import React from "react";
import QuickReply, { QuickReplyType } from "./QuickReply";
import uuidV4 from "uuid/v4";

export interface ReplyClickArgsType {
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>;
  payload: string;
  text: string;
}

interface QuickRepliesProps {
  speaks: string;
  text: {
    stringValue: string;
  };
  replyClick: ({ e, payload, text }: ReplyClickArgsType) => void;
  payload: QuickReplyType[];
}

const QuickReplies: React.FC<QuickRepliesProps> = ({
  speaks,
  text,
  replyClick,
  payload
}) => {
  const handleClick = async ({ e, payload, text }: ReplyClickArgsType) => {
    await replyClick({ e, payload, text });
  };
  const renderQuickReplies = (replies: QuickReplyType[]) =>
    replies.map(reply => (
      <QuickReply key={uuidV4()} reply={reply} click={handleClick} />
    ));
  return (
    <div className="col s12 m8 offset-m2 l6 offset-l3">
      <div className="card-panel grey lighten-5 z-depth-1">
        <div className="row valign-wrapper">
          <div className="col s2">
            <button className="btn-floating btn-large waves-effect waves-light red">
              {speaks}
            </button>
          </div>
          <div className="col s-10">
            <p>{text.stringValue}</p>
          </div>
          {renderQuickReplies(payload)}
        </div>
      </div>
    </div>
  );
};

export default QuickReplies;
