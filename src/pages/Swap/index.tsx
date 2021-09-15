import { CurrencyAmount, JSBI, Token, Trade } from "@uniswap/sdk";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ReactComponent as ArrowDownUp } from "assets/svg/arrowupdown.svg";
import ReactGA from "react-ga";
import { Text } from "rebass";
import { ThemeContext } from "styled-components";
import AddressInputPanel from "components/AddressInputPanel";
import { ButtonError, ButtonConfirmed } from "components/Button";
import Card, { GreyCard } from "components/Card";
import Column, { AutoColumn } from "components/Column";
import ConfirmSwapModal from "components/swap/ConfirmSwapModal";
import CurrencyInputPanel from "components/CurrencyInputPanel";
import { FindPoolTabs } from "components/NavigationTabs";
import { AutoRow, RowBetween } from "components/Row";
import BetterTradeLink, { DefaultVersionLink } from "components/swap/BetterTradeLink";
import confirmPriceImpactWithoutFee from "components/swap/confirmPriceImpactWithoutFee";
import { StyledFlex, ArrowWrapper, BottomGrouping, SwapCallbackError, Wrapper } from "components/swap/styleds";
import TokenWarningModal from "components/TokenWarningModal";
import ProgressSteps from "components/ProgressSteps";
import { INITIAL_ALLOWED_SLIPPAGE } from "../../constants";
import { getTradeVersion } from "data/V1";
import { useActiveWeb3React } from "hooks";
import { useCurrency, useAllTokens } from "hooks/Tokens";
import { ApprovalState, useApproveCallbackFromTrade } from "hooks/useApproveCallback";
import useENSAddress from "hooks/useENSAddress";
import { useSwapCallback } from "hooks/useSwapCallback";
import useToggledVersion, { DEFAULT_VERSION, Version } from "hooks/useToggledVersion";
import useWrapCallback, { WrapType } from "hooks/useWrapCallback";
import { useToggleSettingsMenu, useWalletModalToggle } from "state/application/hooks";
import { Field } from "state/swap/actions";
import { useDefaultsFromURLSearch, useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from "state/swap/hooks";
import { useExpertModeManager, useUserSlippageTolerance, useUserSingleHopOnly } from "state/user/hooks";
import { LinkStyledButton, TYPE } from "theme";
import { maxAmountSpend } from "utils/maxAmountSpend";
import { computeTradePriceBreakdown, warningSeverity } from "utils/prices";
import AppBody from "../AppBody";
import { ClickableText } from "../Pool/styleds";
import Loader from "../../components/Loader";
import { useIsTransactionUnsupported } from "hooks/Trades";
import { isTradeBetter } from "utils/trades";
import AdvancedSwapDetailsDropdown from "components/swap/AdvancedSwapDetailsDropdown";
import Button from "components/Button/Button";
import Layout from "components/layout/Layout";

export default function Swap() {
  const loadedUrlParams = useDefaultsFromURLSearch();

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ];
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false);
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  );
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
  }, []);

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens();
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !(token.address in defaultTokens);
    });

  const { account } = useActiveWeb3React();
  const theme = useContext(ThemeContext);

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle();

  // for expert mode
  const toggleSettings = useToggleSettingsMenu();
  const [isExpertMode] = useExpertModeManager();

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance();

  // swap state
  const { independentField, typedValue, recipient } = useSwapState();
  const {
    v1Trade,
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo();
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue);
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;
  const { address: recipientAddress } = useENSAddress(recipient);
  const toggledVersion = useToggledVersion();
  const tradesByVersion = {
    [Version.v1]: v1Trade,
    [Version.v2]: v2Trade,
  };
  const trade = showWrap ? undefined : tradesByVersion[toggledVersion];
  const defaultTrade = showWrap ? undefined : tradesByVersion[DEFAULT_VERSION];

  const betterTradeLinkV2: Version | undefined =
    toggledVersion === Version.v1 && isTradeBetter(v1Trade, v2Trade) ? Version.v2 : undefined;

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      };

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers();
  const isValid = !swapInputError;
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput]
  );
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput]
  );

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean;
    tradeToConfirm: Trade | undefined;
    attemptingTxn: boolean;
    swapErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  });

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ""
      : parsedAmounts[dependentField]?.toSignificant(6) ?? "",
  };

  const route = trade?.route;
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  );
  const noRoute = !route;

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage);

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approval, approvalSubmitted]);

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT]);

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient);

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade);

  const [singleHopOnly] = useUserSingleHopOnly();

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return;
    }
    if (!swapCallback) {
      return;
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined });
    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash });

        ReactGA.event({
          category: "Swap",
          action:
            recipient === null
              ? "Swap w/o Send"
              : (recipientAddress ?? recipient) === account
              ? "Swap w/o Send + recipient"
              : "Swap w/ Send",
          label: [
            trade?.inputAmount?.currency?.symbol,
            trade?.outputAmount?.currency?.symbol,
            getTradeVersion(trade),
          ].join("/"),
        });

        ReactGA.event({
          category: "Routing",
          action: singleHopOnly ? "Swap with multihop disabled" : "Swap with multihop enabled",
        });
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        });
      });
  }, [
    priceImpactWithoutFee,
    swapCallback,
    tradeToConfirm,
    showConfirm,
    recipient,
    recipientAddress,
    account,
    trade,
    singleHopOnly,
  ]);

  // errors

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode);

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash });
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, "");
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash]);

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm });
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash]);

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false); // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency);
    },
    [onCurrencySelection]
  );

  const handleMaxInput = useCallback(() => {
    maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact());
  }, [maxAmountInput, onUserInput]);

  const handleOutputSelect = useCallback(
    (outputCurrency) => onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection]
  );

  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT);
  const [arrowRotate, setArrowRotate] = useState(false);

  return (
    <Layout>
      <StyledFlex>
        {importTokensNotInDefault.length > 0 && !dismissTokenWarning ? (
          <TokenWarningModal
            isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
            tokens={importTokensNotInDefault}
            onConfirm={handleConfirmTokenWarning}
          />
        ) : null}
        <AppBody>
          <FindPoolTabs padding="44px 8px 21px 15px" />
          <Wrapper id="swap-page">
            {showConfirm ? (
              <ConfirmSwapModal
                isOpen={showConfirm}
                trade={trade}
                originalTrade={tradeToConfirm}
                onAcceptChanges={handleAcceptChanges}
                attemptingTxn={attemptingTxn}
                txHash={txHash}
                recipient={recipient}
                allowedSlippage={allowedSlippage}
                onConfirm={handleSwap}
                swapErrorMessage={swapErrorMessage}
                onDismiss={handleConfirmDismiss}
              />
            ) : null}
            <AutoColumn gap={"3px"}>
              <CurrencyInputPanel
                label={independentField === Field.OUTPUT && !showWrap && trade ? "From (estimated)" : "From"}
                value={formattedAmounts[Field.INPUT]}
                currency={currencies[Field.INPUT]}
                onUserInput={handleTypeInput}
                onMax={handleMaxInput}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT]}
                id="swap-currency-input"
              />
              <AutoColumn justify="space-between">
                <AutoRow
                  justify={recipient === null && !showWrap && isExpertMode ? "space-between" : "center"}
                  style={{ padding: "0 1rem" }}
                >
                  <ArrowWrapper onClick={() => setArrowRotate((prop) => !prop)} trigger={arrowRotate} clickable>
                    <ArrowDownUp
                      onClick={() => {
                        setApprovalSubmitted(false); // reset 2 step UI for approvals
                        onSwitchTokens();
                      }}
                      color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? theme.blue1 : theme.text4}
                    />
                  </ArrowWrapper>
                  {recipient === null && !showWrap && isExpertMode ? (
                    <LinkStyledButton
                      color={theme.brown1}
                      id="add-recipient-button"
                      onClick={() => onChangeRecipient("")}
                    >
                      + Add a send (optional)
                    </LinkStyledButton>
                  ) : null}
                </AutoRow>
              </AutoColumn>
              <CurrencyInputPanel
                value={formattedAmounts[Field.OUTPUT]}
                onUserInput={handleTypeOutput}
                label={independentField === Field.INPUT && !showWrap && trade ? "To (estimated)" : "To"}
                currency={currencies[Field.OUTPUT]}
                onCurrencySelect={handleOutputSelect}
                otherCurrency={currencies[Field.INPUT]}
                id="swap-currency-output"
              />

              {recipient !== null && !showWrap ? (
                <>
                  <AutoRow justify="right" style={{ padding: "0.8rem 1rem" }}>
                    <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                      - Remove send
                    </LinkStyledButton>
                  </AutoRow>
                  <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                </>
              ) : null}

              {!showWrap ? null : (
                <Card padding={showWrap ? ".25rem 1rem 0 1rem" : "0px"} borderRadius={"20px"}>
                  <AutoColumn gap="8px" style={{ padding: "0 16px" }}>
                    {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                      <RowBetween align="center">
                        <ClickableText fontWeight={500} fontSize={14} color={theme.text2} onClick={toggleSettings}>
                          Slippage Tolerance
                        </ClickableText>
                        <ClickableText fontWeight={500} fontSize={14} color={theme.text2} onClick={toggleSettings}>
                          {allowedSlippage / 100}%
                        </ClickableText>
                      </RowBetween>
                    )}
                  </AutoColumn>
                </Card>
              )}
            </AutoColumn>
            <BottomGrouping>
              {swapIsUnsupported ? (
                <Button disabled={true}>
                  <TYPE.main mb="4px">Unsupported Asset</TYPE.main>
                </Button>
              ) : !account ? (
                <Button onClick={toggleWalletModal} position="512px">
                  Connect Wallet
                </Button>
              ) : showWrap ? (
                <Button disabled={Boolean(wrapInputError)} onClick={onWrap} position="512px">
                  {wrapInputError ??
                    (wrapType === WrapType.WRAP ? "Wrap" : wrapType === WrapType.UNWRAP ? "Unwrap" : null)}
                </Button>
              ) : noRoute && userHasSpecifiedInputOutput ? (
                <GreyCard style={{ textAlign: "left" }}>
                  <TYPE.main mb="4px">Insufficient liquidity for this trade.</TYPE.main>
                  {singleHopOnly && <TYPE.main mb="4px">Try enabling multi-hop trades.</TYPE.main>}
                </GreyCard>
              ) : showApproveFlow ? (
                <RowBetween>
                  <ButtonConfirmed
                    onClick={approveCallback}
                    disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                    altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                    confirmed={approval === ApprovalState.APPROVED}
                    width="45%"
                  >
                    {approval === ApprovalState.PENDING ? (
                      <AutoRow gap="6px" justify="center">
                        Approving <Loader stroke="white" />
                      </AutoRow>
                    ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                      "Approved"
                    ) : (
                      "Approve " + currencies[Field.INPUT]?.symbol
                    )}
                  </ButtonConfirmed>
                  <ButtonError
                    onClick={() => {
                      if (isExpertMode) {
                        handleSwap();
                      } else {
                        setSwapState({
                          tradeToConfirm: trade,
                          attemptingTxn: false,
                          swapErrorMessage: undefined,
                          showConfirm: true,
                          txHash: undefined,
                        });
                      }
                    }}
                    id="swap-button"
                    disabled={
                      !isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)
                    }
                    error={isValid && priceImpactSeverity > 2}
                    width="45%"
                  >
                    <Text fontSize={14} fontWeight={500}>
                      {priceImpactSeverity > 3 && !isExpertMode
                        ? "Price Impact High"
                        : `Swap${priceImpactSeverity > 2 ? " Anyway" : ""}`}
                    </Text>
                  </ButtonError>
                </RowBetween>
              ) : (
                <ButtonError
                  backgroundColor={
                    swapInputError ? swapInputError : priceImpactSeverity > 3 && !isExpertMode ? "" : ")"
                  }
                  onClick={() => {
                    if (isExpertMode) {
                      handleSwap();
                    } else {
                      setSwapState({
                        tradeToConfirm: trade,
                        attemptingTxn: false,
                        swapErrorMessage: undefined,
                        showConfirm: true,
                        txHash: undefined,
                      });
                    }
                  }}
                  id="swap-button"
                  disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                  error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
                >
                  <Text fontSize={14} fontWeight={500}>
                    {swapInputError
                      ? swapInputError
                      : priceImpactSeverity > 3 && !isExpertMode
                      ? "Price Impact Too High"
                      : `Swap${priceImpactSeverity > 2 ? " Anyway" : ""}`}
                  </Text>
                </ButtonError>
              )}
              {showApproveFlow && (
                <Column style={{ marginTop: "1rem" }}>
                  <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                </Column>
              )}
              {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
              {betterTradeLinkV2 && !swapIsUnsupported && toggledVersion === Version.v1 ? (
                <BetterTradeLink version={betterTradeLinkV2} />
              ) : toggledVersion !== DEFAULT_VERSION && defaultTrade ? (
                <DefaultVersionLink />
              ) : null}
            </BottomGrouping>
          </Wrapper>
          <AdvancedSwapDetailsDropdown trade={trade} />
        </AppBody>
      </StyledFlex>
    </Layout>
  );
}
