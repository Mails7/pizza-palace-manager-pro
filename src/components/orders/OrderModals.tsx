
import React from "react";
import ClientSearchModal from "@/components/modals/ClientSearchModal";
import OrderFormModal from "@/components/modals/OrderFormModal";

interface OrderModalsProps {
  isClientSearchOpen: boolean;
  setIsClientSearchOpen: (open: boolean) => void;
  isOrderFormOpen: boolean;
  setIsOrderFormOpen: (open: boolean) => void;
  selectedClient: any;
  setSelectedClient: (client: any) => void;
  onClientSelected: (client: any) => void;
  onOrderFormClose: () => void;
}

const OrderModals: React.FC<OrderModalsProps> = ({
  isClientSearchOpen,
  setIsClientSearchOpen,
  isOrderFormOpen,
  setIsOrderFormOpen,
  selectedClient,
  setSelectedClient,
  onClientSelected,
  onOrderFormClose,
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
    </>
  );
};

export default OrderModals;
