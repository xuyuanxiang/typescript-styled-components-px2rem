import * as ts from 'typescript';
import { transform } from '../transform';

describe('transform()', () => {
  it('should transform NoSubstitutionTemplateLiteral', function() {});
  it('should transform TemplateExpression', function() {
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
    const result = transform(template);
    expect(ts.isTemplateExpression(result) && result.head.text).toBe('\n padding: 0 0.48rem;\n');
    expect(ts.isTemplateExpression(result) && result.templateSpans[0].literal.text).toBe(
      ';\n display: block;\n width: 100%;\n height: 0.88rem;\n line-height: 0.88rem;\n width: ',
    );
    expect(ts.isTemplateExpression(result) && result.templateSpans[1].literal.text).toBe('px;\n font-size: 0.32rem;\n');
  });
});
