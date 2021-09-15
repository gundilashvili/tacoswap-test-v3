import { useCallback, useEffect, useState } from "react";

import BigNumber from "bignumber.js";

import { getStaked, getMasterChefContract } from "../utaco/utils";
import useUTaco from "./useUTaco";
import { useWeb3React } from "@web3-react/core";

const useStakedBalance = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0));
  const { account } = useWeb3React();
  const sushi = useUTaco();
  const masterChefContract = getMasterChefContract(sushi);

  const fetchBalance = useCallback(async () => {
    const balance = await getStaked(masterChefContract, pid, account);
    return balance;
  }, [account, pid, masterChefContract]);

  useEffect(() => {
    if (account && sushi) {
      fetchBalance()
        .then((res) => {
          setBalance(() => new BigNumber(res));
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [account, pid, fetchBalance, sushi]);

  return balance;
};

export default useStakedBalance;
