
import React from "react";
import { useApp } from "@/contexts/AppContext";
import KitchenLayout from "@/components/kitchen/KitchenLayout";
import ExpandedOrderCard from "@/components/ExpandedOrderCard";
import KitchenStageExpanded from "@/components/KitchenStageExpanded";
import { useKitchenOrders } from "@/hooks/useKitchenOrders";
import { useKitchenAutomation } from "@/hooks/useKitchenAutomation";

const Cozinha = () => {
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

  return (
    <>
      <KitchenLayout
        kitchenOrders={kitchenOrders}
        autoUpdateEnabled={autoUpdateEnabled}
        toggleAutoUpdate={toggleAutoUpdate}
        onOrderExpand={setExpandedOrder}
        onOrderAction={moveToNextStatus}
        onExpandStage={setExpandedStage}
      />
      
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
    </>
  );
};

export default Cozinha;
