
import React from "react";
import { useApp } from "@/contexts/AppContext";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import KitchenSidebar from "@/components/KitchenSidebar";
import OrderSection from "@/components/kitchen/OrderSection";
import ExpandedOrderCard from "@/components/ExpandedOrderCard";
import KitchenStageExpanded from "@/components/KitchenStageExpanded";
import { useKitchenOrders } from "@/hooks/useKitchenOrders";
import { useKitchenAutomation } from "@/hooks/useKitchenAutomation";

const Cozinha = () => {
  console.log("Cozinha component rendering");
  
  const { 
    kitchenOrders, 
    updateOrderStatus, 
    deleteOrder,
    autoUpdateEnabled, 
    toggleAutoUpdate 
  } = useApp();
  
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

  console.log("Sidebar state:", { expandedOrder: !!expandedOrder, expandedStage: !!expandedStage });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <KitchenSidebar 
          kitchenOrders={kitchenOrders}
          autoUpdateEnabled={autoUpdateEnabled}
          toggleAutoUpdate={toggleAutoUpdate}
        />
        
        <SidebarInset className="flex-1 min-w-0">
          <div className="h-full flex flex-col">
            <header className="border-b bg-white p-4 flex-shrink-0">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold">Cozinha - Sistema de Pedidos</h1>
              </div>
            </header>
            
            <main className="flex-1 p-4 overflow-x-auto">
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
                
                <OrderSection
                  title="Entregues"
                  orders={kitchenOrders.delivered}
                  status="Entregue"
                  actionLabel=""
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
    </SidebarProvider>
  );
};

export default Cozinha;
