import styled, { css, createGlobalStyle, keyframes } from 'styled-components';

const mixins = css`
  padding: 0 16px;
  margin: 16px 32px 16px 32px;
`;

const Animation = keyframes`
  from {
    transform: translateX(100px);
  }

  to {
    transform: translateX(-100px);
  }
`;

const Input = styled.input.attrs(props => ({
  type: 'password',
  size: props.size || '1em',
  width: props.width || 100,
}))`
  color: palevioletred;
  font-size: 14px;
  border: 1px solid palevioletred;
  width: ${props => props.width}px;
  padding: ${props => props.size};
  border-radius: 8px;
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

const ExtendedButton = styled(InlineButton)`
  width: 120px;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
`;

const SizeableButton = styled.button<{ width: number; height: string }>(
  props => `
  display: inline;
  width: ${props.width}px;
  height: ${props.height};
  font-size: 16px;
`,
);
