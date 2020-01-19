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


