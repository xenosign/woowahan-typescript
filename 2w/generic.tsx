import { css } from '@emotion/react';
import {
  ReactNode,
  CSSProperties,
  ElementType,
  ComponentPropsWithoutRef,
} from 'react';
import { FontStyle, fontStyles } from '../../style/mixins';
import {
  colorTokens,
  fontWeightTokens,
  textColorTokens,
} from '../../style/tokens';

type FontWeight = keyof typeof fontWeightTokens;
type FontColor = keyof typeof textColorTokens;

interface TextBaseProps {
  children?: ReactNode;
  className?: string;
  fontStyle?: FontStyle;
  fontWeight?: FontWeight;
  color?: FontColor;
  ellipsis?: boolean;
  wordKeepAll?: boolean;
  display?: CSSProperties['display'];
  textAlign?: CSSProperties['textAlign'];
}

type PolymorphicProps<T, P extends ElementType> = T & {
  as?: P;
} & Omit<ComponentPropsWithoutRef<P>, 'as'>;

type TextProps<Element extends ElementType = 'span'> = PolymorphicProps<
  TextBaseProps,
  Element
>;

const ellipsisCss = css({
  display: 'inline-block',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
});

export default function Text<Element extends ElementType = 'span'>({
  as,
  className,
  children,
  color = 'text-default-primary',
  fontStyle = 'body1',
  fontWeight,
  ellipsis,
  wordKeepAll,
  role,
  ...rest
}: TextProps<Element>) {
  const Component = as || 'span';

  return (
    <Component
      className={className}
      role={role ?? (Component === 'span' ? 'text' : undefined)}
      css={{
        color: colorTokens[color],
        ...fontStyles[fontStyle],
        ...(fontWeight && { fontWeight: fontWeightTokens[fontWeight] }),
        ...(wordKeepAll && { wordBreak: 'keep-all' }),
        ...(ellipsis && ellipsisCss),
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}
