import { Token } from "@uniswap/sdk";
import { useCallback } from "react";
import Modal from "../Modal";
import { ImportToken } from "components/SearchModal/ImportToken";

export default function TokenWarningModal({
  isOpen,
  tokens,
  onConfirm,
}: {
  isOpen: boolean;
  tokens: Token[];
  onConfirm: () => void;
}) {
  const handleDismiss = useCallback(() => null, []);

  return (
    <Modal border isOpen={isOpen} onDismiss={handleDismiss} maxHeight="90vh">
      <ImportToken tokens={tokens} handleCurrencySelect={onConfirm} />
    </Modal>
  );
}
