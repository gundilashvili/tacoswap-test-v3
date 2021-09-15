import { useState, useRef } from "react";
import styled from "styled-components";

import QuestionHelper from "../QuestionHelper";
import { TYPE } from "theme";
import { AutoColumn } from "../Column";
import { RowBetween, RowFixed } from "../Row";

import { darken } from "polished";

enum SlippageError {
  InvalidInput = "InvalidInput",
  RiskyLow = "RiskyLow",
  RiskyHigh = "RiskyHigh",
}

enum DeadlineError {
  InvalidInput = "InvalidInput",
}

const FancyButton = styled.button`
  color: ${({ theme }) => theme.brown1};
  align-items: center;
  height: 2rem;
  border-radius: 8px;
  font-size: 1rem;
  width: auto;
  min-width: 3.5rem;
  border: 1px solid rgba(97, 78, 86, 0.5);
  outline: none;
  background: ${({ theme }) => theme.bg1};
  :hover {
    border: 1px solid ${({ theme }) => theme.border};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.border};
  }
  &::placeholder {
    color: ${({ theme }) => theme.white};
  }
`;

const Option = styled(FancyButton)<{ active: boolean }>`
  background: ${({ active, theme }) => (active ? theme.linear2 : "inherit")};
  color: ${({ active, theme }) => (active ? theme.white : theme.brown1)};
  border: ${({ active }) => (active ? "none" : "")};
  margin-right: 8px;
  :hover {
    cursor: pointer;
    color: ${({ active }) => (active ? "" : "#FF962D")};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.border};
  }
`;

const Input = styled.input<{ bgcolor?: string; width?: string }>`
  border: ${({ theme }) => theme.border};
  background: transparent;
  font-size: 16px;
  width: ${({ width }) => (width ? width : "auto")};
  outline: none;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  color: ${({ theme, color }) => (color === "red" ? theme.red1 : theme.brown1)};
  text-align: right;
`;

const OptionCustom = styled(FancyButton)<{
  active?: boolean;
  warning?: boolean;
  minWidth?: boolean;
  mobileDisplay?: boolean;
}>`
  border: none;
  min-width: ${({ minWidth }) => (minWidth ? "75px" : "")};
  max-width: 98px;
  color: #614e56;
  background: rgba(97, 78, 86, 0.2);
  height: 2rem;
  position: relative;
  padding: 0 0.25rem;
  flex: 1;
  border: 1px solid transparent;
  :hover {
    border: ${({ theme, active, warning }) =>
      active && `1px solid ${warning ? darken(0.1, theme.red1) : darken(0.1, theme.border)}`};
  }
  :focus {
    border-color: ${({ theme }) => theme.border};
  }
  input {
    height: 100%;
    border: 0;
    border-radius: 2rem;
    &::placeholder {
      color: rgba(97, 78, 86, 0.5);
    }
  }
  @media (max-width: 420px) {
    display: ${({ mobileDisplay }) => mobileDisplay && "none"};
  }
`;

const SlippageEmojiContainer = styled.span`
  color: #f3841e;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;  
  `}
`;

export interface SlippageTabsProps {
  rawSlippage: number;
  setRawSlippage: (rawSlippage: number) => void;
  deadline: number;
  setDeadline: (deadline: number) => void;
}

export default function SlippageTabs({ rawSlippage, setRawSlippage, deadline, setDeadline }: SlippageTabsProps) {
  const inputRef = useRef<HTMLInputElement>();

  const [slippageInput, setSlippageInput] = useState("");
  const [deadlineInput, setDeadlineInput] = useState("");

  const slippageInputIsValid =
    slippageInput === "" || (rawSlippage / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2);
  const deadlineInputIsValid = deadlineInput === "" || (deadline / 60).toString() === deadlineInput;

  let slippageError: SlippageError | undefined;
  if (slippageInput !== "" && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput;
  } else if (slippageInputIsValid && rawSlippage < 50) {
    slippageError = SlippageError.RiskyLow;
  } else if (slippageInputIsValid && rawSlippage > 500) {
    slippageError = SlippageError.RiskyHigh;
  } else {
    slippageError = undefined;
  }

  let deadlineError: DeadlineError | undefined;
  if (deadlineInput !== "" && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput;
  } else {
    deadlineError = undefined;
  }

  function parseCustomSlippage(value: string) {
    setSlippageInput(value);

    try {
      const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString());
      if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
        setRawSlippage(valueAsIntFromRoundedFloat);
      }
    } catch {}
  }

  function parseCustomDeadline(value: string) {
    setDeadlineInput(value);

    try {
      const valueAsInt: number = Number.parseInt(value) * 60;
      if (!Number.isNaN(valueAsInt) && valueAsInt > 0) {
        setDeadline(valueAsInt);
      }
    } catch {}
  }

  return (
    <AutoColumn gap="md">
      <AutoColumn gap="sm">
        <RowFixed width="auto" justify="space-between" align="strech">
          <TYPE.brownOpacity fontWeight={400} fontSize={14}>
            Slippage tolerance
          </TYPE.brownOpacity>
          <QuestionHelper text="Your transaction will revert if the price changes unfavorably by more than this percentage." />
        </RowFixed>
        <RowBetween justifyContent="flex-start">
          <Option
            onClick={() => {
              setSlippageInput("");
              setRawSlippage(10);
            }}
            active={rawSlippage === 10}
          >
            0.1%
          </Option>
          <Option
            onClick={() => {
              setSlippageInput("");
              setRawSlippage(50);
            }}
            active={rawSlippage === 50}
          >
            0.5%
          </Option>
          <Option
            onClick={() => {
              setSlippageInput("");
              setRawSlippage(100);
            }}
            active={rawSlippage === 100}
          >
            1%
          </Option>
          <OptionCustom
            minWidth
            active={![10, 50, 100].includes(rawSlippage)}
            warning={!slippageInputIsValid}
            tabIndex={-1}
            mobileDisplay
          >
            <RowBetween color="#fff" justifyContent="flex-end">
              {!!slippageInput &&
              (slippageError === SlippageError.RiskyLow || slippageError === SlippageError.RiskyHigh) ? (
                <SlippageEmojiContainer>
                  <span role="img" aria-label="warning">
                    ⚠️
                  </span>
                </SlippageEmojiContainer>
              ) : null}
              {/* https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451 */}
              <Input
                width="58%"
                ref={inputRef as any}
                placeholder={(rawSlippage / 100).toFixed(2)}
                value={slippageInput}
                onBlur={() => {
                  parseCustomSlippage((rawSlippage / 100).toFixed(2));
                }}
                onChange={(e) => parseCustomSlippage(e.target.value)}
                color={!slippageInputIsValid ? "red" : ""}
              />
              %
            </RowBetween>
          </OptionCustom>
        </RowBetween>
        {!!slippageError && (
          <RowBetween
            style={{
              fontSize: "14px",
              paddingTop: "7px",
              color: slippageError === SlippageError.InvalidInput ? "red" : "#F3841E",
            }}
          >
            {slippageError === SlippageError.InvalidInput
              ? "Enter a valid slippage percentage"
              : slippageError === SlippageError.RiskyLow
              ? "Your transaction may fail"
              : "Your transaction may be frontrun"}
          </RowBetween>
        )}
      </AutoColumn>

      <AutoColumn gap="sm">
        <RowFixed width="auto" justify="space-between" align="strech">
          <TYPE.brownOpacity fontSize={14} fontWeight={400}>
            Transaction deadline
          </TYPE.brownOpacity>
          <QuestionHelper text="Your transaction will revert if it is pending for more than this long." />
        </RowFixed>
        <RowFixed>
          <OptionCustom style={{ width: "65px" }} tabIndex={-1}>
            <Input
              width="100%"
              color={deadlineError ? "red" : undefined}
              onBlur={() => {
                parseCustomDeadline((deadline / 60).toString());
              }}
              placeholder={(deadline / 60).toString()}
              value={deadlineInput}
              onChange={(e) => parseCustomDeadline(e.target.value)}
            />
          </OptionCustom>
          <TYPE.main style={{ paddingLeft: "8px" }} fontSize={14}>
            min
          </TYPE.main>
        </RowFixed>
      </AutoColumn>
    </AutoColumn>
  );
}
