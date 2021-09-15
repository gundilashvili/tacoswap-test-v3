import { Card, Flex } from "../styled";
import Switcher from "./Switcher";
import DepositPanel from "pages/Stake/DepositPanel";
import WithdrawPanel from "pages/Stake/WithdrawPanel";
import { useState } from "react";
import styled from "styled-components";
import { Text } from "rebass";

function StakingCard({ etacoBalance, xeTacoBalance }: any) {
  const [isInStake, setIsInStake] = useState(true);

  return (
    <Card>
      <Switcher isInStake={isInStake} setIsInStake={setIsInStake} />
      <div style={{ maxWidth: "540px", margin: "0 auto" }}>
        <Flex>
          <StyledText>{isInStake ? "Stake eTACO(v2)" : "Unstake eTACO(v2)"}</StyledText>
          <Text fontSize={16} margin="0 14px 14px 0">
            Balance: {isInStake ? etacoBalance?.toSignificant(4) : xeTacoBalance?.toSignificant(4) || "-"}
          </Text>
        </Flex>
        {isInStake ? <DepositPanel /> : <WithdrawPanel />}
      </div>
    </Card>
  );
}

export default StakingCard;

const StyledText = styled.p`
  font-weight: 700;
  font-size: 18px;
  margin: 0 0 14px 14px;
`;
