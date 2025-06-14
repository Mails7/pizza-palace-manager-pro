
import React from "react";
import { Button } from "@/components/ui/button";

interface ProductSelectionActionsProps {
  onBack: () => void;
  onAddToOrder: () => void;
  selectedSize: string;
}

const ProductSelectionActions: React.FC<ProductSelectionActionsProps> = ({
  onBack,
  onAddToOrder,
  selectedSize,
}) => {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onBack}>
        Voltar
      </Button>
      <Button onClick={onAddToOrder} disabled={!selectedSize}>
        Adicionar ao Pedido
      </Button>
    </div>
  );
};

export default ProductSelectionActions;
