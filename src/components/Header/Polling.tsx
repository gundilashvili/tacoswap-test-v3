import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { TYPE, ExternalLink } from "../../theme";

import { useBlockNumber } from "../../state/application/hooks";
import { getEtherscanLink } from "../../utils";
import { useActiveWeb3React } from "../../hooks";

const StyledPolling = styled.div`
  align-items: center;
  position: fixed;
  z-index: 999;
  display: flex;
  right: 0;
  bottom: 65px;
  padding: 1rem;
  color: white;
  transition: opacity 0.25s ease;
  color: ${({ theme }) => theme.green1};
  :hover {
    opacity: 1;
  }
  @media (max-width: 1140px) {
    display: none;
  }
`;
const StyledPollingDot = styled.div`
  width: 23px;
  height: 23px;
  min-height: 23px;
  min-width: 23px;
  margin-left: 0.5rem;
  margin-top: 3px;
  border-radius: 50%;
  position: relative;
  background-color: ${({ theme }) => theme.green1};
`;

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  animation: ${rotate360} 1s cubic-bezier(0.83, 0, 0.17, 1) infinite;
  transform: translateZ(0);

  border-top: 1px solid transparent;
  border-right: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-left: 2px solid ${({ theme }) => theme.green1};
  background: transparent;
  width: 29px;
  height: 29px;
  border-radius: 50%;
  position: relative;

  left: -3px;
  top: -3px;
`;

export default function Polling() {
  const { chainId } = useActiveWeb3React();

  const blockNumber = useBlockNumber();

  const [isMounted, setIsMounted] = useState(true);

  useEffect(
    () => {
      const timer1 = setTimeout(() => setIsMounted(true), 1000);

      // this will clear Timeout when component unmount like in willComponentUnmount
      return () => {
        setIsMounted(false);
        clearTimeout(timer1);
      };
    },
    [blockNumber] //useEffect will run only one time
    //if you pass a value to array, like this [data] than clearTimeout will run every time this value changes (useEffect re-run)
  );

  return (
    <ExternalLink href={chainId && blockNumber ? getEtherscanLink(chainId, blockNumber.toString(), "block") : ""}>
      <StyledPolling>
        <TYPE.small style={{ opacity: isMounted ? "0.6" : "0.8" }}>{blockNumber}</TYPE.small>
        <StyledPollingDot>{!isMounted && <Spinner />}</StyledPollingDot>
      </StyledPolling>
    </ExternalLink>
  );
}
