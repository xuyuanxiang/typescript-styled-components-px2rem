import * as ts from 'typescript';
import { replace } from './replace';
import configuration from './configuration';

function isStyledTagged(node: ts.TaggedTemplateExpression): boolean {
  const tag = node.tag;
  const tags = configuration.config.tags;
  if (ts.isIdentifier(tag)) {
    return tags.includes(tag.text);
  } else if ((ts.isPropertyAccessExpression(tag) || ts.isCallExpression(tag)) && ts.isIdentifier(tag.expression)) {
    return tags.includes(tag.expression.text);
  }
  return false;
}

function transformTemplateLiteral(templateLiteral: ts.TemplateLiteral): ts.TemplateLiteral {
  if (ts.isNoSubstitutionTemplateLiteral(templateLiteral)) {
    return ts.createNoSubstitutionTemplateLiteral(replace(templateLiteral.text));
  } else {
    return ts.createTemplateExpression(
      ts.createTemplateHead(replace(templateLiteral.head.text)),
      templateLiteral.templateSpans.map(span => {
        if (ts.isTemplateTail(span.literal)) {
          return ts.createTemplateSpan(span.expression, ts.createTemplateTail(replace(span.literal.text)));
        } else {
          return ts.createTemplateSpan(span.expression, ts.createTemplateMiddle(replace(span.literal.text)));
        }
      }),
    );
  }
}

export function transform(node: ts.Node): ts.Node {
  if (ts.isTaggedTemplateExpression(node) && isStyledTagged(node)) {
    const newNode = ts.createTaggedTemplate(node.tag, transformTemplateLiteral(node.template));
    newNode.parent = node.parent;
    return newNode;
  } else if (ts.isCallExpression(node) && node.arguments.length >= 1) {
    if (
      ts.isPropertyAccessExpression(node.expression) &&
      ts.isIdentifier(node.expression.expression) &&
      configuration.config.tags.includes(node.expression.expression.text)
    ) {
      if (ts.isArrowFunction(node.arguments[0])) {
        const arrowFn = node.arguments[0] as ts.ArrowFunction;
        if (ts.isTemplateLiteral(arrowFn.body)) {
          const newNode = ts.createCall(node.expression, node.typeArguments, [
            ts.createArrowFunction(
              arrowFn.modifiers,
              arrowFn.typeParameters,
              arrowFn.parameters,
              arrowFn.type,
              arrowFn.equalsGreaterThanToken,
              transformTemplateLiteral(arrowFn.body),
            ),
            ...node.arguments.slice(1),
          ]);
          newNode.parent = node.parent;
          return newNode;
        }
      }
    }
  } else if (ts.isTemplateExpression(node)) {
    const newNode = transformTemplateLiteral(node);
    newNode.parent = node.parent;
    return newNode;
  }

  return node;
}
