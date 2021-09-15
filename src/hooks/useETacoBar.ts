import { useCallback, useState, useEffect } from "react";
import { ethers } from "ethers";
import { useETacoContract, useETacoBarContract } from "./useContract";
import { useTransactionAdder } from "state/transactions/hooks";
import { useActiveWeb3React } from ".";
import Fraction from "../constants/Fraction";
import { BalanceProps } from "./useToken";

const { BigNumber } = ethers;

const useUTacoBar = () => {
  const { account } = useActiveWeb3React();
  const addTransaction = useTransactionAdder();
  const etacoContract = useETacoContract(true); // withSigner
  const barContract = useETacoBarContract(true); // withSigner

  const [allowance, setAllowance] = useState("0");

  const fetchAllowance = useCallback(async () => {
    if (account) {
      try {
        const allowance = await etacoContract?.allowance(account, barContract?.address);
        const formatted = Fraction.from(BigNumber.from(allowance), BigNumber.from(10).pow(18)).toString();
        setAllowance(formatted);
      } catch {
        setAllowance("0");
      }
    }
  }, [account, barContract, etacoContract]);

  useEffect(() => {
    if (account && barContract && etacoContract) {
      fetchAllowance();
    }
    const refreshInterval = setInterval(fetchAllowance, 10000);
    return () => clearInterval(refreshInterval);
  }, [account, barContract, fetchAllowance, etacoContract]);

  const approve = useCallback(async () => {
    try {
      const tx = await etacoContract?.approve(barContract?.address, ethers.constants.MaxUint256.toString());
      return addTransaction(tx, { summary: "Approve" });
    } catch (e) {
      return e;
    }
  }, [addTransaction, barContract, etacoContract]);

  const enter = useCallback(
    // todo: this should be updated with BigNumber as opposed to string
    async (amount: BalanceProps | undefined) => {
      if (amount?.value) {
        try {
          const tx = await barContract?.enter(amount?.value);
          return addTransaction(tx, { summary: "Enter etacoBar" });
        } catch (e) {
          return e;
        }
      }
    },
    [addTransaction, barContract]
  );

  const leave = useCallback(
    // todo: this should be updated with BigNumber as opposed to string
    async (amount: BalanceProps | undefined) => {
      if (amount?.value) {
        try {
          const tx = await barContract?.leave(amount?.value);
          //const tx = await barContract?.leave(ethers.utils.parseUnits(amount)) // where amount is string
          return addTransaction(tx, { summary: "Enter etacoBar" });
        } catch (e) {
          return e;
        }
      }
    },
    [addTransaction, barContract]
  );

  return { allowance, approve, enter, leave };
};

export default useUTacoBar;
