import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";
import styled from 'styled-components';

import PrivateRoute from "./components/PrivateRoute";
import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import HomePage from "./containers/home/HomePage";
import Profile from "./views/Profile";
import { useAuth0 } from "./react-auth0-spa";
import history from "./utils/history";

import "./App.css"

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
initFontAwesome();


const App = () => {
  const { loading } = useAuth0();

  if (loading) {
    return <Loading />;
  }

  return (
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100 app-container">
        <NavBar />
        {/*<Container className="flex-grow-1 mt-5">*/}
        <PageBody>
          <Switch>
            <Route path="/" exact component={HomePage} />
            <PrivateRoute path="/profile" component={Profile} />
          </Switch>
        </PageBody>
        {/*</Container>*/}
        <Footer />
      </div>
    </Router>
  );
};

export default App;

const PageBody = styled.div`
  display: flex;
  height: 100%;
`;

// const AppContainer = styled.div`
//   display: flex;
//   flex-direction: column;
// `;
