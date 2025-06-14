
import React from "react";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { ShoppingBag, Plus } from "lucide-react";
import { useOrdersLogic } from "@/hooks/useOrdersLogic";
import OrdersFilter from "@/components/orders/OrdersFilter";
import OrdersTable from "@/components/orders/OrdersTable";
import OrderModals from "@/components/orders/OrderModals";

const Pedidos = () => {
  const {
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
  } = useOrdersLogic();

  return (
    <div className="p-6">
      <PageHeader 
        title="Pedidos" 
        actionLabel="Novo Pedido" 
        actionIcon={Plus}
        onAction={handleNewOrderClick} 
      />
      
      <OrdersFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      
      {filteredOrders.length === 0 ? (
        <EmptyState 
          message="Nenhum pedido encontrado"
          icon={<ShoppingBag className="h-12 w-12" />}
        />
      ) : (
        <OrdersTable
          orders={filteredOrders}
          onDeleteOrder={deleteOrder}
          onEditOrder={handleEditOrder}
          onPriorityChange={handlePriorityChange}
        />
      )}

      <OrderModals
        isClientSearchOpen={isClientSearchOpen}
        setIsClientSearchOpen={setIsClientSearchOpen}
        isOrderFormOpen={isOrderFormOpen}
        setIsOrderFormOpen={setIsOrderFormOpen}
        isEditOrderOpen={isEditOrderOpen}
        setIsEditOrderOpen={setIsEditOrderOpen}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
        onClientSelected={handleClientSelected}
        onOrderFormClose={handleOrderFormClose}
        onEditOrderClose={handleEditOrderClose}
      />
    </div>
  );
};

export default Pedidos;
