import { useCallback, useEffect, useState } from "react";
import { getEarned, getOldMasterChefContract, getFarms } from "../utaco/utils";
import useUTaco from "./useUTaco";
import useBlock from "./useBlock";
import { useWeb3React } from "@web3-react/core";

const useAllEarnings = () => {
  const [balances, setBalance] = useState([]);
  const { account } = useWeb3React();
  const utaco = useUTaco();
  const farms = getFarms(utaco);

  const masterChefContract = getOldMasterChefContract(utaco);
  const block = useBlock();

  const fetchAllBalances = useCallback(async () => {
    const balances: any = await Promise.all(
      farms.map(({ pid }: { pid: number }) => getEarned(masterChefContract, pid, account))
    );
    setBalance(() => balances);
  }, [account, masterChefContract, farms]);

  useEffect(() => {
    if (account && masterChefContract && utaco) {
      fetchAllBalances();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, block, masterChefContract, setBalance, utaco]);
  return balances;
};

export default useAllEarnings;
