import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { connect } from "react-redux";

import Main from "./views/Main";
import Chat from "./views/Chat";
import Admin from "./views/Admin";

import TopBar from "./components/TopBar";
import MessageBox from "./components/MessageBox";


import "./assets/app.scss";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        {this.props.messageBox && <MessageBox {...this.props.messageBox} />}

        <TopBar />
        <Switch>
          <Route exact path="/" component={Main} />
          <Route exact sensitive path="/chat" component={Chat} />
          <Route exact sensitive path="/admin" component={Admin} />
        </Switch>
      </BrowserRouter>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    messageBox: state.messageBox,
  };
};

export default connect(mapStateToProps)(App);

