
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, X, User, Phone, MapPin } from "lucide-react";
import { OrderStatus } from "@/types";

interface ExpandedOrderCardProps {
  order: any;
  onClose: () => void;
  onNextAction: () => void;
  actionLabel: string;
}

const ExpandedOrderCard: React.FC<ExpandedOrderCardProps> = ({
  order,
  onClose,
  onNextAction,
  actionLabel
}) => {
  const calculateProgress = (status: OrderStatus) => {
    switch (status) {
      case 'Pendente':
        return 20;
      case 'Em Preparo':
        return 40;
      case 'Pronto':
        return 60;
      case 'Em Entrega':
        return 80;
      case 'Entregue':
        return 100;
      default:
        return 0;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pendente':
        return 'from-amber-400 to-orange-500';
      case 'Em Preparo':
        return 'from-blue-400 to-blue-600';
      case 'Pronto':
        return 'from-green-400 to-green-600';
      case 'Em Entrega':
        return 'from-purple-400 to-purple-600';
      case 'Entregue':
        return 'from-gray-400 to-gray-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className={`bg-gradient-to-r ${getStatusColor(order.status)} text-white`}>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">Pedido #{order.id}</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{order.clientName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{order.phone}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {order.preparationTime && (
            <div className="flex items-center gap-2 mt-2">
              <Clock className="h-4 w-4" />
              <span>Tempo de preparo: {order.preparationTime} min</span>
            </div>
          )}
          <Progress 
            value={calculateProgress(order.status)} 
            className="h-3 mt-3 bg-white/20" 
          />
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-3">Itens do Pedido</h3>
              <div className="space-y-3">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col">
                        <span className="font-medium text-lg">
                          {item.quantity}x {item.productName}
                        </span>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">Tamanho: {item.size}</Badge>
                          {item.isHalfPizza && (
                            <Badge variant="secondary">Meia Pizza</Badge>
                          )}
                          {item.hasCrust !== undefined && (
                            <Badge variant="outline">
                              {item.hasCrust ? "Com Borda" : "Sem Borda"}
                            </Badge>
                          )}
                        </div>
                        {item.halfPizzaFlavors && (
                          <div className="text-sm text-gray-600 mt-1">
                            Sabores: {item.halfPizzaFlavors.flavor1} / {item.halfPizzaFlavors.flavor2}
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-green-600">
                        R$ {(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    {item.observations && (
                      <div className="text-sm text-gray-700 bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                        <strong>Observações:</strong> {item.observations}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {order.address && (
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço de Entrega
                </h3>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p>{order.address}</p>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span className="text-green-600">R$ {order.total.toFixed(2)}</span>
              </div>
            </div>

            {order.status !== 'Entregue' && (
              <Button 
                onClick={onNextAction}
                className="w-full mt-4"
                size="lg"
              >
                {actionLabel}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpandedOrderCard;
