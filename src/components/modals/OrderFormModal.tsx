
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProductSelectionModal from "./ProductSelectionModal";
import OrderTypeSelector from "./OrderTypeSelector";
import OrderItemsList from "./OrderItemsList";
import OrderSummary from "./OrderSummary";
import { useOrderForm } from "@/hooks/useOrderForm";

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: any;
}

const OrderFormModal: React.FC<OrderFormModalProps> = ({
  isOpen,
  onClose,
  client,
}) => {
  const {
    orderType,
    setOrderType,
    selectedTable,
    setSelectedTable,
    isProductSelectionOpen,
    setIsProductSelectionOpen,
    items,
    tables,
    calculateTotal,
    handleAddItem,
    handleRemoveItem,
    handleSubmit,
  } = useOrderForm({ client, onClose });

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) onClose();
      }}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Pedido</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <OrderTypeSelector
              orderType={orderType}
              setOrderType={setOrderType}
              selectedTable={selectedTable}
              setSelectedTable={setSelectedTable}
              tables={tables}
            />

            <div>
              <p className="mb-2 font-medium">Cliente</p>
              <div className="p-2 bg-gray-50 rounded-md">
                <p>{client.name} - {client.phone}</p>
                {client.address && <p className="text-sm text-gray-500">{client.address}</p>}
              </div>
            </div>

            <OrderItemsList
              items={items}
              onRemoveItem={handleRemoveItem}
              onAddProduct={() => setIsProductSelectionOpen(true)}
            />

            <OrderSummary
              total={calculateTotal()}
              onCancel={onClose}
              onSubmit={handleSubmit}
            />
          </div>
        </DialogContent>
      </Dialog>

      <ProductSelectionModal
        isOpen={isProductSelectionOpen}
        onClose={() => setIsProductSelectionOpen(false)}
        onAddItem={handleAddItem}
      />
    </>
  );
};

export default OrderFormModal;
