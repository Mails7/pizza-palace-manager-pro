
import React from "react";
import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
  total: number;
  onCancel: () => void;
  onSubmit: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  total,
  onCancel,
  onSubmit,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="flex justify-between items-center border-t pt-4">
      <p className="font-bold">Total: {formatCurrency(total)}</p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onSubmit}>Salvar Pedido</Button>
      </div>
    </div>
  );
};

export default OrderSummary;
