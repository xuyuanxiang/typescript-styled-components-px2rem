import * as ts from 'typescript';
import { transform } from '../transform';

const options = {
  rootValue: 100,
  unitPrecision: 5,
  minPixelValue: 2,
  multiplier: 2,
};

describe('transform()', () => {
  it('should transform NoSubstitutionTemplateLiteral', function() {
    const result = transform(
      ts.createNoSubstitutionTemplateLiteral(
        '\n  padding: 0 16px;\n  width: 200px;\n  border: 1px solid red;\n  padding: 8px 16px 32px 40px;\n',
      ),
      options,
    );
    expect(ts.isNoSubstitutionTemplateLiteral(result) && result.text).toBe(
      '\n  padding: 0 0.32rem;\n  width: 4rem;\n  border: 1px solid red;\n  padding: 0.16rem 0.32rem 0.64rem 0.8rem;\n',
    );
  });
  it('should ignore TemplateExpression', function() {
    const template = ts.createTemplateExpression(ts.createTemplateHead('styled'), []);
    const result = transform(template, options);
    expect(result).toBe(result);
  });
});
