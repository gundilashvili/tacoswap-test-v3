import { useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as CloseIcon } from "../../assets/svg/CloseIcon.svg";
import { ReactComponent as ButtonIcon } from "../../assets/svg/Group.svg";
import { ReactComponent as PlusIcon } from "../../assets/svg/Subtract.svg";
import { ReactComponent as ButtonIconUnion } from "../../assets/svg/Union.svg";
import Value from "../../components/Value/Value";
import useAllStakedValue from "hooks/useAllStakedValue";
import useFarm from "hooks/useFarm";
import { BigNumber } from "../../utaco";
import MyStakeCard from "./components/MyStakedCard";
import TotalStakedCard from "./components/TotalStakedCard";
import { StyledButtonDiv, StyledP2 } from "./components/styled";
import Button from "components/Button/Button";
import { StyledCardFarm } from "pages/Farms/FarmCards";
import { StyledIcon } from "./components/styled";
import { PageHeaderProto } from "components/PageHader/PageHeader";
import useTheme from "hooks/useTheme";
import usePrice from "hooks/usePrice";

const BLOCKS_PER_DAY = new BigNumber(6500);
const BLOCKS_PER_YEAR = BLOCKS_PER_DAY.times(new BigNumber(365));
const REWARD_PER_BLOCK = new BigNumber(90);

const StyledCloseIcon = styled(CloseIcon)`
  cursor: pointer;
  width: 15px;
  height: 15px;
  path {
    fill: ${({ theme }) => theme.brown1};
  }
`;

const Farm = () => {
  const { farmId }: any = useParams();
  const {
    pid,
    lpToken,
    lpTokenAddress,
    tokenAddress,
    tokenSymbol,
    quoteTokenSymbol,
    earnToken,
    name,
    icon,
    quoteIcon,
    external,
  } = useFarm(farmId) || {
    pid: 0,
    lpToken: "",
    lpTokenAddress: "",
    tokenAddress: "",
    tokenSymbol: "",
    quoteTokenSymbol: "",
    earnToken: "",
    name: "",
    icon: null,
    quoteIcon: null,
    external: false,
  };

  const stakedValue = useAllStakedValue();

  const farmStakedValue = stakedValue.filter(({ pid: id }) => id === pid)[0];

  const { price, etherPrice }: any = usePrice();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const theme = useTheme();

  const apy = farmStakedValue
    ? price
        .times(REWARD_PER_BLOCK)
        .times(BLOCKS_PER_YEAR)
        .times(farmStakedValue.poolWeight)
        .div(farmStakedValue.totalWethValue)
        .times(new BigNumber(100))
    : new BigNumber(0);

  const {
    baseTokenAmount = new BigNumber(0),
    quoteTokenAmount = new BigNumber(0),
    baseTokenAmountWholeLP = new BigNumber(0),
    quoteTokenAmountWholeLP = new BigNumber(0),
    poolWeight = new BigNumber(0),
  } = farmStakedValue || {};

  const dailyCOMB = poolWeight * REWARD_PER_BLOCK.times(BLOCKS_PER_DAY).toNumber();

  let infoLink = `https://info.tacoswap.io/pair/${lpTokenAddress}`;
  if (lpTokenAddress === tokenAddress) {
    infoLink = `https://info.tacoswap.io/token/${lpTokenAddress}`;
  } else if (external) {
    infoLink =
      name.indexOf("Uniswap") == -1
        ? `https://analytics.sushi.com/pairs/${lpTokenAddress}`
        : `https://v2.info.uniswap.org/pair/${lpTokenAddress}`;
  }

  return (
    <StyledCardFarm width="auto" mobilePadding="61px 89px 27px 89px" display="block" mobileWidth="100%">
      <StyledCloseButton>
        <Button
          size="sm"
          background="transparent"
          hoverBackground="transparent"
          to="/farms"
          text={<StyledCloseIcon />}
        />
      </StyledCloseButton>
      <StyledHeader>
        <div>
          <PageHeaderProto
            size="45px"
            padding="0"
            flexDirection="row"
            icon={icon}
            subtitle={`Deposit ${lpToken} Tokens and earn ${earnToken}`}
            title={name}
          />
        </div>
        <StyledButtonDiv>
          <Button
            size="icon-button"
            padding={40}
            background="transparent"
            butColor={true}
            borderRadius="50%"
            fontSize={14}
            margin="0 20px 0 0"
            href={infoLink}
            text={<ButtonIcon />}
            iconHoverColor={theme.white}
            hoverBackground={theme.linear1}
            isWithoutAnimation
          />
          <Button
            size="icon-button"
            margin="0 20px 0 0"
            to={`/swap?outputCurrency=${tokenAddress}`}
            borderRadius="50%"
            hoverBackground={theme.linear1}
            text={<ButtonIconUnion />}
            iconHoverColor={theme.hoverText}
          />
          <Button
            size="icon-button"
            butColor={true}
            background="transparent"
            borderRadius="50%"
            fontSize={25}
            padding={20}
            to={`/add/ETH/${tokenAddress}`}
            text={<PlusIcon />}
            iconHoverColor={theme.white}
            hoverBackground={theme.linear1}
            isWithoutAnimation
          />
        </StyledButtonDiv>
      </StyledHeader>
      <StyledCalcDiv>
        <StyledCalcMobile>
          <StyledCalc>
            <StyledIcon width="21px" height="22px">
              {icon}
            </StyledIcon>
            <StyledP>
              &nbsp;
              <Value size="sm" value={1} symbol={tokenSymbol} />
              &nbsp;=&nbsp;
              {baseTokenAmount.div(quoteTokenAmount).toNumber() && (
                <Value
                  size="sm"
                  value={quoteTokenAmount.div(baseTokenAmount).toNumber()}
                  symbol={quoteTokenSymbol}
                  decimals={8}
                />
              )}
            </StyledP>
          </StyledCalc>
          <StyledCalc>
            <StyledIcon>{quoteIcon}</StyledIcon>
            <StyledP>
              <Value value={1} size="sm" />
              &nbsp;=&nbsp;
              {baseTokenAmount.div(quoteTokenAmount).toNumber() && (
                <Value value={baseTokenAmount.div(quoteTokenAmount).toNumber()} size="sm" symbol={tokenSymbol} />
              )}
            </StyledP>
          </StyledCalc>
        </StyledCalcMobile>
        <StyledMobile>
          <div style={{ display: "flex", marginRight: "24px", alignItems: "center" }}>
            <StyledIcon>{icon}</StyledIcon>
            <StyledP>
              <Value value={baseTokenAmountWholeLP.toNumber()} size="sm" symbol={tokenSymbol} />
            </StyledP>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <StyledIcon>{quoteIcon}</StyledIcon>
            <StyledP>
              <Value value={quoteTokenAmountWholeLP.toNumber()} size="sm" symbol={quoteTokenSymbol} />
            </StyledP>
          </div>
        </StyledMobile>
      </StyledCalcDiv>

      <StyledApyDiv>
        <StyledFlexDiv>
          <FlexContainer>
            <StyledApy>
              <StyledApyP1>APY</StyledApyP1>
              <StyledApyP2>
                {!isNaN(apy.toNumber()) ? (
                  <Value size="md" value={apy.toNumber()} symbol="%" fontWeight={700} />
                ) : (
                  "Loading ..."
                )}
              </StyledApyP2>
            </StyledApy>
            <StyledApy>
              <StyledApyP1>Daily ROI</StyledApyP1>
              <StyledApyP2>
                {!isNaN(apy.toNumber()) ? (
                  <Value size="md" value={apy ? apy.div(365).toNumber() : "Loading ..."} symbol="%" fontWeight={700} />
                ) : (
                  "Loading ..."
                )}
              </StyledApyP2>
            </StyledApy>
            <StyledApy>
              <StyledApyP1>Hourly ROI</StyledApyP1>
              <StyledApyP2>
                {!isNaN(apy.toNumber()) ? (
                  <Value
                    size="md"
                    value={apy ? apy.div(365).div(24).toNumber() : "Loading ..."}
                    symbol="%"
                    fontWeight={700}
                  />
                ) : (
                  "Loading ..."
                )}
              </StyledApyP2>
            </StyledApy>
          </FlexContainer>
          <StyledApyProto paddingRight="0">
            <div style={{ display: "flex" }}>
              <StyledApyP1>Pool Supply</StyledApyP1>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingRight: "14px",
              }}
            >
              <StyledP2 paddingRight="auto" alignItems="flexEnd" lineHeight="44px">
                <Value size="md" value={dailyCOMB} symbol={`${earnToken}/DAY`} fontWeight={700} decimals={0} />
              </StyledP2>
              <div>
                <StyledApyP1>
                  ≈ &nbsp;
                  <Value size="sm" value={price.times(dailyCOMB).toNumber()} symbol="Ξ" />
                </StyledApyP1>
                <StyledApyP1>
                  ≈ &nbsp;
                  <Value size="sm" value={price.times(dailyCOMB).times(etherPrice).toNumber()} symbol="$" />
                </StyledApyP1>
              </div>
            </div>
          </StyledApyProto>
        </StyledFlexDiv>
        <StyledCardContainer>
          <TotalStakedCard />
          <MyStakeCard />
        </StyledCardContainer>
      </StyledApyDiv>
    </StyledCardFarm>
  );
};

const StyledCloseButton = styled.div`
  position: absolute;
  right: 5px;
  top: 5px;
  cursor: pointer;
  margin: 0;
  padding: 0;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 28px;
  @media (max-width: 700px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const StyledCalcMobile = styled.div`
  width: 62%;
  display: flex;
  margin-right: 23px;
  @media (max-width: 890px) {
    width: 100%;
    margin-right: 0;
    justify-content: space-between;
  }
  @media (max-width: 608px) {
    flex-direction: column;
    width: 100%;
    margin-right: 0;
  }
`;

const StyledMobile = styled.div`
  display: flex;
  @media (max-width: 890px) {
    width: 100%;
    margin-top: 17px;
    justify-content: space-around;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  @media (max-width: 1000px) {
    margin-bottom: 16px;
    width: 100%;
  }
  @media (max-width: 558px) {
    justify-content: space-between;
  }
`;

const StyledFlexDiv = styled.div<{ width?: string }>`
  width: 100%;
  display: flex;
  width: ${({ width }) => width};
  margin-bottom: 31px;
  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

const StyledP = styled.div`
  display: flex;
  font-size: 14px;
  margin: 0;
`;

const StyledCalcDiv = styled.div`
  box-sizing: border-box;
  margin: 20px 0 0 0;
  display: flex;
  align-items: center;
  @media (max-width: 890px) {
    flex-direction: column;
  }
  @media (max-width: 608px) {
    width: 100%;
    align-items: flex-start;
  }
  @media (min-width: 701px) {
    margin-bottom: 32px;
  }
`;

const StyledCalc = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  border: 1px solid #ffdfbe;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 5px 40px 4px 16px;
  @media (max-width: 890px) {
    width: 50%;
  }
  :first-of-type {
    margin-right: 16px;
    @media (max-width: 608px) {
      margin-right: 0;
      margin-bottom: 12px;
    }
  }
  @media (max-width: 608px) {
    width: 100%;
  }
`;

const StyledApyDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 22px;
  @media (min-width: 1265px) {
    justify-content: center;
  }
  @media (min-width: 1024px) {
    justify-content: space-between;
  }
  @media (max-width: 895px) {
    flex-direction: column;
  }
  @media (max-width: 700px) {
    width: 100%;
  }
`;

const StyledApy = styled.div<{ paddingRight?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 158px;
  padding-right: ${({ paddingRight }) => (paddingRight ? paddingRight : "49px")};
  padding: 12px 0 9px 25px;
  background: ${({ theme }) => theme.bg6};
  border-radius: 8px;
  margin-right: 16px;
  color: ${({ theme }) => theme.brown1};
  border: 1px solid ${({ theme }) => theme.border};
  @media (max-width: 1000px) {
    width: 33%;
    :last-of-type {
      margin-right: 0;
    }
  }
  @media (max-width: 700px) {
    padding: 12px 0 10px 32px;
    padding-right: ${({ paddingRight }) => (paddingRight ? paddingRight : "54px")};
    margin-top: 19px;
  }
  @media (max-width: 524px) {
    padding-right: 30px;
    padding-left: 25px;
  }
  @media (max-width: 431px) {
    margin-right: 8px;
    padding-right: 14px;
    padding-left: 17px;
  }
  @media (max-width: 340px) {
    padding-left: 10px;
  }
`;

const StyledApyProto = styled(StyledApy)`
  width: calc(100% - 522px);
  box-sizing: border-box;
  margin-right: 0;
  @media (max-width: 1000px) {
    width: 100%;
  }
  @media (max-width: 700px) {
    padding: 10px 15px 4px 12px;
  }
  @media (max-width: 373px) {
    div {
      & p:first-child {
        padding-right: 20px;
      }
    }
  }
`;

const StyledApyP1 = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin: 0;
  font-style: normal;
  font-size: 14px;
  span {
    color: ${({ color, theme }) => (color ? color : theme.brown1)};
  }
  @media (max-width: 370px) {
    font-size: 11px;
  }
`;

const StyledApyP2 = styled.div<{
  margin?: string;
  alignItems?: string;
  lineHeight?: string;
  paddingRight?: string;
  background?: string;
  paddingTop?: string;
}>`
  display: flex;
  position: relative;
  margin: ${({ margin }) => (margin ? margin : "0")};
  align-items: ${({ alignItems }) =>
    alignItems === "flexEnd" ? "flex-end" : alignItems === "center" ? "center" : "baseline"};
  font-style: normal;
  font-weight: 700;
  font-size: 19px;
  line-height: ${({ lineHeight }) => (lineHeight ? lineHeight : "44px")};
  color: ${({ color, theme }) => (color ? color : theme.brown1)};
  padding-right: ${({ paddingRight }) => (paddingRight ? paddingRight : "0")};
  padding-top: ${({ paddingTop }) => (paddingTop ? paddingTop : "0")};
  background: ${({ background }) => (background ? background : "white")};
  -webkit-background-clip: text;

  @media (max-width: 324px) {
    font-size: 14px;
  }
`;

const StyledCardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  @media (max-width: 795px) {
    flex-direction: column;
    align-items: center;
  }
`;

export default Farm;
