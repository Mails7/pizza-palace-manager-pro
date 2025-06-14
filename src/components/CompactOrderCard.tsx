
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Expand, User, Check } from "lucide-react";
import { OrderStatus } from "@/types";

interface CompactOrderCardProps {
  order: any;
  onExpand: () => void;
  onNextAction: () => void;
  actionLabel: string;
}

const CompactOrderCard: React.FC<CompactOrderCardProps> = ({
  order,
  onExpand,
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

  const getStatusColors = (status: OrderStatus) => {
    switch (status) {
      case 'Pendente':
        return {
          bg: 'bg-amber-50 border-amber-200',
          progress: 'bg-amber-500',
          text: 'text-amber-800'
        };
      case 'Em Preparo':
        return {
          bg: 'bg-blue-50 border-blue-200',
          progress: 'bg-blue-500',
          text: 'text-blue-800'
        };
      case 'Pronto':
        return {
          bg: 'bg-green-50 border-green-200',
          progress: 'bg-green-500',
          text: 'text-green-800'
        };
      case 'Em Entrega':
        return {
          bg: 'bg-purple-50 border-purple-200',
          progress: 'bg-purple-500',
          text: 'text-purple-800'
        };
      case 'Entregue':
        return {
          bg: 'bg-gray-50 border-gray-200',
          progress: 'bg-gray-500',
          text: 'text-gray-800'
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          progress: 'bg-gray-500',
          text: 'text-gray-800'
        };
    }
  };

  const colors = getStatusColors(order.status);

  return (
    <Card className={`mb-4 transition-all hover:shadow-md ${colors.bg}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-4 w-4" />
              #{order.id}
            </CardTitle>
            <p className={`text-sm font-medium ${colors.text}`}>
              {order.clientName}
            </p>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onExpand}
              className="h-8 w-8 p-0"
            >
              <Expand className="h-4 w-4" />
            </Button>
            {order.preparationTime && (
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {order.preparationTime}min
              </div>
            )}
          </div>
        </div>
        <Progress 
          value={calculateProgress(order.status)} 
          className="h-2 mt-2"
        />
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-1 mb-3">
          <div className="text-sm text-gray-600">
            {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
          </div>
          <div className="text-sm font-semibold text-green-600">
            R$ {order.total.toFixed(2)}
          </div>
        </div>
        
        {order.status === 'Em Entrega' && (
          <Button 
            onClick={onNextAction}
            className="w-full bg-green-600 hover:bg-green-700"
            size="sm"
          >
            <Check className="h-4 w-4 mr-1" />
            Marcar como Entregue
          </Button>
        )}
        
        {order.status !== 'Entregue' && order.status !== 'Em Entrega' && (
          <Button 
            onClick={onNextAction}
            className="w-full"
            size="sm"
          >
            {actionLabel}
          </Button>
        )}
        
        {order.status === 'Entregue' && (
          <Button 
            variant="outline"
            className="w-full"
            size="sm"
            disabled
          >
            Finalizado
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CompactOrderCard;
