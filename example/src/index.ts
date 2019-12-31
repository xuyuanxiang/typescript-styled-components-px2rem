import styled, { css, createGlobalStyle } from 'styled-components';

const mixins = css`
  padding: 0 16px;
  margin: 16px 32px 16px 32px;
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

const InlineButton = styled.button<{ width: number }>`
  ${mixins};
  display: inline;
  width: ${props => props.width}px;
  height: 96px;
  line-height: 96px;
`;

const SmallButton = styled.extend(InlineButton)`
  width: 120px;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
`;

const SizeableButton = styled.button<{ width: number; height: number }>(
  props => `
  ${mixins};
  display: inline;
  width: ${props.width}px;
  height: ${props.height}px;
  line-height: ${props.height}px;
`,
);
