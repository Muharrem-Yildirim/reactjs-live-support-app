import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import ChatContext from "./ChatContext";
import locale from "./locales/main";
import ChatClient from "./ChatClient";

import store from "./redux/store";
let chatClient = new ChatClient();
document.documentElement.lang = locale.getLanguage();

chatClient.init(store, locale);

global.ChatClient = chatClient;


ReactDOM.render(

    <Provider store={store}>
        <ChatContext.Provider value={chatClient}>
            <App />
        </ChatContext.Provider>
    </Provider>

    , document.getElementById("root"));
