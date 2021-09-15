// import Button from "components/Button/Button";
// import Value from "components/Value";
import styled from "styled-components";
// import { Flex } from "../styled";

function StakingAPR() {
  return (
    <StakingAPRContainer>
      <StyledP>
        For every swap on the exchange on every chain, 0.1% of the swap fees are distributed as eTACO(v2) proportional
        to your share of the eTacoBar. When your eTACO(v2) is staked into the eTacoBar, you recieve xeTACO in return for
        a fully composable token that can interact with other protocols. Your xeTACO is continuously compounding, when
        you unstake you will receive all the originally deposited eTACO(v2) and any additional from fees.
      </StyledP>
      {/* <Flex>
          <Value size="lg" symbol="%" value={7.14} />
          <StyledParagraph>Yesterday&rsquo;s APR</StyledParagraph>
        </Flex> */}
      {/* <Button isWithoutAnimation to="" width="158px" primary={true} size="add" text="View Statistics" /> */}
    </StakingAPRContainer>
  );
}

const StakingAPRContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: transparent;
  display: flex;
  justify-content: space-between;
  padding: 24px 25px 21px 32px;
  grid-area: apr;
  align-items: center;
  @media (max-width: 418px) {
    padding: 17px 14px 33px;
  }
`;

const StyledP = styled.p`
  font-size: 14px;
  font-weight: bold;
  line-height: 18px;
  margin: 0;
  margin-bottom: 15px;
`;

// const StyledParagraph = styled(StyledP)`
//   font-size: 14px;
//   font-weight: 400px;
//   margin: 0 0 3px 16px;
// `;

export default StakingAPR;
