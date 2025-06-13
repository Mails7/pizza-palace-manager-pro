
import React, { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { OrderStatus } from "@/types";
import { toast } from "@/components/ui/sonner";
import { Expand } from "lucide-react";
import useSound from "use-sound";
import KitchenSidebar from "@/components/KitchenSidebar";
import CompactOrderCard from "@/components/CompactOrderCard";
import ExpandedOrderCard from "@/components/ExpandedOrderCard";
import KitchenStageExpanded from "@/components/KitchenStageExpanded";

const Cozinha = () => {
  const { 
    kitchenOrders, 
    updateOrderStatus, 
    deleteOrder,
    autoUpdateEnabled, 
    toggleAutoUpdate 
  } = useApp();
  
  const [expandedOrder, setExpandedOrder] = useState<any>(null);
  const [expandedStage, setExpandedStage] = useState<OrderStatus | null>(null);
  
  // Carregando som de notificação
  const [playNewOrder] = useSound("/notification-sound.mp3", { volume: 0.5 });

  // Automação de pedidos com novos tempos
  useEffect(() => {
    if (!autoUpdateEnabled) return;
    
    const intervals: NodeJS.Timeout[] = [];
    
    // Processamento automático para pedidos pendentes (30 segundos)
    kitchenOrders.pending.forEach(order => {
      const timer = setTimeout(() => {
        updateOrderStatus(order.id, "Em Preparo");
        toast("Pedido atualizado", {
          description: `Pedido ${order.id} agora está Em Preparo.`
        });
      }, 30000); // 30 segundos
      intervals.push(timer);
    });
    
    // Processamento automático para pedidos em preparo (3 minutos)
    kitchenOrders.preparing.forEach(order => {
      const timer = setTimeout(() => {
        updateOrderStatus(order.id, "Pronto");
        toast("Pedido atualizado", {
          description: `Pedido ${order.id} agora está Pronto.`
        });
      }, 180000); // 3 minutos
      intervals.push(timer);
    });
    
    // Processamento automático para pedidos prontos (2 minutos)
    kitchenOrders.ready.forEach(order => {
      const timer = setTimeout(() => {
        updateOrderStatus(order.id, "Em Entrega");
        toast("Pedido atualizado", {
          description: `Pedido ${order.id} agora está Em Entrega.`
        });
      }, 120000); // 2 minutos
      intervals.push(timer);
    });
    
    // Processamento automático para pedidos em entrega (30 minutos)
    kitchenOrders.delivering.forEach(order => {
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
        nextStatus = 'Em Preparo';
        break;
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
        return 'Iniciar Preparo';
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

  const OrderSection = ({ 
    title, 
    orders, 
    status,
    actionLabel
  }: { 
    title: string;
    orders: any[];
    status: OrderStatus;
    actionLabel: string;
  }) => (
    <div className={`flex-1 min-w-0 border-t-4 rounded-lg ${getSectionColor(status)} p-4`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Badge variant="outline" className="bg-white">
            {orders.length}
          </Badge>
        </div>
        {orders.length > 3 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpandedStage(status)}
            className="p-1"
          >
            <Expand className="h-4 w-4" />
          </Button>
        )}
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
              onExpand={() => setExpandedOrder(order)}
              onNextAction={() => moveToNextStatus(order.id, order.status)}
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

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <KitchenSidebar 
          kitchenOrders={kitchenOrders}
          autoUpdateEnabled={autoUpdateEnabled}
          toggleAutoUpdate={toggleAutoUpdate}
        />
        
        <SidebarInset className="flex-1">
          <div className="h-full flex flex-col">
            <div className="border-b bg-white p-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold">Cozinha - Sistema de Pedidos</h1>
              </div>
            </div>
            
            <div className="flex-1 p-4 bg-gray-100">
              <div className="flex gap-4 h-full">
                <OrderSection
                  title="Pendentes"
                  orders={kitchenOrders.pending}
                  status="Pendente"
                  actionLabel="Iniciar Preparo"
                />
                
                <OrderSection
                  title="Em Preparo"
                  orders={kitchenOrders.preparing}
                  status="Em Preparo"
                  actionLabel="Marcar como Pronto"
                />
                
                <OrderSection
                  title="Prontos"
                  orders={kitchenOrders.ready}
                  status="Pronto"
                  actionLabel="Enviar para Entrega"
                />
                
                <OrderSection
                  title="Em Entrega"
                  orders={kitchenOrders.delivering}
                  status="Em Entrega"
                  actionLabel="Confirmar Entrega"
                />
                
                <OrderSection
                  title="Entregues"
                  orders={kitchenOrders.delivered}
                  status="Entregue"
                  actionLabel=""
                />
              </div>
            </div>
          </div>
        </SidebarInset>
        
        {expandedOrder && (
          <ExpandedOrderCard
            order={expandedOrder}
            onClose={() => setExpandedOrder(null)}
            onNextAction={() => moveToNextStatus(expandedOrder.id, expandedOrder.status)}
            actionLabel={getActionLabel(expandedOrder.status)}
          />
        )}
        
        {expandedStage && (
          <KitchenStageExpanded
            title={getSectionTitle(expandedStage)}
            orders={kitchenOrders[expandedStage === 'Pendente' ? 'pending' : 
                              expandedStage === 'Em Preparo' ? 'preparing' :
                              expandedStage === 'Pronto' ? 'ready' :
                              expandedStage === 'Em Entrega' ? 'delivering' : 'delivered']}
            status={expandedStage}
            actionLabel={getActionLabel(expandedStage)}
            onClose={() => setExpandedStage(null)}
            onOrderExpand={setExpandedOrder}
            onOrderAction={moveToNextStatus}
          />
        )}
      </div>
    </SidebarProvider>
  );
};

export default Cozinha;
