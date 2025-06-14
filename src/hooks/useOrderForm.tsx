
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { OrderType, OrderItem, PaymentMethod } from "@/types";

interface UseOrderFormProps {
  client: any;
  onClose: () => void;
  forceTableOrder?: boolean; // Nova prop para forçar pedido de mesa
  tableId?: string; // ID da mesa quando vem do gerenciamento
}

export const useOrderForm = ({ client, onClose, forceTableOrder = false, tableId }: UseOrderFormProps) => {
  const { addOrder, tables } = useApp();
  
  // Se forceTableOrder for true, inicia como "Mesa"
  const [orderType, setOrderType] = useState<OrderType>(forceTableOrder ? "Mesa" : "Balcão");
  const [selectedTable, setSelectedTable] = useState(tableId || client.tableId || "");
  const [isProductSelectionOpen, setIsProductSelectionOpen] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Dinheiro");
  const [orderNotes, setOrderNotes] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
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
      unitPrice: itemPrice,
      size: size as any,
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
      phone: client.phone,
      items,
      total: calculateTotal(),
      status: "Pendente" as const,
      priority: "Média" as const, // Corrigido para usar um valor válido do tipo Priority
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
    isTableOrderForced: forceTableOrder, // Retorna se é um pedido forçado de mesa
  };
};
