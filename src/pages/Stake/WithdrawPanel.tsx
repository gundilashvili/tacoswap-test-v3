import { useCallback, useState } from "react";
import { StyledFlex } from "components/swap/styleds";
import { Input } from "components/NumericalInput";
import { Container, StyledButtonPrimary } from "./styled";
import useETacoBar from "hooks/useETacoBar";
import useToken from "hooks/useToken";
import { formatFromBalance, formatToBalance } from "utils";
import { MaxButtonInherit } from "pages/Pool/styleds";
import { useActiveWeb3React } from "hooks";
import Button from "components/Button/Button";
import { useWalletModalToggle } from "state/application/hooks";
import { XETACO } from "../../constants";

const WithdrawPanel = () => {
  const { allowance, approve, leave } = useETacoBar();
  const { account } = useActiveWeb3React();
  const xSushiBalanceBigInt = useToken(XETACO.address);
  const xSushiBalance = formatFromBalance(xSushiBalanceBigInt?.value, xSushiBalanceBigInt?.decimals);
  const decimals = xSushiBalanceBigInt?.decimals;

  // handle approval
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

  const [depositValue, setDepositValue] = useState("");
  const [maxSelected, setMaxSelected] = useState(false);
  const onUserDepositInput = useCallback((depositValue: string, max = false) => {
    setMaxSelected(max);
    setDepositValue(depositValue);
  }, []);
  const maxDepositAmountInput = xSushiBalanceBigInt;

  const handleMaxDeposit = useCallback(() => {
    maxDepositAmountInput && onUserDepositInput(xSushiBalance, true);
  }, [maxDepositAmountInput, onUserDepositInput, xSushiBalance]);
  const toggleWalletModal = useWalletModalToggle();

  return (
    <>
      <Container>
        <StyledFlex justifyContent="space-between" alignItems="center" style={{ marginBottom: "0" }}>
          <Input value={depositValue} placeholder="0.00" onUserInput={(val) => onUserDepositInput(val)} />
          <MaxButtonInherit onClick={handleMaxDeposit}>Max</MaxButtonInherit>
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
          disabled={
            pendingTx || !xSushiBalance || Number(depositValue) === 0 || Number(depositValue) > Number(xSushiBalance)
          }
          onClick={async () => {
            setPendingTx(true);
            if (maxSelected) {
              await leave(maxDepositAmountInput);
            } else {
              await leave(formatToBalance(depositValue, decimals));
            }
            setPendingTx(false);
          }}
        >
          Withdraw
        </StyledButtonPrimary>
      )}
    </>
  );
};

export default WithdrawPanel;
