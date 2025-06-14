
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Expand, Eye } from "lucide-react";
import { OrderStatus } from "@/types";
import CompactOrderCard from "@/components/CompactOrderCard";

interface OrderSectionProps {
  title: string;
  orders: any[];
  status: OrderStatus;
  actionLabel: string;
  onOrderExpand: (order: any) => void;
  onOrderAction: (orderId: string, status: OrderStatus) => void;
  onExpandStage: (status: OrderStatus) => void;
}

const OrderSection: React.FC<OrderSectionProps> = ({
  title,
  orders,
  status,
  actionLabel,
  onOrderExpand,
  onOrderAction,
  onExpandStage
}) => {
  const getSectionColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pendente':
        return 'border-t-amber-500 bg-amber-50';
      case 'Em Preparo':
        return 'border-t-blue-500 bg-blue-50';
      case 'Pronto':
        return 'border-t-green-500 bg-green-50';
      case 'Em Entrega':
        return 'border-t-purple-500 bg-purple-50';
      case 'Entregue':
        return 'border-t-gray-500 bg-gray-50';
      default:
        return 'border-t-gray-500 bg-gray-50';
    }
  };

  return (
    <div className={`flex-1 min-w-0 border-t-4 rounded-lg ${getSectionColor(status)} p-4`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Badge variant="outline" className="bg-white">
            {orders.length}
          </Badge>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onExpandStage(status)}
            className="p-1"
            title="Visualizar todos os pedidos"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {orders.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onExpandStage(status)}
              className="p-1"
              title="Expandir visualização"
            >
              <Expand className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
        {orders.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-gray-500">Nenhum pedido {title.toLowerCase()}</p>
          </div>
        ) : (
          orders.slice(0, 3).map(order => (
            <CompactOrderCard
              key={order.id}
              order={order}
              onExpand={() => onOrderExpand(order)}
              onNextAction={() => onOrderAction(order.id, order.status)}
              actionLabel={actionLabel}
            />
          ))
        )}
        {orders.length > 3 && (
          <div className="text-center text-sm text-gray-500 py-2">
            +{orders.length - 3} pedidos adicionais
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSection;
