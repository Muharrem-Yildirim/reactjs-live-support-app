import React from "react";
import store from "./redux/store";
import { Provider } from "react-redux";
import ChatClient from "./ChatClient";
import ChatContext from "./ChatContext";
import Main from "./views/Main";
import Chat from "./views/Chat";
import Admin from "./views/Admin";
import "./assets/app.scss";
import TopBar from "./components/TopBar";
import { BrowserRouter, Switch, Route } from "react-router-dom";

let chatClient = new ChatClient();
chatClient.init(store);
global.ChatClient = chatClient;

export default function App() {
  return (
    <Provider store={store}>
      <ChatContext.Provider value={chatClient}>
        <BrowserRouter>
          <TopBar />
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact sensitive path="/chat" component={Chat} />
            <Route exact sensitive path="/admin" component={Admin} />
          </Switch>
        </BrowserRouter>
      </ChatContext.Provider>
    </Provider>
  );
}
