import BigNumber from "bignumber.js";

import { ethers } from "ethers";
import { ReactComponent as LogoEthereum } from "../assets/logos/logos_ethereum.svg";
// import logoEthereum from '../assets/logos/logos_ethereum.svg'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

// const GAS_LIMIT = {
//   STAKING: {
//     DEFAULT: 200000,
//     SNX: 850000,
//   },
// }

export const getMasterChefAddress = (utaco) => {
  return utaco && utaco.masterChefAddress;
};
export const getSushiAddress = (utaco) => {
  return utaco && utaco.sushiAddress;
};
export const getRewardTokenAddress = (utaco) => {
  return utaco && utaco.etacoAddress;
};
export const getWethContract = (utaco) => {
  return utaco && utaco.contracts && utaco.contracts.weth;
};

export const getMasterChefContract = (utaco) => {
  return utaco && utaco.contracts && utaco.contracts.masterChef;
};

export const getOldMasterChefContract = (utaco) => {
  return utaco && utaco.contracts && utaco.contracts.oldMasterChef;
};

export const getSushiContract = (utaco) => {
  return utaco && utaco.contracts && utaco.contracts.etaco;
};

export const getFarms = (utaco) => {
  return utaco
    ? utaco.contracts.pools.map(
        ({
          pid,
          name,
          symbol,
          icon,
          quoteIcon = <LogoEthereum />,
          // quoteIcon = <img src={logoEthereum} style={{ maxWidth: '100%' }} alt="Tacoswap.io" />,
          tokenAddress,
          quoteTokenAddress,
          tokenSymbol,
          quoteTokenSymbol = "ETH",
          tokenContract,
          quoteTokenContract,
          lpAddress,
          lpContract,
          active,
          price,
          external,
        }) => ({
          pid,
          id: symbol,
          name,
          lpToken: symbol,
          lpTokenAddress: lpAddress,
          lpContract,
          tokenAddress,
          quoteTokenAddress,
          tokenSymbol,
          tokenContract,
          quoteTokenContract,
          quoteTokenSymbol,
          earnToken: "eTACO(v2)",
          earnTokenAddress: utaco.contracts.etaco.options?.address,
          icon,
          quoteIcon,
          active,
          price,
          notLP: tokenAddress === lpAddress,
          external,
        })
      )
    : [];
};

export const getPoolWeight = async (masterChefContract, pid) => {
  const { allocPoint } = await masterChefContract.methods.poolInfo(pid).call();
  const totalAllocPoint = await masterChefContract.methods.totalAllocPoint().call();
  return new BigNumber(allocPoint).div(new BigNumber(totalAllocPoint));
};

export const getEarned = async (masterChefContract, pid, account) => {
  return masterChefContract.methods.pendingReward(pid, account).call();
};

export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256.toString())
    .send({ from: account });
};

export const getSushiSupply = async (utaco) => {
  const burned = new BigNumber(250);
  return new BigNumber(await utaco.contracts.etaco.methods.totalSupply().call()).minus(
    burned.multipliedBy(new BigNumber(10).pow(18))
  );
};

export const stake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .deposit(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const unstake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .withdraw(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};
export const harvestAll = async (masterChefContract, account) => {
  return masterChefContract.methods
    .harvestAll()
    .send({ from: account })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const harvest = async (masterChefContract, pid, account) => {
  return masterChefContract.methods
    .deposit(pid, "0")
    .send({ from: account })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const getStaked = async (masterChefContract, pid, account) => {
  try {
    const { amount } = await masterChefContract.methods.userInfo(pid, account).call();
    return new BigNumber(amount);
  } catch {
    return new BigNumber(0);
  }
};

export const redeem = async (masterChefContract, account) => {
  const now = new Date().getTime() / 1000;
  if (now >= 1597172400) {
    return masterChefContract.methods
      .exit()
      .send({ from: account })
      .on("transactionHash", (tx) => {
        return tx.transactionHash;
      });
  } else {
    alert("pool not active");
  }
};
