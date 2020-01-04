import React from "react";
import { ReplyClickArgsType } from "./QuickReplies";

export interface QuickReplyType {
  structValue: {
    fields: {
      text: {
        stringValue: string;
      };
      link: {
        stringValue: string;
      };
      payload: {
        stringValue: string;
      };
    };
  };
}

export interface QuickReplyProps {
  reply: QuickReplyType;
  click: ({ e, payload, text }: ReplyClickArgsType) => void;
}

const QuickReply: React.FC<QuickReplyProps> = ({ reply, click }) => {
  if (reply.structValue.fields.payload)
    return (
      <button
        onClick={e => {
          click({
            e,
            payload: reply.structValue.fields.payload.stringValue,
            text: reply.structValue.fields.text.stringValue
          });
        }}
        className="btn-floating btn-large waves-effect waves-light red"
      >
        {reply.structValue.fields.text.stringValue}
      </button>
    );
  else
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={reply.structValue.fields.link.stringValue}
        className="btn-floating btn-large waves-effect waves-light red"
      >
        ss
        {reply.structValue.fields.text.stringValue}
      </a>
    );
};

export default QuickReply;
