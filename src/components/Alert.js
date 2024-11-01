import React from 'react';

const Alert = ({ message, type, onClose }) => {
  const alertStyles = {
    base: "fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white text-lg max-w-sm transition-opacity duration-300",
    success: "bg-green-500",
    error: "bg-red-500",
  };

  return (
    <div className={`${alertStyles.base} ${alertStyles[type]}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 font-bold text-xl leading-none">&times;</button>
    </div>
  );
};

export default Alert;
