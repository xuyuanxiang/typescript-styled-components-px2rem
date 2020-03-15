import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { ITextFontSize, PropsWithTheme } from '../theme-provider';
import { ITypographyProps } from './prop-types';

export interface ITextProps extends ITypographyProps {
  /**
   * 字号
   */
  fontSize?: keyof ITextFontSize | number;
}

export function Text({
  fontColor = 'main',
  fontSpec = 'standard',
  component = 'span',
  fontSize = 'M',
  children,
  ...props
}: PropsWithChildren<ITextProps>): JSX.Element {
  return React.createElement(
    styled(component)<PropsWithTheme>`
      font-family: ${props => props?.theme.fonts.family.base};
      font-size: ${typeof fontSize === 'number'
        ? fontSize
        : props => props?.theme.fonts.size[fontSpec]?.text?.[fontSize]}px;
      color: ${props => props?.theme.colors[fontColor]};
      line-height: 1;
    `,
    props,
    children,
  );
}
