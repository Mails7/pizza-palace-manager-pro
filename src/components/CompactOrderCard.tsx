
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Expand, User, Check, Star } from "lucide-react";
import { OrderStatus } from "@/types";
import { useOrderProgress } from "@/hooks/useOrderProgress";

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
  // Usar hook de progresso em tempo real
  const progress = useOrderProgress({
    status: order.status,
    createdAt: order.createdAt || new Date()
  });

  const getStatusColors = (status: OrderStatus) => {
    switch (status) {
      case 'Pendente':
        return {
          bg: 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200',
          progress: 'bg-gradient-to-r from-amber-400 to-yellow-500',
          text: 'text-amber-800',
          icon: 'bg-gradient-to-r from-amber-500 to-yellow-500'
        };
      case 'Em Preparo':
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200',
          progress: 'bg-gradient-to-r from-blue-400 to-sky-500',
          text: 'text-blue-800',
          icon: 'bg-gradient-to-r from-blue-500 to-sky-500'
        };
      case 'Pronto':
        return {
          bg: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
          progress: 'bg-gradient-to-r from-green-400 to-emerald-500',
          text: 'text-green-800',
          icon: 'bg-gradient-to-r from-green-500 to-emerald-500'
        };
      case 'Em Entrega':
        return {
          bg: 'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200',
          progress: 'bg-gradient-to-r from-purple-400 to-violet-500',
          text: 'text-purple-800',
          icon: 'bg-gradient-to-r from-purple-500 to-violet-500'
        };
      case 'Entregue':
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200',
          progress: 'bg-gradient-to-r from-gray-400 to-slate-500',
          text: 'text-gray-800',
          icon: 'bg-gradient-to-r from-gray-500 to-slate-500'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200',
          progress: 'bg-gradient-to-r from-gray-400 to-slate-500',
          text: 'text-gray-800',
          icon: 'bg-gradient-to-r from-gray-500 to-slate-500'
        };
    }
  };

  const colors = getStatusColors(order.status);

  return (
    <Card className={`mb-4 transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 ${colors.bg}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${colors.icon} shadow-lg`}>
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                #{order.id}
              </CardTitle>
              <p className={`text-sm font-semibold ${colors.text}`}>
                {order.clientName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onExpand}
              className="h-8 w-8 p-0 hover:bg-white/50 transition-colors"
            >
              <Expand className="h-4 w-4" />
            </Button>
            {order.preparationTime && (
              <div className="flex items-center text-xs text-gray-600 bg-white/70 px-2 py-1 rounded-full">
                <Clock className="h-3 w-3 mr-1" />
                {order.preparationTime}min
              </div>
            )}
          </div>
        </div>
        <div className={`w-full bg-white/30 rounded-full h-3 mt-3 overflow-hidden shadow-inner`}>
          <div
            className={`h-full transition-all duration-500 ${colors.progress} rounded-full shadow-sm`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between bg-white/70 p-2 rounded-lg">
            <div className="text-sm text-gray-700 font-medium">
              {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-green-600">
              <Star className="h-3 w-3 text-yellow-500" />
              R$ {order.total.toFixed(2)}
            </div>
          </div>
        </div>

        {order.status === 'Em Entrega' && (
          <Button
            onClick={onNextAction}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transition-all duration-200"
            size="sm"
          >
            <Check className="h-4 w-4 mr-1" />
            Marcar como Entregue
          </Button>
        )}

        {order.status !== 'Entregue' && order.status !== 'Em Entrega' && (
          <Button
            onClick={onNextAction}
            className="w-full bg-gradient-to-r from-pizza to-pizza-dark hover:from-pizza-dark hover:to-pizza text-white shadow-lg transition-all duration-200"
            size="sm"
          >
            {actionLabel}
          </Button>
        )}

        {order.status === 'Entregue' && (
          <Button
            variant="outline"
            className="w-full bg-white/80 border-2 border-gray-300 text-gray-600"
            size="sm"
            disabled
          >
            ✅ Finalizado
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CompactOrderCard;
