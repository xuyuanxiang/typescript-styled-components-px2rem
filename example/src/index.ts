import styled, { css, createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html body {
    font-size: 18px;
  }
`;

const BlockButton = styled.button`
  display: block;
  width: 100%;
  height: 96px;
  line-height: 96px;
`;

const InlineButton = styled(BlockButton)<{ width: number }>`
  display: inline-block;
  width: ${props => props.width}px;
`;

const mixins = css`
  padding: 0 16px;
  margin: 8px 32px 12px 32px;
`;

const Button = styled(InlineButton)`
  ${mixins}
`;
