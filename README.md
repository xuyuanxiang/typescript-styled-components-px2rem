# typescript-styled-components-px2rem

[![npm version](https://img.shields.io/npm/v/typescript-styled-components-px2rem.svg?style=flat-square)](https://www.npmjs.com/package/typescript-styled-components-px2rem) [![Build Status](https://api.travis-ci.org/xuyuanxiang/typescript-styled-components-px2rem.svg)](https://travis-ci.org/xuyuanxiang/typescript-styled-components-px2rem) [![Coverage Status](https://coveralls.io/repos/github/xuyuanxiang/typescript-styled-components-px2rem/badge.svg)](https://coveralls.io/github/xuyuanxiang/typescript-styled-components-px2rem)

TypeScript transformer for convert `px` to `rem` units of [styled-components](https://www.styled-components.com/)

Use [postcss-plugin-px2rem](https://github.com/pigcan/postcss-plugin-px2rem#readme) to process all css text in template strings.

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

## TODO

### Should support embedded expressions in template strings

```typescript
import styled from 'styled-components';

const InlineButton = styled.button<{ width: number }>`
  display: inline;
  width: ${props => props.width}px;
  height: 48px;
  line-height: 48px;
`;
// transformed:
const TransformedInlineButton = styled.button<{ width: number }>`
  display: inline;
  width: ${props => props.width}px; /* not work */
  height: 0.48rem;
  line-height: 0.48rem;
`;

const SizeableButton = styled.button<{ width: number; height: number }>(
  props => `
  display: inline;
  width: ${props.width}px;
  height: ${props.height}px;
  line-height: ${props.height}px;
  font-size: 16px;
`,
);
// transformed:
const TransformedSizeableButton = styled.button<{ width: number; height: number }>(
  props => `
  display: inline;
  width: ${props.width}px; /* not work */
  height: ${props.height}px; /* not work */
  line-height: ${props.height}px; /* not work */
  font-size: 0.16rem; 
`,
);
```
