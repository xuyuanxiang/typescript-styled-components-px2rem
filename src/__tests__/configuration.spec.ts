import configuration from '../configuration';

describe('configuration', () => {
  it('should return default configuration', function() {
    expect(configuration.config).toEqual({
      rootValue: 100,
      unitPrecision: 5,
      minPixelValue: 2,
      multiplier: 2,
      tags: ['styled', 'css', 'createGlobalStyle'],
    });
  });
  it('should return update configuration', function() {
    expect(configuration.config).toEqual({
      rootValue: 100,
      unitPrecision: 5,
      minPixelValue: 2,
      multiplier: 2,
      tags: ['styled', 'css', 'createGlobalStyle'],
    });
    configuration.updateConfig({ rootValue: 75, tags: ['sty', 'inject'] });
    expect(configuration.config).toEqual({
      rootValue: 75,
      unitPrecision: 5,
      minPixelValue: 2,
      multiplier: 2,
      tags: ['sty', 'inject'],
    });
  });
});
