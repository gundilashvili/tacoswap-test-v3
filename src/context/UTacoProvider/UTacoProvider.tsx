import React, { createContext, useEffect, useState } from "react";
import Web3 from "web3";
import { UTaco } from "utaco/UTaco";
import { useWeb3React } from "@web3-react/core";
export interface UTacoContext {
  utaco?: typeof UTaco;
  block?: any;
}

export const Context = createContext<UTacoContext>({
  utaco: undefined,
  block: undefined,
});

interface SushiProvider {
  children: React.ReactNode;
}
declare global {
  interface Window {
    utaco: any;
    block: any;
  }
}

const ethereum: any = window.ethereum;

const SushiProvider = ({ children }: SushiProvider) => {
  const [utaco, setUtaco] = useState<any>();
  const { account } = useWeb3React();
  const [block, setBlock] = useState(0);
  const provider = new Web3.providers.HttpProvider("https://api.exio.dev/1/proxy");

  useEffect(() => {
    if (ethereum) {
      const chainId = Number(ethereum.chainId);
      const utacoLib = new UTaco(ethereum, chainId || 1, false, {
        defaultAccount: ethereum.selectedAddress,
        defaultConfirmations: 1,
        autoGasMultiplier: 1.5,
        testing: false,
        defaultGas: "6000000",
        defaultGasPrice: "1000000000000",
        accounts: [],
        ethereumNodeTimeout: 60000,
      });
      setUtaco(() => utacoLib);
      window.utaco = utacoLib;
    } else {
      const utacoLib = new UTaco(provider, 1, false, {
        defaultConfirmations: 1,
        autoGasMultiplier: 1.5,
        testing: false,
        defaultGas: "6000000",
        defaultGasPrice: "1000000000000",
        accounts: [],
        ethereumNodeTimeout: 60000,
      });
      setUtaco(() => utacoLib);
      window.utaco = utacoLib;
    }
    // eslint-disable-next-line
  }, [ethereum, account]);

  // const subscribtion = useCallback(() => {
  //   const web3 = new Web3(provider)
  //   web3.eth.subscribe("newBlockHeaders", (e, { number })=> {
  //     console.log(web3);
  //     if (e) {
  //       console.error(e)
  //     }
  //     console.log("New block", number);
  //     setBlock(number)
  //   })
  // }, [])

  // console.log(subscribtion());

  useEffect(() => {
    setInterval(async () => {
      const web3 = new Web3(provider);
      const number = await web3.eth.getBlockNumber();
      setBlock(number);
    }, 20000);
  }, []);

  return <Context.Provider value={{ utaco, block }}>{children}</Context.Provider>;
};

export default SushiProvider;
