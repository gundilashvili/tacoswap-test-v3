import { UniIcon } from "pages/Farm/components/styled";
import styled from "styled-components";
import { ReactComponent as TacoLogo } from "../../assets/logos/tacoLogo.svg";
import { ReactComponent as Certik } from "../../assets/logos/certik.svg";
import Waceo from "../../assets/logos/waceo.png";
import { StyledImg } from "./styled";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledParagraph = styled.p<{ opacity?: number }>`
  margin: 0 0 0 17px;
  font-size: 14px;
  opacity: ${({ opacity }) => opacity && opacity};
  color: ${({ theme }) => theme.brown1};
`;
const StyledLink = styled.a`
  text-decoration: none;
`;
function FooterLogo() {
  return (
    <Wrapper>
      <UniIcon>
        <TacoLogo />
      </UniIcon>
      <StyledParagraph>TacoSwap</StyledParagraph>
      <UniIcon width="110px" marginLeft>
        <StyledLink target="_blank" href="https://www.waceo.org/">
          <StyledImg src={Waceo} alt="" />
        </StyledLink>
      </UniIcon>
      <UniIcon width="90px" marginLeft>
        <StyledLink target="_blank" href=" https://www.certik.org/projects/tacoswap">
          <Certik />
        </StyledLink>
      </UniIcon>{" "}
    </Wrapper>
  );
}

export default FooterLogo;
