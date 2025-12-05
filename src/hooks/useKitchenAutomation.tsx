
import { useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { OrderStatus } from "@/types";

interface UseKitchenAutomationProps {
  kitchenOrders: any;
  autoUpdateEnabled: boolean;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder?: (orderId: string) => void;
}

export const useKitchenAutomation = ({
  kitchenOrders,
  autoUpdateEnabled,
  updateOrderStatus,
  deleteOrder
}: UseKitchenAutomationProps) => {
  // Progressão automática quando automação está ativa
  useEffect(() => {
    if (!autoUpdateEnabled) return;

    const intervals: NodeJS.Timeout[] = [];

    // Pendentes -> Em Preparo (1 minuto = 60000ms)
    kitchenOrders.pending.forEach((order: any) => {
      const timer = setTimeout(() => {
        updateOrderStatus(order.id, "Em Preparo");
        toast("Pedido iniciado automaticamente", {
          description: `Pedido #${order.id} agora está Em Preparo.`
        });
      }, 60000); // 1 minuto
      intervals.push(timer);
    });

    // Em Preparo -> Pronto (4 minutos = 240000ms)
    kitchenOrders.preparing.forEach((order: any) => {
      const timer = setTimeout(() => {
        updateOrderStatus(order.id, "Pronto");
        toast("Pedido atualizado", {
          description: `Pedido #${order.id} agora está Pronto.`
        });
      }, 240000); // 4 minutos
      intervals.push(timer);
    });

    // Pronto -> Em Entrega (6 minutos = 360000ms)
    kitchenOrders.ready.forEach((order: any) => {
      const timer = setTimeout(() => {
        updateOrderStatus(order.id, "Em Entrega");
        toast("Pedido atualizado", {
          description: `Pedido #${order.id} agora está Em Entrega.`
        });
      }, 360000); // 6 minutos
      intervals.push(timer);
    });

    // Em Entrega -> Entregue (30 minutos = 1800000ms)
    kitchenOrders.delivering.forEach((order: any) => {
      const timer = setTimeout(() => {
        updateOrderStatus(order.id, "Entregue");
        toast.success("Pedido entregue", {
          description: `Pedido #${order.id} foi entregue com sucesso!`
        });

        // Remover da lista após mais 30 minutos como entregue
        if (deleteOrder) {
          setTimeout(() => {
            deleteOrder(order.id);
            console.log(`✅ Pedido #${order.id} removido da cozinha`);
          }, 1800000); // +30 minutos
        }
      }, 1800000); // 30 minutos
      intervals.push(timer);
    });

    // Limpar todos os timers quando o componente desmontar ou quando as ordens mudarem
    return () => {
      intervals.forEach(interval => clearTimeout(interval));
    };
  }, [kitchenOrders, autoUpdateEnabled, updateOrderStatus, deleteOrder]);

  // Sempre iniciar pedidos pendentes automaticamente (independente da automação)
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    // Sempre iniciar pedidos pendentes automaticamente (1 minuto)
    kitchenOrders.pending.forEach((order: any) => {
      const timer = setTimeout(() => {
        updateOrderStatus(order.id, "Em Preparo");
        toast("🍕 Pedido iniciado", {
          description: `Pedido #${order.id} foi iniciado automaticamente.`
        });
      }, 60000); // 1 minuto
      intervals.push(timer);
    });

    return () => {
      intervals.forEach(interval => clearTimeout(interval));
    };
  }, [kitchenOrders.pending, updateOrderStatus]);
};
