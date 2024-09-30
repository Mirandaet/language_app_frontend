import React, { useState } from "react";
import Message from "./Message";
import GenerateResponseStore from "../store/GenerateResponseStore";

function ChatDisplay({responseText }) {
  const {conversationHistory, setConversationHistory} = GenerateResponseStore(); 
  return (
    <div className=" border border-gray-600 rounded-lg p-4 overflow-scroll h-[50vh] w-[50vh]">
      <h2>Chat History</h2>
      {console.log(conversationHistory)}
      {conversationHistory &&
        conversationHistory.map((message, index) => {
          return (
            <Message
              message={message}
              conversationHistory={conversationHistory}
              setConversationHistory={setConversationHistory}
              index={index}
              responseText={responseText}
            />
          );
        })}
    </div>
  );
}

export default ChatDisplay;
