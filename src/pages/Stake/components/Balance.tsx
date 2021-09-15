import { BalanceContainer } from "../styled";
import TacoLogo from "assets/logos/tacoLogo.svg";
import TacoStakingLogo from "assets/logos/tacoStaking.svg";
import BalanceCard from "./BalanceCard";
// import Button from "components/Button/Button";

// Types given any yet
interface IBalance {
  etacoBalance: any;
  xeTacoBalance: any;
}

function Balance({ etacoBalance, xeTacoBalance }: IBalance) {
  return (
    <BalanceContainer>
      <BalanceCard
        balanceName="Wallet Balance"
        icon={TacoLogo}
        balance={etacoBalance ? etacoBalance.toSignificant(4) : "-"}
        tokenName="eTACO(v2)"
      />
      <BalanceCard
        balanceName="Staked Balance"
        icon={TacoStakingLogo}
        balance={xeTacoBalance ? xeTacoBalance.toSignificant(4) : "-"}
        tokenName="xeTACO"
      />
      {/* <Button isWithoutAnimation to="" width="158px" primary={true} size="add" text="View Statistics" margin="0 auto" /> */}
    </BalanceContainer>
  );
}

export default Balance;
