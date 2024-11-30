import React from "react";
import "./VooContainer.css";

const VooContainer = () => {
  return (
    <div className="voo-container">
      {Array(5).fill(null).map((_, index) => (
        <div className="voo-card" key={index}>
          <div className="voo-title">VOO</div>
          <div className="voo-price">$X</div>
          <div className="voo-change">+55%</div>
          <div className="voo-icon">📈</div>
        </div>
      ))}
    </div>
  );
};

export default VooContainer;
