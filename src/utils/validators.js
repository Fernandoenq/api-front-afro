// Validação de CPF
export const isValidCPF = (cpf) => {
    const cleanedCpf = cpf.replace(/\D/g, '');
  
    if (cleanedCpf.length !== 11 || /^(\d)\1+$/.test(cleanedCpf)) return false;
  
    let sum = 0;
    let remainder;
  
    // Primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleanedCpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanedCpf.substring(9, 10))) return false;
  
    // Segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleanedCpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanedCpf.substring(10, 11))) return false;
  
    return true;
  };
  
  // Formatação de número de telefone (WhatsApp)
  export const formatPhoneNumber = (phone) => {
    const rawValue = phone.replace(/\D/g, '');
    if (rawValue.length === 11) {
      return `(${rawValue.slice(0, 2)}) ${rawValue.slice(2, 7)}-${rawValue.slice(7)}`;
    }
    return rawValue; // Retorna sem formatação se não tiver 11 dígitos
  };
  

  export const isValidBirthDate = (date) => {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = date.match(dateRegex);
  
    if (!match) return false;
  
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // Mês é zero-indexado no JavaScript
    const year = parseInt(match[3], 10);
  
    const parsedDate = new Date(year, month, day);
    const isValidDate =
      parsedDate.getFullYear() === year &&
      parsedDate.getMonth() === month &&
      parsedDate.getDate() === day;
  
    const currentYear = new Date().getFullYear();
    if (year > currentYear || year < 1900) {
      return false;
    }
  
    return isValidDate;
  };