import React from 'react';
import TestUtils from 'react-dom/test-utils';
import ReactDOM from 'react-dom';
import { BinaryExpression } from '../BinaryExpression';

const div: HTMLDivElement = document.createElement('div');

beforeEach(() => {
  document.body.appendChild(div);
});

afterEach(() => {
  ReactDOM.unmountComponentAtNode(div);
  document.body.removeChild(div);
});

it('should transform BinaryExpression', function() {
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
