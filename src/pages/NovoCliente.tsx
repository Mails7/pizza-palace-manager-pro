
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowDown, User, Sparkles } from "lucide-react";
import NewClientForm from "@/components/forms/NewClientForm";
import { toast } from "@/hooks/use-toast";

const NovoCliente = () => {
  const navigate = useNavigate();

  const handleClientSuccess = (client: any) => {
    toast({
      title: "Cliente criado com sucesso!",
      description: `${client.name} foi adicionado ao sistema.`,
    });
    navigate("/clientes");
  };

  const handleCancel = () => {
    navigate("/clientes");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="flex items-center mb-6">
        <Link to="/clientes" className="text-gray-500 hover:text-pizza transition-colors mr-2">
          Clientes
        </Link>
        <ArrowDown className="h-4 w-4 text-gray-400 mx-2 rotate-90" />
        <span className="font-medium bg-gradient-to-r from-pizza to-pizza-dark bg-clip-text text-transparent">
          Novo Cliente
        </span>
      </div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-pizza to-pizza-dark rounded-full shadow-lg">
          <User className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            Novo Cliente
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span>Adicione um novo cliente ao sistema</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 max-w-2xl">
        <NewClientForm 
          onSubmitSuccess={handleClientSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default NovoCliente;
