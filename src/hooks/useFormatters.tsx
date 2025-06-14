
export const useFormatters = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    
    return phone;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const calculateEstimatedTime = (items: any[], priority: string = 'Média') => {
    let baseTime = items.reduce((total, item) => {
      const itemTime = item.preparationTime || 15; // tempo base de 15 min
      return total + (itemTime * item.quantity);
    }, 0);

    // Ajuste baseado na prioridade
    switch (priority) {
      case 'Alta':
        baseTime *= 0.8;
        break;
      case 'Baixa':
        baseTime *= 1.2;
        break;
      default:
        break;
    }

    return Math.ceil(baseTime);
  };

  return {
    formatCurrency,
    formatPhone,
    formatDate,
    formatTime,
    calculateEstimatedTime
  };
};
