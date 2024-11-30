import React from "react";
import "./ChatContainer.css";

const ChatContainer = () => {
  return (
    <div className="options-container">
      <div className="option">
        <span className="option-icon">📄</span>
        Research the latest news
      </div>
      <div className="option">
        <span className="option-icon">💬</span>
        Ask questions about your portfolio
      </div>
      <div className="option">
        <span className="option-icon">💡</span>
        Suggestions to improve your portfolio
      </div>
      <div className="chat-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Chat with your portfolio"
        />
      </div>
    </div>
  );
};

export default ChatContainer;
