import { Route, Switch, useRouteMatch } from "react-router-dom";
import Farm from "../Farm/Farm";
import FarmCards from "./FarmCards";
import styled from "styled-components";

const Farms = () => {
  const { path } = useRouteMatch();

  return (
    <>
      <Switch>
        <>
          <Route exact path={path}>
            <StyledDiv>
              <FarmCards />
            </StyledDiv>
            <Route path={`${path}/:farmId`}>
              <Farm />
            </Route>
          </Route>
        </>
      </Switch>
    </>
  );
};

export default Farms;

const StyledDiv = styled.div`
  box-sizing: border-box;
  margin: 59px auto 0;
  width: 100%;
`;
