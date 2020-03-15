import { HTMLProps } from 'react';
import { IThemeFontSpec, IThemePalette } from '../theme-provider';

export interface ITypographyProps extends HTMLProps<HTMLElement> {
  /**
   * 颜色
   */
  fontColor?: keyof IThemePalette;
  /**
   * 规格
   */
  fontSpec?: keyof IThemeFontSpec;
  /**
   * HTML标签
   */
  component?: keyof JSX.IntrinsicElements;
}
