import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import { ThemeProvider } from 'styled-components';
import {
  StyledButton,
  FunctionExpression,
  PropertyAccessExpression,
  GlobalStyle,
  ExtendStyledButton,
  ThemeConsumer,
  ArrowFunctionExpressionWithPureBody,
  ArrowFunctionWithBinaryBody,
  ArrowFunctionWithBlockBody,
  ArrowFunctionWithConditionalBody,
  BinaryExpression,
  ConditionalExpression,
} from '../index';

const div: HTMLDivElement = document.createElement('div');

beforeEach(() => {
  document.body.appendChild(div);
});

afterEach(() => {
  ReactDOM.unmountComponentAtNode(div);
  document.body.removeChild(div);
});



it('should transform <GlobalStyle/>', function() {
  TestUtils.act(() => {
    ReactDOM.render(
      <>
        <GlobalStyle />
      </>,
      div,
    );
  });
  const style = getComputedStyle(document.body);
  expect(style.padding).toBe('0.01rem 0.16rem');
  expect(style.margin).toBe('0.16rem 0.32rem 0.16rem 0.32rem');
  expect(style.fontSize).toBe('0.18rem');
  expect(style.width).toBe('10.24rem');
  expect(style.height).toBe('0.5rem');
});

it('should transform <StyledButton/>', function() {
  TestUtils.act(() => {
    ReactDOM.render(<StyledButton id="btnId" />, div);
  });
  const button: HTMLElement | null = div.querySelector('button#btnId');
  if (button) {
    const style = getComputedStyle(button);
    expect(style.fontSize).toBe('0.14rem');
    expect(style.height).toBe('0.32rem');
    expect(style.width).toBe('1.2rem');
  } else {
    throw new Error('StyledButton should be render');
  }
});

it('should transform <ExtendStyledButton/>', function() {
  TestUtils.act(() => {
    ReactDOM.render(<ExtendStyledButton id="btnId" padding />, div);
  });
  const button: HTMLElement | null = div.querySelector('button#btnId');
  if (button) {
    const style = getComputedStyle(button);
    expect(style.paddingLeft).toBe('0.25rem');
  } else {
    throw new Error('ExtendStyledButton should be render');
  }
});

it('should transform <FunctionExpression/>', function() {
  TestUtils.act(() => {
    ReactDOM.render(<FunctionExpression id="btnId" width={64} />, div);
  });
  const button: HTMLElement | null = div.querySelector('button#btnId');
  if (button) {
    const style = getComputedStyle(button);
    expect(style.width).toBe('0.64rem');
  } else {
    throw new Error('FunctionExpression should be render');
  }
});

it('should transform <ArrowFunction/> with PropertyAccess, Identifier, StringLiteral, NumericLiteral Body', function() {
  TestUtils.act(() => {
    ReactDOM.render(<ArrowFunctionExpressionWithPureBody id="inputId" width={320} />, div);
  });
  const input = div.querySelector('input#inputId');
  if (input) {
    expect(document.documentElement).toMatchSnapshot();
    const style = getComputedStyle(input);
    expect(style.color).toBe('palevioletred');
    expect(style.border).toBe('0.01rem solid palevioletred');
    expect(style.borderRadius).toBe('0.08rem');
    expect(style.width).toBe('3.2rem');
    expect(style.padding).toBe('0.16rem');
    expect(style.margin).toBe('0.32rem');
    expect(style.lineHeight).toBe('0.44rem');
    expect(style.height).toBe('0.44rem');
  } else {
    throw new Error('ArrowFunctionExpressionWithPureBody should be render');
  }
});

it('should transform <ArrowFunction/> with BinaryExpression Body', function() {
  TestUtils.act(() => {
    ReactDOM.render(<ArrowFunctionWithBinaryBody id="buttonId" marginVertical={24} disabled />, div);
  });
  const button = div.querySelector('button#buttonId');
  if (button) {
    expect(document.documentElement).toMatchSnapshot();
    const style = getComputedStyle(button);
    expect(style.margin).toBe('0.24rem 0.08rem 0.24rem 0rem');
    expect(style.border).toBe('0.02rem solid darkgray');
    expect(style.borderRadius).toBe('0.2rem');
    expect(style.fontSize).toBe('0.18rem');
    expect(style.color).toBe('black');
  } else {
    throw new Error('ArrowFunctionWithBinaryBody should be render');
  }
});

it('should transform <ArrowFunction/> with ConditionalExpression Body', function() {
  TestUtils.act(() => {
    ReactDOM.render(<ArrowFunctionWithConditionalBody id="buttonId" width={280} />, div);
  });
  const button = div.querySelector('button#buttonId');
  if (button) {
    expect(document.documentElement).toMatchSnapshot();
    const style = getComputedStyle(button);
    expect(style.width).toBe('2.8rem');
    expect(style.height).toBe('2rem');
    expect(style.fontSize).toBe('0.18rem');
    expect(style.color).toBe('black');
  } else {
    throw new Error('ArrowFunctionWithConditionalBody should be render');
  }
});

it('should transform <ArrowFunction/> with Block Body', function() {
  TestUtils.act(() => {
    ReactDOM.render(<ArrowFunctionWithBlockBody id="buttonId" width={320} />, div);
  });
  const button = div.querySelector('button#buttonId');
  if (button) {
    expect(document.documentElement).toMatchSnapshot();
    const style = getComputedStyle(button);
    expect(style.width).toBe('3.2rem');
    expect(style.fontSize).toBe('0.18rem');
    expect(style.color).toBe('black');
  } else {
    throw new Error('ArrowFunctionWithBlockBody should be render');
  }
});

it('should transform <BinaryExpression/>', function() {
  TestUtils.act(() => {
    ReactDOM.render(<BinaryExpression id="btnId" />, div);
  });
  const button = div.querySelector('button#btnId');
  if (button) {
    expect(document.documentElement).toMatchSnapshot();
    const style = getComputedStyle(button);
    expect(style.width).toBe('2rem');
    expect(style.height).toBe('1rem');
    expect(style.padding).toBe('0.9rem 0.16rem 0.04rem 0.32rem');
    expect(style.lineHeight).toBe('0.18rem');
    expect(style.backgroundColor).toBe('red');
    expect(style.borderRadius).toBe('0.32rem');
  } else {
    throw new Error('BinaryExpression should be render');
  }
});

it('should transform <PropertyAccessExpression/>', function() {
  TestUtils.act(() => {
    ReactDOM.render(<PropertyAccessExpression id="btnId" width={200} height="44px" />, div);
  });
  const button: HTMLElement | null = div.querySelector('button#btnId');
  if (button) {
    const style = getComputedStyle(button);
    expect(style.display).toBe('inline');
    expect(style.fontSize).toBe('0.16rem');
    expect(style.height).toBe('44px');
    expect(style.width).toBe('2rem');
  } else {
    throw new Error('PropertyAccessExpression should be render');
  }
});

it('should transform <ThemeConsumer/>', function() {
  TestUtils.act(() => {
    ReactDOM.render(
      <ThemeProvider theme={{ fontSize: 18, color: '#000000' }}>
        <ThemeConsumer id="consumer" />
      </ThemeProvider>,
      div,
    );
  });
  const consumer = div.querySelector('div#consumer');
  if (consumer) {
    const style = getComputedStyle(consumer);
    expect(style.fontSize).toBe('0.18rem');
    expect(style.color).toBe('rgb(0, 0, 0)');
  } else {
    throw new Error('ThemeConsumer should be render');
  }
});

it("should transform <ConditionalExpression/> with ThemeProvider's fontSize", function() {
  TestUtils.act(() => {
    ReactDOM.render(
      <ThemeProvider theme={{ fontSize: 48 }}>
        <ConditionalExpression />
      </ThemeProvider>,
      div,
    );
  });
  const button = div.querySelector('button');
  if (button) {
    expect(document.documentElement).toMatchSnapshot();
    const style = getComputedStyle(button);
    expect(style.fontSize).toBe('0.48rem');
  } else {
    throw new Error('ConditionalExpression should be render');
  }
});

it('should transform <ConditionalExpression/> with self fontSize', function() {
  TestUtils.act(() => {
    ReactDOM.render(
      <ThemeProvider theme={{ fontSize: 48 }}>
        <ConditionalExpression fontSize={24} />
      </ThemeProvider>,
      div,
    );
  });
  const button = div.querySelector('button');
  if (button) {
    expect(document.documentElement).toMatchSnapshot();
    const style = getComputedStyle(button);
    expect(style.fontSize).toBe('0.24rem');
  } else {
    throw new Error('ConditionalExpression should be render');
  }
});
