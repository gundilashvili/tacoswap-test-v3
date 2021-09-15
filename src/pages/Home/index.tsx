import { useEffect, useState } from "react";
import styled from "styled-components";
import Label from "../../components/Label/Label";
import Spacer from "../../components/Spacer";
import Button from "../../components/Button/Button";
import BigNumber from "bignumber.js";
import Value from "../../components/Value";
import useTokenBalance from "../../hooks/useTokenBalance";
import useUTaco from "../../hooks/useUTaco";
import { getRewardTokenAddress, getSushiSupply } from "../../utaco/utils";
import { getBalanceNumber } from "../../utils/formatBalance";
import FarmCards from "../Farms/FarmCards";
import usePrice from "hooks/usePrice";
import { PendingRewards } from "./pendingRewards";
import useFarms from "../../hooks/useFarms";
import { useWeb3React } from "@web3-react/core";
import PageHeader from "components/PageHader";
import useTheme from "hooks/useTheme";
import { StyledFlex } from "components/swap/styleds";
import { useParams } from "react-router-dom";
import useFarm from "hooks/useFarm";
import useHarvestAll from "hooks/useHarvestAll";

const Balances = () => {
  const theme = useTheme();
  const [totalSupply, setTotalSupply] = useState(new BigNumber(0));
  const [totalLocked, setTotalLocked] = useState(new BigNumber(0));
  const { onHarvestAll } = useHarvestAll();
  const { stakedValue } = useFarms();
  const utaco = useUTaco();
  const { account } = useWeb3React();
  const sushiBalance = useTokenBalance(getRewardTokenAddress(utaco));
  const { etherPrice, price, liquidityWETH, liquidityCOMB }: any = usePrice();
  const { farmId }: any = useParams();
  const { earnToken }: any = useFarm(farmId) || { earnToken: "eTACO(v2)" };
  useEffect(() => {
    if (stakedValue.length) {
      const totalLocked = stakedValue.reduce((t: any, n: any) => t.plus(n.totalWethValue), new BigNumber(0));
      setTotalLocked(totalLocked);
    }
  }, [stakedValue]);

  useEffect(() => {
    async function fetchTotalSupply() {
      const supply = await getSushiSupply(utaco);
      return supply;
    }

    if (utaco) {
      fetchTotalSupply().then((res) => {
        setTotalSupply(() => res);
      });
    }
  }, [utaco]);

  useEffect(() => {
    const isAdded = window.localStorage?.getItem("token_added");
    console.log(isAdded);
    if (!isAdded) {
      window.ethereum
        ?.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: "0xC97b96098bd6DE2B1F5aC954F9E94Ef0BAA2Ed05",
              symbol: "eTACO(v2)",
              decimals: 18,
              image: "https://i.imgur.com/7toKDUZ.png",
            },
          },
        })
        .then((wasAdded: boolean) => {
          if (wasAdded) {
            console.log("Thanks for your interest!");
            window.localStorage.setItem("token_added", "true");
          } else {
            console.log("Your loss!");
          }
        })
        .catch(console.error);
    }
  }, []);

  const tacoBalance = (balance: number) => {
    if (balance < 1000000) {
      return balance;
    }
    if (balance < 1000000000) {
      return parseInt((balance / 1000000).toFixed()) + "M";
    }
    return parseInt((balance / 1000000000).toFixed()) + "B";
  };

  return (
    <>
      {/* <UserMigrationModule /> */}
      <StyledDiv>
        <MobilePageHeader>
          <PageHeader
            title="Claim your very own eTACOs"
            subtitle="Stake UNI V2 LP and TACO LP tokens"
            padding="78px 0 48px"
            subtitleMargin="19px 0 0 0"
          />
        </MobilePageHeader>
        <StyledDivs>
          <StyledWrapper>
            <StyledCardWrapper>
              <StyledCardContent>
                <StyledBalances>
                  <StyledBalance>
                    <StyledBalanceContent>
                      <div style={{ width: "100%", justifyContent: "space-between" }}>
                        <Label text={`Your ${earnToken} Balance`} />
                        <StyledFlex justifyContent="space-between" mb="0">
                          <Value size="lg" value={account ? getBalanceNumber(sushiBalance) : "Locked"} />
                          <StyledConvertions>
                            <StyledParagraph mt="-10px">
                              <Value
                                value={price.toNumber() ? getBalanceNumber(sushiBalance.times(price)) : "Locked"}
                                symbol="Ξ"
                                size="sm"
                                decimals={4}
                              />
                            </StyledParagraph>
                            <StyledParagraph>
                              <Value
                                value={
                                  price.toNumber()
                                    ? getBalanceNumber(price.times(etherPrice).times(sushiBalance))
                                    : "Locked"
                                }
                                symbol="$"
                                size="sm"
                                decimals={2}
                              />
                            </StyledParagraph>
                          </StyledConvertions>
                        </StyledFlex>
                      </div>
                    </StyledBalanceContent>
                  </StyledBalance>
                </StyledBalances>
                {!!account && (
                  <Footnote>
                    Unclaimed:&nbsp; &nbsp;
                    <PendingRewards />
                  </Footnote>
                )}
              </StyledCardContent>
              <StyledFooter>
                <div style={{ width: "96px" }}>
                  <Button
                    text="Harvest All"
                    size="sm"
                    onClick={onHarvestAll}
                    background={theme.linear3}
                    variant="secondary"
                    paddingLeft={"0"}
                    paddingRight={"0"}
                  />
                </div>
              </StyledFooter>
            </StyledCardWrapper>
            <Spacer size="sm" />
            <StyledCardWrapper>
              <StyledCardContent>
                <StyledBalances>
                  <StyledBalance>
                    <StyledBalanceContent>
                      <div style={{ width: "100%", justifyContent: "flex-start" }}>
                        <Label text={`${earnToken} Price`} />
                        <Value
                          size="lg"
                          value={price.toNumber() ? price.toNumber() : "Locked"}
                          symbol="Ξ"
                          decimals={6}
                        />
                      </div>
                      <StyledConvertions>
                        <StyledParagraph>
                          <Value
                            value={price.toNumber() ? price.times(etherPrice).toNumber() : "Locked"}
                            symbol="$"
                            size="sm"
                            decimals={4}
                          />
                        </StyledParagraph>
                      </StyledConvertions>
                    </StyledBalanceContent>
                  </StyledBalance>
                </StyledBalances>
                {!!account && (
                  <PriceFootnote>
                    LP: &nbsp;
                    <Value
                      value={liquidityWETH.toNumber() ? liquidityWETH.toNumber() : "Locked"}
                      symbol="Ξ"
                      decimals={2}
                      size="sm"
                    />
                    &nbsp;/&nbsp;
                    <Value
                      value={liquidityCOMB.toNumber() ? liquidityCOMB.toNumber() : "Locked"}
                      symbol={earnToken}
                      decimals={0}
                      size="sm"
                    />
                  </PriceFootnote>
                )}
              </StyledCardContent>
              <StyledFooter>
                <StyledButtonDiv>
                  <div style={{ width: "96px", marginRight: "17px" }}>
                    <Button
                      paddingLeft={"0"}
                      paddingRight={"0"}
                      text="Trade"
                      size="sm"
                      to="/swap?outputCurrency=0xc97b96098bd6de2b1f5ac954f9e94ef0baa2ed05"
                      background={theme.linear3}
                      variant="secondary"
                    />
                  </div>
                  <div style={{ width: "96px" }}>
                    <Button
                      paddingLeft={"0"}
                      paddingRight={"0"}
                      secondary={true}
                      text="Pool"
                      size="sm"
                      href="https://info.tacoswap.io/pair/0x6919934c61bee0e0e019a0ebdafe6764a9550bb0"
                      hoverColor={theme.brown1}
                      position="0"
                      hoverUnderline
                    />
                  </div>
                </StyledButtonDiv>
              </StyledFooter>
            </StyledCardWrapper>
          </StyledWrapper>
          <Spacer />
          <StyledRight>
            <StyledCardContentInherit className="classname" paddingBottom="10px">
              <StyledBalanceContent>
                <div>
                  <Label text="Total Circulating Supply" />
                  <Value size="lg" symbol={earnToken} value={tacoBalance(getBalanceNumber(totalSupply))} decimals={0} />
                </div>
                <StyledConvertions>
                  <StyledParagraph>
                    <Value
                      value={price.toNumber() ? tacoBalance(getBalanceNumber(totalSupply.times(price))) : "Locked"}
                      symbol="Ξ"
                      size="sm"
                      decimals={2}
                    />
                  </StyledParagraph>
                  <StyledParagraph>
                    <Value
                      value={price.toNumber() ? getBalanceNumber(totalSupply.times(price).times(etherPrice)) : "Locked"}
                      symbol="$"
                      size="sm"
                      decimals={0}
                    />
                  </StyledParagraph>
                </StyledConvertions>
              </StyledBalanceContent>

              <FootnoteRight>Current emission rate 90 eTACO(v2) per block</FootnoteRight>
            </StyledCardContentInherit>
            <Spacer size="sm" />
            <StyledCardContentInherit paddingBottom="30px">
              <StyledBalanceContent>
                <div style={{ width: "100%" }}>
                  <Label text="Total Locked Value" />
                  <div
                    style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}
                  >
                    <Value
                      size="lg"
                      value={totalLocked ? getBalanceNumber(totalLocked, 0) : "Locked"}
                      decimals={2}
                      symbol="Ξ"
                    />
                    <StyledConvertions>
                      <Value
                        value={totalLocked ? getBalanceNumber(totalLocked.multipliedBy(etherPrice), 0) : "Locked"}
                        decimals={2}
                        size="sm"
                        symbol="≈ $"
                      />
                    </StyledConvertions>
                  </div>
                </div>
              </StyledBalanceContent>
            </StyledCardContentInherit>
          </StyledRight>
        </StyledDivs>
        <FarmCards
          homeFarmCards={true}
          width="inherit"
          display="flex"
          padding="0 0 45px 0"
          marginTop="166px"
          marginBottom="80px"
          mobilePadding="0 49px 45px 49px"
        />
        <StyleFramedDiv>
          <StyledContainer maxWidth="750px">
            <Spacer />
            <StyledInfo>No ETH? Buy with credit card!</StyledInfo>
            <Spacer />
            <iframe
              style={{ maxWidth: "750px", border: "0" }}
              title="Coinify"
              src="https://trade-ui.coinify.com/widget?partnerId=159&primaryColor=blue&fontColor=gray&cryptoCurrencies=ETH,BTC,XLM&defaultCryptoCurrency=ETH"
              width="100%"
              height="450px"
              allow="camera"
            />
          </StyledContainer>
        </StyleFramedDiv>
      </StyledDiv>
    </>
  );
};

export default Balances;

const MobilePageHeader = styled.div`
  @media (max-width: 1300px) {
    width: 90%;
    margin: auto;
  }
`;

const StyledDiv = styled.div`
  box-sizing: border-box;
  padding: 0px 24px;
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
  @media (max-width: 731px) {
    padding: 0 8px;
  }
`;

const StyledConvertions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 8px 20px 8px 8px;
`;

const StyledButtonDiv = styled.div`
  display: flex;
`;

const StyledParagraph = styled.div<{ mt?: string }>`
  position: relative;
  margin-top: ${({ mt }) => mt && mt};
  &:not(:last-child) {
    margin-bottom: 8px;
  }

  &:before {
    content: "≈";
    position: absolute;
    left: -16px;
    top: -2px;
  }
`;

const Footnote = styled.div`
  display: flex;
  align-items: baseline;
  flex-direction: row;
  font-size: 14px;
  color: ${({ theme }) => theme.white};
  margin-top: 19px;
`;

const PriceFootnote = styled(Footnote)`
  margin-top: 25px;
`;

const StyledFooter = styled.div`
  box-sizing: border-box;
  border-top: 2px solid ${({ theme }) => theme.border};
  width: 100%;
  padding: 17px 0 17px 18px;
`;

const FootnoteRight = styled.div`
  font-size: 12px;
  margin-top: 7px;
  color: ${({ theme }) => theme.brown1};
  opacity: 0.6;
`;

const StyledWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  height: inherit;
  width: 50%;
  max-width: 610px;
  color: #fff;
  @media (max-width: 992px) {
    flex-flow: row nowrap;
    align-items: stretch;
    margin-right: 10px;
    width: 100%;
    max-width: 100%;
  }
  @media (max-width: 692px) {
    flex-direction: column;
    width: 96%;
    max-width: 96%;

    margin: auto;
  }
`;

const StyledBalances = styled.div`
  display: flex;
  width: 100%;
`;

const StyledBalance = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
`;

const StyledBalanceContent = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const StyledRight = styled.div`
  color: ${({ theme }) => theme.brown1};
  display: flex;
  flex-direction: column;
  justify-content: right;
  height: inherit;
  width: 40%;
  max-width: 487px;
  @media (max-width: 992px) {
    width: 100%;
    max-width: 100%;
  }
  @media (max-width: 692px) {
    width: 96%;
    max-width: 96%;

    margin: auto;
  }
`;

const StyledCardContent = styled.div<{ paddingBottom?: string }>`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 49px 3px 15px 32px;
  border-radius: 11px;
  padding-bottom: ${({ paddingBottom }) => paddingBottom && paddingBottom};
`;

const StyledCardContentInherit = styled(StyledCardContent)`
  background: ${({ theme }) => theme.bg6};
  border: 1px solid ${({ theme }) => theme.border};
  padding-top: 12px;
  min-height: 117px;
`;

const StyledDivs = styled.div`
  display: flex;

  @media (max-width: 992px) {
    width: 90%;
    margin: auto;
    height: auto;
    flex-direction: column;
  }
  @media (max-width: 692px) {
    width: 100%;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: flex-start;
  width: 50%;
  box-shadow: 0px 4px 16px rgba(254, 187, 120, 0.6);
  border-radius: 11px;
  background: ${({ theme }) => theme.linear1};
  @media (min-width: 993px) {
    height: 100%;
  }
  @media (max-width: 692px) {
    width: 100%;
  }
`;

const StyleFramedDiv = styled.div`
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
  margin-bottom: 50px;
`;

const StyledInfo = styled.h3`
  color: ${({ theme }) => theme.brown1};
  font-size: 30px;
  font-family: "Fira Sans", serif;
  margin: 0;
  padding: 0;
  text-align: center;
  > b {
    color: ${({ theme }) => theme.brown1};
  }
`;

const StyledContainer = styled.div<{ maxWidth?: string }>`
  box-sizing: border-box;
  margin: 0 auto;
  max-width: ${({ maxWidth }) => maxWidth};
  width: 100%;
  @media (min-width: 578px) {
  }
`;
