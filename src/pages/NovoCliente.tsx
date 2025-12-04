
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowDown, User, Sparkles, Star, Heart } from "lucide-react";
import NewClientForm from "@/components/forms/NewClientForm";
import { toast } from "@/hooks/use-toast";

const NovoCliente = () => {
  const navigate = useNavigate();

  const handleClientSuccess = (client: any) => {
    toast({
      title: "🎉 Cliente criado com sucesso!",
      description: `${client.name} foi adicionado ao sistema com muito carinho.`,
    });
    navigate("/clientes");
  };

  const handleCancel = () => {
    navigate("/clientes");
  };

  return (
    <div className="p-6 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-20 animate-pulse delay-2000"></div>

      <div className="relative z-10">
        <div className="flex items-center mb-6">
          <Link to="/clientes" className="text-gray-500 hover:text-pizza transition-colors mr-2 hover:scale-105 transform duration-200">
            Clientes
          </Link>
          <ArrowDown className="h-4 w-4 text-gray-400 mx-2 rotate-90" />
          <span className="font-medium bg-gradient-to-r from-pizza to-pizza-dark bg-clip-text text-transparent">
            ✨ Novo Cliente
          </span>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-pizza to-pizza-dark rounded-full shadow-xl animate-pulse">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              Novo Cliente
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="h-4 w-4 text-yellow-500 animate-spin" />
              <span>Adicione um novo cliente ao sistema</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20 max-w-2xl relative">
          {/* Borda colorida animada */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-3xl opacity-20 animate-pulse"></div>
          <div className="absolute inset-1 bg-white rounded-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-purple-700 font-medium">Formulário de Cadastro</span>
              <Star className="h-5 w-5 text-yellow-500" />
            </div>

            <NewClientForm
              onSubmitSuccess={handleClientSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovoCliente;
