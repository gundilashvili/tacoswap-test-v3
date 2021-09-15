import styled from "styled-components";
import BorderOuter from "../../assets/images/hero-border-outer.png";
import BorderInner from "../../assets/images/hero-border-inner.png";
import Main from "../../assets/images/hero-inner.png";

const StyledContainer = styled.div`
  width: 366px;
  height: 366px;
  display: none;
  justify-content: center;
  align-items: center;
  position: relative;

  @media (min-width: 800px) {
    display: flex;
  }
`;
const StyledImageWrapper = styled.div<{ width?: string; padding?: number }>`
  position: absolute;
  padding: ${(props) => props.padding || 0}px;
  img {
    width: 100%;
  }
`;

const SwapLogo = () => {
  return (
    <>
      <StyledContainer>
        <StyledImageWrapper>
          <img src={BorderOuter} alt="" />
        </StyledImageWrapper>
        <StyledImageWrapper padding={20}>
          <img src={BorderInner} alt="" />
        </StyledImageWrapper>
        <StyledImageWrapper padding={50}>
          <img src={Main} alt="" />
        </StyledImageWrapper>
      </StyledContainer>
    </>
  );
};

export default SwapLogo;
