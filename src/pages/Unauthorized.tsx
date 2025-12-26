import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Acesso não autorizado</h1>
        <p className="text-gray-600 mb-6">
          Você não tem permissão para acessar esta página. Se acredita que isso é um erro, entre em contato com o administrador.
        </p>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
          >
            Voltar
          </Button>
          <Button 
            onClick={() => navigate('/')}
            className="w-full sm:w-auto"
          >
            Página Inicial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
