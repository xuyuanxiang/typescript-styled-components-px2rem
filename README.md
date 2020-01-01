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

If enabled `transformRuntime` option, all expressions embedded in template strings are processed as follows:

Source code:

```typescript
import styled, { css, createGlobalStyle, keyframes } from 'styled-components';

const Input = styled.input.attrs(props => ({
  type: 'password',
  size: props.size || '1em',
  width: props.width || 100,
}))`
  color: palevioletred;
  font-size: 14px;
  width: ${props => props.width}px;
  margin: ${props => props.size};
`;

const SizeableButton = styled.button<{ width: number | string; height: string }>(
  props => `
  display: inline;
  width: ${props.width}px;
  height: ${props.height};
  font-size: 16px;
`,
);
```

will be transformed to:

```typescript
import { px2rem as _px2rem } from 'typescript-styled-components-px2rem/lib/px2rem';
var _OPTIONS = {
  rootValue: 100,
  unitPrecision: 5,
  multiplier: 1,
  minPixelValue: 2,
};
import styled, { css, createGlobalStyle, keyframes } from 'styled-components';
const Input = styled.input.attrs(props => ({
  type: 'password',
  size: props.size || '1em',
  width: props.width || 100,
}))`
  color: palevioletred;
  font-size: 0.14rem;
  width: ${props => _px2rem(props.width, _OPTIONS)};
  margin: ${props => props.size}; /* ignored */
`;
const SizeableButton = styled.button<{ width: number | string; height: string }>(
  props => `
  display: inline;
  width: ${_px2rem(props.width, _OPTIONS)};
  height: ${props.height}; /* ignored */
  font-size: 0.16rem;
`,
);
```

**Note:** Only expressions that end in `px` will be processed.
