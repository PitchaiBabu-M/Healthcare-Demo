import React from "react";
import Chatbot from "react-chatbot-kit";
import 'react-chatbot-kit/build/main.css'

import config from "./Config";
import MessageParser from "./MessageParser";
import ActionProvider from "./Actionprovider";

function ChatApp() {

  const validator = (input) => {
    if ((input.trim()).length > 0) return true;
    return false
}

  return (
    <div className="App">
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
        validator={validator} 
      />
    </div>
  );
}

export default ChatApp;