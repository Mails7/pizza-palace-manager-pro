
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NovoPedido = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para a página de pedidos
    navigate("/pedidos");
  }, [navigate]);

  return null;
};

export default NovoPedido;
