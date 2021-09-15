import { Trade, TradeType } from "@uniswap/sdk";
import { useContext, useMemo } from "react";
import { ArrowDown, AlertTriangle } from "react-feather";
import { ThemeContext } from "styled-components";
import { Field } from "../../state/swap/actions";
import { TYPE } from "../../theme";
import { ButtonPrimaryProto } from "../Button";
import { isAddress, shortenAddress } from "../../utils";
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from "../../utils/prices";
import { AutoColumn } from "../Column";
import CurrencyLogo from "../CurrencyLogo";
import { RowBetween, RowFixed } from "../Row";
import { TruncatedText, SwapShowAcceptChanges } from "./styleds";

export default function SwapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
}: {
  trade: Trade;
  allowedSlippage: number;
  recipient: string | null;
  showAcceptChanges: boolean;
  onAcceptChanges: () => void;
}) {
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [trade, allowedSlippage]
  );
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade]);
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);

  const theme = useContext(ThemeContext);

  return (
    <AutoColumn gap={"md"} style={{ marginTop: "20px" }}>
      <RowBetween align="flex-end">
        <RowFixed gap={"0px"}>
          <CurrencyLogo currency={trade.inputAmount.currency} size={"24px"} style={{ marginRight: "12px" }} />
          <TruncatedText
            fontSize={24}
            fontWeight={500}
            color={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? theme.brown1 : theme.brown1}
          >
            {trade.inputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={"0px"}>
          <TYPE.brown fontSize={24} fontWeight={500} style={{ marginLeft: "10px" }}>
            {trade.inputAmount.currency.symbol}
          </TYPE.brown>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDown size="16" color={theme.brown1} style={{ marginLeft: "4px", minWidth: "16px" }} />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap={"0px"}>
          <CurrencyLogo currency={trade.outputAmount.currency} size={"24px"} style={{ marginRight: "12px" }} />
          <TruncatedText
            fontSize={24}
            fontWeight={500}
            color={
              priceImpactSeverity > 2
                ? theme.red1
                : showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT
                ? theme.brown1
                : theme.brown1
            }
          >
            {trade.outputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={"0px"}>
          <TYPE.brown fontSize={24} fontWeight={500} style={{ marginLeft: "10px" }}>
            {trade.outputAmount.currency.symbol}
          </TYPE.brown>
        </RowFixed>
      </RowBetween>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap={"0px"}>
          <RowBetween>
            <RowFixed>
              <AlertTriangle size={20} style={{ marginRight: "8px", minWidth: 24 }} />
              <TYPE.brownOpacity> Price Updated</TYPE.brownOpacity>
            </RowFixed>
            <ButtonPrimaryProto
              width="50%"
              // style={{ padding: '.5rem', width: 'fit-content', fontSize: '0.825rem', borderRadius: '12px' }}
              onClick={onAcceptChanges}
              position="220px"
            >
              Accept
            </ButtonPrimaryProto>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: "12px 0 0 0px" }}>
        {trade.tradeType === TradeType.EXACT_INPUT ? (
          <TYPE.italic color={theme.brown1} opacity={0.5} textAlign="left" style={{ width: "100%" }}>
            {"Output is estimated. You will receive at least "}
            <b>
              {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)} {trade.outputAmount.currency.symbol}
            </b>
            {" or the transaction will revert."}
          </TYPE.italic>
        ) : (
          <TYPE.italic color={theme.brown1} opacity={0.5} textAlign="left" style={{ width: "100%" }}>
            {"Input is estimated. You will sell at most "}
            <b>
              {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)} {trade.inputAmount.currency.symbol}
            </b>
            {" or the transaction will revert."}
          </TYPE.italic>
        )}
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: "12px 0 0 0px" }}>
          <TYPE.main>
            Output will be sent to{" "}
            <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
          </TYPE.main>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  );
}
