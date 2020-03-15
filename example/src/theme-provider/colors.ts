export interface IThemePalette {
  /**
   * 主色
   * 链接文字色
   * 按钮背景色
   */
  readonly primary: string;

  /**
   * 开关及通过
   */
  readonly success: string;

  /**
   * 强调文字色
   */
  readonly emphasize: string;

  /**
   * 警示色
   */
  readonly warning: string;

  /**
   * 表单背景色
   * 备注背景色
   */
  readonly form: string;

  /**
   * 表单文字色
   */
  readonly label: string;

  /**
   * 分隔线色
   * 边框线色
   */
  readonly border: string;

  /**
   * 主文字色
   */
  readonly main: string;

  /**
   * 辅助文字色
   */
  readonly secondary: string;

  /**
   * 次要链接文字色
   */
  readonly hint: string;

  /**
   * 黑色背景
   */
  readonly dark: string;

  /**
   * 白色背景
   */
  readonly light: string;
}

class DefaultPalette implements IThemePalette {
  readonly light = '#ffffff';
  readonly dark = '#000000';
  readonly primary = '#d9af5c';
  readonly success = '#35a04d';
  readonly emphasize = '#ff5400';
  readonly warning = '#d23f31';
  readonly border = '#efefef';
  readonly main = '#262626';
  readonly secondary = '#666666';
  readonly hint = '#9b9b9b';
  readonly form = '#f6f6f6';
  readonly label = '#cccccc';
}

export const colors = new DefaultPalette();
