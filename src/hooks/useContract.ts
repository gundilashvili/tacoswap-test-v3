import { Contract } from "@ethersproject/contracts";
import { abi as GOVERNANCE_ABI } from "@uniswap/governance/build/GovernorAlpha.json";
import { abi as UNI_ABI } from "@uniswap/governance/build/Uni.json";
import { abi as STAKING_REWARDS_ABI } from "@uniswap/liquidity-staker/build/StakingRewards.json";
import { abi as MERKLE_DISTRIBUTOR_ABI } from "@uniswap/merkle-distributor/build/MerkleDistributor.json";
import BAR_ABI from "constants/utacoAbis/UTacoBar.json";
import SUSHI_ABI from "constants/utacoAbis/utaco.json";
import MIGRATOR_FULL_ABI from "constants/utacoAbis/migrator.json";
import CHEF_ABI from "constants/utacoAbis/chef.json";
import { ChainId, WETH } from "@uniswap/sdk";
import { SUSHI_ADDRESS } from "@sushiswap/sdk";
import { abi as IUniswapV2PairABI } from "@uniswap/v2-core/build/IUniswapV2Pair.json";
import { useMemo } from "react";
import { GOVERNANCE_ADDRESS, MERKLE_DISTRIBUTOR_ADDRESS, UNI } from "../constants";
import {
  ARGENT_WALLET_DETECTOR_ABI,
  ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS,
} from "../constants/abis/argent-wallet-detector";
import ENS_PUBLIC_RESOLVER_ABI from "../constants/abis/ens-public-resolver.json";
import ENS_ABI from "../constants/abis/ens-registrar.json";
import { ERC20_BYTES32_ABI } from "../constants/abis/erc20";
import ERC20_ABI from "../constants/abis/erc20.json";
import { MIGRATOR_ABI, MIGRATOR_ADDRESS } from "../constants/abis/migrator";
import UNISOCKS_ABI from "../constants/abis/unisocks.json";
import WETH_ABI from "../constants/abis/weth.json";
import { MULTICALL_ABI, MULTICALL_NETWORKS } from "../constants/multicall";
import { V1_EXCHANGE_ABI, V1_FACTORY_ABI, V1_FACTORY_ADDRESSES } from "../constants/v1";
import { ETACO_ADDRESS, BAR_ADDRESS } from "../constants";
import { getContract } from "../utils";
import { useActiveWeb3React } from "./index";

// returns null on errors
export function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined);
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

export function useV1FactoryContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(chainId && V1_FACTORY_ADDRESSES[chainId], V1_FACTORY_ABI, false);
}

export function useV2MigratorContract(): Contract | null {
  return useContract(MIGRATOR_ADDRESS, MIGRATOR_ABI, true);
}

export function useV1ExchangeContract(address?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, V1_EXCHANGE_ABI, withSignerIfPossible);
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(chainId ? WETH[chainId].address : undefined, WETH_ABI, withSignerIfPossible);
}

export function useArgentWalletDetectorContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId === ChainId.MAINNET ? ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS : undefined,
    ARGENT_WALLET_DETECTOR_ABI,
    false
  );
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React();
  let address: string | undefined;
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.GÖRLI:
      case ChainId.ROPSTEN:
      case ChainId.RINKEBY:
        address = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
        break;
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible);
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible);
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible);
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false);
}

export function useMerkleDistributorContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(chainId ? MERKLE_DISTRIBUTOR_ADDRESS[chainId] : undefined, MERKLE_DISTRIBUTOR_ABI, true);
}

export function useGovernanceContract(): Contract | null {
  return useContract(GOVERNANCE_ADDRESS, GOVERNANCE_ABI, true);
}

export function useUniContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(chainId ? UNI[chainId].address : undefined, UNI_ABI, true);
}

export function useStakingContract(stakingAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(stakingAddress, STAKING_REWARDS_ABI, withSignerIfPossible);
}

export function useSocksController(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId === ChainId.MAINNET ? "0x65770b5283117639760beA3F867b69b3697a91dd" : undefined,
    UNISOCKS_ABI,
    false
  );
}
export function useSushiContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(chainId && SUSHI_ADDRESS[chainId], SUSHI_ABI, withSignerIfPossible);
}
export function useChefContract(withSignerIfPossible = true): Contract | null {
  return useContract("0x502C28F523636251BEEFf8bCd5023eCd1bBb8B3A", CHEF_ABI, withSignerIfPossible);
}
export function useTacoContract(withSignerIfPossible = true): Contract | null {
  return useContract("0x41C028a4C1F461eBFC3af91619b240004ebAD216", SUSHI_ABI, withSignerIfPossible);
}
export function useETacoContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(chainId && ETACO_ADDRESS[chainId], SUSHI_ABI, withSignerIfPossible);
}
export function useMigratorContract(withSignerIfPossible = true): Contract | null {
  return useContract("0x218b46dbd9aeBf08c8940307CD9d01395730080d", MIGRATOR_FULL_ABI, withSignerIfPossible);
}
export function useOldMigratorContract(withSignerIfPossible = true): Contract | null {
  return useContract("0xD8C140D3b1A20062Ae7143f7FB1e635683415d5e", MIGRATOR_FULL_ABI, withSignerIfPossible);
}
export function useETacoBarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(chainId && BAR_ADDRESS[chainId], BAR_ABI, withSignerIfPossible);
}
