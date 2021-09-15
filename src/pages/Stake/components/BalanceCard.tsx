import { Flex, Text } from "rebass";
import styled from "styled-components";

interface ICard {
  balanceName: string;
  balance: number;
  icon: string;
  tokenName: string;
}

const BalanceCard = (props: ICard) => {
  const { balanceName, balance, icon, tokenName } = props;
  return (
    <StyledBalanceCard>
      <Text fontSize={23} fontWeight={700} marginBottom={37}>
        {balanceName}
      </Text>
      <Flex>
        <WalletBalanceLogo>
          <img src={icon} alt="" />
        </WalletBalanceLogo>
        <StyledBalanceText>
          <Text fontWeight={800} fontSize={24}>
            {balance}
          </Text>
          <Text>{tokenName}</Text>
        </StyledBalanceText>
      </Flex>
    </StyledBalanceCard>
  );
};

const StyledBalanceCard = styled.div`
  :first-child {
    margin-bottom: 56px;
  }
  @media (max-width: 802px) {
    :first-child {
      margin-bottom: 0;
    }
  }
  @media (max-width: 462px) {
    justify-content: center;
    :first-child {
      margin-bottom: 56px;
    }
  }
`;

const WalletBalanceLogo = styled.div`
  width: 72px;
  height: 72px;
  background: ${({ theme }) => theme.bg1};
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.hoverText};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 31px;
  svg {
    width: 44px;
    height: 36px;
  }
`;

const StyledBalanceText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

export default BalanceCard;
