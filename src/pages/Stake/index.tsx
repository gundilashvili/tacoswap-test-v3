import styled from "styled-components";

import { useActiveWeb3React } from "hooks";
import { useTokenBalance } from "../../state/wallet/hooks";
import { XETACO, ETACO } from "../../constants";
import useETacoBar from "hooks/useETacoBar";
import Balance from "./components/Balance";
import StakingAPR from "./components/StakingAPR";
import StakingCard from "./components/StakingCard";

const StakeUnstake = () => {
  const { account } = useActiveWeb3React();
  const etacoBalance = useTokenBalance(account ?? undefined, ETACO);
  const xeTacoBalance = useTokenBalance(account ?? undefined, XETACO);

  // const sushiPrice = useSushiPrice()

  const { enter, leave } = useETacoBar();
  console.log(enter, leave, etacoBalance, xeTacoBalance, account);

  return (
    <GridContainer>
      <StakingAPR />
      <StakingCard etacoBalance={etacoBalance} xeTacoBalance={xeTacoBalance} />
      <Balance etacoBalance={etacoBalance} xeTacoBalance={xeTacoBalance} />
    </GridContainer>
  );
};

const GridContainer = styled.div`
  display: grid;
  max-width: 1120px;
  width: 100%;
  grid-template-areas: "balance" "card" "apr";
  @media (min-width: 803px) {
    grid-template-columns: 1fr 350px;
    grid-template-areas: "apr balance" "card balance";
  }
  grid-gap: 24px;
  margin: 83px 45px;
  @media (max-width: 1300px) {
    margin: 83px auto;
  }
`;

export default StakeUnstake;
