
import React from "react";
import { Button } from "@/components/ui/button";

interface OrderFormActionsProps {
  onBack: () => void;
  onSubmit: () => void;
  isSubmitDisabled?: boolean;
}

const OrderFormActions: React.FC<OrderFormActionsProps> = ({
  onBack,
  onSubmit,
  isSubmitDisabled = false
}) => {
  return (
    <div className="flex gap-3 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        className="flex-1"
      >
        Voltar ao Cardápio
      </Button>
      <Button
        type="button"
        onClick={onSubmit}
        className="flex-1 bg-orange-500 hover:bg-orange-600"
        disabled={isSubmitDisabled}
      >
        Finalizar Pedido
      </Button>
    </div>
  );
};

export default OrderFormActions;
