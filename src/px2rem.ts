import { IPluginConfiguration } from './IPluginConfiguration';

export function toFixed(value: number, precision: number): number {
  const multiplier = Math.pow(10, precision + 1);
  const wholeNumber = Math.floor(value * multiplier);
  return (Math.round(wholeNumber / 10) * 10) / multiplier;
}

export function px2rem(
  input: string | number,
  { rootValue, minPixelValue, unitPrecision, multiplier }: IPluginConfiguration,
): string {
  const pixels = typeof input === 'string' ? parseFloat(input) : input;
  if (pixels < minPixelValue) {
    return `${pixels}px`;
  }
  const fixedVal = toFixed((pixels * multiplier) / rootValue, unitPrecision);

  return `${fixedVal}rem`;
}
