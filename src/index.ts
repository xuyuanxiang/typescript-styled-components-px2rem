import * as ts from 'typescript';
import configuration, { IConfiguration } from './configuration';
import { transformerFactory } from './transform';

export default function(options?: Partial<IConfiguration>): ts.TransformerFactory<ts.SourceFile> {
  configuration.updateConfig(options);
  return transformerFactory;
}
