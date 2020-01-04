import React, { useState, useEffect, useRef } from "react";
import uuidV4 from "uuid/v4";
import axios from "axios";
import Cookies from "universal-cookie";

import Message from "./Message";
import Card from "./Card";
import QuickReplies from "./QuickReplies";
import { QuickReplyType } from "./QuickReply";
import { ReplyClickArgsType } from "./QuickReplies";

export interface CardStructValueType {
  structValue: {
    fields: {
      header: {
        stringValue: string;
      };
      link: {
        stringValue: string;
      };
      price: {
        stringValue: string;
      };
      image: {
        stringValue: string;
      };
      description: {
        stringValue: string;
      };
    };
  };
}
export interface MessageDataType {
  speaks: string;
  msg: {
    message?: string;
    text?: {
      text: string;
    };
    payload?: {
      fields: {
        text: {
          stringValue: string;
        };
        soaps: {
          listValue: {
            values: [CardStructValueType];
          };
        };
        quick_replies: {
          listValue: {
            values: [QuickReplyType];
          };
        };
      };
    };
  };
}
export interface QuickRepliesPayloadType {
  payload?: {
    stringValue: string;
  };
  text: {
    stringValue: string;
  };
  link?: {
    stringValue: string;
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

  const renderCards = (cards: [CardStructValueType]) =>
    cards.map(card => <Card key={uuidV4()} {...card.structValue.fields} />);

  const renderMessages = (messages: MessageDataType[]) =>
    messages.map(({ speaks, msg }) => {
      if (msg && msg.text && msg.text.text)
        return <Message key={uuidV4()} speaks={speaks} text={msg.text!.text} />;
      else if (msg && msg.payload?.fields.soaps) {
        return (
          <div
            key={uuidV4()}
            style={{ marginLeft: ".5rem", marginRight: ".5rem" }}
            className="card-panel grey lighten-5 z-depth-1 overflow-hidden"
          >
            <div className="col s2">
              <button className="btn-floating btn-large waves-effect waves-light red">
                {speaks}
              </button>
            </div>
            <div style={{ overflowX: "scroll" }}>
              <div
                className="cards-container"
                style={{
                  height: "auto",
                  width: msg.payload!.fields.soaps.listValue.values.length * 270
                }}
              >
                {renderCards(msg.payload!.fields.soaps.listValue.values)}
              </div>
            </div>
          </div>
        );
      } else if (
        msg &&
        msg.payload &&
        msg.payload.fields &&
        msg.payload.fields.quick_replies
      )
        return (
          <QuickReplies
            key={uuidV4()}
            replyClick={handleQuickReply}
            speaks={speaks}
            text={msg.payload!.fields.text}
            payload={msg.payload!.fields.quick_replies.listValue.values}
          />
        );
    });

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
    inputRef.current!.focus();
  }, []); //empty array means run effect on didmount only

  useEffect(() => {
    messagesEnd.current!.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // when messages updated, fire if!

  const handleQuickReply = async ({ e, payload, text }: ReplyClickArgsType) => {
    e.preventDefault();
    e.stopPropagation();
    await dfTextQuery(text);
  };

  return (
    <div className="chat-main d-flex flex-column">
      <nav>
        <div className="nav-wrapper">
          <a className="brand-logo">Chatbot</a>
        </div>
      </nav>
      <div className="chat-body">
        {renderMessages(messages)}
        <div ref={messagesEnd} />
      </div>
      <div className="col s12">
        <input
          style={{
            width: "98%",
            paddingLeft: "1%",
            paddingRight: "1%",
            marginBottom: 0
          }}
          ref={inputRef}
          type="text"
          placeholder="type a message"
          value={userSay}
          onChange={e => setUserSay(e.target.value)}
          onKeyPress={handleInputKeyPress}
        />
      </div>
    </div>
  );
};

export default Chatbot;
