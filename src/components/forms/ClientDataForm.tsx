
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { ChefHat, Utensils, Heart } from 'lucide-react';

interface ClientData {
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface ClientDataFormProps {
  onSubmit: (data: ClientData) => void;
}

const ClientDataForm: React.FC<ClientDataFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ClientData>({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const [errors, setErrors] = useState<Partial<ClientData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ClientData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Formato: (00) 00000-0000';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      toast.success('Dados salvos com sucesso! Redirecionando para o cardápio...');
    } else {
      toast.error('Por favor, corrija os erros no formulário');
    }
  };

  const handleInputChange = (field: keyof ClientData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20">
          <ChefHat className="h-24 w-24 text-orange-300" />
        </div>
        <div className="absolute top-40 right-32">
          <Utensils className="h-20 w-20 text-red-300" />
        </div>
        <div className="absolute bottom-32 left-32">
          <Heart className="h-16 w-16 text-pink-300" />
        </div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-3xl p-8 shadow-2xl mb-6">
            <ChefHat className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Bem-vindo!</h1>
            <p className="text-orange-100 text-lg">
              Descubra sabores únicos em nosso cardápio especial
            </p>
          </div>
        </div>

        <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-8">
            <CardTitle className="text-2xl font-bold">Acesso ao Cardápio</CardTitle>
            <p className="text-orange-100 mt-2">
              Para uma experiência personalizada, precisamos de algumas informações
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-lg font-medium text-gray-700">Nome Completo *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`mt-2 h-12 text-lg rounded-xl border-2 ${errors.name ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'}`}
                  placeholder="Digite seu nome completo"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-2">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-lg font-medium text-gray-700">Telefone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                  className={`mt-2 h-12 text-lg rounded-xl border-2 ${errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'}`}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-2">{errors.phone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-lg font-medium text-gray-700">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`mt-2 h-12 text-lg rounded-xl border-2 ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'}`}
                  placeholder="seuemail@exemplo.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="address" className="text-lg font-medium text-gray-700">Endereço Completo *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`mt-2 text-lg rounded-xl border-2 ${errors.address ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'}`}
                  placeholder="Rua, número, bairro, cidade, CEP"
                  rows={3}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-2">{errors.address}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                Acessar Cardápio Exclusivo
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>✨ Seus dados são seguros e utilizados apenas para melhorar sua experiência</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDataForm;
