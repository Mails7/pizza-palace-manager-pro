
import React from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

interface ValidationMessageProps {
  type: 'error' | 'success' | 'warning';
  message: string;
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({ type, message }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`flex items-center gap-2 text-sm ${getTextColor()}`}>
      {getIcon()}
      <span>{message}</span>
    </div>
  );
};

export const validatePhone = (phone: string): { isValid: boolean; message: string } => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length < 10) {
    return { isValid: false, message: 'Telefone deve ter pelo menos 10 dígitos' };
  }
  
  if (cleaned.length > 11) {
    return { isValid: false, message: 'Telefone não pode ter mais de 11 dígitos' };
  }
  
  return { isValid: true, message: 'Telefone válido' };
};

export const validateEmail = (email: string): { isValid: boolean; message: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, message: 'Email é obrigatório' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Email inválido' };
  }
  
  return { isValid: true, message: 'Email válido' };
};

export const validateRequired = (value: string, fieldName: string): { isValid: boolean; message: string } => {
  if (!value || value.trim().length === 0) {
    return { isValid: false, message: `${fieldName} é obrigatório` };
  }
  
  return { isValid: true, message: `${fieldName} válido` };
};
