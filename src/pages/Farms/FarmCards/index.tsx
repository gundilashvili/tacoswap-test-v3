import BigNumber from "bignumber.js";
import styled, { css, keyframes } from "styled-components";
import Button from "components/Button/Button";
import Card from "components/Card/Card";
import CardContent from "components/CardContent/index";
import Loader from "components/Loader/index";
import Spacer from "components/Spacer/Spacer";
import useAllStakedValue from "hooks/useAllStakedValue";
import useFarms from "hooks/useFarms";
import { getDisplayBalance } from "utils/formatBalance";
import { AlertTriangle, Star } from "react-feather";
import usePrice from "hooks/usePrice";
import useTheme from "hooks/useTheme";

const BLOCKS_PER_DAY = new BigNumber(6500);
const BLOCKS_PER_YEAR = BLOCKS_PER_DAY.times(new BigNumber(365));
const REWARD_PER_BLOCK = new BigNumber(90);

interface FarmCards {
  width?: string;
  homeFarmCards?: boolean;
  background?: string;
  mobilePadding?: string;
  display?: string;
  marginTop?: string;
  marginBottom?: string;
  padding?: string;
}

const FarmCards = ({
  width,
  homeFarmCards,
  background,
  mobilePadding,
  display,
  marginTop,
  marginBottom,
  padding,
}: FarmCards) => {
  const { farms } = useFarms();
  const stakedValue = useAllStakedValue();
  const { price: sushiPrice }: any = usePrice();
  const farmsWithAPY = farms.map((farm: any) => {
    const farmStakedValue = stakedValue.filter(({ pid }) => pid === farm.pid)[0];
    const farmWithStakedValue = {
      ...farm,
      ...farmStakedValue,
      apy: farmStakedValue
        ? sushiPrice
            .times(REWARD_PER_BLOCK)
            .times(BLOCKS_PER_YEAR)
            .times(farmStakedValue?.poolWeight)
            .div(farmStakedValue?.totalWethValue)
        : new BigNumber(0),
    };
    return farmWithStakedValue;
  });
  const theme = useTheme();

  return (
    <StyledDiv>
      {homeFarmCards ? (
        <StyledCard
          width={width}
          background={background}
          mobilePadding={mobilePadding}
          padding={padding}
          display={display}
          marginTop={marginTop}
          marginBottom={marginBottom}
        >
          <StyledHeading>TOP POOLS</StyledHeading>
          {farms.length ? (
            <StyledRow marginBottom="0">
              {farmsWithAPY.map((farm: any, j: number) => {
                return j <= 2 ? (
                  <div key={farm.id}>
                    <FarmCard key={farm.id} farm={farm} />
                  </div>
                ) : null;
              })}
            </StyledRow>
          ) : (
            <StyledLoadingWrapper>
              <Loader text="Cooking the rice ..." />
            </StyledLoadingWrapper>
          )}
        </StyledCard>
      ) : (
        <StyledCardHeir width={width} mobilePadding="32px 40px">
          <FlexContainer farmTitle>
            <AlertTriangle color="#E43727" style={{ strokeWidth: 1.5, marginRight: "5px" }} size={20} />
            <StyledP>
              ️ Please note that current APYs are approximate we&lsquo;re working on improving the calculations
            </StyledP>
          </FlexContainer>
          {farms.length ? (
            <StyledRow marginBottom="0">
              {farmsWithAPY.map((farm: any) => (
                <FarmCard key={farm.id} farm={farm} />
              ))}
            </StyledRow>
          ) : (
            <StyledLoadingWrapper>
              <Loader text="Cooking the tacos ..." />
            </StyledLoadingWrapper>
          )}
          <FlexContainer style={{ marginTop: "140px" }}>
            <Star color={theme.yellow3} style={{ marginRight: "5px", fill: theme.yellow3 }} size={20} />
            <StyledP>
              ️ Every time you stake and unstake LP tokens, the contract will automagically harvest eTACO(v2) rewards
              for you!
            </StyledP>
          </FlexContainer>
        </StyledCardHeir>
      )}
    </StyledDiv>
  );
};

const FarmCard = ({ farm }: any) => {
  const poolActive = farm.active;

  const TextShorter = (text: any) => {
    if (text.length > 16) {
      return text.slice(0, 16) + "...";
    }
    return text;
  };

  const { earnToken, poolWeight = new BigNumber(0) } = farm;
  const rewardByPercent = REWARD_PER_BLOCK.times(BLOCKS_PER_DAY).times(poolWeight).toFixed(0);

  return (
    <StyledCardWrapper>
      {farm.lpToken === "eTACO(v2)-ETH TLP" && <StyledCardAccent />}
      <Card external={farm.external}>
        <StyledUpper>
          <StyledPercentage>{(poolWeight * 100).toFixed(0)}%</StyledPercentage>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 200,
              padding: "10px 16px 0 0",
              mixBlendMode: "normal",
              opacity: "0.6px",
            }}
          >
            ≈{rewardByPercent} {earnToken}
            /day
          </div>
        </StyledUpper>
        <CardContent padding={15}>
          <StyledContent>
            <StyledTitleDiv>
              <StyledIconDiv>{farm.icon}</StyledIconDiv>
              <div style={{ display: "flex", flexDirection: "column", width: "74%" }}>
                <StyledTitle title={farm.name}>{TextShorter(farm.name)}</StyledTitle>
                <div style={{ height: "28px" }}>
                  <StyledParagraph>
                    Deposit {farm.lpToken.toUpperCase()} <br /> Earn {farm.earnToken}
                  </StyledParagraph>
                </div>
              </div>
            </StyledTitleDiv>
            {!poolActive && (
              <>
                <Spacer />
                <StyledDetail>Coming Soon!</StyledDetail>
              </>
            )}
            {poolActive && (
              <StyledInsight external={farm.external}>
                <StyledInsightText>
                  <span>APY</span>
                  <span>
                    {farm.apy
                      ? `${farm.apy.times(new BigNumber(100).toFixed(2)).toNumber().toLocaleString("en-US")}%`
                      : "Loading ..."}
                  </span>
                </StyledInsightText>
              </StyledInsight>
            )}
            <StyledParagraphDiv>
              <StyledParagraph>Total Staked</StyledParagraph>
            </StyledParagraphDiv>
            <StyledLower>
              <StyledStakedContainer padding="0 10px">
                <StyledStakedContent>{farm.tokenSymbol}</StyledStakedContent>
                <StyledStakedContent textAlign="end" fontWeight="600">
                  {farm.baseTokenAmount ? getDisplayBalance(farm.baseTokenAmount, 0) : "--"}
                </StyledStakedContent>
                {!farm.notLP ? (
                  <>
                    <StyledStakedContent>{farm.quoteTokenSymbol}</StyledStakedContent>
                    <StyledStakedContent textAlign="end" fontWeight="600">
                      {farm.baseTokenAmount ? getDisplayBalance(farm.quoteTokenAmount, 0) : "--"}
                    </StyledStakedContent>
                  </>
                ) : (
                  <StyledStakedContent>
                    <br />
                  </StyledStakedContent>
                )}
              </StyledStakedContainer>
            </StyledLower>
            <StyledStakedContainer margin="20px 0 0 0">
              {poolActive && (
                <StyledFlexItem width="50%">
                  <Button
                    paddingLeft={"0"}
                    paddingRight={"0"}
                    size="sm"
                    disabled={!poolActive}
                    text={poolActive ? "Select" : undefined}
                    to={`/farms/${farm.id}`}
                  >
                    {!poolActive && "Soon!"}
                  </Button>
                </StyledFlexItem>
              )}
              {poolActive && (
                <StyledFlexItem width="50%" jusifyContent="right">
                  {farm.notLP ? (
                    <Button
                      butColor={true}
                      background="transparent"
                      href="https://exchange.sushi.com/#/swap?outputCurrency=0xcAaa93712BDAc37f736C323C93D4D5fDEFCc31CC"
                      disabled={!poolActive}
                      text={poolActive ? `Get ${farm.tokenSymbol}` : undefined}
                      hoverUnderline
                      size="sm"
                    >
                      {!poolActive && "Soon!"}
                    </Button>
                  ) : (
                    <Button
                      butColor={true}
                      background="transparent"
                      to={`/add/ETH/${farm.tokenAddress}`}
                      disabled={!poolActive}
                      text={poolActive ? "Get LP" : undefined}
                      hoverUnderline
                      size="sm"
                    >
                      {!poolActive && "Soon!"}
                    </Button>
                  )}
                </StyledFlexItem>
              )}
            </StyledStakedContainer>
          </StyledContent>
        </CardContent>
      </Card>
    </StyledCardWrapper>
  );
};

const RainbowLight = keyframes`
  
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`;

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 12px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`;

const StyledUpper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledStakedContainer = styled.div<{ margin?: string; padding?: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: ${({ margin }) => margin};
  flex-wrap: wrap;
  padding: ${({ padding }) => padding};
`;

const StyledHeading = styled.h2`
  color: ${({ theme }) => theme.brown1};
  font-size: 30px;
  font-weight: 400;
  font-family: "Lora", serif;
  margin-bottom: 46px;
  margin-top: 24px;
`;

const StyledFlexItem = styled.div<{ width?: string; jusifyContent?: string }>`
  width: ${({ width }) => width};
  display: flex;
  align-items: center;
  justify-content: ${({ jusifyContent }) => jusifyContent && jusifyContent};
`;
const StyledStakedContent = styled.p<{
  textAlign?: string;
  fontWeight?: string | number;
}>`
  margin: 0;
  width: 50%;
  text-align: ${({ textAlign }) => textAlign};
  font-style: normal;
  font-weight: ${({ fontWeight }) => (fontWeight ? fontWeight : "normal")};
  font-size: 14px;
  line-height: 32px;
  letter-spacing: 0.44px;
`;

const StyledPercentage = styled.div<{}>`
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 74px;
  height: 30px;
  background: ${({ theme }) => theme.buttonLinear};
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  border-radius: 8px 0;
`;

const StyledIconDiv = styled.div`
  display: flex;
  width: 54px;
  height: 54px;
  justify-content: center;
  font-size: 30px;
  img {
    width: 100%;
    height: 100%;
  }
  svg {
    width: 100%;
    height: 100%;
  }
`;

const StyledTitleDiv = styled.div`
  width: 100%;
  margin: 0 15px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledParagraphDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: left;
  align-items: flex-start;
  padding: 0;
`;

const StyledParagraph = styled.p`
  margin: 0;
  mix-blend-mode: normal;
  opacity: 0.5;
  font-size: 12px;
`;

export const StyledCard = styled.div<{
  width?: string;
  display?: string;
  padding?: string;
  background?: string;
  marginTop?: string;
  marginBottom?: string;
  mobileMargin?: string;
  mobilePadding?: string;
  mobileWidth?: string;
  marginLeft?: string;
  marginRight?: string;
}>`
  position: relative;
  width: ${({ width }) => (width ? width : "100%")};
  display: ${({ display }) => (display ? display : "flex")};
  flex-wrap: wrap;
  justify-content: space-between;
  padding: ${({ padding }) => (padding ? padding : "15px 10px 45px")};
  align-items: center;
  flex-direction: column;
  background: ${({ background }) => (background ? background : "#FBFDFF")};
  margin-top: ${({ marginTop }) => (marginTop ? marginTop : "")};
  margin-bottom: ${({ marginBottom }) => (marginBottom ? marginBottom : "")};
  margin-left: ${({ marginLeft }) => marginLeft};
  margin-right: ${({ marginRight }) => marginRight};
  border-radius: 16px;
  box-sizing: border-box;
  box-shadow: 0 0 40px rgba(255, 150, 45, 0.06);
  @media (max-width: 1300px) {
    border-radius: 16px;
  }
  @media (max-width: 678px) {
    margin: ${({ mobileMargin }) => mobileMargin};
  }
  @media (min-width: 760px) {
    padding: ${({ mobilePadding }) => (mobilePadding ? mobilePadding : "56px 48px 45px 48px")};
  }
  @media (max-width: 450px) {
    width: ${({ mobileWidth }) => mobileWidth};
  }
`;

const StyledCardHeir = styled(StyledCard)`
  box-shadow: none;
  background: none;
`;

export const StyledCardFarm = styled(StyledCard)`
  background: #fffcf7;
  border: ${({ theme }) => `1px solid ${theme.border}`};
  color: ${({ theme }) => theme.brown1};
  max-width: 1120px;
  margin: 83px auto 27px;
  @media (min-width: 1301px) {
    margin: 83px auto 27px;
  }
  @media (max-width: 1024px) {
    border-radius: 0;
  }
  @media (min-width: 700px) {
    padding: ${({ mobilePadding }) => (mobilePadding ? mobilePadding : "56px 48px 45px 48px")};
  }
`;

const StyledLoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
`;

const StyledRow = styled.div<{ marginBottom?: string }>`
  display: flex;
  margin-bottom: ${({ marginBottom }) => (marginBottom ? marginBottom : "52px")};
  flex-flow: row wrap;
  justify-content: space-around;
  @media (max-width: 811px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  margin: 0 14px 49px;
  width: 285px;
  position: relative;
  color: ${({ theme }) => theme.brown1};
`;

const StyledTitle = styled.h4`
  font-size: 18px;
  padding: 0;
  margin: 0 0 7px 0;
  font-weight: 400;
`;

const StyledContent = styled.div`
  align-items: center;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
`;

const StyledDetail = styled.div``;

const StyledInsight = styled.div<{ external?: boolean }>`
  font-size: 20px;
  text-align: center;
  padding: 0px 12px;
  width: 100%;
  box-sizing: border-box;
  margin-top: 10px;
  line-height: 56px;
  background: ${({ theme, external }) => (external ? "transparent" : theme.bg5)};
  border-radius: 4px;
  position: relative;
  margin-bottom: 13px;
`;

const StyledInsightText = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 32px;
  position: relative;
  transform: translateY(-1px);
  padding: 3px 0;

  span {
    font-weight: 800;
  }
`;

const StyledLower = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 14px;
`;

const StyledP = styled.p`
  font-weight: normal;
  font-size: 14px;
  color: ${({ theme }) => theme.brown1};
  margin: 0;
  @media (max-width: 650px) {
    text-align: center;
  }
`;

const FlexContainer = styled.div<{ farmTitle?: boolean }>`
  ${({ farmTitle }) =>
    farmTitle &&
    css`
      width: 100%;
      background: #fbfdff;
      padding: 14px 0;
      border-radius: 20px;
    `}
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 25px;
  @media (max-width: 650px) {
    flex-direction: column;
  }
`;
const StyledDiv = styled.div`
  width: 96%;
  border-radius: 16px;
  box-shadow: 0px 0px 40px rgba(255, 150, 45, 0.06);
  @media (max-width: 992px) {
    width: 100%;
    padding: 0 12px 0 12px;
  }
`;

export default FarmCards;
