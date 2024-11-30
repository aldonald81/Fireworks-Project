import React from "react";
import "./LoadingSpinner.css"; // Import the CSS file

const colors = [
  "#ffe08c", // Pale yellow
  "#ffd469", // Bright yellow
  "#f39c12", // Orange-yellow
  "#e67e22", // Deep orange
  "#d35400", // Bright red-orange
  "#e74c3c", // Red-orange
  "#c0392b", // Deep red
  "#e67e22", // Deep orange
];

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      {colors.map((color, index) => (
        <div
          className="circle"
          style={{ transform: `rotate(${45 * index}deg)` }}
          key={index}
        >
          <div
            className="dot"
            style={{ backgroundColor: color, animationDelay: `${(index * 0.15)}s` }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
