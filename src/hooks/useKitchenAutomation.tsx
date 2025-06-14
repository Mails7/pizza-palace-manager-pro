
import { useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { OrderStatus } from "@/types";

interface UseKitchenAutomationProps {
  kitchenOrders: any;
  autoUpdateEnabled: boolean;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const useKitchenAutomation = ({
  kitchenOrders,
  autoUpdateEnabled,
  updateOrderStatus
}: UseKitchenAutomationProps) => {
  useEffect(() => {
    if (!autoUpdateEnabled) return;
    
    const intervals: NodeJS.Timeout[] = [];
    
    // Processamento automático para pedidos pendentes (IMEDIATO - assim que chega)
    kitchenOrders.pending.forEach((order: any) => {
      const timer = setTimeout(() => {
        updateOrderStatus(order.id, "Em Preparo");
        toast("Pedido iniciado automaticamente", {
          description: `Pedido ${order.id} agora está Em Preparo.`
        });
      }, 1000); // 1 segundo apenas para dar tempo de processar
      intervals.push(timer);
    });
    
    // Processamento automático para pedidos em preparo (3 minutos)
    kitchenOrders.preparing.forEach((order: any) => {
      const timer = setTimeout(() => {
        updateOrderStatus(order.id, "Pronto");
        toast("Pedido atualizado", {
          description: `Pedido ${order.id} agora está Pronto.`
        });
      }, 180000); // 3 minutos
      intervals.push(timer);
    });
    
    // Processamento automático para pedidos prontos (2 minutos)
    kitchenOrders.ready.forEach((order: any) => {
      const timer = setTimeout(() => {
        updateOrderStatus(order.id, "Em Entrega");
        toast("Pedido atualizado", {
          description: `Pedido ${order.id} agora está Em Entrega.`
        });
      }, 120000); // 2 minutos
      intervals.push(timer);
    });
    
    // Processamento automático para pedidos em entrega (30 minutos)
    kitchenOrders.delivering.forEach((order: any) => {
      const timer = setTimeout(() => {
        updateOrderStatus(order.id, "Entregue");
        toast("Pedido atualizado", {
          description: `Pedido ${order.id} agora está Entregue.`
        });
      }, 1800000); // 30 minutos
      intervals.push(timer);
    });
    
    // Limpar todos os timers quando o componente desmontar ou quando as ordens mudarem
    return () => {
      intervals.forEach(interval => clearTimeout(interval));
    };
  }, [kitchenOrders, autoUpdateEnabled, updateOrderStatus]);

  // Função para iniciar automaticamente pedidos pendentes mesmo sem automação ativa
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];
    
    // Sempre iniciar pedidos pendentes automaticamente (independente da automação geral)
    kitchenOrders.pending.forEach((order: any) => {
      const timer = setTimeout(() => {
        updateOrderStatus(order.id, "Em Preparo");
        toast("Pedido iniciado", {
          description: `Pedido ${order.id} foi iniciado automaticamente.`
        });
      }, 2000); // 2 segundos para iniciar automaticamente
      intervals.push(timer);
    });
    
    return () => {
      intervals.forEach(interval => clearTimeout(interval));
    };
  }, [kitchenOrders.pending, updateOrderStatus]);
};
