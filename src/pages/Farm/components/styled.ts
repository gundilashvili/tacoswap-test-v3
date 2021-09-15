import styled, { css } from "styled-components";
export const StyledTotalStakedCard = styled.div`
  background: ${({ theme }) => theme.bg9};
  border-radius: 8px;
  font-size: 15px;
  padding: 16px 22px;
  width: 325px;
  margin-right: 16px;
  @media (max-width: 595px) {
    width: 80%;
    position: relative;
    margin-right: 0;
    box-sizing: border-box;
    :first-of-type {
      margin-bottom: 29px;
    }
  }
  @media (max-width: 450px) {
    width: 100%;
    left: 0;
    position: static;
  }
`;
export const StyledP = styled.div<{
  fontSize?: string;
  paddingRight?: string;
  paddingTop?: string;
  paddingBottom?: string;
  before?: boolean;
  color?: string;
  lineHeight?: string;
}>`
  display: flex;
  align-items: center;
  position: relative;
  margin: 0;
  font-style: normal;
  font-weight: normal;
  font-size: ${({ fontSize }) => (fontSize ? fontSize : "14px")};
  padding-right: ${({ paddingRight }) => (paddingRight ? paddingRight : "0")};
  padding-top: ${({ paddingTop }) => (paddingTop ? paddingTop : "0")};
  padding-bottom: ${({ paddingBottom }) => (paddingBottom ? paddingBottom : "0")};
  line-height: ${({ lineHeight }) => lineHeight};
  ${({ before }) =>
    before
      ? css`
          &:before {
            content: "≈";
          }
        `
      : css``};
  span {
    color: ${({ color }) => (color ? color : "")};
  }
  @media (max-width: 370px) {
    font-size: 11px;
  }
`;

export const StyledP2 = styled.div<{
  alignItems?: string;
  background?: string;
  before?: boolean;
  paddingRight?: string;
  paddingTop?: string;
  paddingBottom?: string;
  lineHeight?: string;
  size?: number;
}>`
  display: flex;
  position: relative;
  margin: 0;
  align-items: ${({ alignItems }) =>
    alignItems === "flexEnd" ? "flex-end" : alignItems === "center" ? "center" : "baseline"};
  font-style: normal;
  font-weight: 700;
  font-size: ${({ size }) => (size ? size : 19)}px;
  color: ${({ color }) => (color ? color : "")};
  padding-right: ${({ paddingRight }) => (paddingRight ? paddingRight : "0")};
  padding-top: ${({ paddingTop }) => (paddingTop ? paddingTop : "0")};
  padding-bottom: ${({ paddingBottom }) => (paddingBottom ? paddingBottom : "0")};
  background: ${({ background, theme }) => (background ? background : `-webkit-${theme.linear2}`)};
  line-height: ${({ lineHeight }) => lineHeight};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  ${({ before }) =>
    before
      ? css`
          &:before {
            content: "≈";
          }
        `
      : css``};
  span {
    color: ${({ color }) => (color ? color : "")};
  }
  @media (max-width: 324px) {
    font-size: 15px;
  }
`;

export const StyledIcon = styled.div<{
  width?: string;
  height?: string;
}>`
  width: ${({ width }) => (width ? width : "21px")};
  height: ${({ height }) => (height ? height : "22px")};
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
    height: 100%;
  }
  svg {
    width: 100%;
    height: 100%;
  }
`;

export const StyledButtonDiv = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 865px) {
    margin-top: 30px;
  }
`;

export const UniIcon = styled.div<{ width?: string; marginLeft?: boolean }>`
  align-items: center;
  display: flex;
  justify-content: left;
  align-items: center;
  margin-left: ${({ marginLeft }) => (marginLeft ? "17px" : "")};
  padding: 0;
  text-decoration: none;
  width: ${({ width }) => (width ? width : "44px")};
  height: 38px;
  svg {
    width: 100%;
    height: 100%;
  }
`;
