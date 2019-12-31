export interface IConfiguration {
  rootValue: number;
  unitPrecision: number;
  minPixelValue: number;
  multiplier: number;
}

class ConfigurationManager {
  private static readonly defaultConfiguration: IConfiguration = {
    rootValue: 100,
    unitPrecision: 5,
    minPixelValue: 2,
    multiplier: 2,
  };
  private _config: IConfiguration = ConfigurationManager.defaultConfiguration;

  public get config(): IConfiguration {
    return this._config;
  }

  public updateConfig(config?: Partial<IConfiguration>): void {
    if (config) {
      this._config = Object.assign({}, ConfigurationManager.defaultConfiguration, config);
    }
  }
}

export default new ConfigurationManager();
