import { ReactComponent as SuccessedSVG } from "assets/svg/successed.svg";
import styled, { css } from "styled-components";
// import { ReactComponent as ClaimedSVG } from 'assets/svg/claimed.svg'
const PageTitle = styled.h3`
  color: ${({ theme }) => theme.brown1};
  font-size: 26px;
  font-weight: 800;
  margin: 0 auto 30px;
`;

const StyledRewards = styled.div`
  max-height: 213px;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 14px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 1);
    border-radius: 40px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #696969; /* color of the scroll thumb */
    border-radius: 100px; /* roundness of the scroll thumb */
    border: 4px solid rgba(255, 255, 255, 1);
    :hover {
      background-color: #484848;
    }
  }
`;

const StyledUserModal = styled.div`
  width: 100%;
  max-width: 592px;
  padding: 44px 52px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 768px) {
    padding: 55px 10px;
  }
`;

const StyledFlex = styled.div`
  display: flex;
  width: 100%;
  max-width: 305px;
  justify-content: space-between;
  align-items: center;
  padding: 48px 0 71px;
`;

const StyledMenu = styled.div<{ active?: boolean }>`
  position: relative;
  &:not(:first-child)::after {
    content: "";
    width: 107px;
    height: 2px;
    top: 15px;
    right: 31px;
    position: absolute;
    background-color: ${({ theme }) => theme.brown1};
    opacity: ${({ active }) => (active ? 1 : 0.5)};
  }
`;

const StyledPageNumber = styled.div`
  width: 31px;
  height: 31px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.brown1};
  opacity: 0.5;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  &.active {
    opacity: 1;
  }
`;

const RelativeContent = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainContent = styled.div`
  width: 100%;
`;

const StyledTitle = styled.p`
  font-size: 12px;
  position: absolute;
  width: 76px;
  margin: 9px 0;
  &.first {
    left: -71%;
  }
  &.secondary {
    left: -12%;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledCircle = styled.div<{ active?: boolean }>`
  position: relative;
  width: 127px;
  height: 127px;
  margin: auto;
  .svg-container {
    height: 127px;
    position: relative;
    width: 127px;
    margin: 0 auto;
  }

  .circle {
    height: 127px;
    width: 127px;

    .background {
      fill: transparent;
      transition: all 600ms ease;
      height: 127px;
      width: 127px;
    }

    .foreground {
      fill: transparent;
      stroke-dasharray: 0;
      stroke-dashoffset: 0;
      stroke: linear-gradient(270deg, #ec6a46 0%, #f4b740 100%);
      transform-origin: 50% 50%;
      transform: rotate(-140deg);
      transition: all 2000ms ease;
      margin: 0 auto;
      width: 127px;
      height: 127px;
    }

    .g {
      width: 127px;
      height: 127px;
    }

    ${({ active }) =>
      active &&
      css`
        cursor: pointer;
        .background {
          stroke: transparent;
        }
        .foreground {
          fill: transparent;
          stroke-dasharray: 330;
          stroke-dashoffset: 377;
          stroke-dashoffset: 0;
          transform-origin: 50% 50%;
          transform: rotate(-12deg);
          transition: all 4s ease;
        }
        .icon {
          transform: scale(1);
        }
      `}
  }
`;

const SuccessIcon = styled(SuccessedSVG)<{ active?: boolean }>`
  width: 65px;
  height: 53px;
  transform: scale(0);
  position: absolute;
  top: 35px;
  left: 33px;
  transition: 2s ease;
  -moz-transition: 2s ease;
  -webkit-transition: 2s ease;
  -o-transition: 2s ease;
  -ms-transition: 2s ease;
  ${({ active }) =>
    active &&
    css`
      transform: scale(1);
    `}
`;

const FlexContainer = styled.div`
  display: flex;
  padding-top: 36px;
`;

const ContainerPart = styled.div`
  display: flex;
  justify-content: space-between;
  padding-right: 36px;
  width: 80%;
  @media screen and (max-width: 400px) {
    padding-right: 10px;
  }
`;

const ClaimedIccon = styled.div<{ clicked?: boolean }>`
  width: 15px;
  height: 15px;
  margin-right: 6.5px;
  transition: all 2s ease;
  position: relative;
  ::after {
    content: "";
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    background: ${({ theme }) => theme.hoverText};
    transition: all 3s ease;
  }
  ${({ clicked }) =>
    clicked &&
    css`
      ::after {
        left: 100%;
        width: 0;
      }
    `}
`;

const MainContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export {
  PageTitle,
  StyledRewards,
  StyledUserModal,
  StyledFlex,
  StyledMenu,
  StyledPageNumber,
  RelativeContent,
  MainContent,
  StyledTitle,
  Container,
  StyledCircle,
  SuccessIcon,
  FlexContainer,
  ContainerPart,
  ClaimedIccon,
  MainContainer,
};
