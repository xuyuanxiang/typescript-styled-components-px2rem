import React from 'react';
import TestUtils from 'react-dom/test-utils';
import ReactDOM from 'react-dom';
import {
  ArrowFunctionExpressionWithPureBody,
  ArrowFunctionWithBinaryBody,
  ArrowFunctionWithBlockBody,
  ArrowFunctionWithConditionalBody,
} from '../ArrowFunctionExpression';

describe('embedded ArrowFunctionExpression', () => {
  const div: HTMLDivElement = document.createElement('div');

  beforeEach(() => {
    document.body.appendChild(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  it('should transform PropertyAccess, Identifier, StringLiteral, NumericLiteral Body', function() {
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
      expect(style.padding).toBe('0px');
      expect(style.margin).toBe('0.32rem');
      expect(style.lineHeight).toBe('0.44rem');
      expect(style.height).toBe('0.44rem');
    } else {
      throw new Error('ArrowFunctionExpressionWithPureBody should be render');
    }
  });

  it('should transform BinaryExpression Body', function() {
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

  it('should transform ConditionalExpression Body', function() {
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

  it('should transform Block Body', function() {
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
});
