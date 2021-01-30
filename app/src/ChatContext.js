import React from "react";

const ChatContext = React.createContext();

export default ChatContext;

export function withChatContext(Component) {
  return (
    props // eslint-disable-line react/display-name
  ) => (
    <ChatContext.Consumer>
      {(chatClient) => <Component {...props} chatClient={chatClient} />}
    </ChatContext.Consumer>
  );
}
