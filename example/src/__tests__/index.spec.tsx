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
