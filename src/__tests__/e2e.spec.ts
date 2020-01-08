import * as ts from 'typescript';
import { readFileSync } from 'fs';
import { join } from 'path';
import transform from '../';

describe('e2e', () => {
  it('should work', function() {
    const options = {
      rootValue: 100,
      unitPrecision: 5,
      minPixelValue: 0,
      multiplier: 1,
      tags: ['styled', 'css', 'createGlobalStyle', 'keyframes'],
      transformRuntime: false,
    };
    const transformed = ts.transpileModule(readFileSync(join(__dirname, 'case.txt'), 'utf8'), {
      fileName: 'case.txt',
      compilerOptions: {
        skipLibCheck: true,
        target: ts.ScriptTarget.ES2015,
        module: ts.ModuleKind.ES2015,
        strict: true,
        esModuleInterop: true,
      },
      transformers: { before: [transform(options)] },
    });
    expect(transformed.outputText).toMatchSnapshot();
  });

  it('should transform runtime', function() {
    const options = {
      rootValue: 100,
      unitPrecision: 5,
      minPixelValue: 0,
      multiplier: 1,
      tags: ['styled', 'css', 'createGlobalStyle', 'keyframes'],
      transformRuntime: true,
    };
    const transformed = ts.transpileModule(readFileSync(join(__dirname, 'case.txt'), 'utf8'), {
      fileName: 'case.txt',
      compilerOptions: {
        skipLibCheck: true,
        target: ts.ScriptTarget.ES2015,
        module: ts.ModuleKind.ES2015,
        strict: true,
        esModuleInterop: true,
      },
      transformers: { before: [transform(options)] },
    });
    expect(transformed.outputText).toMatchSnapshot();
  });

  it('should polyfill px2rem when really used', function() {
    const options = {
      rootValue: 100,
      unitPrecision: 5,
      minPixelValue: 0,
      multiplier: 1,
      tags: ['styled', 'css', 'createGlobalStyle', 'keyframes'],
      transformRuntime: true,
    };
    const transformed = ts.transpileModule('const foo = 1', {
      fileName: 'case.txt',
      compilerOptions: {
        skipLibCheck: true,
        target: ts.ScriptTarget.ES2015,
        module: ts.ModuleKind.ES2015,
        strict: true,
        esModuleInterop: true,
      },
      transformers: { before: [transform(options)] },
    });
    expect(transformed.outputText).toMatchSnapshot();
  });
});
