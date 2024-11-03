import React, { useEffect } from 'react';

const Alert = ({ message, type, onClose }) => {
  const alertStyles = {
    base: "fixed top-4 right-4 p-2 rounded-lg shadow-lg text-white text-sm max-w-sm transition-opacity duration-1",
    success: "bg-green-500",
    error: "bg-red-500",
  };

  useEffect(() => {
    const timer = setTimeout(onClose, 2000); // Fecha o alerta após 2 segundos
    return () => clearTimeout(timer); // Limpa o temporizador se o componente for desmontado
  }, [onClose]);

  return (
    <div className={`${alertStyles.base} ${alertStyles[type]}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-1 font-bold text-xl leading-none">&times;</button>
    </div>
  );
};

export default Alert;
