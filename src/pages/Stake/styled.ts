import styled from "styled-components";

export const Container = styled.div<{ marginBottom?: string }>`
  border-radius: 8px;
  background: #fff5ea;
  padding: 18px 23px;
  margin-bottom: ${({ marginBottom }) => marginBottom ?? "48px"};
  @media (max-width: 420px) {
    padding: 10px;
  }
`;
export const StyledButtonPrimary = styled.button`
  background: ${({ theme }) => theme.buttonAnimationColor};
  background-size: 250% 100%;
  background-repeat: no-repeat;
  border: none;
  color: #ffffff;
  padding: 13px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  border-radius: 24px;
  transition: all 0.2s;
  width: 170px;

  &:hover:enabled {
    color: ${({ theme }) => theme.hoverText};
    box-shadow: none;
    background-position: -67% 0 !important;
  }
  &:focus {
    color: #ffffff;
    box-shadow: ${({ theme }) => `0px 0px 10px 0px${theme.backgroundHover}`};
    background: ${({ theme }) => theme.buttonLinear};
    outline: none;
  }
  &:active {
    color: #ffffff;
    box-shadow: ${({ theme }) => `0px 15px 10px ${theme.backgroundHover}, 0px -15px 10px ${theme.backgroundHover}`};
    background: ${({ theme }) => theme.buttonLinear};
  }

  &:disabled {
    cursor: auto;
    box-shadow: none;
    outline: none;
    opacity: 0.5;
    background: ${({ theme }) => theme.disable};
    color: #ffffff;
  }
  @media (max-width: 420px) {
    width: 100px;
    padding: 8px 5px;
    font-size: 14px;
  }
`;

export const Card = styled.div`
  border-radius: 16px;
  background: ${({ theme }) => theme.white};
  padding: 25px 25px 48px;
  text-align: center;
  grid-area: card;
  @media (max-width: 436px) {
    padding: 17px 14px 48px;
  }
`;

export const BalanceContainer = styled(Card)`
  grid-area: balance;
  padding: 48px 42px;
  text-align: left;
  display: flex;
  flex-direction: column;
  @media (max-width: 802px) {
    flex-direction: row;
    justify-content: space-around;
  }
  @media (max-width: 462px) {
    flex-direction: column;
    justify-content: center;
  }
`;

export const Flex = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;
