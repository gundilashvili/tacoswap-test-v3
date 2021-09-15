import { useCallback } from "react";

import useUTaco from "./useUTaco";

import { unstake, getMasterChefContract } from "../utaco/utils";
import { useWeb3React } from "@web3-react/core";

const useUnstake = (pid: number) => {
  const { account } = useWeb3React();
  const utaco = useUTaco();
  const masterChefContract = getMasterChefContract(utaco);

  const handleUnstake = useCallback(
    async (amount) => {
      await unstake(masterChefContract, pid, amount, account);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, pid, utaco]
  );

  return { onUnstake: handleUnstake };
};

export default useUnstake;
