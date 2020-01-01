import * as ts from 'typescript';
import { transform } from '../transform';

describe('transform()', () => {
  it('should transform TaggedTemplateExpression with NoSubstitutionTemplateLiteral', function() {
    const transformed = transform(
      ts.createTaggedTemplate(
        ts.createIdentifier('createGlobalStyle'),
        ts.createNoSubstitutionTemplateLiteral('html body {\n  font-size: 16px;\n}'),
      ),
    );
    if (
      ts.isTaggedTemplateExpression(transformed) &&
      ts.isIdentifier(transformed.tag) &&
      ts.isNoSubstitutionTemplateLiteral(transformed.template)
    ) {
      expect(transformed.tag.text).toBe('createGlobalStyle');
      expect(transformed.template.text).toBe('html body {\n  font-size: 0.16rem;\n}');
    } else {
      throw new Error('Transformed Node should be the same type with raw');
    }
  });
  it('should transform TaggedTemplateExpression with TemplateExpression', function() {
    const spans: ts.TemplateSpan[] = [];
    spans.push(
      ts.createTemplateSpan(
        ts.createIdentifier('Mixins'),
        ts.createTemplateMiddle(';\n display: block;\n width: 100%;\n height: 44px;\n line-height: 44px;\n width: '),
      ),
    );
    const params = ts.createParameter(undefined, undefined, undefined, ts.createIdentifier('props'));
    const body = ts.createPropertyAccess(ts.createIdentifier('props'), ts.createIdentifier('width'));
    const arrowFn = ts.createArrowFunction(undefined, undefined, [params], undefined, undefined, body);
    spans.push(ts.createTemplateSpan(arrowFn, ts.createTemplateTail('px;\n font-size: 16px;\n')));
    const template = ts.createTemplateExpression(ts.createTemplateHead('\n padding: 0 24px;\n'), spans);
    const access = ts.createPropertyAccess(ts.createIdentifier('styled'), 'button');
    const result = transform(ts.createTaggedTemplate(access, template));
    if (
      ts.isTaggedTemplateExpression(result) &&
      ts.isPropertyAccessExpression(result.tag) &&
      ts.isIdentifier(result.tag.expression) &&
      ts.isTemplateExpression(result.template)
    ) {
      expect(result.tag.expression.text === 'styled').toBeTruthy();
      expect(result.template.head.text).toBe('\n padding: 0 0.24rem;\n');
      expect(result.template.templateSpans[0].literal.text).toBe(
        ';\n display: block;\n width: 100%;\n height: 0.44rem;\n line-height: 0.44rem;\n width: ',
      );
      expect(result.template.templateSpans[1].literal.text).toBe('px;\n font-size: 0.16rem;\n');
    } else {
      throw new Error('Transformed Node should be the same type with raw');
    }
  });

  it('should transform styled function', function() {
    /*
     *  styled.button<{ width: number; }>(
     *    props => `
     *      width: ${props.width}px;
     *      height: 48px;
     *    `,
     *  )
     */
    const head = ts.createTemplateHead('\n  width:');
    const spans: ts.TemplateSpan[] = [];
    spans.push(
      ts.createTemplateSpan(
        ts.createPropertyAccess(ts.createIdentifier('props'), 'width'),
        ts.createTemplateTail('px;\n  height: 48px;\n'),
      ),
    );

    const template = ts.createTemplateExpression(head, spans);
    const rawArrowFn = ts.createArrowFunction(
      undefined,
      undefined,
      [ts.createParameter(undefined, undefined, undefined, ts.createIdentifier('props'))],
      undefined,
      undefined,
      template,
    );
    const raw = ts.createCall(
      ts.createPropertyAccess(ts.createIdentifier('styled'), 'button'),
      [
        ts.createTypeLiteralNode([
          ts.createPropertySignature(
            undefined,
            'width',
            undefined,
            ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
            undefined,
          ),
        ]),
      ],
      [rawArrowFn],
    );
    const transformed = transform(raw);
    if (ts.isCallExpression(transformed) && ts.isArrowFunction(transformed.arguments[0])) {
      expect(transformed.expression).toBe(raw.expression);
      expect(transformed.typeArguments).toBe(raw.typeArguments);
      const arrowFn = transformed.arguments[0] as ts.ArrowFunction;
      expect(arrowFn.name).toBe(rawArrowFn.name);
      expect(arrowFn.equalsGreaterThanToken).toBe(rawArrowFn.equalsGreaterThanToken);
      expect(arrowFn.kind).toBe(rawArrowFn.kind);
      if (ts.isTemplateExpression(arrowFn.body)) {
        expect(arrowFn.body.head.text).toBe(head.text);
        expect(arrowFn.body.templateSpans[0].expression).toBe(spans[0].expression);
        expect(arrowFn.body.templateSpans[0].literal.text).toBe('px;\n  height: 0.48rem;\n');
        return;
      }
    }
    throw new Error('Transformed Node should be the same type with raw');
  });
  it('should ignored unknown Node or Tagged', function() {
    const id = ts.createIdentifier('test');
    expect(transform(id)).toBe(id);
    const unknownIdentifierTagged = ts.createTaggedTemplate(
      ts.createIdentifier('foo'),
      ts.createNoSubstitutionTemplateLiteral('font-size: 16px;'),
    );
    expect(transform(unknownIdentifierTagged)).toBe(unknownIdentifierTagged);
    const otherTag = ts.createCall(ts.createPropertyAccess(ts.createIdentifier('my'), 'tagged'), undefined, []);
    const otherTaggedTemplate = ts.createTaggedTemplate(otherTag, ts.createNoSubstitutionTemplateLiteral('foo'));
    expect(transform(otherTaggedTemplate)).toBe(otherTaggedTemplate);
  });
});
