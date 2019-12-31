# typescript-styled-components-px2rem

[![npm version](https://img.shields.io/npm/v/typescript-styled-components-px2rem.svg?style=flat-square)](https://www.npmjs.com/package/typescript-styled-components-px2rem) [![Build Status](https://travis-ci.org/xuyuanxiang/typescript-styled-components-px2rem.svg?branch=master)](https://travis-ci.org/xuyuanxiang/typescript-styled-components-px2rem) [![Coverage Status](https://coveralls.io/repos/github/xuyuanxiang/typescript-styled-components-px2rem/badge.svg?branch=master)](https://coveralls.io/github/xuyuanxiang/typescript-styled-components-px2rem?branch=master)

TypeScript transformer for convert `px` to `rem` units of [styled-components](https://www.styled-components.com/)

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
              multiplier: 2,
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
  multiplier: 2,
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
        "multiplier": 2
      }
    ]
  }
}
```

## Options

| name          |  type  | required | default |                                           description |
| :------------ | :----: | :------: | :------ | ----------------------------------------------------: |
| rootValue     | number |  false   | 100     |                            The root element font size |
| unitPrecision | number |  false   | 5       | The decimal numbers to allow the REM units to grow to |
| minPixelValue | number |  false   | 2       |                Set the minimum pixel value to replace |
| multiplier    | number |  false   | 2       |                         The multiplier of input value |

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

## TODO

### Should support TemplateExpression

Example:

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
  height: 0.96rem;
  line-height: 0.96rem;
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
  font-size: 0.32rem;
`,
);
```
