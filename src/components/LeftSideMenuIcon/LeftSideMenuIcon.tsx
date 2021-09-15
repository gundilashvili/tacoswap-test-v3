import styled, { css } from "styled-components";

const StyledContainer = styled.div<{ trigger: boolean }>`
  display: none;
  @media (max-width: 1300px) {
    width: 54px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 85px;
    background: ${({ theme, trigger }) => trigger && theme.bg1};
    ${({ trigger }) =>
      trigger
        ? css`
            border: 2px solid #ff962d;
            border-left: 0px;
          `
        : ""};

    border-radius: 0 100px 100px 0;
    z-index: 4;
    padding: 10px 5px;
    cursor: pointer;
  }
`;

const StyledIconContainer = styled.div<{ trigger: boolean }>`
  width: 20px;
  height: 20px;
  position: relative;

  span {
    display: block;
    position: absolute;
    height: 2px;
    background: #614e56;
  }

  > div {
    width: 20px;
    height: 6px;
    position: relative;
    top: 8px;
    transform: translate(7%, 0) rotate(360deg);
    ${({ trigger }) =>
      trigger
        ? css`
            transform: translate(-6%, 0) rotate(180deg);
          `
        : ""};
    transition: all 0.3s ease;

    .left {
      width: 8px;
      border-radius: 5px;
      transform: rotate(-140deg);
      right: 0;
    }

    .right {
      width: 8px;
      border-radius: 5px;
      bottom: 0;
      transform: rotate(140deg);
      right: 0;
    }
  }

  .first {
    width: 20px;
    border-radius: 9px;
    top: 2px;
  }

  .second {
    width: 14px;
    border-radius: 9px;
    bottom: 8px;
    left: 0;
    right: unset;
    ${({ trigger }) =>
      trigger
        ? css`
            left: unset;
            right: 0;
          `
        : ""};
    transition: all 0.3s ease;
  }

  .third {
    display: block;
    position: absolute;
    width: 20px;
    border-radius: 5px;
    bottom: 0;
  }
`;

const LeftSideMenuIcon = ({ trigger, setTrigger }: { trigger: boolean; setTrigger: () => void }) => {
  return (
    <StyledContainer trigger={!trigger} onClick={() => setTrigger()}>
      <StyledIconContainer trigger={trigger}>
        <span className="first" />
        <span className="second" />
        <span className="third" />
        <div>
          <span className="left" />
          <span className="right" />
        </div>
      </StyledIconContainer>
    </StyledContainer>
  );
};

export default LeftSideMenuIcon;
