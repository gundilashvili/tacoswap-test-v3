import { Trade, TradeType } from "@uniswap/sdk";
import { useContext, useMemo, useState } from "react";
import { Repeat } from "react-feather";
import { Text } from "rebass";
import { ThemeContext } from "styled-components";
import { Field } from "../../state/swap/actions";
import { TYPE } from "../../theme";
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  formatExecutionPrice,
  warningSeverity,
} from "../../utils/prices";
import { ButtonError } from "../Button";
import { AutoColumn } from "../Column";
import QuestionHelper from "../QuestionHelper";
import { AutoRow, RowBetween, RowFixed } from "../Row";
import FormattedPriceImpact from "./FormattedPriceImpact";
import { StyledBalanceMaxMini, SwapCallbackError } from "./styleds";

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm,
}: {
  trade: Trade;
  allowedSlippage: number;
  onConfirm: () => void;
  swapErrorMessage: string | undefined;
  disabledConfirm: boolean;
}) {
  const [showInverted, setShowInverted] = useState<boolean>(false);
  const theme = useContext(ThemeContext);
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [allowedSlippage, trade]
  );
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade]);
  const severity = warningSeverity(priceImpactWithoutFee);

  return (
    <>
      <AutoColumn gap="0px">
        <RowBetween align="center" lineHeight="44px">
          <Text fontWeight={400} fontSize={14} color={theme.brown1}>
            Price
          </Text>
          <TYPE.brownOpacity
            fontWeight={500}
            fontSize={14}
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              textAlign: "right",
              paddingLeft: "10px",
            }}
          >
            {formatExecutionPrice(trade, showInverted)}
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)} color="#FFD18A">
              <Repeat size={14} />
            </StyledBalanceMaxMini>
          </TYPE.brownOpacity>
        </RowBetween>

        <RowBetween lineHeight="44px">
          <RowFixed>
            <TYPE.brown fontSize={14} fontWeight={400}>
              {trade.tradeType === TradeType.EXACT_INPUT ? "Minimum received" : "Maximum sold"}
            </TYPE.brown>
            <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
          <RowFixed>
            <TYPE.brownOpacity fontSize={14}>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? "-"
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? "-"}
            </TYPE.brownOpacity>
            <TYPE.brownOpacity fontSize={14} marginLeft={"4px"}>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? trade.outputAmount.currency.symbol
                : trade.inputAmount.currency.symbol}
            </TYPE.brownOpacity>
          </RowFixed>
        </RowBetween>
        <RowBetween lineHeight="44px">
          <RowFixed>
            <TYPE.brown fontSize={14} fontWeight={400}>
              Price Impact
            </TYPE.brown>
            <QuestionHelper text="The difference between the market price and your price due to trade size." />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween lineHeight="44px">
          <RowFixed>
            <TYPE.brown fontSize={14} fontWeight={400}>
              Liquidity Provider Fee
            </TYPE.brown>
            <QuestionHelper text="A portion of each trade (0.30%) goes to liquidity providers as a protocol incentive." />
          </RowFixed>
          <TYPE.brownOpacity fontSize={14}>
            {realizedLPFee ? realizedLPFee?.toSignificant(6) + " " + trade.inputAmount.currency.symbol : "-"}
          </TYPE.brownOpacity>
        </RowBetween>
      </AutoColumn>

      <AutoRow>
        <ButtonError
          onClick={onConfirm}
          disabled={disabledConfirm}
          error={severity > 2}
          style={{ margin: "auto" }}
          id="confirm-swap-or-send"
          width="100%"
        >
          <Text fontSize={20} fontWeight={500}>
            {severity > 2 ? "Swap Anyway" : "Confirm Swap"}
          </Text>
        </ButtonError>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  );
}
