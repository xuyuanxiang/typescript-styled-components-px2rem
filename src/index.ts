import * as ts from 'typescript';
import { IPluginConfiguration } from './IPluginConfiguration';
import { transform } from './transform';

const DEFAULT_OPTIONS: IPluginConfiguration = {
  rootValue: 100,
  unitPrecision: 5,
  minPixelValue: 2,
  multiplier: 2,
};

export default function({
  rootValue = DEFAULT_OPTIONS.rootValue,
  unitPrecision = DEFAULT_OPTIONS.unitPrecision,
  minPixelValue = DEFAULT_OPTIONS.minPixelValue,
  multiplier = DEFAULT_OPTIONS.multiplier,
}: Partial<IPluginConfiguration> = DEFAULT_OPTIONS): ts.TransformerFactory<ts.SourceFile> {
  return context => {
    const visitor: ts.Visitor = node => {
      if (ts.isTaggedTemplateExpression(node)) {
        const newNode = ts.createTaggedTemplate(
          node.tag,
          transform(node.template, { rootValue, unitPrecision, multiplier, minPixelValue }),
        );
        newNode.parent = node.parent;
        node = newNode;
      }
      return ts.visitEachChild(node, visitor, context);
    };
    return node => ts.visitNode(node, visitor);
  };
}
