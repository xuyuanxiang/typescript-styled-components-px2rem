# typescript-styled-components-px2rem

TypeScript transformer for converting `px` to `rem` unit;

## Installation

```npm
npm install typescript-styled-components-px2rem --save
```

## Usage

### ttypescript compiler

see [example](example);

### rollup

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

### webpack

```js
const createCustomerTransformer = require('typescript-styled-components-px2rem').default;

const customerTransformer = createCustomerTransformer();

module.exports = {
  // ... other webpack configs
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          // ... other loader options
          getCustomTransformers: () => ({ before: [customerTransformer] }),
        },
      },
    ],
  },
};
```
