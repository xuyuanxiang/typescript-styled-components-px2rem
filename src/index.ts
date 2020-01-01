import * as ts from 'typescript';
import configuration, { IConfiguration } from './configuration';
import { transform } from './transform';

export default function(options?: Partial<IConfiguration>): ts.TransformerFactory<ts.SourceFile> {
  configuration.updateConfig(options);
  return context => {
    const visitor: ts.Visitor = node => ts.visitEachChild(transform(node, context), visitor, context);
    return node => ts.visitNode(node, visitor);
  };
}
