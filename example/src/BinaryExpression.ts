import styled from 'styled-components';

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
  padding: ${40 + 50}px 16px ${4}px 32px;
  line-height: ${calc() - 2}px;
  border-radius: 32px;
  background-color: red;
`;
