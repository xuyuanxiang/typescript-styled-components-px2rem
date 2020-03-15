export interface IThemeZIndex {
  /**
   * 背景遮罩
   */
  readonly mask: number;
  /**
   * select选择器
   */
  readonly picker: number;
  /**
   * 导航条标题门店下拉选择
   */
  readonly dropdown: number;
  /**
   * 轻提示
   */
  readonly toast: number;
  /**
   * 对话框：alert，confirm, ActionSheet...
   */
  readonly dialog: number;
  /**
   * 加载动画
   */
  readonly loading: number;
}

class DefaultZIndex implements IThemeZIndex {
  readonly dialog: number = 1001;
  readonly dropdown: number = 1000;
  readonly loading: number = 1002;
  readonly mask: number = 999;
  readonly picker: number = 1000;
  readonly toast: number = 1003;
}

export const zIndex = new DefaultZIndex();
