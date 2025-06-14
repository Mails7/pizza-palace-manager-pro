
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowDown } from "lucide-react";
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
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link to="/clientes" className="text-gray-500 mr-2">
          Clientes
        </Link>
        <ArrowDown className="h-4 w-4 text-gray-400 mx-2 rotate-90" />
        <span className="font-medium">Novo Cliente</span>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Novo Cliente</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl">
        <NewClientForm 
          onSubmitSuccess={handleClientSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default NovoCliente;
