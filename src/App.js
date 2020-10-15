import React, {useState} from "react";
import { Router, Route, Switch } from "react-router-dom";
import styled, { css } from 'styled-components/macro';

import PrivateRoute from "./components/PrivateRoute";
import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Home from "./containers/home/Home";
import { useAuth0 } from "./react-auth0-spa";
import history from "./utils/history";

import "./App.css"

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
import Groups from "./containers/groups/Groups";
import {FlexRow} from "./components/BaseStyledComponents";
import {SIDEBAR_WIDTH, TOP_BAR_HEIGHT} from "./utils/constants";
initFontAwesome();


const App = () => {
  const { loading } = useAuth0();
  const [sidebar, setSidebar] = useState(true);

  const toggleSidebar = () => {
    setSidebar(!sidebar)
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Router history={history}>
      <NavBar toggleSidebar={toggleSidebar} sidebar={sidebar}/>
      <PageBodyContainer sidebar={sidebar}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/groups" component={Groups} />
        </Switch>
      </PageBodyContainer>
    </Router>
  );
};

export default App;

const PageBodyContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  padding-top: ${TOP_BAR_HEIGHT};
  transition: 350ms;
  ${props => props.sidebar && css`
    padding-left: ${SIDEBAR_WIDTH};  
    transition: 550ms;
  `}
`;

// const AppContainer = styled.div`
//   display: flex;
//   flex-direction: column;
// `;
