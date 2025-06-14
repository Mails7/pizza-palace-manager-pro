
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { OrderStatus } from "@/types";
import CompactOrderCard from "./CompactOrderCard";

interface KitchenStageExpandedProps {
  title: string;
  orders: any[];
  status: OrderStatus;
  actionLabel: string;
  onClose: () => void;
  onOrderExpand: (order: any) => void;
  onOrderAction: (orderId: string, status: OrderStatus) => void;
}

const KitchenStageExpanded: React.FC<KitchenStageExpandedProps> = ({
  title,
  orders,
  status,
  actionLabel,
  onClose,
  onOrderExpand,
  onOrderAction
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className={`w-full max-w-7xl h-[90vh] border-t-4 rounded-lg ${getSectionColor(status)} p-6 bg-white`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">{title}</h2>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {orders.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-[calc(100%-80px)] overflow-y-auto">
          {orders.length === 0 ? (
            <div className="col-span-full flex items-center justify-center h-full">
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-500 text-lg">Nenhum pedido {title.toLowerCase()}</p>
              </div>
            </div>
          ) : (
            orders.map(order => (
              <CompactOrderCard
                key={order.id}
                order={order}
                onExpand={() => onOrderExpand(order)}
                onNextAction={() => onOrderAction(order.id, order.status)}
                actionLabel={actionLabel}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default KitchenStageExpanded;
