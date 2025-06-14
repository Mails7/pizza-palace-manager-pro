
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Priority, Order } from "@/types";

export const useOrdersLogic = () => {
  const { orders, deleteOrder, updateOrderPriority } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [isClientSearchOpen, setIsClientSearchOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isEditOrderOpen, setIsEditOrderOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsEditOrderOpen(true);
  };

  const handleEditOrderClose = () => {
    setIsEditOrderOpen(false);
    setSelectedOrder(null);
  };

  const handlePriorityChange = (orderId: string, priority: Priority) => {
    updateOrderPriority(orderId, priority);
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
    isEditOrderOpen,
    setIsEditOrderOpen,
    selectedClient,
    setSelectedClient,
    selectedOrder,
    setSelectedOrder,
    filteredOrders,
    handleClientSelected,
    handleNewOrderClick,
    handleOrderFormClose,
    handleEditOrder,
    handleEditOrderClose,
    handlePriorityChange,
    deleteOrder,
  };
};
