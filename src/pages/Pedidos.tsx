
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
    selectedClient,
    setSelectedClient,
    filteredOrders,
    handleClientSelected,
    handleNewOrderClick,
    handleOrderFormClose,
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
          onPriorityChange={handlePriorityChange}
        />
      )}

      <OrderModals
        isClientSearchOpen={isClientSearchOpen}
        setIsClientSearchOpen={setIsClientSearchOpen}
        isOrderFormOpen={isOrderFormOpen}
        setIsOrderFormOpen={setIsOrderFormOpen}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        onClientSelected={handleClientSelected}
        onOrderFormClose={handleOrderFormClose}
      />
    </div>
  );
};

export default Pedidos;
