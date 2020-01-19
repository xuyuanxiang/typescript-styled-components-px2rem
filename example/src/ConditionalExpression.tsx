import React from 'react';
import styled from 'styled-components';

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
