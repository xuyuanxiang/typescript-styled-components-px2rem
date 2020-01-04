import * as ts from 'typescript';
import { replace } from './replace';
import configuration from './configuration';
import { createToken, isArrowFunction, isPropertyAccessExpression } from 'typescript';
import createPx2rem from './px2rem';

let _px2rem: ts.Identifier | undefined;
let _used: boolean = false;

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

function isPureExpression(
  expression: ts.Node,
): expression is
  | ts.LiteralExpression
  | ts.Identifier
  | ts.PropertyAccessExpression
  | ts.ElementAccessExpression
  | ts.CallExpression
  | ts.BinaryExpression {
  return (
    ts.isIdentifier(expression) ||
    ts.isLiteralExpression(expression) ||
    ts.isPropertyAccessExpression(expression) ||
    ts.isElementAccessExpression(expression) ||
    ts.isCallExpression(expression) ||
    ts.isBinaryExpression(expression)
  );
}

function createCallPx2rem(px2rem: ts.Identifier, ...expression: ts.Expression[]): ts.CallExpression {
  _used = true;
  return ts.createCall(px2rem, undefined, expression);
}

function createTemplateSpanExpressionVisitor(context: ts.TransformationContext, px2rem: ts.Identifier): ts.Visitor {
  const visitor: ts.Visitor = node => {
    if (isArrowFunction(node)) {
      if (ts.isBlock(node.body)) {
        return ts.updateArrowFunction(
          node,
          node.modifiers,
          node.typeParameters,
          node.parameters,
          node.type,
          node.equalsGreaterThanToken,
          ts.createCall(px2rem, undefined, [
            ts.createArrowFunction(
              undefined,
              undefined,
              [],
              undefined,
              createToken(ts.SyntaxKind.EqualsGreaterThanToken),
              node.body,
            ),
          ]),
        );
      } else {
        return ts.updateArrowFunction(
          node,
          node.modifiers,
          node.typeParameters,
          node.parameters,
          node.type,
          node.equalsGreaterThanToken,
          createCallPx2rem(px2rem, node.body),
        );
      }
    } else if (ts.isConditionalExpression(node)) {
      if (isPureExpression(node.whenTrue) && isPureExpression(node.whenFalse)) {
        return ts.updateConditional(
          node,
          node.condition,
          node.questionToken,
          createCallPx2rem(px2rem, node.whenTrue),
          node.colonToken,
          createCallPx2rem(px2rem, node.whenFalse),
        );
      } else if (isPureExpression(node.whenTrue)) {
        node = ts.updateConditional(
          node,
          node.condition,
          node.questionToken,
          createCallPx2rem(px2rem, node.whenTrue),
          node.colonToken,
          node.whenFalse,
        );
      } else if (isPureExpression(node.whenFalse)) {
        node = ts.updateConditional(
          node,
          node.condition,
          node.questionToken,
          node.whenTrue,
          node.colonToken,
          createCallPx2rem(px2rem, node.whenFalse),
        );
      }
    } else if (ts.isFunctionExpression(node)) {
      return ts.createArrowFunction(
        undefined,
        undefined,
        [
          ts.createParameter(
            undefined,
            undefined,
            ts.createToken(ts.SyntaxKind.DotDotDotToken),
            'args',
            undefined,
            undefined,
          ),
        ],
        undefined,
        ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        createCallPx2rem(px2rem, node, ts.createSpread(ts.createIdentifier('args'))),
      );
    }
    // else if (ts.isBinaryExpression(node)) {
    //   switch (node.operatorToken.kind) {
    //     case ts.SyntaxKind.AmpersandAmpersandToken:
    //       if (isPureExpression(node.right)) {
    //         return ts.updateBinary(node, node.left, createCallPx2rem(px2rem, node.right), node.operatorToken);
    //       }
    //       break;
    //     case ts.SyntaxKind.BarBarToken:
    //       if (isPureExpression(node.left) && isPureExpression(node.right)) {
    //         return ts.updateBinary(
    //           node,
    //           createCallPx2rem(px2rem, node.left),
    //           createCallPx2rem(px2rem, node.right),
    //           node.operatorToken,
    //         );
    //       } else if (isPureExpression(node.left)) {
    //         node = ts.updateBinary(node, createCallPx2rem(px2rem, node.left), node.right, node.operatorToken);
    //       } else if (isPureExpression(node.right)) {
    //         node = ts.updateBinary(node, node.left, createCallPx2rem(px2rem, node.right), node.operatorToken);
    //       }
    //       break;
    //     default:
    //       return createCallPx2rem(px2rem, node);
    //   }
    // }
    return ts.visitEachChild(node, visitor, context);
  };

  return visitor;
}

function createStyledVisitor(context: ts.TransformationContext): ts.Visitor {
  const visitor: ts.Visitor = node => {
    if (ts.isNoSubstitutionTemplateLiteral(node)) {
      return createIfDifference(node.text, replaced => ts.createNoSubstitutionTemplateLiteral(replaced), node);
    } else if (ts.isTemplateHead(node)) {
      return createIfDifference(node.text, replaced => ts.createTemplateHead(replaced), node);
    } else if (ts.isStringLiteral(node)) {
      return createIfDifference(node.text, replaced => ts.createStringLiteral(replaced), node);
    } else if (ts.isTemplateTail(node)) {
      return createIfDifference(node.text, replaced => ts.createTemplateTail(replaced), node);
    } else if (ts.isTemplateMiddle(node)) {
      return createIfDifference(node.text, replaced => ts.createTemplateMiddle(replaced), node);
    }

    if (configuration.config.transformRuntime && _px2rem) {
      if (ts.isTemplateSpan(node) && node.literal.text && node.literal.text.startsWith('px')) {
        const text = node.literal.text.replace(/^px/, '');
        if (isPureExpression(node.expression)) {
          node = ts.updateTemplateSpan(
            node,
            createCallPx2rem(_px2rem, node.expression),
            ts.isTemplateMiddle(node.literal) ? ts.createTemplateMiddle(text) : ts.createTemplateTail(text),
          );
        } else {
          node = ts.updateTemplateSpan(
            node,
            ts.visitNode(node.expression, createTemplateSpanExpressionVisitor(context, _px2rem)),
            ts.isTemplateMiddle(node.literal) ? ts.createTemplateMiddle(text) : ts.createTemplateTail(text),
          );
        }
      }
    }
    return ts.visitEachChild(node, visitor, context);
  };

  return visitor;
}

function isStyledFunction(call: ts.CallExpression): boolean {
  const expression = call.expression;
  if (isPropertyAccessExpression(expression)) {
    return isStyledMember(expression);
  } else if (ts.isCallExpression(expression)) {
    return isStyledFunction(expression);
  } else if (ts.isIdentifier(expression)) {
    return isStyled(expression);
  }
  return false;
}

export const transformerFactory: ts.TransformerFactory<ts.SourceFile> = context => {
  const styledVisitor = createStyledVisitor(context);
  const visitor: ts.Visitor = node => {
    if (ts.isTaggedTemplateExpression(node) && isStyledTagged(node)) {
      return ts.visitNode(node, styledVisitor);
    } else if (ts.isCallExpression(node) && isStyledFunction(node)) {
      return ts.visitNode(node, styledVisitor);
    }

    return ts.visitEachChild(node, visitor, context);
  };
  return node => {
    if (configuration.config.transformRuntime) {
      _px2rem = ts.createUniqueName('px2rem');
    } else {
      _px2rem = undefined;
    }
    _used = false;
    const sourceFile = ts.visitNode(node, visitor);
    if (_used && _px2rem) {
      return ts.updateSourceFileNode(sourceFile, [...sourceFile.statements, createPx2rem(_px2rem)]);
    }
    return sourceFile;
  };
};
