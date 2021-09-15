import { StyledButton } from "components/Button/Button";
import styled from "styled-components";

interface ISwitcher {
  isInStake?: boolean;
  setIsInStake?: any;
}

function Switcher(props: ISwitcher) {
  const { isInStake, setIsInStake } = props;
  return (
    <StyledSwitcher onClick={() => setIsInStake((prev: boolean) => !prev)}>
      <div className={isInStake ? "" : "disabled"}>
        <StyledSwitchButton isWithoutAnimation>Stake</StyledSwitchButton>
      </div>
      <div className={isInStake ? "disabled" : ""}>
        <StyledSwitchButton isWithoutAnimation>Unstake</StyledSwitchButton>
      </div>
    </StyledSwitcher>
  );
}

const StyledSwitchButton = styled(StyledButton)`
  width: 171px;
  height: 44px;
  @media (max-width: 450px) {
    width: 155px;
  }
`;

const StyledSwitcher = styled.div`
  border-radius: 99px;
  background: ${({ theme }) => theme.bg10};
  display: flex;
  margin: 0 auto 64px;
  width: max-content;
  padding: 6px 9px;
  div {
    height: auto;
  }
  button {
    :hover {
      background: ${({ theme }) => theme.pressed};
      color: ${({ theme }) => theme.white};
    }
  }
  .disabled {
    button {
      background: transparent;
      color: ${({ theme }) => theme.brown1};
    }
  }
`;

export default Switcher;
