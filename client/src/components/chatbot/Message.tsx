import React from "react";

export interface MessageType {
  speaks: string;
  text: string;
}

const Message: React.FC<MessageType> = ({ speaks, text }) => {
  return (
    <div className="col s12 m8 offset-m2 offset-l3">
      <div className="card-panel grey lighten-5 z-depth-1">
        <div className="row valign-wrapper">
          {speaks === "bot" && (
            <div className="col s2">
              <button className="btn-floating btn-large waves-effect waves-light red">
                {speaks}
              </button>
            </div>
          )}
          <div className="col s10">
            <span className="black-text">{text}</span>
          </div>
          {speaks === "me" && (
            <div className="col s2">
              <button className="btn-floating btn-large waves-effect waves-light red">
                {speaks}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
