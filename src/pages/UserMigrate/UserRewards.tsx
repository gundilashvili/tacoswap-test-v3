import { useState } from "react";
import Loader from "components/Loader";
import { ClaimButton } from "components/Button";
import { TYPE } from "theme";
import { FlexContainer, ContainerPart, ClaimedIccon } from "./styled";
import { ReactComponent as ClaimedSVG } from "assets/svg/claimed.svg";

const UserRewards = ({ lpTokens, setLpTokens, setCount }: any) => {
  const [pending, setPending] = useState(false);
  const claim = async (id: any) => {
    setPending(true);
    setTimeout(() => {
      setPending(false);
    }, 2);
    const state = [...lpTokens];
    state.map((a: any) => {
      return (a.value = a.id === id ? 0 : a.value);
    });
    await setLpTokens(state);
    setCount((e: any) => e - 1);
  };

  return (
    <>
      {lpTokens.map((a: any) => {
        return (
          <FlexContainer key={a.id}>
            <ContainerPart>
              <TYPE.brown fontSize={20} alignSelf="center">
                {a.tokenName}
              </TYPE.brown>
              <TYPE.brown fontSize={20} fontWeight={800} alignSelf="center" title={a.value}>
                {a.value.toFixed(2)}
              </TYPE.brown>
            </ContainerPart>
            <ClaimButton disabled={a.value ? false : true} width="136px" size="sm" onClick={() => claim(a.id)} claim>
              {a.value === 0 ? (
                pending ? (
                  <Loader size="16px" stroke="#fff" />
                ) : (
                  <ClaimedIccon clicked={a.value === 0 && true}>
                    <ClaimedSVG />
                  </ClaimedIccon>
                )
              ) : null}{" "}
              {a.value ? "Claim" : pending ? null : "Claimed"}
            </ClaimButton>
          </FlexContainer>
        );
      })}
    </>
  );
};

export default UserRewards;
