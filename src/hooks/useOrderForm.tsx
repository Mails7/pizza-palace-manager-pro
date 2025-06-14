
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { OrderItem } from "@/types";
import { toast } from "@/components/ui/use-toast";

interface UseOrderFormProps {
  client: any;
  onClose: () => void;
}

export const useOrderForm = ({ client, onClose }: UseOrderFormProps) => {
  const { tables, addOrder } = useApp();
  const [orderType, setOrderType] = useState<"delivery" | "takeaway" | "table">("delivery");
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [isProductSelectionOpen, setIsProductSelectionOpen] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([]);

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
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
    
    if (isHalfPizza && halfPizzaFlavors) {
      productName = `${halfPizzaFlavors.flavor1} / ${halfPizzaFlavors.flavor2}`;
    }
    
    if (hasCrust !== undefined) {
      productName += hasCrust ? " (Com Borda)" : " (Sem Borda)";
    }

    setItems((prevItems) => [
      ...prevItems,
      {
        productId: product.id,
        productName,
        quantity,
        size,
        unitPrice: product.prices.find((p: any) => p.size === size).price,
        observations,
        isHalfPizza,
        halfPizzaFlavors,
        hasCrust,
      },
    ]);
    setIsProductSelectionOpen(false);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (items.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um produto ao pedido",
        variant: "destructive"
      });
      return;
    }

    if (orderType === "table" && !selectedTable) {
      toast({
        title: "Erro",
        description: "Selecione uma mesa",
        variant: "destructive"
      });
      return;
    }

    const newOrder = {
      clientId: client.id,
      clientName: client.name,
      phone: client.phone,
      items,
      total: calculateTotal(),
      status: "Pendente" as const,
      priority: "Média" as const,
      table: orderType === "table" ? selectedTable : undefined,
    };

    addOrder(newOrder);
    toast({
      title: "Sucesso",
      description: "Pedido criado com sucesso!"
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
    calculateTotal,
    handleAddItem,
    handleRemoveItem,
    handleSubmit,
  };
};
