import React from "react";
import LandingPage from "./components/Landing";
import HomePage from "./components/Home";
import * as ROUTES from "./constants/routes";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Blueprint from "./components/blueprint";
import { PrivatePath } from "./PrivatePath";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <PrivatePath path={ROUTES.HOME} component={HomePage} />
        <Route
          path={ROUTES.BLUEPRINT}
          render={props => <Blueprint {...props} />}
        />
      </Switch>
    </Router>
  );
}
export default App;
