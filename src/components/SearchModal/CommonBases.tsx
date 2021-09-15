import { ChainId, Currency, currencyEquals, ETHER, Token } from "@uniswap/sdk";
import styled from "styled-components";
import { TYPE } from "theme";
import { SUGGESTED_BASES } from "../../constants";
import { AutoColumn } from "../Column";
import QuestionHelper from "../QuestionHelper";
import { AutoRow } from "../Row";
import CurrencyLogo from "../CurrencyLogo";

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border: 1px solid ${({ theme, disable }) => (disable ? "transparent" : theme.border2)};
  border-radius: 10px;
  display: flex;
  padding: 6px;
  align-items: center;
  transition: all 0.3s ease;

  :hover {
    cursor: ${({ disable }) => !disable && "pointer"};
    background-color: ${({ theme, disable }) => !disable && theme.bg8};
  }

  background: ${({ theme, disable }) => disable && theme.bg7};
  opacity: ${({ disable }) => disable && "0.4"};
  cursor: ${({ disable }) => (disable ? "not-allowed" : "pointer")};
`;

export default function CommonBases({
  chainId,
  onSelect,
  selectedCurrency,
}: {
  chainId?: ChainId;
  selectedCurrency?: Currency | null;
  onSelect: (currency: Currency) => void;
}) {
  return (
    <AutoColumn gap="md">
      <AutoRow>
        <TYPE.main fontWeight={500} fontSize={14}>
          Common bases
        </TYPE.main>
        <QuestionHelper text="These tokens are commonly paired with other tokens." />
      </AutoRow>
      <AutoRow gap="4px">
        <BaseWrapper
          onClick={() => {
            if (!selectedCurrency || !currencyEquals(selectedCurrency, ETHER)) {
              onSelect(ETHER);
            }
          }}
          disable={selectedCurrency === ETHER}
        >
          <CurrencyLogo currency={ETHER} style={{ marginRight: 8 }} />
          <TYPE.main fontWeight={500} fontSize={16}>
            ETH
          </TYPE.main>
        </BaseWrapper>
        {(chainId ? SUGGESTED_BASES[chainId] : []).map((token: Token) => {
          const selected = selectedCurrency instanceof Token && selectedCurrency.address === token.address;
          return (
            <BaseWrapper onClick={() => !selected && onSelect(token)} disable={selected} key={token.address}>
              <CurrencyLogo currency={token} style={{ marginRight: 8 }} />
              <TYPE.main fontWeight={500} fontSize={16}>
                {token.symbol}
              </TYPE.main>
            </BaseWrapper>
          );
        })}
      </AutoRow>
    </AutoColumn>
  );
}
