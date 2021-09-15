import styled from "styled-components";

interface Input {
  endAdornment?: any;
  onChange?: () => void;
  placeholder?: string;
  startAdornment?: any;
  value?: any;
  disabled?: boolean;
}

const Input = ({ endAdornment, onChange, placeholder, startAdornment, value, disabled = false }: Input) => {
  return (
    <StyledInputWrapper>
      {!!startAdornment && startAdornment}
      <StyledInput placeholder={placeholder} value={value} onChange={onChange} disabled={disabled} />
      {!!endAdornment && endAdornment}
    </StyledInputWrapper>
  );
};

const StyledInputWrapper = styled.div`
  -moz-box-align: center;
  align-items: center;
  background-color: #fff5ea;
  border-radius: 8px;
  display: flex;
  height: 93px;
  padding: 0px 16px;
  @media (max-width: 520px) {
    flex-direction: column;
    padding-bottom: 12px;
  }
`;

const StyledInput = styled.input`
  background: none;
  border: 0;
  color: ${({ theme }) => theme.brown1};
  font-size: 18px;
  flex: 1;
  height: 56px;
  margin: 0;
  padding: 0;
  outline: none;
`;

export default Input;
