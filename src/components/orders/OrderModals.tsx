
import React from "react";
import ClientSearchModal from "@/components/modals/ClientSearchModal";
import OrderFormModal from "@/components/modals/OrderFormModal";
import EditOrderModal from "@/components/modals/EditOrderModal";
import { Order } from "@/types";

interface OrderModalsProps {
  isClientSearchOpen: boolean;
  setIsClientSearchOpen: (open: boolean) => void;
  isOrderFormOpen: boolean;
  setIsOrderFormOpen: (open: boolean) => void;
  isEditOrderOpen: boolean;
  setIsEditOrderOpen: (open: boolean) => void;
  selectedClient: any;
  setSelectedClient: (client: any) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  onClientSelected: (client: any) => void;
  onOrderFormClose: () => void;
  onEditOrderClose: () => void;
}

const OrderModals: React.FC<OrderModalsProps> = ({
  isClientSearchOpen,
  setIsClientSearchOpen,
  isOrderFormOpen,
  setIsOrderFormOpen,
  isEditOrderOpen,
  setIsEditOrderOpen,
  selectedClient,
  setSelectedClient,
  selectedOrder,
  setSelectedOrder,
  onClientSelected,
  onOrderFormClose,
  onEditOrderClose,
}) => {
  return (
    <>
      <ClientSearchModal 
        isOpen={isClientSearchOpen}
        onClose={() => setIsClientSearchOpen(false)}
        onClientSelected={onClientSelected}
      />

      {selectedClient && (
        <OrderFormModal 
          isOpen={isOrderFormOpen}
          onClose={onOrderFormClose}
          client={selectedClient}
        />
      )}

      {selectedOrder && (
        <EditOrderModal
          isOpen={isEditOrderOpen}
          onClose={onEditOrderClose}
          order={selectedOrder}
        />
      )}
    </>
  );
};

export default OrderModals;
