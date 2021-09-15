import { useCallback, useMemo, useState } from "react";
import Button from "components/Button/Button";
import { getFullDisplayBalance } from "../../../utils/formatBalance";
import ModalTitle from "./ModalTitle";
import TokenInput from "components/TokenInputs";
import ModalActions from "components/ModalActions";
import useApprove from "hooks/useApprove";
import useAllowance from "hooks/useAllowance";
import useLpContact from "hooks/useLpContract";
import styled from "styled-components";
import { BigNumber } from "bignumber.js";
import Spacer from "../../../components/Spacer";

interface DepositModal {
  onConfirm: (val: string) => Promise<any>;
  onDismiss: () => void;
  max: BigNumber;
  tokenName: string;
  lpTokenAddress: string;
}

const DepositModal = ({ max, onConfirm, onDismiss, tokenName = "", lpTokenAddress }: DepositModal) => {
  const lpContract = useLpContact(lpTokenAddress);

  const allowance = useAllowance(lpContract);
  const { onApprove } = useApprove(lpContract);

  const [val, setVal] = useState("0");
  const [pendingTx, setPendingTx] = useState(false);
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max);
  }, [max]);

  const handleChange = useCallback(
    (e) => {
      setVal(e.currentTarget.value);
    },
    [setVal]
  );

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);

  const handleApprove = useCallback(async () => {
    try {
      const txHash = await onApprove();
      // user rejected tx or didn't go thru
      if (!txHash) {
      }
    } catch (e) {
      console.error(e);
    }
  }, [onApprove]);

  console.log(allowance.isZero());

  return (
    <>
      <StyledFlexContainer>
        <ModalTitle height={72} onDismiss={onDismiss} text={`Deposit ${tokenName} Tokens`} />
        {allowance.isZero() ? (
          <div>
            <p style={{ textAlign: "center" }}>
              Please unlock your {tokenName} before staking. This action must be done only once for each pool.
            </p>
            <ModalActions padding="24px 0">
              <Button size="md" width="100%" text={`Unlock ${tokenName}`} onClick={handleApprove} />
            </ModalActions>
          </div>
        ) : (
          <div>
            <TokenInput
              value={val}
              onSelectMax={handleSelectMax}
              onChange={handleChange}
              max={fullBalance}
              symbol={tokenName}
              disabled={allowance.isZero()}
            />
            <ModalActions padding="24px 0">
              <Button
                size="md"
                width="100%"
                disabled={pendingTx}
                text={pendingTx ? "Pending Confirmation" : "Confirm"}
                onClick={async () => {
                  try {
                    setPendingTx(true);
                    await onConfirm(val);
                    setPendingTx(false);
                    onDismiss();
                  } catch (e) {
                    setPendingTx(false);
                    console.error(e);
                  }
                }}
              />
            </ModalActions>
          </div>
        )}
        <StyledHr />
        <Spacer size="sm" />
        <StyledTitle>Speed Stake</StyledTitle>
        <p style={{ textAlign: "center" }}>
          Speed stake will convert your <b>ETH</b> into <b>{tokenName}</b> and deposit them for you in one transaction.
        </p>
        <TokenInput
          value={val}
          onSelectMax={handleSelectMax}
          onChange={handleChange}
          max={fullBalance}
          symbol={"ETH"}
        />
        <ModalActions padding="24px 0">
          <Button
            size="md"
            width="100%"
            disabled={pendingTx}
            text={pendingTx ? "Pending Confirmation" : "Confirm"}
            onClick={async () => {
              try {
                setPendingTx(true);
                await onConfirm(val);
                setPendingTx(false);
                onDismiss();
              } catch (e) {
                setPendingTx(false);
                console.error(e);
              }
            }}
          />
        </ModalActions>
      </StyledFlexContainer>
    </>
  );
};

export default DepositModal;

const StyledFlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  width: 100%;
`;

const StyledTitle = styled.div<{ height?: any }>`
  align-items: center;
  color: ${({ theme }) => theme.brown1};
  display: flex;
  font-size: 18px;
  font-weight: 700;
  height: ${({ height }) => (height ? height : "")}px;
  justify-content: center;
  text-align: center;
`;

const StyledHr = styled.hr`
  border-top: 1px solid #614e56;
  border-style: solid none none;
  width: 100%;
`;
