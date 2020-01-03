import React, { useState, useEffect, useRef } from "react";
import uuidV4 from "uuid/v4";
import axios from "axios";
import Cookies from "universal-cookie";

import Message from "./Message";

export interface MessageDataType {
  speaks: string;
  msg: {
    text: {
      text: string;
    };
  };
}

const cookies = new Cookies();

const Chatbot = () => {
  const userId = cookies.get("userId");
  if (userId === undefined) cookies.set("userId", uuidV4(), { path: "/" });

  const [messages, setMessages] = useState<MessageDataType[]>([]);
  const [userSay, setUserSay] = useState("");

  const dfTextQuery = async (text: string) => {
    const userSay: MessageDataType = {
      speaks: "me",
      msg: {
        text: {
          text
        }
      }
    };
    setMessages(oldMessages => [...oldMessages, userSay]);
    const {
      data: { result }
    } = await axios.post("/api/df_text_query", { text, userId });
    for (let msg of result.fulfillmentMessages) {
      const botSay = { speaks: "bot", msg };
      setMessages(oldMessages => [...oldMessages, botSay]);
    }
  };

  const dfEventQuery = async (event: string) => {
    const {
      data: { result }
    } = await axios.post("/api/df_event_query", { event, userId });
    for (let msg of result.fulfillmentMessages) {
      const botSay: MessageDataType = { speaks: "bot", msg };
      setMessages(oldMessages => [...oldMessages, botSay]);
    }
  };

  const renderMessages = (messages: MessageDataType[]) =>
    messages.map(({ speaks, msg }) => (
      <Message key={uuidV4()} speaks={speaks} text={msg.text.text} />
    ));

  const handleInputKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      await dfTextQuery(userSay);
      setUserSay("");
    }
  };
  const messagesEnd = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    dfEventQuery("Welcome");
  }, []); //empty array means run effect on didmount only

  useEffect(() => {
    messagesEnd.current!.scrollIntoView({ behavior: "smooth" });
    inputRef.current!.focus();
  }, [messages]); // when messages updated, fire if!

  return (
    <div className="chat-main">
      <div className="chat-body">
        <h2>Chatbot</h2>
        {renderMessages(messages)}
        <div ref={messagesEnd} />
        <input
          ref={inputRef}
          type="text"
          value={userSay}
          onChange={e => setUserSay(e.target.value)}
          onKeyPress={handleInputKeyPress}
        />
      </div>
    </div>
  );
};

export default Chatbot;
