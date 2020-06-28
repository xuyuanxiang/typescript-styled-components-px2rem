# typescript-styled-components-px2rem [![MIT](https://img.shields.io/github/license/xuyuanxiang/typescript-styled-components-px2rem?style=plastic)](https://github.com/xuyuanxiang/typescript-styled-components-px2rem/blob/master/LICENSE)

[![npm version](https://img.shields.io/npm/v/typescript-styled-components-px2rem.svg?style=flat-square)](https://www.npmjs.com/package/typescript-styled-components-px2rem) 
![NPM Downloads](https://badgen.net/npm/dt/typescript-styled-components-px2rem) 
[![Build Status](https://api.travis-ci.org/xuyuanxiang/typescript-styled-components-px2rem.svg)](https://travis-ci.org/xuyuanxiang/typescript-styled-components-px2rem) 
[![codecov](https://codecov.io/gh/xuyuanxiang/typescript-styled-components-px2rem/branch/master/graph/badge.svg)](https://codecov.io/gh/xuyuanxiang/typescript-styled-components-px2rem)

TypeScript transformer for convert `px` to `rem` units of [styled-components](https://www.styled-components.com/)

1. Use [postcss-plugin-px2rem](https://github.com/pigcan/postcss-plugin-px2rem#readme) to process all css text in template strings.

2. Add a runtime `px2rem` function polyfill to process expression embedded in template strings when enable [transformRuntime](#transform-runtime) option.

Babel plugin with similar functionality：[babel-plugin-styled-components-px2rem](https://github.com/xuyuanxiang/babel-plugin-styled-components-px2rem).

## Table of Contents

- [Requirement](#requirement)
- [Usage](#usage)
  * [ttypescript](#ttypescript)
  * [rollup](#rollup)
  * [webpack](#webpack)
  * [Jest](#jest)
- [Composition](#composition)
- [Options](#options)
- [Transform Runtime](#transform-runtime)
  * [FunctionExpression](#functionexpression)
  * [ArrowFunctionExpression](#arrowfunctionexpression)
  * [PropertyAccessExpression](#propertyaccessexpression)
  * [ConditionalExpression](#conditionalexpression)
  * [Other Expressions](#other-expressions)
- [Polyfill](#Polyfill)

## Requirement

You need to install the following `peerDependencies` of typescript-styled-components-px2rem into your project at the same time:

```json
{
  "peerDependencies": {
    "typescript": "^3.0.0",
    "postcss": "^7.0.0"
  }
}
```

## Usage

### [ttypescript](https://github.com/cevek/ttypescript) compiler

see [example](example)

The use of React and styled-components [test cases](example/src/__tests__/index.spec.tsx).

### [rollup](https://github.com/rollup/rollup)

Integration with [rollup-plugin-typescript2](https://github.com/ezolenko/rollup-plugin-typescript2) and [ttypescript](https://github.com/cevek/ttypescript)：

```js
import typescript2 from 'rollup-plugin-typescript2';
import tts from 'ttypescript';

export default {
  // ... other rollup configs
  plugins: [
    // ...other rollup plugins
    typescript2({
      typescript: tts,
      objectHashIgnoreUnknownHack: true,
      tsconfigOverride: {
        compilerOptions: {
          module: 'ES2015',
          plugins: [
            {
              transform: 'typescript-styled-components-px2rem',
              rootValue: 100,
              unitPrecision: 5,
              minPixelValue: 0,
              multiplier: 1,
              tags: ['styled', 'css', 'createGlobalStyle', 'keyframes'],
              transformRuntime: false,
            },
          ],
        },
      },
    }),
    // ...other rollup plugins
  ],
};
```

### [webpack](https://github.com/webpack/webpack)

Integration with [awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader) or [ts-loader](https://github.com/TypeStrong/ts-loader)：

```js
const createCustomTransformer = require('typescript-styled-components-px2rem').default;

const customTransformer = createCustomTransformer({
  rootValue: 100,
  unitPrecision: 5,
  minPixelValue: 0,
  multiplier: 1,
  tags: ['styled', 'css', 'createGlobalStyle', 'keyframes'],
  transformRuntime: false,
});

module.exports = {
  // ... other webpack configs
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        // loader: 'awesome-typescript-loader',
        loader: 'ts-loader', // ts-loader or awesome-typescript-loader
        options: {
          // ... other loader options
          getCustomTransformers: () => ({ before: [customTransformer] }),
        },
      },
    ],
  },
};
```

### [Jest](https://github.com/facebook/jest)

Integration with [ts-jest](https://github.com/kulshekhar/ts-jest) and [ttypescript](https://github.com/cevek/ttypescript):

jest.config.js:

```js
module.exports = {
  // other jest configs
  globals: {
    'ts-jest': {
      compiler: 'ttypescript',
    },
  },
};
```

tsconfig.json:

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "transform": "typescript-styled-components-px2rem",
        "type": "config",
        "rootValue": 100,
        "unitPrecision": 5,
        "minPixelValue": 0,
        "multiplier": 1,
        "tags": ["styled", "css", "createGlobalStyle", "keyframes"],
        "transformRuntime": false
      }
    ]
  }
}
```

## Composition

It should be put before [typescript-plugin-styled-components](https://github.com/Igorbek/typescript-plugin-styled-components)

tsconfig.json:

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "transform": "typescript-styled-components-px2rem",
        "type": "config"
      },
      {
        "transform": "typescript-plugin-styled-components",
        "type": "config"
      }
    ]
  }
}
```

## Options

| name | type | required | default | description |
| :-- | :-: | :-: | :-- | --: |
| rootValue | number | false | 100 | The root element font size |
| unitPrecision | number | false | 5 | The decimal numbers to allow the REM units to grow to |
| minPixelValue | number | false | 0 | Set the minimum pixel value to replace |
| multiplier | number | false | 1 | The multiplier of input value |
| tags | string[] | false | ["styled", "css", "createGlobalStyle", "keyframes"] | [styled-components](https://www.styled-components.com/) template literal [tagged](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) |
| transformRuntime | boolean | false | false | since 1.1.0，enable transformation of all expressions that embedded in template strings |

Simple version of the formula：

```js
const input = '32px'; // the value in css text
const pixels = parseFloat(input);

if (pixels < minPixelValue) {
  return input;
}

const fixedVal = toFixed((pixels * multiplier) / rootValue, unitPrecision);

return `${fixedVal}rem`;
```

Remaining options are consistent with [postcss-plugin-px2rem](https://github.com/pigcan/postcss-plugin-px2rem#readme).

## Transform Runtime

If enabled `transformRuntime` option, all supported expressions embedded in template strings are processed as follows:

**Note:** Only expression that end with `px` will be processed.

### FunctionExpression

source code:

```typescript
import styled from 'styled-components';

export const FunctionExpression = styled.button<{ width?: number | string }>`
  width: ${function(props) {
    return props.width;
  }}px; /* Block Body */
  ${props => (props.disabled ? 'height: 400px' : 'height: 200px')};
`;
```

compiled:

```javascript
import styled from 'styled-components';

export const FunctionExpression = styled.button`
  width: ${(...args) =>
    px2rem_1(function(props) {
      return props.width;
    }, ...args)}; /* Block Body */
  ${props => (props.disabled ? 'height: 4rem' : 'height: 2rem')};
`;

function px2rem_1(input, ...args) {
  if (typeof input === 'function') return px2rem_1(input(...args), ...args);
  var value = parseFloat(input);
  var pixels = Number.isNaN(value) ? 0 : value;
  if (Math.abs(pixels) < 0) return `${pixels}px`;
  var multiplier = Math.pow(10, 5 + 1);
  var wholeNumber = Math.floor(((pixels * 1) / 100) * multiplier);
  return `${(Math.round(wholeNumber / 10) * 10) / multiplier}rem`;
}
```

### ArrowFunctionExpression

source code:

```typescript
import styled from 'styled-components';

const height = '44';
export const ArrowFunction = styled.input.attrs(props => ({
  type: 'password',
  size: props.size || '16px',
  width: props.width || 100,
}))`
  color: palevioletred;
  font-size: 14px;
  border: 1px solid palevioletred;
  border-radius: 8px;
  width: ${props => props.width}px; /* PropertyAccess Body */
  height: ${() => height}px; /* Identifier Body */
  line-height: ${() => '44'}px; /* StringLiteral Body */
  margin: ${() => 32}px; /* NumericLiteral Body */
  padding: ${props => props.size};
`;
export const ArrowFunctionWithBlockBody = styled.button<{ width?: number | string }>`
  width: ${props => {
    if (props.width) {
      return props.width;
    } else {
      return 0;
    }
  }}px; /* Block Body */
  ${props => (props.disabled ? 'height: 400px' : 'height: 200px')};
`;
export const ArrowFunctionWithBinaryBody = styled.button<{ height?: number }>`
  ${props =>
    props.disabled &&
    `
    width: 200px;
    font-size: 14px;
  `};
  height: ${props => !props.disabled && props.height}px; /* Binary Body */
`;
export const ArrowFunctionWithConditionalBody = styled.button<{ height?: number }>`
  height: ${props => (props.height ? height : 100)}px; /* Conditional Body */
`;
```

compiled:

```javascript
import styled from 'styled-components';
const height = '44';
export const ArrowFunction = styled.input.attrs(props => ({
  type: 'password',
  size: props.size || '0.16rem',
  width: props.width || 100,
}))`
  color: palevioletred;
  font-size: 0.14rem;
  border: 1px solid palevioletred;
  border-radius: 0.08rem;
  width: ${props => px2rem_1(props.width)}; /* PropertyAccess Body */
  height: ${() => px2rem_1(height)}; /* Identifier Body */
  line-height: ${() => px2rem_1('44')}; /* StringLiteral Body */
  margin: ${() => px2rem_1(32)}; /* NumericLiteral Body */
  padding: ${props => props.size};
`;
export const ArrowFunctionWithBlockBody = styled.button`
  width: ${props =>
    px2rem_1(() => {
      if (props.width) {
        return props.width;
      } else {
        return 0;
      }
    })}; /* Block Body */
  ${props => (props.disabled ? 'height: 4rem' : 'height: 2rem')};
`;
export const ArrowFunctionWithBinaryBody = styled.button`
  ${props =>
    props.disabled &&
    `
    width: 2rem;
    font-size: 0.14rem;
  `};
  height: ${props => px2rem_1(!props.disabled && props.height)}; /* Binary Body */
`;
export const ArrowFunctionWithConditionalBody = styled.button`
  height: ${props => (props.height ? px2rem_1(height) : px2rem_1(100))}; /* Conditional Body */
`;
function px2rem_1(input, ...args) {
  if (typeof input === 'function') return px2rem_1(input(...args), ...args);
  var value = parseFloat(input);
  var pixels = Number.isNaN(value) ? 0 : value;
  if (Math.abs(pixels) < 0) return `${pixels}px`;
  var multiplier = Math.pow(10, 5 + 1);
  var wholeNumber = Math.floor(((pixels * 1) / 100) * multiplier);
  return `${(Math.round(wholeNumber / 10) * 10) / multiplier}rem`;
}
```

### PropertyAccessExpression

source code:

```typescript
import styled from 'styled-components';

export const PropertyAccessExpression = styled.button<{ width: number; height: string }>(
  props => `
  width: ${props.width}px;
  height: ${props.height}; /* Note: Only expression end with 'px' will be processed. */
`,
);
```

compiled:

```javascript
import styled from 'styled-components';
export const PropertyAccessExpression = styled.button(
  props => `
  width: ${px2rem_1(props.width)};
  height: ${props.height}; /* Note: Only expression end with 'px' will be processed. */
`,
);
function px2rem_1(input, ...args) {
  if (typeof input === 'function') return px2rem_1(input(...args), ...args);
  var value = parseFloat(input);
  var pixels = Number.isNaN(value) ? 0 : value;
  if (Math.abs(pixels) < 0) return `${pixels}px`;
  var multiplier = Math.pow(10, 5 + 1);
  var wholeNumber = Math.floor(((pixels * 1) / 100) * multiplier);
  return `${(Math.round(wholeNumber / 10) * 10) / multiplier}rem`;
}
```

### ConditionalExpression

source code:

```typescript jsx
import React from 'react';
import styled from 'styled-components';

export const ConditionalExpression = function({ fontSize }: { fontSize?: unknown }) {
  const StyledButton = styled.button`
    font-size: ${typeof fontSize === 'number' ? fontSize : props => props?.theme.fontSize}px;
  `;

  return <StyledButton />;
};
export const ConditionalExpressionWhenTrue = function({ fontSize }: { fontSize?: unknown }) {
  const StyledButton = styled.button`
    font-size: ${typeof fontSize !== 'number' ? props => props?.theme.fontSize : fontSize}px;
  `;

  return <StyledButton />;
};
```

compiled:

```javascript
import React from 'react';
import styled from 'styled-components';
export const ConditionalExpression = function({ fontSize }) {
  const StyledButton = styled.button`
    font-size: ${typeof fontSize === 'number' ? px2rem_1(fontSize) : props => px2rem_1(props?.theme.fontSize)};
  `;
  return React.createElement(StyledButton, null);
};
export const ConditionalExpressionWhenTrue = function({ fontSize }) {
  const StyledButton = styled.button`
    font-size: ${typeof fontSize !== 'number' ? props => px2rem_1(props?.theme.fontSize) : px2rem_1(fontSize)};
  `;
  return React.createElement(StyledButton, null);
};
function px2rem_1(input, ...args) {
  if (typeof input === 'function') return px2rem_1(input(...args), ...args);
  var value = parseFloat(input);
  var pixels = Number.isNaN(value) ? 0 : value;
  if (Math.abs(pixels) < 0) return `${pixels}px`;
  var multiplier = Math.pow(10, 5 + 1);
  var wholeNumber = Math.floor(((pixels * 1) / 100) * multiplier);
  return `${(Math.round(wholeNumber / 10) * 10) / multiplier}rem`;
}
```

### Other Expressions

Identifier, CallExpression, BinaryExpression, ...

source code:

```typescript
import styled, { css, createGlobalStyle } from 'styled-components';

const fontSize = 18;
export const GlobalStyle = createGlobalStyle`
  html body {
    font-size: ${fontSize}px;
  }
`;

function getHeight() {
  const height = 100;

  return height / 2;
}
const mixins = css`
  padding: 0 16px;
`;
export const MixinsButton = styled.button`
  ${mixins};
  height: ${getHeight()}px;
`;

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
  padding: ${40 + 50}px 8px ${4}px 16px;
  line-height: ${calc() - 2}px;
`;
```

compiled:

```javascript
import styled, { css, createGlobalStyle } from 'styled-components';
const fontSize = 18;
export const GlobalStyle = createGlobalStyle`
  html body {
    font-size: ${px2rem_1(fontSize)};
  }
`;
function getHeight() {
  const height = 100;
  return height / 2;
}
const mixins = css`
  padding: 0 0.16rem;
`;
export const MixinsButton = styled.button`
  ${mixins};
  height: ${px2rem_1(getHeight())};
`;
const condition = false;
function calc() {
  return 20;
}
export const BinaryExpression = styled.button`
  ${condition ||
    `
    width: 2rem;
  `};
  height: ${px2rem_1(condition || 100)};
  padding: ${px2rem_1(40 + 50)} 0.08rem ${px2rem_1(4)} 0.16rem;
  line-height: ${px2rem_1(calc() - 2)};
`;

function px2rem_1(input, ...args) {
  if (typeof input === 'function') return px2rem_1(input(...args), ...args);
  var value = parseFloat(input);
  var pixels = Number.isNaN(value) ? 0 : value;
  if (Math.abs(pixels) < 0) return `${pixels}px`;
  var multiplier = Math.pow(10, 5 + 1);
  var wholeNumber = Math.floor(((pixels * 1) / 100) * multiplier);
  return `${(Math.round(wholeNumber / 10) * 10) / multiplier}rem`;
}
```

# Polyfill

Maybe you need import some polyfills from `core-js` only once in your entry file to support outdated user agent like: `iOS 7.x`, `iOS 8.x` and `android 4.x`.

```javascript
import 'core-js/es/number/is-nan';
import 'core-js/es/parse-float';
```
