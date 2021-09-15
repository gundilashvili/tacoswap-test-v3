import BigNumber from "bignumber.js";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import useFarm from "../../../hooks/useFarm";
import useAllStakedValue from "../../../hooks/useAllStakedValue";
import Value from "../../../components/Value/Value";
import { StyledP, StyledP2 } from "./styled";
import usePrice from "hooks/usePrice";
import { ReactComponent as LogoEthereum } from "assets/svg/ethereum.svg";
import { ReactComponent as DollarIcon } from "assets/svg/dollar.svg";

const TotalStakedCard = () => {
  const { farmId }: any = useParams();
  const { lpToken, tokenSymbol, quoteTokenSymbol, icon, quoteIcon } = useFarm(farmId) || {
    pid: 0,
    lpToken: "",
    lpTokenAddress: "",
    tokenAddress: "",
    tokenSymbol: "",
    quoteTokenSymbol: "",
    earnToken: "",
    name: "",
    icon: "",
    quoteIcon: null,
    bonus: 0,
  };

  const farm = useFarm(farmId);

  const stakedValue = useAllStakedValue();

  const { etherPrice }: any = usePrice();

  const farmStakedValue = stakedValue.filter(({ pid }) => pid === farm?.pid)[0];

  const {
    baseTokenAmount = new BigNumber(0),
    quoteTokenAmount = new BigNumber(0),
    lpWethWorth = new BigNumber(0),
    totalLPTokenStaked = new BigNumber(0),
  } = farmStakedValue || {};

  return (
    <StyledTotalStakedCard>
      <StyledHeader>
        <StyledP fontSize="16px">Total Staked</StyledP>
      </StyledHeader>
      <StyledContent>
        <StyledP2 paddingTop="10px">
          <Value size="md" value={totalLPTokenStaked.toNumber()} symbol={lpToken} fontWeight="700" />
        </StyledP2>
        <div style={{ display: "flex", paddingTop: "10px", alignItems: "center" }}>
          <div style={{ display: "flex" }}>
            <StyledIcon width="22px" height="22px">
              <LogoEthereum />
            </StyledIcon>
            <StyledP paddingRight="10px" lineHeight="22px">
              {" "}
              ≈
              <Value size="sm" value={lpWethWorth.toNumber()} symbol="Ξ" />{" "}
            </StyledP>
          </div>
          <div style={{ display: "flex" }}>
            <StyledIcon width="22px" height="24px">
              <DollarIcon />
            </StyledIcon>
            <StyledP lineHeight="18px">
              ≈ <Value symbol="$" size="sm" value={lpWethWorth.times(etherPrice).toNumber()} />
            </StyledP>
          </div>
        </div>
      </StyledContent>
      <StyledCardDivValues>
        <div style={{ display: "flex", alignItems: "center" }}>
          <StyledIcon>{icon}</StyledIcon>
          <StyledP>
            <Value value={tokenSymbol} />
          </StyledP>
        </div>
        <StyledP>
          <Value size="sm" value={baseTokenAmount.toNumber()} />
        </StyledP>
      </StyledCardDivValues>
      <StyledCardDivValues>
        <div style={{ display: "flex", alignItems: "center" }}>
          <StyledIcon>{quoteIcon}</StyledIcon>
          <Value value={quoteTokenSymbol} />
        </div>
        <StyledP>
          <Value size="sm" value={quoteTokenAmount.toNumber()} />
        </StyledP>
      </StyledCardDivValues>
    </StyledTotalStakedCard>
  );
};

export const StyledTotalStakedCard = styled.div`
  background: ${({ theme }) => theme.bg6};
  border-radius: 8px;
  font-size: 15px;
  padding: 26px 22px 23px;
  width: 332px;
  margin-right: 16px;
  border: ${({ theme }) => `1px solid ${theme.border}`};
  @media (max-width: 795px) {
    width: 100%;
    position: relative;
    margin-right: 0;
    box-sizing: border-box;
    :first-of-type {
      margin-bottom: 29px;
    }
  }
  @media (max-width: 450px) {
    width: 100%;
    left: 0;
    position: static;
  }
`;

const StyledHeader = styled.div`
  align-items: center;
  margin-top: 11px;
`;

const StyledContent = styled.div`
  margin-bottom: 32px;
  margin-top: 10px;
`;

const StyledCardDivValues = styled.div`
  border-top: 1px solid #fdcf89;
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
`;

const StyledIcon = styled.div<{
  width?: string;
  height?: string;
}>`
  width: ${({ width }) => (width ? width : "21px")};
  height: ${({ height }) => (height ? height : "22px")};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  img {
    width: 100%;
    height: 100%;
  }
  svg {
    width: 100%;
    height: 100%;
  }
`;

export default TotalStakedCard;
