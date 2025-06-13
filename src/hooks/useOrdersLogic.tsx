
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Priority } from "@/types";

export const useOrdersLogic = () => {
  const { orders, deleteOrder } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [isClientSearchOpen, setIsClientSearchOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const handleClientSelected = (client: any) => {
    setSelectedClient(client);
    setIsClientSearchOpen(false);
    setIsOrderFormOpen(true);
  };

  const handleNewOrderClick = () => {
    setIsClientSearchOpen(true);
  };

  const handleOrderFormClose = () => {
    setIsOrderFormOpen(false);
    setSelectedClient(null);
  };

  const handlePriorityChange = (orderId: string, priority: Priority) => {
    console.log(`Updating priority for order ${orderId} to ${priority}`);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "Todos" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return {
    orders,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    isClientSearchOpen,
    setIsClientSearchOpen,
    isOrderFormOpen,
    setIsOrderFormOpen,
    selectedClient,
    setSelectedClient,
    filteredOrders,
    handleClientSelected,
    handleNewOrderClick,
    handleOrderFormClose,
    handlePriorityChange,
    deleteOrder,
  };
};
