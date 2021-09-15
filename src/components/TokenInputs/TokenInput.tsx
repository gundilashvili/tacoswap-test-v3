import Button from "components/Button/Button";
import Input from "components/Input";

import styled from "styled-components";

interface TokenInput {
  max?: any;
  symbol?: any;
  onChange?: any;
  onSelectMax?: () => void;
  value?: string;
  disabled?: boolean;
}

const TokenInput = ({ max, symbol, onChange, onSelectMax, value, disabled = false }: TokenInput) => {
  return (
    <StyledTokenInput>
      <StyledMaxText>
        {max.toLocaleString()} {symbol} Available
      </StyledMaxText>
      <Input
        endAdornment={
          <StyledTokenAdornmentWrapper>
            <StyledTokenSymbol>{symbol}</StyledTokenSymbol>
            <StyledSpacer />
            <div>
              <Button size="sm" text="Max" onClick={onSelectMax} />
            </div>
          </StyledTokenAdornmentWrapper>
        }
        onChange={onChange}
        placeholder="0"
        value={value}
        disabled={disabled}
      />
    </StyledTokenInput>
  );
};

const StyledTokenInput = styled.div``;

const StyledSpacer = styled.div`
  width: 3px;
`;

const StyledTokenAdornmentWrapper = styled.div`
  align-items: center;
  display: flex;
`;

const StyledMaxText = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.brown1};
  display: flex;
  font-size: 14px;
  font-weight: 700;
  height: 44px;
  justify-content: flex-end;
  @media (max-width: 520px) {
    justify-content: center;
  }
`;

const StyledTokenSymbol = styled.span`
  color: ${({ theme }) => theme.brown1};
  font-weight: 700;
`;

export default TokenInput;
