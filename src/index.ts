import * as ts from 'typescript';
import { isTagged } from 'typescript-template-language-service-decorator/lib/nodes';
import configuration, { IConfiguration } from './configuration';
import { transform } from './transform';

function isValidStyledTagged(node: ts.TaggedTemplateExpression) {
  const valid = isTagged(node, configuration.config.tags);
  if (!valid) {
    console.warn("It seems not to be styled-components's tagged: ", node.tag.getText());
  }
  return valid;
}

export default function(options?: Partial<IConfiguration>): ts.TransformerFactory<ts.SourceFile> {
  configuration.updateConfig(options);
  return context => {
    const visitor: ts.Visitor = node => {
      if (ts.isTaggedTemplateExpression(node) && isValidStyledTagged(node)) {
        const newNode = ts.createTaggedTemplate(node.tag, transform(node.template));
        newNode.parent = node.parent;
        node = newNode;
      }
      return ts.visitEachChild(node, visitor, context);
    };
    return node => ts.visitNode(node, visitor);
  };
}
