import styled from 'styled-components';

const height = '44';

// ArrowFunction with Pure Expression Body
export const ArrowFunctionExpressionWithPureBody = styled.input.attrs(props => ({
  type: 'password',
  size: props.size || '0',
  width: props.width || 100,
}))`
  color: palevioletred;
  border: 1px solid palevioletred;
  border-radius: 8px;
  width: ${props => props.width}px; /* PropertyAccess Body */
  height: ${() => height}px; /* Identifier Body */
  line-height: ${() => '44'}px; /* StringLiteral Body */
  margin: ${() => 32}px; /* NumericLiteral Body */
  padding: ${props => props.size};
`;

// ArrowFunction with Block Body
export const ArrowFunctionWithBlockBody = styled.button<{
  width?: number;
}>`
  font-size: 18px;
  color: black;
  width: ${props => {
    if (props.width) {
      return props.width;
    } else {
      return 0;
    }
  }}px;
`;

// ArrowFunction with BinaryExpression Body
export const ArrowFunctionWithBinaryBody = styled.button<{
  marginVertical?: number;
}>`
  font-size: 18px;
  color: black;
  margin: ${props => props.marginVertical && props.marginVertical}px 8px
    ${props => props.marginVertical && props.marginVertical}px 0px;
  ${props =>
    props.disabled &&
    `
    border: 2px solid darkgray;
    border-radius: 20px;
  `};
`;

// ArrowFunction with ConditionalExpression Body
export const ArrowFunctionWithConditionalBody = styled.button<{
  width?: number;
}>`
  font-size: 18px;
  color: black;
  width: ${props => (props.width ? props.width : 16)}px;
  ${props => (props.disabled ? 'height: 400px' : 'height: 200px')};
`;
