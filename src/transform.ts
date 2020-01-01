import * as ts from 'typescript';
import { replace } from './replace';
import configuration from './configuration';
import { createToken } from 'typescript';

let _px2rem: ts.Identifier | undefined;
let _options: ts.Identifier | undefined;

function isStyledTagged(node: ts.TaggedTemplateExpression): boolean {
  const tag = node.tag;
  if (ts.isIdentifier(tag)) {
    return isStyled(tag);
  } else if (ts.isCallExpression(tag)) {
    if (ts.isIdentifier(tag.expression)) {
      return isStyled(tag.expression);
    } else if (ts.isPropertyAccessExpression(tag.expression)) {
      return isStyledMember(tag.expression);
    }
  } else if (ts.isPropertyAccessExpression(tag)) {
    return isStyledMember(tag);
  }
  return false;
}

function isStyledMember(node: ts.PropertyAccessExpression): boolean {
  if (ts.isIdentifier(node.expression)) {
    return isStyled(node.expression);
  } else if (ts.isPropertyAccessExpression(node.expression)) {
    return isStyledMember(node.expression);
  }
  return false;
}

function isStyled(id: ts.Identifier): boolean {
  const tags = configuration.config.tags;
  return Array.isArray(tags) && tags.includes(id.text);
}

function createIfDifference<T extends ts.Node>(text: string, create: (replaced: string) => T, origin: T): T {
  const replaced = replace(text);
  if (replaced !== text) {
    const newNode = create(replaced);
    newNode.parent = origin.parent;
    return newNode;
  }
  return origin;
}

function createTemplateExpressionVisitor(context: ts.TransformationContext): ts.Visitor {
  const templateExpressionVisitor: ts.Visitor = node => {
    if (ts.isTemplateHead(node)) {
      return createIfDifference(node.text, replaced => ts.createTemplateHead(replaced), node);
    } else if (ts.isTemplateSpan(node)) {
      const span = node as ts.TemplateSpan;
      if (configuration.config.transformRuntime && /^px/.test(span.literal.text)) {
        let newExpression: ts.Expression | undefined;
        if (_px2rem && _options) {
          if (ts.isPropertyAccessExpression(span.expression)) {
            newExpression = ts.createCall(
              // ts.createPropertyAccess(_px2rem, ts.createIdentifier('px2rem')),
              _px2rem,
              undefined,
              [span.expression, _options],
            );
          } else if (ts.isArrowFunction(span.expression)) {
            if (ts.isBlock(span.expression.body)) {
              newExpression = ts.createArrowFunction(
                span.expression.modifiers,
                span.expression.typeParameters,
                span.expression.parameters,
                span.expression.type,
                span.expression.equalsGreaterThanToken,
                ts.createCall(
                  // ts.createPropertyAccess(_px2rem, ts.createIdentifier('px2rem')),
                  _px2rem,
                  undefined,
                  [
                    ts.createArrowFunction(
                      undefined,
                      undefined,
                      [],
                      undefined,
                      createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                      span.expression.body,
                    ),
                    _options,
                  ],
                ),
              );
            } else {
              newExpression = ts.updateArrowFunction(
                span.expression,
                span.expression.modifiers,
                span.expression.typeParameters,
                span.expression.parameters,
                span.expression.type,
                span.expression.equalsGreaterThanToken,
                ts.createCall(
                  // ts.createPropertyAccess(_px2rem, ts.createIdentifier('px2rem')),
                  _px2rem,
                  undefined,
                  [span.expression.body, _options],
                ),
              );
            }
          } else {
            newExpression = ts.createCall(
              // ts.createPropertyAccess(_px2rem, ts.createIdentifier('px2rem')),
              _px2rem,
              undefined,
              [span.expression, _options],
            );
          }
        }
        const text = newExpression ? span.literal.text.replace(/^px/, '') : span.literal.text;
        return ts.updateTemplateSpan(
          span,
          newExpression || span.expression,
          ts.isTemplateMiddle(span.literal)
            ? ts.createTemplateMiddle(replace(text))
            : ts.createTemplateTail(replace(text)),
        );
      } else {
        return createIfDifference(
          span.literal.text,
          replaced =>
            ts.createTemplateSpan(
              span.expression,
              ts.isTemplateTail(span.literal) ? ts.createTemplateTail(replaced) : ts.createTemplateMiddle(replaced),
            ),
          span,
        );
      }
    }
    return ts.visitEachChild(node, templateExpressionVisitor, context);
  };
  return templateExpressionVisitor;
}

function createTemplateLiteralVisitor(context: ts.TransformationContext): ts.Visitor {
  const visitor: ts.Visitor = node => {
    if (ts.isNoSubstitutionTemplateLiteral(node)) {
      return createIfDifference(node.text, replaced => ts.createNoSubstitutionTemplateLiteral(replaced), node);
    } else if (ts.isTemplateExpression(node)) {
      return ts.visitNode(node, createTemplateExpressionVisitor(context));
    }
    return ts.visitEachChild(node, visitor, context);
  };

  return visitor;
}

export const transformerFactory: ts.TransformerFactory<ts.SourceFile> = context => {
  const templateLiteralVisitor = createTemplateLiteralVisitor(context);
  const visitor: ts.Visitor = node => {
    if (ts.isTaggedTemplateExpression(node) && isStyledTagged(node)) {
      return ts.visitNode(node, templateLiteralVisitor);
    } else if (ts.isCallExpression(node) && node.arguments.length > 0) {
      if (
        ts.isPropertyAccessExpression(node.expression) &&
        ts.isIdentifier(node.expression.expression) &&
        isStyled(node.expression.expression)
      ) {
        return ts.visitNode(node, templateLiteralVisitor);
      }
    }
    return ts.visitEachChild(node, visitor, context);
  };
  return node => {
    if (configuration.config.transformRuntime) {
      _px2rem = ts.createUniqueName('px2rem');
      _options = ts.createUniqueName('OPTIONS');
    } else {
      _px2rem = undefined;
      _options = undefined;
    }
    if (ts.isSourceFile(node) && _px2rem && _options) {
      const namespace = ts.createNamespaceImport(_px2rem);
      const names = ts.createNamedImports([ts.createImportSpecifier(ts.createIdentifier('px2rem'), _px2rem)]);
      const importClause = ts.createImportClause(undefined, names);
      node = ts.updateSourceFileNode(node, [
        ts.createImportDeclaration(
          undefined,
          undefined,
          importClause,
          ts.createStringLiteral('typescript-styled-components-px2rem/lib/px2rem'),
        ),
        ts.createVariableStatement(
          undefined,
          ts.createVariableDeclarationList([
            ts.createVariableDeclaration(
              _options,
              undefined,
              ts.createObjectLiteral(
                [
                  ts.createPropertyAssignment(
                    'rootValue',
                    ts.createNumericLiteral(configuration.config.rootValue + ''),
                  ),
                  ts.createPropertyAssignment(
                    'unitPrecision',
                    ts.createNumericLiteral(configuration.config.unitPrecision + ''),
                  ),
                  ts.createPropertyAssignment(
                    'minPixelValue',
                    ts.createNumericLiteral(configuration.config.minPixelValue + ''),
                  ),
                  ts.createPropertyAssignment(
                    'multiplier',
                    ts.createNumericLiteral(configuration.config.multiplier + ''),
                  ),
                ],
                true,
              ),
            ),
          ]),
        ),
        ...node.statements,
      ]);
    }
    return ts.visitNode(node, visitor);
  };
};
