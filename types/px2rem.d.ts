declare module 'px2rem' {
  interface IPx2remOptions {
    baseDpr?: number; // base device pixel ratio (default: 2)
    remUnit?: number; // rem unit value (default: 75)
    remPrecision?: number; // rem value precision (default: 6)
    forcePxComment?: string; // force px comment (default: `px`)
    keepComment?: string; // no transform value comment (default: `no`)
  }
  class Px2rem {
    constructor(options: IPx2remOptions);
    generateThree(cssText: string, dpr: number): string;
    generateRem(cssText: string): string;
    _getCalcValue(type: 'px' | 'rem', value: string, dpr: number): string;
  }
  export = Px2rem;
}
