
import React from "react";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { ShoppingBag, Plus } from "lucide-react";
import { useOrdersLogic } from "@/hooks/useOrdersLogic";
import OrdersFilter from "@/components/orders/OrdersFilter";
import OrdersTable from "@/components/orders/OrdersTable";
import OrderModals from "@/components/orders/OrderModals";
import { useApp } from "@/contexts/AppContext";

const Pedidos = () => {
  const { orders } = useApp();

  console.log('📋 === PÁGINA PEDIDOS CARREGADA ===');
  console.log('📊 Total de pedidos no contexto:', orders.length);
  console.log('📄 Pedidos completos:', orders);

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

  console.log('🔍 Pedidos filtrados na página:', filteredOrders.length);

  return (
    <div className="p-6">
      <PageHeader
        title="Pedidos"
        actionLabel="Novo Pedido"
        actionIcon={Plus}
        onAction={handleNewOrderClick}
      />

      <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 mb-6 border border-purple-100">
        <OrdersFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-12 border border-purple-100 flex justify-center">
          <EmptyState
            message="Nenhum pedido encontrado"
            icon={<ShoppingBag className="h-12 w-12 text-purple-300" />}
          />
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden border border-purple-200">
          <OrdersTable
            orders={filteredOrders}
            onDeleteOrder={deleteOrder}
            onEditOrder={handleEditOrder}
            onPriorityChange={handlePriorityChange}
          />
        </div>
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
