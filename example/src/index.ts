import styled, { css, createGlobalStyle } from 'styled-components';

const mixins = css`
  padding: 0 16px;
  margin: 8px 32px 12px 32px;
`;

const GlobalStyle = createGlobalStyle`
  html body {
    font-size: 18px;
  }
`;

const BlockButton = styled.button`
  ${mixins};
  display: block;
  width: 100%;
  height: 96px;
  line-height: 96px;
`;
