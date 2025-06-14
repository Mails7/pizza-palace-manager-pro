
import { useState, useEffect } from "react";
import { OrderStatus } from "@/types";
import useSound from "use-sound";

interface UseKitchenOrdersProps {
  kitchenOrders: any;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const useKitchenOrders = ({
  kitchenOrders,
  updateOrderStatus
}: UseKitchenOrdersProps) => {
  const [expandedOrder, setExpandedOrder] = useState<any>(null);
  const [expandedStage, setExpandedStage] = useState<OrderStatus | null>(null);
  
  // Carregando som de notificação
  const [playNewOrder] = useSound("/notification-sound.mp3", { volume: 0.5 });

  // Tocar som quando chegar um novo pedido
  useEffect(() => {
    const pendingCount = kitchenOrders.pending.length;
    if (pendingCount > 0) {
      playNewOrder();
    }
  }, [kitchenOrders.pending.length, playNewOrder]);

  const moveToNextStatus = (orderId: string, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus;
    
    switch (currentStatus) {
      case 'Pendente':
        // Pedidos pendentes não precisam mais de ação manual
        return;
      case 'Em Preparo':
        nextStatus = 'Pronto';
        break;
      case 'Pronto':
        nextStatus = 'Em Entrega';
        break;
      case 'Em Entrega':
        nextStatus = 'Entregue';
        break;
      default:
        return;
    }
    
    updateOrderStatus(orderId, nextStatus);
    setExpandedOrder(null);
  };

  const getActionLabel = (status: OrderStatus) => {
    switch (status) {
      case 'Pendente':
        return 'Iniciando...'; // Não há ação manual para pendentes
      case 'Em Preparo':
        return 'Marcar como Pronto';
      case 'Pronto':
        return 'Enviar para Entrega';
      case 'Em Entrega':
        return 'Confirmar Entrega';
      default:
        return '';
    }
  };

  const getSectionTitle = (status: OrderStatus) => {
    switch (status) {
      case 'Pendente':
        return 'Pendentes';
      case 'Em Preparo':
        return 'Em Preparo';
      case 'Pronto':
        return 'Prontos';
      case 'Em Entrega':
        return 'Em Entrega';
      case 'Entregue':
        return 'Entregues';
      default:
        return '';
    }
  };

  return {
    expandedOrder,
    setExpandedOrder,
    expandedStage,
    setExpandedStage,
    moveToNextStatus,
    getActionLabel,
    getSectionTitle
  };
};
