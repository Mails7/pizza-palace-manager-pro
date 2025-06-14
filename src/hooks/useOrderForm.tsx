
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { OrderItem } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { useFormatters } from "./useFormatters";

interface UseOrderFormProps {
  client: any;
  onClose: () => void;
}

export const useOrderForm = ({ client, onClose }: UseOrderFormProps) => {
  const { tables, addOrder, products } = useApp();
  const { calculateEstimatedTime, formatTime } = useFormatters();
  const [orderType, setOrderType] = useState<"delivery" | "takeaway" | "table">("delivery");
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [isProductSelectionOpen, setIsProductSelectionOpen] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'Dinheiro' | 'Cartão' | 'PIX'>('Dinheiro');
  const [orderNotes, setOrderNotes] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState(client?.address || "");

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  };

  const getEstimatedPreparationTime = () => {
    if (items.length === 0) return 0;
    return calculateEstimatedTime(items);
  };

  const handleAddItem = (
    product: any, 
    quantity: number, 
    size: any, 
    observations?: string,
    isHalfPizza?: boolean,
    halfPizzaFlavors?: any,
    hasCrust?: boolean
  ) => {
    let productName = product.name;
    let unitPrice = product.prices.find((p: any) => p.size === size)?.price || 0;
    
    if (isHalfPizza && halfPizzaFlavors) {
      productName = `${halfPizzaFlavors.flavor1} / ${halfPizzaFlavors.flavor2}`;
      
      const flavor1Product = products.find(p => p.name === halfPizzaFlavors.flavor1);
      const flavor2Product = products.find(p => p.name === halfPizzaFlavors.flavor2);

      const price1 = flavor1Product?.prices.find(p => p.size === size)?.price || 0;
      const price2 = flavor2Product?.prices.find(p => p.size === size)?.price || 0;

      unitPrice = Math.max(price1, price2);
    }
    
    if (hasCrust !== undefined) {
      productName += hasCrust ? " (Com Borda)" : " (Sem Borda)";
    }

    const newItem: OrderItem = {
      productId: product.id,
      productName,
      quantity,
      size,
      unitPrice,
      observations,
      isHalfPizza,
      halfPizzaFlavors,
      hasCrust,
    };

    setItems((prevItems) => [...prevItems, newItem]);
    setIsProductSelectionOpen(false);

    toast({
      title: "Produto adicionado",
      description: `${quantity}x ${productName} adicionado ao pedido`
    });
  };

  const handleRemoveItem = (index: number) => {
    const removedItem = items[index];
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
    
    toast({
      title: "Produto removido",
      description: `${removedItem.productName} removido do pedido`
    });
  };

  const validateOrder = () => {
    if (items.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um produto ao pedido",
        variant: "destructive"
      });
      return false;
    }

    if (orderType === "table" && !selectedTable) {
      toast({
        title: "Erro",
        description: "Selecione uma mesa",
        variant: "destructive"
      });
      return false;
    }

    if (orderType === "delivery" && !deliveryAddress.trim()) {
      toast({
        title: "Erro",
        description: "Endereço de entrega é obrigatório",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateOrder()) return;

    const estimatedTime = getEstimatedPreparationTime();
    const estimatedDeliveryTime = new Date();
    estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + estimatedTime);

    const newOrder = {
      clientId: client.id,
      clientName: client.name,
      phone: client.phone,
      items,
      total: calculateTotal(),
      status: "Pendente" as const,
      priority: "Média" as const,
      table: orderType === "table" ? selectedTable : undefined,
      preparationTime: estimatedTime,
      estimatedDeliveryTime: orderType === "delivery" ? estimatedDeliveryTime : undefined,
      deliveryAddress: orderType === "delivery" ? deliveryAddress : undefined,
      paymentMethod,
      orderNotes: orderNotes.trim() || undefined,
    };

    addOrder(newOrder);
    
    toast({
      title: "Sucesso",
      description: `Pedido criado! Tempo estimado: ${formatTime(estimatedTime)}`
    });
    
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
  };
};
