export interface IPluginConfiguration {
  rootValue: number;
  unitPrecision: number;
  minPixelValue: number;
  multiplier: number;
}

export const DEFAULT_OPTIONS: IPluginConfiguration = {
  rootValue: 100,
  unitPrecision: 5,
  minPixelValue: 2,
  multiplier: 2,
};
