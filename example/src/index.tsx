import React from 'react';
import styled, { css, createGlobalStyle, keyframes } from 'styled-components';

const Animation = keyframes`
  from {
    transform: translateX(100px);
  }

  to {
    transform: translateX(-100px);
  }
`;
export const FunctionExpression = styled.button<{ width?: number | string }>`
  width: ${function(props) {
    return props.width;
  }}px; /* Block Body */
  ${props => (props.disabled ? 'height: 400px' : 'height: 200px')};
`;

const fontSize = 18;

function getHeight() {
  const height = 100;

  return height / 2;
}

const height = '44';

// ArrowFunction with Pure Expression Body
export const ArrowFunctionExpressionWithPureBody = styled.input.attrs(props => ({
  type: 'password',
  size: props.size || '16px',
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

const mixins = css`
  padding: 1px 16px;
  margin: 16px 32px 16px 32px;
`;
export const GlobalStyle = createGlobalStyle`
  html body {
    ${mixins};
    font-size: ${fontSize}px; /* Identifier */
    width: 1024px;
    height: ${getHeight()}px; /* CallExpression */
  }
`;

export const StyledButton = styled.button`
  width: 120px;
  height: 32px;
  font-size: 14px;
`;
export const ExtendStyledButton = styled(StyledButton)<{ padding: boolean }>(
  ({ padding }) => `
  padding-left: 15px;
  ${
    padding
      ? `
      padding-left: 25px;
  `
      : ''
  }
`,
);

const condition = false;
function calc() {
  return 20;
}
export const BinaryExpression = styled.button`
  ${condition ||
    `
    width: 200px;
  `};
  height: ${condition || 100}px;
  padding: ${40 + 50}px 16px ${4}px 8.5px;
  margin: ${(48 - 18) / 2}px 16px;
  line-height: ${calc() - 2}px;
  border-radius: 32px;
  background-color: red;
`;

export const PropertyAccessExpression = styled.button<{ width: number; height: string }>(
  props => `
  display: inline;
  width: ${props.width}px;
  padding: 8px 16px;
  height: ${props.height}; /* should ignored */
  font-size: 16px;
`,
);

export const ThemeConsumer = styled.div`
  font-size: ${props => props.theme.fontSize}px;
  color: ${props => props.theme.color};
`;

export const ConditionalExpression = function({ fontSize }: { fontSize?: unknown }) {
  const StyledButton = styled.button`
    font-size: ${typeof fontSize === 'number' ? fontSize : props => props?.theme.fontSize}px;
  `;

  return <StyledButton />;
};

export const ConditionalExpressionWhenTrue = function({ fontSize }: { fontSize?: unknown }) {
  const StyledButton = styled.button`
    font-size: ${typeof fontSize !== 'number' ? props => props?.theme.fontSize : fontSize}px;
  `;

  return <StyledButton />;
};

export const ConditionalExpressionWhenFalse = function({ fontSize }: { fontSize?: unknown }) {
  const StyledButton = styled.button`
    font-size: ${typeof fontSize === 'number' ? fontSize : 16}px;
  `;

  return <StyledButton />;
};
