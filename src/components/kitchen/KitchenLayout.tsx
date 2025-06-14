
import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { OrderStatus } from "@/types";
import KitchenSidebar from "@/components/KitchenSidebar";
import OrderSection from "./OrderSection";

interface KitchenLayoutProps {
  kitchenOrders: any;
  autoUpdateEnabled: boolean;
  toggleAutoUpdate: () => void;
  onOrderExpand: (order: any) => void;
  onOrderAction: (orderId: string, status: OrderStatus) => void;
  onExpandStage: (status: OrderStatus) => void;
}

const KitchenLayout: React.FC<KitchenLayoutProps> = ({
  kitchenOrders,
  autoUpdateEnabled,
  toggleAutoUpdate,
  onOrderExpand,
  onOrderAction,
  onExpandStage
}) => {
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
                  onOrderExpand={onOrderExpand}
                  onOrderAction={onOrderAction}
                  onExpandStage={onExpandStage}
                />
                
                <OrderSection
                  title="Em Preparo"
                  orders={kitchenOrders.preparing}
                  status="Em Preparo"
                  actionLabel="Marcar como Pronto"
                  onOrderExpand={onOrderExpand}
                  onOrderAction={onOrderAction}
                  onExpandStage={onExpandStage}
                />
                
                <OrderSection
                  title="Prontos"
                  orders={kitchenOrders.ready}
                  status="Pronto"
                  actionLabel="Enviar para Entrega"
                  onOrderExpand={onOrderExpand}
                  onOrderAction={onOrderAction}
                  onExpandStage={onExpandStage}
                />
                
                <OrderSection
                  title="Em Entrega"
                  orders={kitchenOrders.delivering}
                  status="Em Entrega"
                  actionLabel="Confirmar Entrega"
                  onOrderExpand={onOrderExpand}
                  onOrderAction={onOrderAction}
                  onExpandStage={onExpandStage}
                />
                
                <OrderSection
                  title="Entregues"
                  orders={kitchenOrders.delivered}
                  status="Entregue"
                  actionLabel=""
                  onOrderExpand={onOrderExpand}
                  onOrderAction={onOrderAction}
                  onExpandStage={onExpandStage}
                />
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default KitchenLayout;
