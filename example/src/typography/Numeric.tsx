import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { INumberFontSize, PropsWithTheme } from '../theme-provider';
import { ITypographyProps } from './prop-types';

export interface INumericProps extends ITypographyProps {
  /**
   * 字号
   */
  fontSize?: keyof INumberFontSize | number;
}

export function Numeric({
  fontColor = 'main',
  fontSpec = 'standard',
  component = 'span',
  fontSize = 'L',
  children,
  ...props
}: PropsWithChildren<INumericProps>): JSX.Element {
  return React.createElement(
    styled(component)<PropsWithTheme>`
      font-family: ${props => props?.theme.fonts.family.numeric}, sans-serif;
      font-size: ${props =>
        typeof fontSize === 'number' ? fontSize : props?.theme.fonts.size[fontSpec]?.numeric?.[fontSize]}px;
      color: ${props => props?.theme.colors[fontColor]};
    `,
    props,
    children,
  );
}
