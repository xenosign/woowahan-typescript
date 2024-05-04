// // HrComponent.tsx
// export type Props = {
//   height?: string;
//   color?: keyof typeof colors;
//   isFull?: boolean;
//   className?: string;
// }

// export const Hr: VFC<Props> = ({ height, color, isFull, className }) => {
//   return <HrComponent height={height} color={color} isFull={isFull} className={class Name} />;
// };

// // style.ts
// import { Props } from '...';

// type StyledProps = {
//   height?: string;
//   color?: keyof typeof Color;
//   isFull?: boolean;
//   className?: string;
// }

// type UtilityStyledProps = Pick<Props, "height" | "color" | "isFull">;

// const HrComponent = styled.hr<StyledProps>`
//   height: ${({ height }) => height || "10px"};
//   margin: 0;
//   background-color: ${({ color }) => colors[color || "gray7"]};
//   border: none;
//   ${({ isFull }) => isFull &&
//   css`
//     margin: 0 -15px;
//   `}
// `;

// interface Props {
//   fontSize?: string;
//   backgroundColor?: string;
//   color?: string;
//   onClick: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
// }

// const Button: FC<Props> = ({ fontSize, backgroundColor, color, children }) => {
//   return (
//     <ButtonWrap
//       fontSize={fontSize}
//       backgroundColor={backgroundColor}
//       color={color}
//     >
//       {' '}
//       {children}{' '}
//     </ButtonWrap>
//   );
// };
// const ButtonWrap = styled.button<Omit<Props, 'onClick'>>`
//   color: ${({ color }) => theme.color[color ?? 'default']};
//   background-color: ${({ backgroundColor }) =>
//     theme.bgColor[backgroundColor ?? 'default']};
//   font-size: ${({ fontSize }) => theme.fontSize[fontSize ?? 'default']};
// `;

// import { FC } from "react";
// import styled from "styled-components";

// const colors = { black: "#000000", gray: "#222222", white: "#FFFFFF", mint: "#2AC1BC" };

// const theme = {
//   colors: {
//     default: colors.gray,
//     ...colors
//   },
//   backgroundColor: {
//     default: colors.white,
//     gray: colors.gray,
//     mint: colors.mint,
//     black: colors.black
//   },
//   fontSize: { default: "16px", small: "14px", large: "18px" } };

// type ColorType = typeof keyof theme.colors;
// type BackgroundColorType = typeof keyof theme.backgroundColor;
// type FontSizeType = typeof keyof theme.fontSize;

// interface Props {
//   color?: ColorType;
//   backgroundColor?: BackgroundColorType;
//   fontSize?: FontSizeType;
//   onClick: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
// }

// const Button: FC<Props> = ({ fontSize, backgroundColor, color, children }) => {
//   return (
//     <ButtonWrap
//       fontSize={fontSize}
//       backgroundColor={backgroundColor}
//       color={color}
//     >
//       {children}
//     </ButtonWrap>
//   );
// };

// const ButtonWrap = styled.button<Omit<Props, "onClick">>`
//   color: ${({ color }) => theme.color[color ?? "default"]};
//   background-color: ${({ backgroundColor }) => theme.bgColor[backgroundColor ?? "default"]};
//   font-size: ${({ fontSize }) => theme.fontSize[fontSize ?? "default"]};
// `;
