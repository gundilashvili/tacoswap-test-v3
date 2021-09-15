import { useCallback, useContext } from "react";
import WalletConnectIcon from "assets/images/walletConnectIcon.svg";
import Identicon from "../Identicon";
import { useETHBalances } from "state/wallet/hooks";
import { AccountElement } from "components/Header";
import { useDispatch } from "react-redux";
import styled, { ThemeContext } from "styled-components";
import { useActiveWeb3React } from "hooks";
import { AppDispatch } from "state";
import { clearAllTransactions } from "state/transactions/actions";
import { shortenAddress } from "utils";
import { AutoRow } from "../Row";
import Copy from "./Copy";
import Transaction from "./Transaction";
import Button from "components/Button/Button";
import { SUPPORTED_WALLETS } from "../../constants";
import { ReactComponent as CloseIcon } from "assets/svg/CloseIcon.svg";
import { getEtherscanLink } from "utils";
import { injected, walletconnect } from "connectors";
import { ButtonPink } from "../Button";
import { ReactComponent as LinkIcon } from "assets/svg/LinkIcon.svg";

import { ExternalLink, LinkStyledButton, TYPE } from "theme";
import { Text } from "rebass";

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 23px 0 0;
  font-weight: 500;
  color: ${({ theme }) => theme.text3};
  margin: 0 auto;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`;

const UpperSection = styled.div`
  position: relative;
  margin: 0 0 2rem 0;
  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
  @media (max-width: 630px) {
    margin: 0 0 1rem 0;
  }
`;

const InfoCard = styled.div`
  padding: 1rem;
  border-radius: 20px;
  position: relative;
  display: grid;
  grid-row-gap: 8px;
  margin-bottom: 20px;
  @media (max-width: 420px) {
    margin-bottom: 4px;
  }
`;

const AccountGroupingRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  color: ${({ theme }) => theme.text1};
  margin-top: 5px;
  div {
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
  }
`;

const AccountSection = styled.div`
  padding: 0 1rem 2rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 0rem 1rem 1.5rem 1rem;`};
`;

const YourAccount = styled.div`
  h5 {
    margin: 0 0 1rem 0;
    font-weight: 400;
  }

  h4 {
    margin: 0;
    font-weight: 500;
  }
`;

const LowerSection = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  padding: 1.5rem;
  flex-grow: 1;
  overflow: auto;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.bg3};
  height: 100%;
  max-height: 400px;
  h5 {
    margin: 0;
    font-weight: 400;
    color: ${({ theme }) => theme.text3};
  }
  @media (max-width: 630px) {
    max-height: 200px;
    padding: 10px;
  }
`;

const AccountControl = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 0;
  width: 100%;
  color: ${({ theme }) => theme.text3};
  font-weight: 500;
  font-size: 1.25rem;

  a:hover {
    text-decoration: underline;
  }

  p {
    min-width: 0;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const AddressLink = styled(ExternalLink)<{ hasENS: boolean; isENS: boolean }>`
  color: ${({ theme }) => theme.brown1};
  margin-left: 1rem;
  font-size: 13px;
  display: flex;
  align-items: center;
  :hover {
    opacity: 0.65;
  }
  @media (max-width: 420px) {
    font-size: 11px;
  }
`;

const CloseIconContainer = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  svg path {
    stroke: ${({ theme }) => theme.brown1};
    fill: ${({ theme }) => theme.brown1};
  }
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`;

const WalletName = styled.div`
  width: initial;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.brown1};
`;

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + "px" : "32px")};
    width: ${({ size }) => (size ? size + "px" : "32px")};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`;

const TransactionListWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
`;

const StyledContainer = styled.div<{ padding?: string; margin?: string }>`
  display: none;
  margin: ${({ margin }) => margin ?? "37px auto 2px"};
  padding: ${({ padding }) => padding ?? `0 24px`};
  width: 100%;
  @media (max-width: 630px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
function renderTransactions(transactions: string[]) {
  return (
    <TransactionListWrapper>
      {transactions.map((hash, i) => {
        return <Transaction key={i} hash={hash} />;
      })}
    </TransactionListWrapper>
  );
}

interface AccountDetailsProps {
  toggleWalletModal: () => void;
  pendingTransactions: string[];
  confirmedTransactions: string[];
  ENSName?: string;
  openOptions: () => void;
}

export const AccountInfo = ({
  children,
  radius,
  padding,
  margin,
}: {
  children: any;
  radius?: string;
  padding?: string;
  margin?: string;
}) => {
  const { account } = useActiveWeb3React();
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? ""];
  return (
    <>
      {account && (
        <StyledContainer padding={padding} margin={margin}>
          <ButtonPink>0 XIS</ButtonPink>
          <AccountElement active style={{ width: "190px", borderRadius: `${radius ?? "6px"}` }}>
            <Text>
              <p>{userEthBalance?.toSignificant(4)}</p> <span>BNB</span>
            </Text>
            {children}
          </AccountElement>
        </StyledContainer>
      )}
    </>
  );
};

export default function AccountDetails({
  toggleWalletModal,
  pendingTransactions,
  confirmedTransactions,
  ENSName,
}: AccountDetailsProps) {
  const { chainId, account, connector, deactivate } = useActiveWeb3React();
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch<AppDispatch>();

  const handleSignOutClick = useCallback(() => {
    deactivate();
    toggleWalletModal();
    // eslint-disable-next-line
  }, [toggleWalletModal]);

  function formatConnectorName() {
    const { ethereum } = window;
    const isMetaMask = !!(ethereum && ethereum.isMetaMask);
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        (k) =>
          SUPPORTED_WALLETS[k].connector === connector && (connector !== injected || isMetaMask === (k === "METAMASK"))
      )
      .map((k) => SUPPORTED_WALLETS[k].name)[0];
    return <WalletName>You are connected with {name}</WalletName>;
  }

  function getStatusIcon() {
    if (connector === injected) {
      return (
        <IconWrapper size={16}>
          <Identicon />
        </IconWrapper>
      );
    } else if (connector === walletconnect) {
      return (
        <IconWrapper size={16}>
          <img src={WalletConnectIcon} alt={"wallet connect logo"} />
        </IconWrapper>
      );
    }
    return null;
  }

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }));
  }, [dispatch, chainId]);

  return (
    <>
      <UpperSection>
        <CloseIconContainer onClick={toggleWalletModal}>
          <CloseIcon />
        </CloseIconContainer>
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <HeaderRow>
            <TYPE.brown fontWeight={600} fontSize={["14px", "18px"]}>
              Account
            </TYPE.brown>
          </HeaderRow>
        </div>
        <AccountSection>
          <YourAccount>
            <InfoCard>
              <AccountGroupingRow>{formatConnectorName()}</AccountGroupingRow>
              <AccountGroupingRow id="web3-account-identifier-row">
                <AccountControl>
                  {ENSName ? (
                    <>
                      <div>
                        {getStatusIcon()}
                        <p style={{ color: theme.text3 }}> {ENSName}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        {getStatusIcon()}
                        <TYPE.brown fontSize={18} fontWeight="bold">
                          {" "}
                          {account && shortenAddress(account)}
                        </TYPE.brown>
                      </div>
                    </>
                  )}
                </AccountControl>
              </AccountGroupingRow>
              <AccountGroupingRow>
                <>
                  <AccountControl>
                    <div>
                      {account && (
                        <Copy toCopy={account}>
                          <span style={{ marginLeft: "4px" }}>Copy Address</span>
                        </Copy>
                      )}
                      {chainId && account && (
                        <AddressLink
                          hasENS={!!ENSName}
                          isENS={ENSName ? true : false}
                          href={
                            ENSName
                              ? chainId && getEtherscanLink(chainId, ENSName, "address")
                              : getEtherscanLink(chainId, account, "address")
                          }
                        >
                          <span style={{ marginRight: "4px" }}>View on Etherscan</span>
                          <LinkIcon />
                        </AddressLink>
                      )}
                    </div>
                  </AccountControl>
                </>
              </AccountGroupingRow>
            </InfoCard>
          </YourAccount>
          {!!pendingTransactions.length || !!confirmedTransactions.length ? (
            <LowerSection>
              <AutoRow padding="0" mb={"1rem"} style={{ justifyContent: "space-between" }}>
                <TYPE.body>Recent Transactions</TYPE.body>
                <LinkStyledButton onClick={clearAllTransactionsCallback}>clear all</LinkStyledButton>
              </AutoRow>
              {renderTransactions(pendingTransactions)}
              {renderTransactions(confirmedTransactions)}
            </LowerSection>
          ) : (
            <LowerSection>
              <TYPE.body color={theme.brown1} fontSize={12}>
                Your transactions will appear here
              </TYPE.body>
            </LowerSection>
          )}
        </AccountSection>
        <Button size="lg" width="183px" margin="auto" onClick={() => handleSignOutClick()}>
          Log Out
        </Button>
      </UpperSection>
    </>
  );
}
