# typescript-styled-components-px2rem-example

## Installation

```npm
npm install typescript-styled-components-px2rem tttypescript --save-dev
```

## Configuration

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

## Compilation

Append scripts to `packages.json`:

```json
{
  "scripts": {
    "build": "ttsc"
  }
}
```

Typing under project root:

```
npm run build
```
