
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Package } from "lucide-react";
import { OrderStatus } from "@/types";
import CompactOrderCard from "@/components/CompactOrderCard";

interface DeliveredOrdersSectionProps {
  orders: any[];
  onOrderExpand: (order: any) => void;
  onClose: () => void;
}

const DeliveredOrdersSection: React.FC<DeliveredOrdersSectionProps> = ({
  orders,
  onOrderExpand,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-4">
      <div className="w-full max-w-7xl h-[90vh] border-t-4 border-t-gray-500 bg-gray-50 rounded-lg p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-gray-600" />
            <h2 className="text-2xl font-bold">Pedidos Entregues</h2>
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
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Nenhum pedido entregue</p>
              </div>
            </div>
          ) : (
            orders.map(order => (
              <CompactOrderCard
                key={order.id}
                order={order}
                onExpand={() => onOrderExpand(order)}
                onNextAction={undefined}
                actionLabel=""
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveredOrdersSection;
