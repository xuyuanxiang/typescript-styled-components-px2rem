import TestUtils from 'react-dom/test-utils';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { ConditionalExpression } from '../ConditionalExpression';
import React from 'react';

describe('embedded ConditionalExpression', () => {
  const div: HTMLDivElement = document.createElement('div');

  beforeEach(() => {
    document.body.appendChild(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
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
});
