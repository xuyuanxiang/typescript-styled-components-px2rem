import * as ts from 'typescript';
import configuration, { IConfiguration } from './configuration';
import { transform } from './transform';

export default function(options?: Partial<IConfiguration>): ts.TransformerFactory<ts.SourceFile> {
  configuration.updateConfig(options);
  return context => {
    const visitor: ts.Visitor = node => {
      if (ts.isTaggedTemplateExpression(node)) {
        const newNode = ts.createTaggedTemplate(node.tag, transform(node.template));
        newNode.parent = node.parent;
        node = newNode;
      }
      return ts.visitEachChild(node, visitor, context);
    };
    return node => ts.visitNode(node, visitor);
  };
}
