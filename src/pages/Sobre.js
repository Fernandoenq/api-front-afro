import React from 'react';

const Sobre = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Sobre Nós</h1>
      <p className="text-center max-w-md mb-4">
        Bem-vindo à nossa aplicação! Este é um exemplo de página com texto e uma imagem.
      </p>
      <img src="https://via.placeholder.com/300" alt="Exemplo" className="rounded mb-4" />
    </div>
  );
};

export default Sobre;
