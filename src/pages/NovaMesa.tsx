
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";

const NovaMesa = () => {
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link to="/mesas" className="text-gray-500 mr-2">
          Mesas
        </Link>
        <ArrowDown className="h-4 w-4 text-gray-400 mx-2 rotate-90" />
        <span className="font-medium">Nova Mesa</span>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Nova Mesa</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-center py-8">Funcionalidade em desenvolvimento</p>
        <div className="flex justify-center">
          <Button asChild>
            <Link to="/mesas">Voltar para Mesas</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NovaMesa;
