
import React, { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import KitchenSidebar from "@/components/KitchenSidebar";
import OrderSection from "@/components/kitchen/OrderSection";
import ExpandedOrderCard from "@/components/ExpandedOrderCard";
import KitchenStageExpanded from "@/components/KitchenStageExpanded";
import DeliveredOrdersSection from "@/components/kitchen/DeliveredOrdersSection";
import { useKitchenOrders } from "@/hooks/useKitchenOrders";
import { useKitchenAutomation } from "@/hooks/useKitchenAutomation";

const Cozinha = () => {
  console.log("=== COZINHA COMPONENT RENDERING ===");
  
  const { 
    kitchenOrders, 
    updateOrderStatus, 
    deleteOrder,
    autoUpdateEnabled, 
    toggleAutoUpdate 
  } = useApp();
  
  console.log("Kitchen orders recebidos do contexto:", kitchenOrders);
  console.log("Pedidos pendentes:", kitchenOrders.pending);
  console.log("Total pedidos pendentes:", kitchenOrders.pending.length);
  
  const [showDelivered, setShowDelivered] = useState(false);
  
  const {
    expandedOrder,
    setExpandedOrder,
    expandedStage,
    setExpandedStage,
    moveToNextStatus,
    getActionLabel,
    getSectionTitle
  } = useKitchenOrders({
    kitchenOrders,
    updateOrderStatus
  });

  // Use kitchen automation hook
  useKitchenAutomation({
    kitchenOrders,
    autoUpdateEnabled,
    updateOrderStatus
  });

  // Log sempre que o estado do kitchen orders mudar
  useEffect(() => {
    console.log("=== KITCHEN ORDERS MUDOU ===");
    console.log("Pendentes:", kitchenOrders.pending.length);
    console.log("Em Preparo:", kitchenOrders.preparing.length);
    console.log("Prontos:", kitchenOrders.ready.length);
    console.log("Em Entrega:", kitchenOrders.delivering.length);
    console.log("Entregues:", kitchenOrders.delivered.length);
    console.log("Detalhes completos:", kitchenOrders);
  }, [kitchenOrders]);

  console.log("Sidebar state:", { expandedOrder: !!expandedOrder, expandedStage: !!expandedStage });

  return (
    <SidebarProvider open={false} onOpenChange={() => {}}>
      <div className="min-h-screen flex w-full bg-gray-50">
        <KitchenSidebar 
          kitchenOrders={kitchenOrders}
          autoUpdateEnabled={autoUpdateEnabled}
          toggleAutoUpdate={toggleAutoUpdate}
        />
        
        <SidebarInset className="flex-1 min-w-0">
          <div className="h-full flex flex-col">
            <header className="border-b bg-white p-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Cozinha - Sistema de Pedidos</h1>
                
                <Button
                  variant="outline"
                  onClick={() => setShowDelivered(true)}
                  className="flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  Pedidos Entregues
                  <Badge variant="secondary">{kitchenOrders.delivered.length}</Badge>
                </Button>
              </div>
            </header>
            
            <main className="flex-1 p-4 overflow-hidden">
              <div className="flex gap-4 h-full">
                <OrderSection
                  title="Pendentes"
                  orders={kitchenOrders.pending}
                  status="Pendente"
                  actionLabel="Iniciar Preparo"
                  onOrderExpand={setExpandedOrder}
                  onOrderAction={moveToNextStatus}
                  onExpandStage={setExpandedStage}
                />
                
                <OrderSection
                  title="Em Preparo"
                  orders={kitchenOrders.preparing}
                  status="Em Preparo"
                  actionLabel="Marcar como Pronto"
                  onOrderExpand={setExpandedOrder}
                  onOrderAction={moveToNextStatus}
                  onExpandStage={setExpandedStage}
                />
                
                <OrderSection
                  title="Prontos"
                  orders={kitchenOrders.ready}
                  status="Pronto"
                  actionLabel="Enviar para Entrega"
                  onOrderExpand={setExpandedOrder}
                  onOrderAction={moveToNextStatus}
                  onExpandStage={setExpandedStage}
                />
                
                <OrderSection
                  title="Em Entrega"
                  orders={kitchenOrders.delivering}
                  status="Em Entrega"
                  actionLabel="Confirmar Entrega"
                  onOrderExpand={setExpandedOrder}
                  onOrderAction={moveToNextStatus}
                  onExpandStage={setExpandedStage}
                />
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
      
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
      
      {showDelivered && (
        <DeliveredOrdersSection
          orders={kitchenOrders.delivered}
          onOrderExpand={setExpandedOrder}
          onClose={() => setShowDelivered(false)}
        />
      )}
    </SidebarProvider>
  );
};

export default Cozinha;
