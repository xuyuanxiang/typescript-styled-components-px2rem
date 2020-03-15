/**
 * 表单规格尺寸
 *
 * FormItem包括: InputItem, SwitchItem, TextareaItem
 */
export interface IThemeFormSpec {
  /**
   * FormItem背景色
   */
  readonly background: string;
  /**
   * FormItem高度
   */
  readonly itemHeight: number;
  /**
   * FormItem padding-left
   */
  readonly leftSpacing: number;
  /**
   * FormItem padding-right
   */
  readonly rightSpacing: number;
  /**
   * FormItem 分割线颜色
   */
  readonly borderColor: string;
  /**
   * FormItem字号
   */
  readonly fontSize: number;
  /**
   * FormItem字重
   */
  readonly fontWeight: number;
  /**
   * input/textarea字号
   */
  readonly inputFontSize: number;
  /**
   * input/textarea字重
   */
  readonly inputFontWeight: number;
  /**
   * input/textarea行高
   */
  readonly inputLineHeight: number;
  /**
   * input/textarea placeholder字色
   */
  readonly placeholderColor: string;
  /**
   * input/textarea 未通过校验时的字色
   */
  readonly invalidColor: string;
  /**
   * input/textarea 设置disabled属性时字色
   */
  readonly disabledColor: string;
  /**
   * input/textarea 设置readonly属性时字色
   */
  readonly readOnlyColor: string;
  /**
   * input/textarea 获取焦点时字色
   */
  readonly focusedColor: string;
  /**
   * input/textarea 字色
   */
  readonly color: string;
}

export class DefaultThemeFormSpec implements IThemeFormSpec {
  readonly background: string = '#ffffff';
  readonly fontSize: number = 16;
  readonly fontWeight: number = 400;
  readonly inputFontSize: number = 16;
  readonly inputFontWeight: number = 400;
  readonly inputLineHeight: number = 24;
  readonly itemHeight: number = 48;
  readonly leftSpacing: number = 16;
  readonly rightSpacing: number = 16;
  readonly color: string = '#d9af5c';
  readonly borderColor: string = '#efefef';
  readonly placeholderColor: string = '#cccccc';
  readonly invalidColor: string = '#d23f31';
  readonly disabledColor: string = '#262626';
  readonly focusedColor: string = '#262626';
  readonly readOnlyColor: string = '#262626';
}

export const form = new DefaultThemeFormSpec();
