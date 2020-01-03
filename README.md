# typescript-styled-components-px2rem

[![npm version](https://img.shields.io/npm/v/typescript-styled-components-px2rem.svg?style=flat-square)](https://www.npmjs.com/package/typescript-styled-components-px2rem) [![Build Status](https://api.travis-ci.org/xuyuanxiang/typescript-styled-components-px2rem.svg)](https://travis-ci.org/xuyuanxiang/typescript-styled-components-px2rem) [![Coverage Status](https://coveralls.io/repos/github/xuyuanxiang/typescript-styled-components-px2rem/badge.svg)](https://coveralls.io/github/xuyuanxiang/typescript-styled-components-px2rem)

TypeScript transformer for convert `px` to `rem` units of [styled-components](https://www.styled-components.com/)

Use [postcss-plugin-px2rem](https://github.com/pigcan/postcss-plugin-px2rem#readme) to process all css text in template strings.

Babel plugin with similar functionality：[babel-plugin-styled-components-px2rem](https://github.com/xuyuanxiang/babel-plugin-styled-components-px2rem).

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
              minPixelValue: 2,
              multiplier: 1,
              tags: ['styled', 'css', 'createGlobalStyle', 'keyframes'],
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
  minPixelValue: 2,
  multiplier: 1,
  tags: ['styled', 'css', 'createGlobalStyle', 'keyframes'],
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
        "minPixelValue": 2,
        "multiplier": 1,
        "tags": ["styled", "css", "createGlobalStyle", "keyframes"]
      }
    ]
  }
}
```

## Composition

It should put before [typescript-plugin-styled-components](https://github.com/Igorbek/typescript-plugin-styled-components)

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
| minPixelValue | number | false | 2 | Set the minimum pixel value to replace |
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

Remaining options ara consistent with [postcss-plugin-px2rem](https://github.com/pigcan/postcss-plugin-px2rem#readme).

## Transform Runtime

If enabled `transformRuntime` option, all supported expressions embedded in template strings are processed as follows:

**Note:** Only expression that end with `px` will be processed.

### ArrowFunctionExpression

source code:

```typescript
import styled from 'styled-components';

export const ArrowFunctionExpression = styled.input.attrs(props => ({
  type: 'password',
  size: props.size || '16px',
  width: props.width || 100,
}))`
  width: ${props => props.width}px;
  padding: ${props => props.size};
`;
export const ArrowFunctionExpressionWithBlockBody = styled.button<{ width?: number | string }>`
  width: ${props => {
    if (props.width) {
      return props.width;
    } else {
      return 0;
    }
  }}px;
`;
```

compiled:

```typescript
import styled from 'styled-components';
export const ArrowFunctionExpression = styled.input.attrs(props => ({
  type: 'password',
  size: props.size || '16px',
  width: props.width || 100,
}))`
  width: ${props => px2rem_1(props.width)};
  padding: ${props => props.size};
`;
export const ArrowFunctionExpressionWithBlockBody = styled.button`
  width: ${props =>
    px2rem_1(() => {
      if (props.width) {
        return props.width;
      } else {
        return 0;
      }
    })};
`;
function px2rem_1(input, ...args) {
  if (typeof input === 'function') return px2rem_1(input(...args));
  var value = parseFloat(input);
  var pixels = Number.isNaN(value) ? 0 : value;
  if (pixels < 2) return `${pixels}px`;
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
  height: ${props.height};
`,
);
```

compiled:

```typescript
import styled from 'styled-components';
export const PropertyAccessExpression = styled.button(
  props => `
  width: ${px2rem_1(props.width)};
  height: ${props.height};
`,
);
function px2rem_1(input, ...args) {
  if (typeof input === 'function') return px2rem_1(input(...args));
  var value = parseFloat(input);
  var pixels = Number.isNaN(value) ? 0 : value;
  if (pixels < 2) return `${pixels}px`;
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
```

compiled:

```typescript
import React from 'react';
import styled from 'styled-components';
export const ConditionalExpression = function({ fontSize }) {
  const StyledButton = styled.button`
    font-size: ${typeof fontSize === 'number' ? px2rem_1(fontSize) : props => px2rem_1(props?.theme.fontSize)};
  `;
  return React.createElement(StyledButton, null);
};
function px2rem_1(input, ...args) {
  if (typeof input === 'function') return px2rem_1(input(...args));
  var value = parseFloat(input);
  var pixels = Number.isNaN(value) ? 0 : value;
  if (pixels < 2) return `${pixels}px`;
  var multiplier = Math.pow(10, 5 + 1);
  var wholeNumber = Math.floor(((pixels * 1) / 100) * multiplier);
  return `${(Math.round(wholeNumber / 10) * 10) / multiplier}rem`;
}
```

### Other Expressions

Identifier, CallExpression...

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
```

compiled:

```typescript
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
function px2rem_1(input, ...args) {
  if (typeof input === 'function') return px2rem_1(input(...args));
  var value = parseFloat(input);
  var pixels = Number.isNaN(value) ? 0 : value;
  if (pixels < 2) return `${pixels}px`;
  var multiplier = Math.pow(10, 5 + 1);
  var wholeNumber = Math.floor(((pixels * 1) / 100) * multiplier);
  return `${(Math.round(wholeNumber / 10) * 10) / multiplier}rem`;
}
```
