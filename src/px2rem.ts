import * as ts from 'typescript';
import configuration from './configuration';

export default (_px2rem: ts.Identifier) => {
  const input = ts.createIdentifier('input');
  const value = ts.createIdentifier('value');
  const pixels = ts.createIdentifier('pixels');
  const multiplier = ts.createIdentifier('multiplier');
  const wholeNumber = ts.createIdentifier('wholeNumber');
  return ts.createFunctionDeclaration(
    undefined,
    undefined,
    undefined,
    _px2rem,
    undefined,
    [
      ts.createParameter(
        undefined,
        undefined,
        undefined,
        input,
        undefined,
        ts.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
      ),
      ts.createParameter(
        undefined,
        undefined,
        ts.createToken(ts.SyntaxKind.DotDotDotToken),
        ts.createIdentifier('args'),
      ),
    ],
    ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    ts.createBlock([
      //  if (typeof input === 'function') return px2rem(input(...args));
      ts.createIf(
        ts.createBinary(
          ts.createTypeOf(input),
          ts.SyntaxKind.EqualsEqualsEqualsToken,
          ts.createStringLiteral('function'),
        ),
        ts.createReturn(
          ts.createCall(_px2rem, undefined, [
            ts.createCall(input, undefined, [ts.createSpread(ts.createIdentifier('args'))]),
          ]),
        ),
        undefined,
      ),
      // const value = parseFloat(input);
      ts.createVariableStatement(
        undefined,
        ts.createVariableDeclarationList([
          ts.createVariableDeclaration(
            value,
            undefined,
            ts.createCall(ts.createIdentifier('parseFloat'), undefined, [input]),
          ),
        ]),
      ),
      // const pixels = Number.isNaN(value) ? 0 : value;
      ts.createVariableStatement(
        undefined,
        ts.createVariableDeclarationList([
          ts.createVariableDeclaration(
            pixels,
            undefined,
            ts.createConditional(
              ts.createCall(ts.createPropertyAccess(ts.createIdentifier('Number'), 'isNaN'), undefined, [value]),
              ts.createToken(ts.SyntaxKind.QuestionToken),
              ts.createNumericLiteral('0'),
              ts.createToken(ts.SyntaxKind.ColonToken),
              value,
            ),
          ),
        ]),
      ),
      // if (pixels < minPixelValue) return `${pixels}px`;
      ts.createIf(
        ts.createBinary(
          pixels,
          ts.SyntaxKind.LessThanToken,
          ts.createNumericLiteral(configuration.config.minPixelValue + ''),
        ),
        ts.createReturn(
          ts.createTemplateExpression(ts.createTemplateHead(''), [
            ts.createTemplateSpan(pixels, ts.createTemplateTail('px')),
          ]),
        ),
        undefined,
      ),
      // const mul = Math.pow(10, unitPrecision + 1);
      ts.createVariableStatement(
        undefined,
        ts.createVariableDeclarationList([
          ts.createVariableDeclaration(
            multiplier,
            undefined,
            ts.createCall(ts.createPropertyAccess(ts.createIdentifier('Math'), 'pow'), undefined, [
              ts.createNumericLiteral('10'),
              ts.createBinary(
                ts.createNumericLiteral(configuration.config.unitPrecision + ''),
                ts.SyntaxKind.PlusToken,
                ts.createNumericLiteral('1'),
              ),
            ]),
          ),
        ]),
      ),
      //  const wholeNumber = Math.floor((pixels * multiplier) / rootValue * mul);
      ts.createVariableStatement(
        undefined,
        ts.createVariableDeclarationList([
          ts.createVariableDeclaration(
            wholeNumber,
            undefined,
            ts.createCall(ts.createPropertyAccess(ts.createIdentifier('Math'), 'floor'), undefined, [
              ts.createBinary(
                ts.createBinary(
                  ts.createParen(
                    ts.createBinary(
                      pixels,
                      ts.SyntaxKind.AsteriskToken,
                      ts.createNumericLiteral(configuration.config.multiplier + ''),
                    ),
                  ),
                  ts.SyntaxKind.SlashToken,
                  ts.createNumericLiteral(configuration.config.rootValue + ''),
                ),
                ts.SyntaxKind.AsteriskToken,
                multiplier,
              ),
            ]),
          ),
        ]),
      ),
      // return `${(Math.round(wholeNumber / 10) * 10) / mul}rem`;
      ts.createReturn(
        ts.createTemplateExpression(ts.createTemplateHead(''), [
          ts.createTemplateSpan(
            ts.createBinary(
              ts.createParen(
                ts.createBinary(
                  ts.createCall(ts.createPropertyAccess(ts.createIdentifier('Math'), 'round'), undefined, [
                    ts.createBinary(wholeNumber, ts.SyntaxKind.SlashToken, ts.createNumericLiteral('10')),
                  ]),
                  ts.SyntaxKind.AsteriskToken,
                  ts.createNumericLiteral('10'),
                ),
              ),
              ts.SyntaxKind.SlashToken,
              multiplier,
            ),
            ts.createTemplateTail('rem'),
          ),
        ]),
      ),
    ]),
  );
};
