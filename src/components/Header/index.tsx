import { ChainId } from "@uniswap/sdk";
import { useRef, useState } from "react";
import { Text } from "rebass";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ReactComponent as ArrowIcon } from "assets/svg/Arrow.svg";
import { ReactComponent as ArrowDropDown } from "assets/images/dropdown.svg";
import styled, { css } from "styled-components";
import { ReactComponent as TacoLogo } from "assets/logos/tacoLogo.svg";
import { useActiveWeb3React } from "hooks";
import { useETHBalances } from "state/wallet/hooks";
import { CardNoise } from "../earn/styled";
import { YellowCard } from "../Card";
import Row, { RowFixed } from "../Row";
import Web3Status from "../Web3Status";
import ClaimModal from "../claim/ClaimModal";
import { useToggleSelfClaimModal, useShowClaimPopup } from "state/application/hooks";
import { useUserHasAvailableClaim } from "state/claim/hooks";
import Modal from "../Modal";
import UniBalanceContent from "./UniBalanceContent";
import { UniIcon } from "pages/Farm/components/styled";
import { ExternalLink } from "theme";
import { useOnClickOutside } from "hooks/useOnClickOutside";

const HeaderFrame = styled.div`
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.bg1};
  border-bottom: 1px solid #faddbc;
  width: 100%;
  margin: 0 auto;
  top: 0;
  position: relative;
  padding: 16.5px 0;
  z-index: 5;
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  justify-self: flex-end;
`;

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderRow = styled(RowFixed)`
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  width: 100%;
  max-width: 1600px;
  padding: 0 40px;
  z-index: -2;
  @media (max-width: 1113px) {
    width: 100%;
  }
`;

const HeaderLinks = styled(Row)`
  justify-content: space-between;
  width: 100%;
  @media (max-width: 1148px) {
    padding-top: 47px;
    position: fixed;
    top: 71px;
    left: 150%;
    right: 0;
    width: 100%;
    flex-direction: column;
    align-items: center;
    background: ${({ theme }) => theme.bg1};
    bottom: 0;
    transition: all 0.5s ease;
    justify-content: flex-start;
    &.active {
      left: 0;
    }
  }
`;

const StyledLinks = styled(RowFixed)`
  @media (max-width: 1148px) {
    flex-direction: column;
  }
`;

const StyledBurgerMenuWrapper = styled.div<{ trigger?: boolean }>`
  @media screen and (min-width: 1149px) {
    display: none;
  }
  width: 16px;
  height: 16px;
  display: block;
  position: relative;
  float: right;
  transform: rotate(0deg);
  transition: 0.5s ease-in-out;
  cursor: pointer;

  span {
    display: block;
    position: absolute;
    height: 2px;
    width: 16px;
    background: ${({ theme }) => theme.brown1};
    border-radius: 9px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: 0.25s ease-in-out;
  }
  ${({ trigger }) =>
    trigger
      ? css`
          span:nth-child(1) {
            top: 7px;
            transform: rotate(135deg);
          }
          span:nth-child(2) {
            opacity: 0;
          }
          span:nth-child(3) {
            top: 7px;
            transform: rotate(-135deg);
          }
        `
      : css`
          span:nth-child(1) {
            top: 0;
          }
          span:nth-child(2) {
            top: 6px;
          }
          span:nth-child(3) {
            top: 12px;
          }
        `};
`;

export const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
  border-radius: 74px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;
  border: ${({ active, theme }) => (!active ? "" : `1px solid ${theme.border}`)};
  padding: 0;
`;

const UNIWrapper = styled.span`
  width: fit-content;
  position: relative;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  :active {
    opacity: 0.9;
  }
`;

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`;

const NetworkCard = styled(YellowCard)`
  border-radius: 12px;
  padding: 8px 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`;

const BalanceText = styled(Text)`
  color: ${({ theme }) => theme.brown1};
  font-size: 13px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`;

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 73px;
  text-decoration: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
  h2 {
    font-size: 24px;
    font-weight: 400;
    margin: 0 0 0 12px;
  }
  @media (max-width: 1260px) {
    margin-right: 40px;
  }
`;

const activeClassName = "ACTIVE";

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.brown1};
  font-size: 16px;
  width: fit-content;
  margin: 0 25px 0 0;
  font-weight: 700;
  position: relative;
  padding: 0.5rem;
  opacity: 0.6;
  &.${activeClassName} {
    font-weight: 700;
    opacity: 1;
    ::after {
      content: "";
      position: absolute;
      bottom: 8px;
      left: 0.5rem;
      right: 0.5rem;
      height: 2px;
      background: ${({ theme }) => theme.brown1};
      border-radius: 10px;
      @media (max-width: 1148px) {
        height: 0;
      }
    }
  }

  :hover,
  :focus {
    ::after {
      content: "";
      position: absolute;
      bottom: 8px;
      left: 0.5rem;
      right: 0.5rem;
      height: 2px;
      background: ${({ theme }) => theme.brown1};
      border-radius: 10px;
    }
  }
  @media (max-width: 1260px) {
    margin: 0 26px 0 0;
  }
  @media (max-width: 1148px) {
    margin: 0 0 25px 0;
    font-size: 15px;
  }
`;

const StyledExternalLink = styled(ExternalLink)`
  position: relative;
  color: ${({ theme }) => theme.brown1};
  padding: 0.5rem;
  font-size: 16px;
  opacity: 0.6;
  font-weight: 700;
  margin: 0 25px 0 0;
  sup {
    position: absolute;
    top: 0;
    right: -3px;
    fill: ${({ theme }) => theme.brown1};
    svg {
      path {
        fill: ${({ theme }) => theme.brown1};
      }
    }
  }
  :hover {
    text-decoration: none;
    ::after {
      content: "";
      position: absolute;
      bottom: 8px;
      left: 0.5rem;
      right: 0.5rem;
      height: 2px;
      background: ${({ theme }) => theme.brown1};
      border-radius: 10px;
    }
    sup {
      svg {
        path {
          fill: ${({ theme }) => theme.brown1};
        }
      }
    }
  }
  :focus {
    text-decoration: none;
  }
  @media (max-width: 1260px) {
    margin: 0 26px 0 0;
  }
  @media (max-width: 1148px) {
    font-size: 15px;
    margin: 0 0 25px 0;
  }
`;

const DropDownButton = styled.div<{ dropDownOpen?: boolean }>`
  position: relative;
  color: ${({ theme }) => theme.brown1};
  padding: 0.5rem;
  font-size: 16px;
  font-weight: 700;
  margin: 0 39px 0 0;
  cursor: pointer;
  opacity: ${({ dropDownOpen }) => (dropDownOpen ? "1" : "0.6")};
  transition: opacity 0.8s ease;
  z-index: 8;
  span {
    stroke: ${({ theme }) => theme.brown1};
    margin: auto;
    svg {
      transform: ${({ dropDownOpen }) => (dropDownOpen ? "rotate(180deg)" : "rotate(0deg)")};
      transition: transform 0.2s ease;
      margin-bottom: 3px;
      path {
        stroke: ${({ theme }) => theme.brown1};
      }
    }
  }
  :hover {
    text-decoration: none;
    ::after {
      content: "";
      position: absolute;
      bottom: 8px;
      left: 0.5rem;
      right: 0.5rem;
      height: 2px;
      background: ${({ theme }) => theme.brown1};
      border-radius: 10px;
    }
    span {
      svg {
        path {
          stroke: ${({ theme }) => theme.brown1};
        }
      }
    }
  }
  :focus {
    text-decoration: none;
  }
  @media (max-width: 1260px) {
    margin: 0 26px 0 0;
  }
  @media (max-width: 1148px) {
    font-size: 15px;
    margin: 0 0 35px 0;
  }
`;

const StyledDropDownDiv = styled.div`
  position: absolute;
  border: 1px solid ${({ theme }) => theme.border};
  background: #fff;
  opacity: 1;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  top: 30px;
  left: 5px;
  @media (max-width: 1148px) {
    left: 8px;
  }
`;

const StyledExternalLinkDropDown = styled(StyledExternalLink)`
  opacity: 1;
  margin-right: 8px;
  width: fit-content;
  @media (max-width: 1148px) {
    margin: 0;
  }
`;

const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.RINKEBY]: "Rinkeby",
  [ChainId.ROPSTEN]: "Ropsten",
  [ChainId.GÖRLI]: "Görli",
  [ChainId.KOVAN]: "Kovan",
};

export default function Header() {
  const { account, chainId } = useActiveWeb3React();
  const { t } = useTranslation();

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? ""];

  const toggleClaimModal = useToggleSelfClaimModal();

  const availableClaim: boolean = useUserHasAvailableClaim(account);

  const [showUniBalanceModal, setShowUniBalanceModal] = useState(false);
  const showClaimPopup = useShowClaimPopup();
  const [trigger, setTrigger] = useState(false);
  const openNav = () => {
    setTrigger((prev) => !prev);
  };

  const [dropDownOpen, setDropDownOpen] = useState(false);
  const node = useRef<HTMLDivElement>();
  const toggle = () => {
    setDropDownOpen((prev) => !prev);
  };
  useOnClickOutside(node, dropDownOpen ? toggle : undefined);

  return (
    <HeaderFrame ref={node as any}>
      <ClaimModal />
      <Modal isOpen={showUniBalanceModal} onDismiss={() => setShowUniBalanceModal(false)}>
        <UniBalanceContent setShowUniBalanceModal={setShowUniBalanceModal} />
      </Modal>
      <HeaderRow>
        <Title href=".">
          <UniIcon>
            <TacoLogo />
          </UniIcon>
        </Title>
        <HeaderLinks className={`${trigger ? "active" : ""}`}>
          <StyledLinks>
            <StyledNavLink id={"swap-nav-link"} to={"/swap"}>
              {t("Swap")}
            </StyledNavLink>
            <StyledNavLink id={"farms-nav-link"} to="/earn">
              Earn
            </StyledNavLink>
            <StyledNavLink to="/migrate-v1">Migrate</StyledNavLink>
            <StyledExternalLink href=" https://info.tacoswap.io/">
              Analytics
              <sup>
                <ArrowIcon />
              </sup>
            </StyledExternalLink>
            <StyledExternalLink href="https://v1.tacoswap.io/">
              Tacoswap V1
              <sup>
                <ArrowIcon />
              </sup>
            </StyledExternalLink>
            <DropDownButton onClick={() => toggle()} dropDownOpen={dropDownOpen}>
              Governance &nbsp;
              <span>
                <ArrowDropDown />
              </span>
              {dropDownOpen && (
                <StyledDropDownDiv>
                  <StyledExternalLinkDropDown href="https://vote.tacoswap.io/#/">
                    Proposals
                    <sup>
                      <ArrowIcon />
                    </sup>
                  </StyledExternalLinkDropDown>
                  <StyledExternalLinkDropDown href="https://www.waceo.org/tacoswap-dao-policies">
                    Policies
                    <sup>
                      <ArrowIcon />
                    </sup>
                  </StyledExternalLinkDropDown>
                </StyledDropDownDiv>
              )}
            </DropDownButton>
            <StyledExternalLink href="https://google.com/" style={{color: '#e64441'}}>
               Whitepaper
              <sup>
                <ArrowIcon />
              </sup>
            </StyledExternalLink>
          </StyledLinks>
          <HeaderControls>
            <HeaderElement>
              <HideSmall>
                {chainId && NETWORK_LABELS[chainId] && (
                  <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
                )}
              </HideSmall>
              {availableClaim && !showClaimPopup && (
                <UNIWrapper onClick={toggleClaimModal}>
                  <CardNoise />
                </UNIWrapper>
              )}
              <AccountElement active={!!account} style={{ pointerEvents: "auto" }}>
                {account && userEthBalance ? (
                  <BalanceText style={{ flexShrink: 0 }} pl="28px" pr="28px" fontWeight={500}>
                    {userEthBalance?.toSignificant(4)} ETH
                  </BalanceText>
                ) : null}
                <Web3Status />
              </AccountElement>
            </HeaderElement>
          </HeaderControls>
        </HeaderLinks>
        <StyledBurgerMenuWrapper trigger={trigger} onClick={() => openNav()}>
          <span />
          <span />
          <span />
        </StyledBurgerMenuWrapper>
      </HeaderRow>
    </HeaderFrame>
  );
}
