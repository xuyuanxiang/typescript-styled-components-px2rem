export interface INumberFontSize {
  /**
   * 大数字
   */
  readonly L: number;
  /**
   * 特大数字
   */
  readonly XL: number;
}

export interface ITitleFontSize {
  /**
   * 特大标题
   */
  readonly XXL: number;
  /**
   * 大标题
   */
  readonly XL: number;
  /**
   * 头条标题
   */
  readonly L: number;
  /**
   * 标题
   */
  readonly M: number;
}

export interface ITextFontSize {
  /**
   * 特大文字
   */
  readonly XL: number;
  /**
   * 大文字
   */
  readonly L: number;
  /**
   * 文字
   */
  readonly M: number;
  /**
   * 备注
   */
  readonly S: number;
  /**
   * 标签
   */
  readonly XS: number;
}

export interface IThemeFontType {
  /**
   * 数字
   */
  readonly numeric: INumberFontSize;
  /**
   * 标题
   */
  readonly title: ITitleFontSize;
  /**
   * 文字
   */
  readonly text: ITextFontSize;
}

export interface IThemeFontSpec {
  /**
   * 标准字体
   */
  readonly standard: IThemeFontType;
  /**
   * 大字体
   */
  readonly large: IThemeFontType;
  /**
   * 特大字体
   */
  readonly huge: IThemeFontType;
}

export interface IThemeFontFamily {
  readonly base: string;
  readonly numeric?: string;
}

export interface IThemeFontWeight {
  readonly normal: number;
  readonly bold: number;
}

export interface IThemeFont {
  readonly size: IThemeFontSpec;
  readonly weight: IThemeFontWeight;
  readonly family: IThemeFontFamily;
}

export class StandardNumericFontSize implements INumberFontSize {
  readonly XL = 80;
  readonly L = 40;
}

export class StandardTitleFontSize implements ITitleFontSize {
  readonly XXL = 48;
  readonly XL = 36;
  readonly L = 34;
  readonly M = 32;
}

export class StandardTextFontSize implements ITextFontSize {
  readonly XL = 30;
  readonly L = 26;
  readonly M = 24;
  readonly S = 22;
  readonly XS = 18;
}

export class StandardFont implements IThemeFontType {
  readonly numeric: INumberFontSize = new StandardNumericFontSize();
  readonly title: ITitleFontSize = new StandardTitleFontSize();
  readonly text: ITextFontSize = new StandardTextFontSize();
}

export class LargeNumericFontSize {
  readonly XL = 96;
  readonly L = 48;
}

export class LargeTitleFontSize {
  readonly XXL = 58;
  readonly XL = 42;
  readonly L = 40;
  readonly M = 38;
}

export class LargeTextFontSize {
  readonly XL = 36;
  readonly L = 30;
  readonly M = 28;
  readonly S = 26;
  readonly XS = 22;
}

export class LargeFont implements IThemeFontType {
  readonly numeric: INumberFontSize = new LargeNumericFontSize();
  readonly title: ITitleFontSize = new LargeTitleFontSize();
  readonly text: ITextFontSize = new LargeTextFontSize();
}

export class HugeNumericFontSize {
  readonly XL = 116;
  readonly L = 58;
}

// 这里跟设计师确认过了，XL和L都是48。
export class HugeTitleFontSize {
  readonly XXL = 70;
  readonly XL = 48;
  readonly L = 48;
  readonly M = 46;
}

export class HugeTextFontSize {
  readonly XL = 42;
  readonly L = 36;
  readonly M = 34;
  readonly S = 30;
  readonly XS = 26;
}

export class HugeFont implements IThemeFontType {
  readonly numeric: INumberFontSize = new HugeNumericFontSize();
  readonly title: ITitleFontSize = new HugeTitleFontSize();
  readonly text: ITextFontSize = new HugeTextFontSize();
}

export class DefaultFontSpec implements IThemeFontSpec {
  readonly standard = new StandardFont();
  readonly large = new LargeFont();
  readonly huge = new HugeFont();
}

export class DefaultFontFamily implements IThemeFontFamily {
  readonly numeric = 'Lato';
  readonly base = "-apple-system, 'PingFang SC', Roboto";
}

export class DefaultFontWeight implements IThemeFontWeight {
  readonly bold = 500;
  readonly normal = 400;
}

export class DefaultThemeFont implements IThemeFont {
  readonly size: IThemeFontSpec = new DefaultFontSpec();
  readonly family: IThemeFontFamily = new DefaultFontFamily();
  readonly weight: IThemeFontWeight = new DefaultFontWeight();
}

export const fonts = new DefaultThemeFont();
