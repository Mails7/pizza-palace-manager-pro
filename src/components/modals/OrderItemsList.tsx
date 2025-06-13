
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { OrderItem } from "@/types";

interface OrderItemsListProps {
  items: OrderItem[];
  onRemoveItem: (index: number) => void;
  onAddProduct: () => void;
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({
  items,
  onRemoveItem,
  onAddProduct,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div>
      <div className="flex justify-between mb-2">
        <p className="font-medium">Produtos</p>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddProduct}
        >
          Adicionar produto
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="p-4 text-center border border-dashed rounded-md">
          <p className="text-gray-500">Nenhum produto adicionado</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 border rounded-md"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {item.quantity}x {item.productName}
                  </span>
                  <Badge variant="outline">{item.size}</Badge>
                  {item.isHalfPizza && (
                    <Badge variant="secondary">Meia Pizza</Badge>
                  )}
                  {item.hasCrust !== undefined && (
                    <Badge variant="outline">
                      {item.hasCrust ? "Com Borda" : "Sem Borda"}
                    </Badge>
                  )}
                </div>
                {item.observations && (
                  <p className="text-sm text-gray-500">
                    Obs: {item.observations}
                  </p>
                )}
                <p className="text-sm">
                  {formatCurrency(item.unitPrice)} cada
                </p>
              </div>
              <div className="flex items-center">
                <p className="font-medium mr-2">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveItem(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderItemsList;
