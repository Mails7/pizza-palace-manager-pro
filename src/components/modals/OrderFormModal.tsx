
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProductSelectionModal from "./ProductSelectionModal";
import OrderTypeSelector from "./OrderTypeSelector";
import OrderItemsList from "./OrderItemsList";
import OrderSummary from "./OrderSummary";
import OrderDetailsSection from "./OrderDetailsSection";
import { useOrderForm } from "@/hooks/useOrderForm";

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: any;
  forceTableOrder?: boolean;
  tableId?: string;
}

const OrderFormModal: React.FC<OrderFormModalProps> = ({
  isOpen,
  onClose,
  client,
  forceTableOrder = false,
  tableId,
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
    paymentMethod,
    setPaymentMethod,
    orderNotes,
    setOrderNotes,
    deliveryAddress,
    setDeliveryAddress,
    calculateTotal,
    getEstimatedPreparationTime,
    handleAddItem,
    handleRemoveItem,
    handleSubmit,
    isTableOrderForced,
  } = useOrderForm({ client, onClose, forceTableOrder, tableId });

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) onClose();
      }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Pedido {isTableOrderForced && "- Mesa"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!isTableOrderForced && (
              <OrderTypeSelector
                orderType={orderType}
                setOrderType={setOrderType}
                selectedTable={selectedTable}
                setSelectedTable={setSelectedTable}
                tables={tables}
              />
            )}

            {isTableOrderForced && (
              <div>
                <p className="mb-2 font-medium">Tipo de Pedido</p>
                <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                  <p className="text-blue-800 font-medium">Mesa (Definido automaticamente)</p>
                  {selectedTable && (
                    <p className="text-sm text-blue-600">
                      Mesa selecionada: {tables.find(t => t.id === selectedTable)?.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 font-medium">Cliente</p>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="font-medium">{client.name}</p>
                <p className="text-sm text-gray-600">{client.phone}</p>
                {client.address && <p className="text-sm text-gray-500">{client.address}</p>}
              </div>
            </div>

            <OrderItemsList
              items={items}
              onRemoveItem={handleRemoveItem}
              onAddProduct={() => setIsProductSelectionOpen(true)}
            />

            {items.length > 0 && (
              <OrderDetailsSection
                orderType={orderType}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                orderNotes={orderNotes}
                setOrderNotes={setOrderNotes}
                deliveryAddress={deliveryAddress}
                setDeliveryAddress={setDeliveryAddress}
                estimatedTime={getEstimatedPreparationTime()}
              />
            )}

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
