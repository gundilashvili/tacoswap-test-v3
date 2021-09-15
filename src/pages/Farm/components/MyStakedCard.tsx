import BigNumber from "bignumber.js";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import useFarm from "hooks/useFarm";
import useTokenBalance from "hooks/useTokenBalance";
import Value from "../../../components/Value/Value";
import { StyledTotalStakedCard } from "./TotalStakedCard";
import { getBalanceNumber } from "../../../utils/formatBalance";
import useStakedBalance from "hooks/useStakedBalance";
import Spacer from "../../../components/Spacer";
import useStake from "hooks/useStake";
import useUnstake from "hooks/useUnstake";
import useEarnings from "hooks/useEarnings";
import useReward from "hooks/useReward";
import useAllStakedValue from "hooks/useAllStakedValue";
import { StyledButtonDiv, StyledIcon, StyledP, StyledP2 } from "./styled";
import Button from "components/Button/Button";
import DepositModal from "./DepositModal";
import WithdrawModal from "./WithdrawalModal";
import Modal from "../../../components/Modal";
import useLpContact from "hooks/useLpContract";
import usePrice from "hooks/usePrice";
import { ReactComponent as LogoEthereum } from "assets/svg/ethereum.svg";
import { ReactComponent as DollarIcon } from "assets/svg/dollar.svg";

const BLOCKS_PER_DAY = new BigNumber(6500);
const REWARD_PER_BLOCK = new BigNumber(90);

const MyStakeCard = () => {
  const { farmId }: any = useParams();
  const {
    pid,
    lpToken,
    lpTokenAddress,
    tokenSymbol,
    quoteTokenSymbol,
    earnToken,
    icon,
    quoteIcon,
  }: // notLP
  any = useFarm(farmId) || {
    pid: 0,
    lpToken: "",
    tokenSymbol: "",
    quoteTokenSymbol: "",
    lpTokenAddress: "",
    tokenAddress: "",
    earnToken: "",
    name: "",
    icon: "",
    quoteIcon: null,
    notLP: true,
  };

  const stakedValue = useAllStakedValue();
  const stakedBalance = useStakedBalance(pid);
  const earnings = useEarnings(pid);
  const { onReward } = useReward(pid);
  const [rewardPending, setRewardPending] = useState(false);

  const { etherPrice }: any = usePrice();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lpContract = useLpContact(lpTokenAddress);

  const tokenBalance = useTokenBalance(lpContract?.options.address);
  const lpTokenName = useMemo(() => {
    return lpToken.toUpperCase();
  }, [lpToken]);

  const iconImg = useMemo(() => {
    return icon;
  }, [icon]);

  const { onUnstake } = useUnstake(pid);
  const { onStake } = useStake(pid);
  const [isOpenDeposit, setIsOpenDeposit] = useState(false);
  const [isOpenWithdrawal, setIsOpenWithdrawal] = useState(false);
  const openModalDeposit = () => {
    setIsOpenDeposit(true);
  };

  const openModalWithdrawal = () => {
    setIsOpenWithdrawal(true);
  };

  const farmStakedValue = stakedValue.filter(({ pid: id }) => id === pid)[0];

  const {
    baseTokenAmount = new BigNumber(0),
    quoteTokenAmount = new BigNumber(0),
    totalWethValue = new BigNumber(0),
    totalLPTokenStaked = new BigNumber(0),
    poolWeight = new BigNumber(0),
  } = farmStakedValue || {};

  const dailyCOMB = poolWeight * REWARD_PER_BLOCK.times(BLOCKS_PER_DAY).toNumber();

  const userShare = totalLPTokenStaked.toNumber()
    ? stakedBalance.div("1e18").div(totalLPTokenStaked).times(100)
    : new BigNumber(0);

  return (
    <>
      <Modal isOpen={isOpenDeposit} onDismiss={() => setIsOpenDeposit(false)}>
        <DepositModal
          max={tokenBalance}
          onConfirm={onStake}
          tokenName={lpTokenName}
          onDismiss={() => setIsOpenDeposit(false)}
          lpTokenAddress={lpTokenAddress}
        />
      </Modal>
      <Modal isOpen={isOpenWithdrawal} onDismiss={() => setIsOpenWithdrawal(false)}>
        <WithdrawModal
          max={stakedBalance}
          onDismiss={() => setIsOpenWithdrawal(false)}
          onConfirm={onUnstake}
          tokenName={lpTokenName}
        />
      </Modal>
      <StyledStakeCard>
        <StyledFlex>
          <StyledP fontSize="16px">My Stake</StyledP>
          <StyledDiv>
            <StyledProfitDivContent mobileMargin="12px 0 6px 0" style={{ marginRight: "25px" }}>
              <StyledP2 paddingRight="4px" paddingBottom="8px" lineHeight="13px" size={14}>
                Daily Profit:
              </StyledP2>
              <Value size="sm" value={userShare.times(dailyCOMB).div(100).toNumber()} symbol={earnToken} decimals={4} />
            </StyledProfitDivContent>
            <StyledProfitDivContent mobileMargin="0 0 20px 0">
              <StyledP2 paddingRight="4px" paddingBottom="8px" lineHeight="13px" size={14}>
                Share of Pool:
              </StyledP2>
              <Value size="sm" value={userShare.toNumber()} symbol="%" decimals={4} />
            </StyledProfitDivContent>
          </StyledDiv>
        </StyledFlex>
        <StyledMargins>
          <StyledP2 lineHeight="21px">
            <Value value={getBalanceNumber(stakedBalance)} size="md" fontWeight="700" symbol={lpToken} decimals={2} />
          </StyledP2>
        </StyledMargins>
        <StyledFlex>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", marginRight: "15px" }}>
              <StyledIcon width="22px" height="22px">
                <LogoEthereum />
              </StyledIcon>
              <StyledP before lineHeight="20px">
                <Value size="sm" value={totalWethValue.times(userShare).div(100).toNumber()} symbol="Ξ" />
              </StyledP>
            </div>
            <div style={{ display: "flex" }}>
              <StyledIcon width="22px" height="22px">
                <DollarIcon />
              </StyledIcon>
              <StyledP before lineHeight="20px">
                <Value
                  size="sm"
                  symbol="$"
                  value={totalWethValue.times(userShare).div(100).times(etherPrice).toNumber()}
                />
              </StyledP>
            </div>
          </div>
          <StyledButtonDivProto>
            <Button
              margin="0 12.9px 0 0"
              size="sm"
              text="Stake"
              paddingLeft="20px"
              paddingRight="20px"
              width="100"
              onClick={() => openModalDeposit()}
            />
            <Button
              butColor
              size="sm"
              text="Unstake"
              secondary={true}
              width="100"
              onClick={() => openModalWithdrawal()}
            />
          </StyledButtonDivProto>
        </StyledFlex>
        <Spacer />
        <StyledStakeValues>
          <div style={{ display: "flex", alignItems: "center" }}>
            <StyledIcon>{iconImg}</StyledIcon>
            <Value value={tokenSymbol} />
          </div>
          <Value size="sm" value={baseTokenAmount.multipliedBy(userShare).div(100).toNumber()} />
        </StyledStakeValues>
        {/* {!notLP && ( */}
        <StyledStakeValues>
          <div style={{ display: "flex", alignItems: "center" }}>
            <StyledIcon>{quoteIcon}</StyledIcon>
            <Value value={quoteTokenSymbol} />
          </div>
          <StyledP>
            <Value size="sm" value={quoteTokenAmount.multipliedBy(userShare).div(100).toNumber()} />
          </StyledP>
        </StyledStakeValues>
        {/* )} */}
        <StyledFooter>
          <Button
            width="136"
            text={rewardPending ? "Pending..." : "Claim"}
            size="sm"
            disabled={rewardPending || !stakedBalance.toNumber()}
            onClick={async () => {
              try {
                setRewardPending(true);
                await onReward();
                setRewardPending(false);
              } catch (e) {
                console.error(e);
                setRewardPending(false);
              }
            }}
          />
          <StyledPProto>
            Pending: <Spacer size="sm" />
            <Value size="sm" value={getBalanceNumber(earnings)} symbol={earnToken} decimals={4} />
          </StyledPProto>
        </StyledFooter>
      </StyledStakeCard>
    </>
  );
};

const StyledStakeCard = styled(StyledTotalStakedCard)`
  margin-right: 0;
  width: calc(100% - 348px);
  @media (max-width: 795px) {
    width: 100%;
  }
  @media (max-width: 450px) {
    width: 100%;
    left: 0;
    position: static;
  }
`;

const StyledFlex = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  @media (max-width: 865px) {
    flex-direction: column;
  }
`;

const StyledDiv = styled.div`
  display: flex;
  @media (max-width: 865px) {
    flex-direction: column;
  }
`;

const StyledPProto = styled(StyledP)`
  @media (max-width: 371px) {
    font-size: 14px;
    margin-top: 24px;
    margin-bottom: 15px;
  }
`;

const StyledProfitDivContent = styled.div<{ mobileMargin?: string }>`
  @media (max-width: 865px) {
    display: flex;
    flex-direction: row;
    margin: ${({ mobileMargin }) => mobileMargin};
    :first-child {
    }
  }
`;

const StyledMargins = styled.div`
  margin-bottom: 6px;
  margin-top: 12px;
`;

const StyledButtonDivProto = styled(StyledButtonDiv)`
  justify-content: left;
  height: 35px;
`;

const StyledStakeValues = styled.div<{ margintop?: string }>`
  margin-top: ${({ margintop }) => (margintop ? margintop : "")};
  border-top: 1px solid #fdcf89;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 16px 0;
`;

const StyledFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  @media (max-width: 371px) {
    flex-direction: column;
  }
`;

export default MyStakeCard;
