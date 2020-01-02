import React, { useState, useEffect } from "react";
import uuidV4 from "uuid/v4";

import axios from "axios";
import Message from "./Message";

export interface MessageDataType {
  speaks: string;
  msg: {
    text: {
      text: string;
    };
  };
}

const Chatbot = () => {
  const [messages, setMessages] = useState<MessageDataType[]>([]);

  const dfTextQuery = async (text: string) => {
    const iSay: MessageDataType = {
      speaks: "me",
      msg: {
        text: {
          text
        }
      }
    };
    setMessages(oldMessages => [...oldMessages, iSay]);
    const { data } = await axios.post("/api/df_text_query", { text });
    for (let msg of data.fulfillmentMessages) {
      const botSay = { speaks: "bot", msg };
      setMessages(oldMessages => [...oldMessages, botSay]);
    }
  };

  const dfEventQuery = async (event: string) => {
    const {
      data: { result }
    } = await axios.post("/api/df_event_query", { event });
    for (let msg of result.fulfillmentMessages) {
      const botSay: MessageDataType = { speaks: "bot", msg };
      setMessages(oldMessages => [...oldMessages, botSay]);
    }
  };

  const renderMessages = (messages: MessageDataType[]) =>
    messages.map(({ speaks, msg }) => (
      <Message key={uuidV4()} speaks={speaks} text={msg.text.text} />
    ));

  useEffect(() => {
    dfEventQuery("Welcome");
  }, []); //empty array means run effect on didmount only

  return (
    <div className="chat-main">
      <div className="chat-body">
        <h2>Chatbot</h2>
        {renderMessages(messages)}
        <input type="text" />
      </div>
    </div>
  );
};

export default Chatbot;
