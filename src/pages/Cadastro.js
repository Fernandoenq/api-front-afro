import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isValidCPF, formatPhoneNumber, isValidBirthDate } from '../utils/validators';
import Alert from '../components/Alert';
import logo from '../assets/logo.png';
import '../estilos/Cadastro.css';

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
  const [birthDateError, setBirthDateError] = useState('');
  const [numbersFromUrl, setNumbersFromUrl] = useState([]);
  const [uuid, setUuid] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const pathSegments = location.pathname.split('/').slice(2);
    const extractedUuid = pathSegments[0];
    localStorage.setItem('cadastroUUID', extractedUuid);
    setUuid(extractedUuid);

    const numbers = pathSegments.slice(1).map(segment => parseInt(segment, 10)).filter(num => !isNaN(num));
    localStorage.setItem('cadastroNumbers', JSON.stringify(numbers));
    setNumbersFromUrl(numbers);
  }, [location]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'birthDate') {
      let formattedValue = value.replace(/\D/g, '');

      if (formattedValue.length >= 5) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}/${formattedValue.slice(4, 8)}`;
      } else if (formattedValue.length >= 3) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`;
      }

      setFormData({
        ...formData,
        [name]: formattedValue,
      });
    } else if (name === 'whatsapp') {
      setFormData({
        ...formData,
        [name]: formatPhoneNumber(value),
      });
    } else if (name === 'cpf') {
      const rawValue = value.replace(/\D/g, '');
      const formattedCPF = rawValue
        .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        .slice(0, 14);
      setFormData({
        ...formData,
        [name]: formattedCPF,
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleWhatsappBlur = () => {
    const rawValue = formData.whatsapp.replace(/\D/g, '');
    if (rawValue.length === 0) {
      setWhatsappError('');
    } else if (rawValue.length !== 11) {
      setWhatsappError('O WhatsApp deve incluir DDD + 9 dígitos.');
    } else {
      setWhatsappError('');
    }
  };

  const handleCpfBlur = () => {
    const rawValue = formData.cpf.replace(/\D/g, '');
    if (rawValue.length === 11 && isValidCPF(rawValue)) {
      setCpfError('');
    } else if (rawValue.length > 0) {
      setCpfError('CPF inválido. Por favor, insira um CPF válido.');
    } else {
      setCpfError('');
    }
  };

  const handleBirthDateBlur = () => {
    if (formData.birthDate.trim() === '') {
      setBirthDateError('');
      return;
    }
  
    if (!isValidBirthDate(formData.birthDate)) {
      setBirthDateError('Data de nascimento inválida. Por favor, insira uma data válida.');
    } else {
      setBirthDateError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    handleWhatsappBlur();
    handleCpfBlur();
    handleBirthDateBlur();

    if (whatsappError || cpfError || birthDateError) {
      setAlert({
        message: 'Por favor, corrija os erros antes de enviar.',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://52.67.171.76:3335/Person/Person', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          RegisterDate: new Date().toISOString().split('T')[0],
          PersonName: formData.nome,
          Cpf: formData.cpf.replace(/\D/g, ''),
          Phone: "55" + formData.whatsapp.replace(/\D/g, ''),
          BirthDate: formData.birthDate,
          Mail: formData.email,
          HasAcceptedParticipation: formData.termsAccepted,
          ImageIds: numbersFromUrl.map((num) => `${num}.png`),
          AuthenticationId: uuid,
          HasAcceptedPromotion: true
        }),
      });

      if (response.ok) {
        setAlert({
          message: 'Cadastro enviado com sucesso!',
          type: 'success',
        });
      } else if (response.status === 422) {
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
    } finally {
      setIsLoading(false);
    }
  };

  const closeAlert = () => setAlert({ message: '', type: '' });

  return (
    <div className="container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo-image" />
      </div>

      <div className="form-container">
        <h1 className="form-title">Cadastro</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={formData.nome}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="text"
            name="whatsapp"
            placeholder="WhatsApp (DDD + número)"
            value={formData.whatsapp}
            onChange={handleChange}
            onBlur={handleWhatsappBlur}
            className="input-field"
            required
          />
          {whatsappError && <p className="error-message">{whatsappError}</p>}
  
          <input
            type="text"
            name="cpf"
            placeholder="CPF (XXX.XXX.XXX-XX)"
            value={formData.cpf}
            onChange={handleChange}
            onBlur={handleCpfBlur}
            className="input-field"
            required
          />
          {cpfError && <p className="error-message">{cpfError}</p>}
  
          <input
            type="text"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            onBlur={handleBirthDateBlur}
            placeholder="dd/mm/aaaa"
            className="input-field"
            required
          />
          {birthDateError && <p className="error-message">{birthDateError}</p>}

          <div className="checkbox-container">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="checkbox-input"
              required
            />
            <label className="checkbox-label">
              Concordo com a coleta e uso dos meus dados pessoais pela Afro Punk para comunicação e marketing, conforme a <a href="/termos" className="terms-link">Política de Privacidade</a>.
            </label>
          </div>
          
          <button type="submit" className="submit-button">
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
