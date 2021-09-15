import { useEffect, useState } from "react";
import { TYPE } from "theme";
import Button from "components/Button/Button";
import { StyledCircle, SuccessIcon, Container } from "./styled";

const TransferSuccess = ({ setIsOpen }: any) => {
  const [active, setActive] = useState(false);
  useEffect(() => {
    setActive(true);
  }, []);
  const close = () => {
    setIsOpen(false);
  };
  return (
    <Container>
      <StyledCircle className="circle" active={active}>
        <section className="svg-container">
          <svg className="circle" xmlns="http://www.w3.org/2000/svg">
            <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f4b740" />
              <stop offset="100%" stopColor="#ec6a46" />
            </linearGradient>
            <g className="g">
              <ellipse className="background" ry="62" rx="62" cy="62.5" cx="62.5" strokeWidth="4" />
              <ellipse
                className="foreground"
                ry="60"
                rx="60"
                cy="62.5"
                cx="62.5"
                strokeWidth="6"
                stroke="url(#linear)"
              />
              <line className="line line1" x1="52" y1="62" x2="74" y2="62" />
              <line className="line line2" x1="52" y1="62" x2="74" y2="62" />
            </g>
          </svg>
        </section>
        <SuccessIcon className="icon" active={active} />
      </StyledCircle>
      <TYPE.brown fontSize={18} fontWeight={800} paddingBottom={12} paddingTop={47} margin="auto">
        Migrations Succeded
      </TYPE.brown>
      <TYPE.brownOpacity fontSize={14} paddingBottom={35} margin="auto">
        Now you can use eTaco Chef!
      </TYPE.brownOpacity>
      <Button
        width="158px"
        primary={true}
        size="add"
        text="Close"
        margin="0 auto 20px"
        onClick={() => close()}
        to="/earn"
      />
    </Container>
  );
};

export default TransferSuccess;
