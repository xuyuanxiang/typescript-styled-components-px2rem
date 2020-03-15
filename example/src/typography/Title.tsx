import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { ITitleFontSize, PropsWithTheme } from '../theme-provider';
import { ITypographyProps } from './prop-types';

export interface ITitleProps extends ITypographyProps {
  /**
   * 字号
   */
  fontSize?: keyof ITitleFontSize | number;
}

export function Title({
  fontColor = 'main',
  fontSpec = 'standard',
  component = 'span',
  fontSize = 'M',
  children,
  ...props
}: PropsWithChildren<ITitleProps>): JSX.Element {
  return React.createElement(
    styled(component)<PropsWithTheme>`
      font-family: ${props => props?.theme.fonts.family.base};
      font-size: ${typeof fontSize === 'number'
        ? fontSize
        : props => props?.theme.fonts.size[fontSpec]?.title?.[fontSize]}px;
      color: ${props => props?.theme.colors[fontColor]};
    `,
    props,
    children,
  );
}
