import { useCallback, useState } from "react";
import { StyledFlex } from "components/swap/styleds";
import { Input } from "components/NumericalInput";
import { Container, StyledButtonPrimary } from "./styled";
import useETacoBar from "hooks/useETacoBar";
import useToken from "hooks/useToken";
import { formatFromBalance, formatToBalance } from "utils";
import { useActiveWeb3React } from "hooks";
import { MaxButtonInherit } from "pages/Pool/styleds";
import Button from "components/Button/Button";
import { useWalletModalToggle } from "state/application/hooks";
import { ETACO } from "../../constants";

const DepositPanel = () => {
  const { allowance, approve, enter } = useETacoBar();
  const { account } = useActiveWeb3React();
  const sushiBalanceBigInt = useToken(ETACO.address);
  const sushiBalance = formatFromBalance(sushiBalanceBigInt?.value, sushiBalanceBigInt?.decimals);
  const decimals = sushiBalanceBigInt?.decimals;
  const [requestedApproval, setRequestedApproval] = useState(false);
  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);
      const txHash = await approve();
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false);
      }
    } catch (e) {
      console.error(e);
    }
  }, [approve, setRequestedApproval]);
  const [pendingTx, setPendingTx] = useState(false);
  // // track and parse user input for Deposit Input
  const [depositValue, setDepositValue] = useState("");
  const [maxSelected, setMaxSelected] = useState(false);
  const onUserDepositInput = useCallback((depositValue: string, max = false) => {
    setMaxSelected(max);
    setDepositValue(depositValue);
  }, []);
  // used for max input button
  const maxDepositAmountInput = sushiBalanceBigInt;
  const handleMaxDeposit = useCallback(() => {
    maxDepositAmountInput && onUserDepositInput(sushiBalance, true);
  }, [maxDepositAmountInput, onUserDepositInput, sushiBalance]);
  const toggleWalletModal = useWalletModalToggle();

  return (
    <>
      <Container>
        <StyledFlex justifyContent="space-between" alignItems="center" style={{ marginBottom: "0" }}>
          <Input placeholder="0.00" value={depositValue} onUserInput={(val) => onUserDepositInput(val)} />
          <MaxButtonInherit onClick={() => handleMaxDeposit()}>Max</MaxButtonInherit>
        </StyledFlex>
      </Container>
      {!account ? (
        <Button onClick={toggleWalletModal} size="md" width="208px" margin="0 auto">
          Enter an amount
        </Button>
      ) : !allowance || Number(allowance) === 0 ? (
        <StyledButtonPrimary onClick={() => handleApprove()} disabled={requestedApproval}>
          Approve
        </StyledButtonPrimary>
      ) : (
        <StyledButtonPrimary
          onClick={async () => {
            setPendingTx(true);
            if (maxSelected) {
              await enter(maxDepositAmountInput);
            } else {
              await enter(formatToBalance(depositValue, decimals));
            }
            setPendingTx(false);
          }}
          disabled={
            pendingTx || !sushiBalance || Number(depositValue) === 0 || Number(depositValue) > Number(sushiBalance)
          }
        >
          Deposit
        </StyledButtonPrimary>
      )}
    </>
  );
};

export default DepositPanel;
