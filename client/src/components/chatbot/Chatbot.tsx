import React, { useState, useEffect, useRef, useCallback } from "react";
import uuidV4 from "uuid/v4";
import axios from "axios";
import Cookies from "universal-cookie";
import { History } from "history";
import { withRouter } from "react-router-dom";

import Message from "./Message";
import Card from "./Card";
import QuickReplies from "./QuickReplies";
import { QuickReplyType } from "./QuickReply";
import { ReplyClickArgsType } from "./QuickReplies";
import { RouteComponentProps } from "react-router";

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
        courses: {
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

interface ChatbotPropsType extends RouteComponentProps {}

const Chatbot: React.FC<ChatbotPropsType> = ({ history }) => {
  const userId = cookies.get("userId");
  if (userId === undefined) cookies.set("userId", uuidV4(), { path: "/" });

  const [messages, setMessages] = useState<MessageDataType[]>([]);
  const [userSay, setUserSay] = useState("");
  const [showChatbot, setShowChatbot] = useState(true);
  const [shopWelcomeSent, setShopWelcomeSent] = useState(false);

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

  const dfEventQuery = useCallback(
    async (event: string) => {
      const {
        data: { result }
      } = await axios.post("/api/df_event_query", { event, userId });
      for (let msg of result.fulfillmentMessages) {
        const botSay: MessageDataType = { speaks: "bot", msg };
        setMessages(oldMessages => [...oldMessages, botSay]);
      }
    },
    [userId]
  );

  const renderCards = (cards: [CardStructValueType]) =>
    cards.map(card => <Card key={uuidV4()} {...card.structValue.fields} />);

  const renderMessages = (messages: MessageDataType[]) =>
    messages.map(({ speaks, msg }) => {
      if (msg && msg.text && msg.text.text)
        return <Message key={uuidV4()} speaks={speaks} text={msg.text!.text} />;
      else if (msg && msg.payload?.fields.courses) {
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
                  width:
                    msg.payload!.fields.courses.listValue.values.length * 270
                }}
              >
                {renderCards(msg.payload!.fields.courses.listValue.values)}
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
      else return null;
    });

  const handleInputKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      await dfTextQuery(userSay);
      setUserSay("");
    }
  };
  const messagesEnd = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const resolveInXSeconds = (x: number) =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve(x);
      }, x * 1000);
    });
  useEffect(() => {
    dfEventQuery("Welcome");
    if (inputRef.current) inputRef.current.focus();
    const sendShopWelcome = async () => {
      await resolveInXSeconds(1);
      dfEventQuery("WELCOME_SHOP");
      setShopWelcomeSent(true);
      setShowChatbot(true);
    };
    if (window.location.pathname === "/shop" && !shopWelcomeSent) {
      sendShopWelcome();
    }
    history.listen(() => {
      if (history.location.pathname === "/shop" && !shopWelcomeSent) {
        sendShopWelcome();
      }
    });
  }, [shopWelcomeSent, history, dfEventQuery]);

  useEffect(() => {
    if (messagesEnd.current)
      messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // when messages updated, fire if!

  const handleQuickReply = ({ e, payload, text }: ReplyClickArgsType) => {
    e.preventDefault();
    e.stopPropagation();
    switch (payload) {
      case "recommended_yes":
        dfEventQuery("SHOW_RECOMMENDATIONS");
        break;
      case "training_masterclass":
        dfEventQuery("MASTERCLASS");
        break;
      default:
        dfTextQuery(text);
        break;
    }
  };

  return (
    <div className="chat-main d-flex flex-column">
      <nav className="chat-nav" onClick={() => setShowChatbot(!showChatbot)}>
        <div className="nav-wrapper">
          <div className="brand-logo" style={{ paddingLeft: "0.5rem" }}>
            Chatbot
          </div>
        </div>
      </nav>
      {showChatbot && (
        <>
          <div className="chat-body">
            {renderMessages(messages)}
            <div ref={messagesEnd} />
          </div>
          <div className="col s12">
            <input
              className="chat-input"
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
        </>
      )}
    </div>
  );
};

export default withRouter(Chatbot);
