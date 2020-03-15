import { fonts, IThemeFont } from './fonts';
import { colors, IThemePalette } from './colors';
import { form, IThemeFormSpec } from './form';
import { zIndex, IThemeZIndex } from './zIndex';

export interface ITheme {
  readonly fonts: IThemeFont;
  readonly colors: IThemePalette;
  readonly zIndex: IThemeZIndex;
  readonly form: IThemeFormSpec;
}

export class DefaultTheme implements ITheme {
  readonly fonts: IThemeFont = fonts;
  readonly colors: IThemePalette = colors;
  readonly zIndex: IThemeZIndex = zIndex;
  readonly form: IThemeFormSpec = form;
}

export type PropsWithTheme<P = {}> = P & { theme?: ITheme };

export const defaultTheme: ITheme = new DefaultTheme();
