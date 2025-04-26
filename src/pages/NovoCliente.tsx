
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";

const NovoCliente = () => {
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
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-center py-8">Funcionalidade em desenvolvimento</p>
        <div className="flex justify-center">
          <Button asChild>
            <Link to="/clientes">Voltar para Clientes</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NovoCliente;
