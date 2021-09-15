import { BigNumber } from "../utaco";
import useFarms from "./useFarms";
import useFarm from "./useFarm";

const usePrice = () => {
  const { stakedValue } = useFarms();
  const rewardTokenFarm = useFarm("eTACO(v2)-ETH TLP");
  const etherFarm = useFarm("USDT-ETH TLP");

  const stakedValueRewardToken = stakedValue.filter(({ pid }) => pid === rewardTokenFarm?.pid)[0];
  const stakedValueEther = stakedValue.filter(({ pid }) => pid === etherFarm?.pid)[0];

  const price = stakedValueRewardToken?.tokenPriceInWeth || new BigNumber(0);

  const etherPrice = stakedValueEther ? new BigNumber(1).div(stakedValueEther.tokenPriceInWeth) : new BigNumber(0);

  const {
    baseTokenAmountWholeLP = new BigNumber(0),
    quoteTokenAmountWholeLP = new BigNumber(0),
    poolWeight = new BigNumber(0),
  } = stakedValueRewardToken || {};

  const liquidityWETH = quoteTokenAmountWholeLP;

  const liquidityCOMB = baseTokenAmountWholeLP;

  return {
    etherPrice,
    price,
    liquidityWETH,
    liquidityCOMB,
    poolWeight,
  } as any;
};

export default usePrice;
