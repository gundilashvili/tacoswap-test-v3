import { useCallback, useState, useEffect } from "react";
import { ethers } from "ethers";
import { useTacoContract, useMigratorContract, useOldMigratorContract, useChefContract } from "./useContract";
import { useTransactionAdder } from "state/transactions/hooks";
import useAllEarnings from "hooks/useAllEarnings";
import { useActiveWeb3React } from ".";
import Fraction from "../constants/Fraction";

const { BigNumber } = ethers;

const useUTacoBar = () => {
  const { account } = useActiveWeb3React();
  const addTransaction = useTransactionAdder();
  const oldMigratorContract = useOldMigratorContract(true); // withSigner
  const migratorContract = useMigratorContract(true); // withSigner
  const tacoContract = useTacoContract(true); // withSigner
  const chefContract = useChefContract(true); // withSigner

  const [allowance, setAllowance] = useState("0");
  const [isMigrated, setIsMigrated] = useState(true);
  const [needsMigration, setNeedsMigration] = useState(false);
  const [tacoBalance, setTacoBalance] = useState(BigNumber.from(0));
  const allEarnings = useAllEarnings();
  let sumEarning = 0;
  for (const earning of allEarnings) {
    sumEarning += BigNumber.from(earning).div(BigNumber.from(10).pow(18)).toNumber();
  }

  const fetchAllowance = useCallback(async () => {
    if (account) {
      try {
        const allowance = await tacoContract?.allowance(account, migratorContract?.address);
        const formatted = Fraction.from(BigNumber.from(allowance), BigNumber.from(10).pow(18)).toString();
        setAllowance(formatted);
      } catch {
        setAllowance("0");
      }
    }
  }, [account, migratorContract, tacoContract]);

  const fetchIsMigrated = useCallback(async () => {
    if (account) {
      try {
        const isMigrated =
          (await migratorContract?.isMigrated(account)) || (await oldMigratorContract?.isMigrated(account));
        // const pending = BigNumber.from(await chefContract?.totalPendingReward(account));
        // setIsMigrated(isMigrated || pending.gte(0));
        setIsMigrated(isMigrated);
      } catch {
        setIsMigrated(false);
      }
    }
  }, [account, migratorContract, tacoContract]);

  const fetchTacoBalance = useCallback(async () => {
    if (account) {
      try {
        const balance = BigNumber.from(await tacoContract?.balanceOf(account));
        setTacoBalance(balance);
        const pending = BigNumber.from(await chefContract?.totalPendingReward(account));
        setNeedsMigration((pending.eq(0) && BigNumber.from(sumEarning).gte(0)) || balance.gte(1));
      } catch (e) {
        console.log(e);
        setNeedsMigration(false);
      }
    }
  }, [account, migratorContract, tacoContract, chefContract]);

  useEffect(() => {
    if (account && migratorContract && tacoContract) {
      fetchTacoBalance();
      fetchAllowance();
      fetchIsMigrated();
    }
    const refreshInterval = setInterval(fetchAllowance, 10000);
    return () => clearInterval(refreshInterval);
  }, [account, migratorContract, fetchAllowance, tacoContract]);

  const approve = useCallback(async () => {
    try {
      const tx = await tacoContract?.approve(migratorContract?.address, ethers.constants.MaxUint256.toString());
      addTransaction(tx, { summary: "Approve" });
      return tx;
    } catch (e) {
      return e;
    }
  }, [addTransaction, migratorContract, tacoContract]);

  const migrate = useCallback(
    // todo: this should be updated with BigNumber as opposed to string
    async () => {
      try {
        const tx = await migratorContract?.migrateUserInfo();
        addTransaction(tx, { summary: "Migrate to eTaco Chef" });
        return tx;
      } catch (e) {
        return e;
      }
    },
    [addTransaction, migratorContract]
  );

  const swap = useCallback(
    // todo: this should be updated with BigNumber as opposed to string
    async () => {
      try {
        const tx = await migratorContract?.swap();
        addTransaction(tx, { summary: "Swap TACO to eTACO" });
        return tx;
      } catch (e) {
        return e;
      }
    },
    [addTransaction, migratorContract]
  );

  return { isMigrated, allowance, approve, migrate, needsMigration, tacoBalance, swap };
};

export default useUTacoBar;
