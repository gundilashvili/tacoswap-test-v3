import { Text } from "rebass";
import styled from "styled-components";
import { RowFixed } from "../Row";

export const FilterWrapper = styled(RowFixed)`
  padding: 4px 17px;
  background: ${({ theme }) => theme.linear2};
  color: ${({ theme }) => theme.text1};
  border-radius: 8px;
  user-select: none;
  & > * {
    user-select: none;
  }
  :hover {
    cursor: pointer;
  }
`;

export default function SortButton({
  toggleSortOrder,
  ascending,
}: {
  toggleSortOrder: () => void;
  ascending: boolean;
}) {
  return (
    <FilterWrapper onClick={toggleSortOrder}>
      <Text color="#fff" fontSize={22} fontWeight={500}>
        {ascending ? "↑" : "↓"}
      </Text>
    </FilterWrapper>
  );
}
