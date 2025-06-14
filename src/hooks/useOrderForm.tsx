
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { OrderType, OrderItem, PaymentMethod } from "@/types";

interface UseOrderFormProps {
  client: any;
  onClose: () => void;
}

export const useOrderForm = ({ client, onClose }: UseOrderFormProps) => {
  const { addOrder, tables } = useApp();
  
  const [orderType, setOrderType] = useState<OrderType>("Balcão");
  const [selectedTable, setSelectedTable] = useState("");
  const [isProductSelectionOpen, setIsProductSelectionOpen] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Dinheiro");
  const [orderNotes, setOrderNotes] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getEstimatedPreparationTime = () => {
    const maxTime = Math.max(...items.map(item => item.preparationTime || 15));
    return maxTime + Math.floor(items.length / 3) * 5; // 5 min extra por cada 3 itens
  };

  const handleAddItem = (
    product: any,
    quantity: number,
    size: string,
    observations?: string,
    isHalfPizza?: boolean,
    halfPizzaFlavors?: any,
    hasCrust?: boolean,
    crustFlavorName?: string,
    crustPrice?: number
  ) => {
    const priceObj = product.prices.find((p: any) => p.size === size);
    let itemPrice = priceObj ? priceObj.price : product.prices[0]?.price || 0;
    
    // Adicionar preço da borda se aplicável
    if (hasCrust && crustPrice) {
      itemPrice += crustPrice;
    }

    let itemName = product.name;
    if (size && size !== 'M') {
      itemName += ` (${size})`;
    }
    
    if (isHalfPizza && halfPizzaFlavors) {
      itemName = `${halfPizzaFlavors.flavor1} + ${halfPizzaFlavors.flavor2}`;
      if (size && size !== 'M') {
        itemName += ` (${size})`;
      }
    }
    
    if (hasCrust && crustFlavorName) {
      itemName += ` - Borda ${crustFlavorName}`;
    }

    const newItem: OrderItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId: product.id,
      productName: itemName,
      quantity,
      price: itemPrice,
      size,
      observations: observations || "",
      preparationTime: product.preparationTime || 15,
      isHalfPizza,
      halfPizzaFlavors,
      hasCrust,
      crustFlavorName,
      crustPrice
    };

    setItems([...items, newItem]);
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleSubmit = () => {
    if (items.length === 0) {
      alert("Adicione pelo menos um item ao pedido");
      return;
    }

    const orderData = {
      clientName: client.name,
      clientId: client.id,
      clientPhone: client.phone,
      items,
      total: calculateTotal(),
      status: "Pendente" as const,
      priority: "Normal" as const,
      orderType,
      paymentMethod,
      notes: orderNotes,
      estimatedTime: getEstimatedPreparationTime(),
      // Incluir mesa se selecionada ou se cliente tem tableId
      ...(selectedTable && { tableId: selectedTable }),
      ...(client.tableId && { tableId: client.tableId }),
      ...(orderType === "Entrega" && { deliveryAddress }),
    };

    addOrder(orderData);
    onClose();
  };

  return {
    orderType,
    setOrderType,
    selectedTable,
    setSelectedTable,
    isProductSelectionOpen,
    setIsProductSelectionOpen,
    items,
    tables: tables.filter(table => table.isAvailable),
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
  };
};
