import { useCallback } from "react";

import useUTaco from "./useUTaco";

import { harvestAll, getMasterChefContract } from "../utaco/utils";
import { useWeb3React } from "@web3-react/core";

const useHarvestAll = () => {
  const { account } = useWeb3React();
  const utaco = useUTaco();
  const masterChefContract = getMasterChefContract(utaco);

  const onHarvestAll = useCallback(
    async () => {
      await harvestAll(masterChefContract, account);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, utaco]
  );

  return { onHarvestAll };
};

export default useHarvestAll;
