import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isValidCPF, formatPhoneNumber } from '../utils/validators';
import Alert from '../components/Alert';
import logo from '../assets/logo.png';

const Cadastro = () => {
  const location = useLocation();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    cpf: '',
    birthDate: '',
    termsAccepted: false,
  });

  const [whatsappError, setWhatsappError] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [numbersFromUrl, setNumbersFromUrl] = useState([]);
  const [uuid, setUuid] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });

  useEffect(() => {
    const pathSegments = location.pathname.split('/').slice(2);

    // Extrai o UUID como o primeiro segmento e salva no localStorage
    const extractedUuid = pathSegments[0];
    localStorage.setItem('cadastroUUID', extractedUuid);
    setUuid(extractedUuid);

    // Extrai os números após o UUID
    const numbers = pathSegments.slice(1).map(segment => parseInt(segment, 10)).filter(num => !isNaN(num));
    localStorage.setItem('cadastroNumbers', JSON.stringify(numbers));
    setNumbersFromUrl(numbers);
  }, [location]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'whatsapp') {
      const formattedValue = formatPhoneNumber(value);
      setWhatsappError(formattedValue.length === 15 ? '' : 'O WhatsApp deve incluir DDD + 9 dígitos.');
      setFormData({
        ...formData,
        [name]: formattedValue,
      });
    } else if (name === 'cpf') {
      const rawValue = value.replace(/\D/g, '');

      if (rawValue.length === 11 && isValidCPF(rawValue)) {
        setCpfError('');
        const formattedCPF = `${rawValue.slice(0, 3)}.${rawValue.slice(3, 6)}.${rawValue.slice(6, 9)}-${rawValue.slice(9)}`;
        setFormData({
          ...formData,
          [name]: formattedCPF,
        });
      } else {
        setCpfError('CPF inválido. Por favor, insira um CPF válido.');
        setFormData({
          ...formData,
          [name]: rawValue,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (whatsappError || cpfError) {
      setAlert({
        message: 'Por favor, corrija os erros antes de enviar.',
        type: 'error',
      });
      return;
    }
  
    // Obter a data atual e formatá-la como "YYYY-MM-DD"
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
  
    // Dados a serem enviados para a API
    const dataToSend = {
      RegisterDate: formattedDate,
      PersonName: formData.nome,
      Cpf: formData.cpf.replace(/\D/g, ''), // Remove a formatação do CPF
      Phone: "55" + formData.whatsapp.replace(/\D/g, ''), // Remove a formatação do telefone
      BirthDate: formData.birthDate,
      Mail: formData.email,
      HasAcceptedParticipation: formData.termsAccepted,
      ImageIds: numbersFromUrl.map((num) => `${num}.png`),
      AuthenticationId: uuid,
      HasAcceptedPromotion: true
    };
  
    // Exibe no console como a API receberia os dados
    console.log("Dados a serem enviados para a API:", dataToSend);
  
    // Comentando a chamada para a API, pois ainda não existe
    
    try {
      const response = await fetch('http://3.133.92.17:3335/Person/Person', {
        method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataToSend),
  });

  if (response.ok) {
    setAlert({
      message: 'Cadastro enviado com sucesso!',
      type: 'success',
    });
  } else if (response.status === 422) {
    // Tenta extrair a mensagem de erro do JSON
    const errorData = await response.json();
    const errorMessage = errorData.Errors ? errorData.Errors.join(', ') : 'Erro desconhecido';

    setAlert({
      message: `Erro ao enviar o cadastro: ${errorMessage}`,
      type: 'error',
    });
  } else {
    setAlert({
      message: 'Erro ao enviar o cadastro. Por favor, tente novamente.',
      type: 'error',
    });
  }
} catch (error) {
  setAlert({
    message: `Erro de rede: ${error.message}`,
    type: 'error',
  });
}
    
  };
  
  

  const closeAlert = () => setAlert({ message: '', type: '' });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-4">
      {/* Logo fora do container do formulário */}
      <div className="flex justify-center mb-8 mt-0">
        <img src={logo} alt="Logo" className="h-20 w-auto mt-4" />
      </div>

      {/* Container do formulário */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Cadastro</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full border border-gray-300 bg-gray-100 text-gray-800 p-4 rounded-lg text-lg placeholder-gray-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 bg-gray-100 text-gray-800 p-4 rounded-lg text-lg placeholder-gray-500"
            required
          />
          <input
            type="text"
            name="whatsapp"
            placeholder="WhatsApp (DDD + número)"
            value={formData.whatsapp}
            onChange={handleChange}
            className="w-full border border-gray-300 bg-gray-100 text-gray-800 p-4 rounded-lg text-lg placeholder-gray-500"
            required
          />
          {whatsappError && <p className="text-red-500 text-sm">{whatsappError}</p>}

          <input
            type="text"
            name="cpf"
            placeholder="CPF (XXX.XXX.XXX-XX)"
            value={formData.cpf}
            onChange={handleChange}
            className="w-full border border-gray-300 bg-gray-100 text-gray-800 p-4 rounded-lg text-lg placeholder-gray-500"
            required
          />
          {cpfError && <p className="text-red-500 text-sm">{cpfError}</p>}

          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className="w-full border border-gray-300 bg-gray-100 text-gray-800 p-4 rounded-lg text-lg placeholder-gray-500"
            required
          />

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="w-16 h-16 mr-2 bg-gray-700 border-gray-600 text-blue-500 focus:ring-0 focus:ring-offset-0"
              required
            />
            <label className="text-left text-gray-700 text-sm">
              Concordo com a coleta e uso dos meus dados pessoais pela Afro Punk para comunicação e marketing, conforme a <a href="/termos" className="text-blue-500 underline">Política de Privacidade</a>.
            </label>
          </div>
          
          <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-lg text-lg font-bold hover:bg-blue-700 transition duration-300">
            Enviar
          </button>
        </form>
        
        {alert.message && (
          <Alert message={alert.message} type={alert.type} onClose={closeAlert} />
        )}
      </div>
    </div>
  );
};

export default Cadastro;
