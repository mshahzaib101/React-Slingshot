/* eslint-disable import/no-named-as-default */
import React from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import NotFoundPage from "./static/NotFoundPage";
import TestContainer from "./Test/TestContainer";

class App extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={TestContainer} />
          <Route exact path="*" component={NotFoundPage} />
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

export default App;

