import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  Client, 
  Order, 
  Product, 
  Table, 
  OrderStatus,
  Priority,
  DashboardData
} from '@/types';
import { products, clients, tables, orders, dashboardData, kitchenOrders } from '@/services/mockData';
import { toast } from '@/components/ui/use-toast';
import { useN8nIntegration } from '@/hooks/useN8nIntegration';

interface AppContextType {
  // Data
  products: Product[];
  clients: Client[];
  tables: Table[];
  orders: Order[];
  dashboardData: DashboardData;
  kitchenOrders: {
    pending: Order[];
    preparing: Order[];
    ready: Order[];
    delivering: Order[];
    delivered: Order[];
  };
  
  // Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addClient: (client: Omit<Client, 'id' | 'orderCount' | 'totalSpent' | 'lastOrderDate'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  addTable: (table: Omit<Table, 'id'>) => void;
  updateTable: (id: string, table: Partial<Table>) => void;
  deleteTable: (id: string) => void;
  
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updateOrderPriority: (id: string, priority: Priority) => void;
  deleteOrder: (id: string) => void;
  
  autoUpdateEnabled: boolean;
  toggleAutoUpdate: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [productsState, setProducts] = useState<Product[]>(products);
  const [clientsState, setClients] = useState<Client[]>(clients);
  const [tablesState, setTables] = useState<Table[]>(tables);
  const [ordersState, setOrders] = useState<Order[]>(orders);
  const [dashboardDataState, setDashboardData] = useState<DashboardData>(dashboardData);
  const [kitchenOrdersState, setKitchenOrders] = useState(kitchenOrders);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(false);
  
  const { notifyNewOrder, notifyCancelOrder, notifyStatusUpdate } = useN8nIntegration();

  // Product actions
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: `product-${Date.now()}`
    };
    setProducts([...productsState, newProduct]);
    toast({
      title: "Produto adicionado",
      description: `${newProduct.name} foi adicionado com sucesso.`
    });
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts(productsState.map(p => 
      p.id === id ? { ...p, ...product } : p
    ));
    toast({
      title: "Produto atualizado",
      description: "O produto foi atualizado com sucesso."
    });
  };

  const deleteProduct = (id: string) => {
    const productToDelete = productsState.find(p => p.id === id);
    setProducts(productsState.filter(p => p.id !== id));
    if (productToDelete) {
      toast({
        title: "Produto excluído",
        description: `${productToDelete.name} foi excluído com sucesso.`
      });
    }
  };

  // Client actions
  const addClient = (client: Omit<Client, 'id' | 'orderCount' | 'totalSpent' | 'lastOrderDate'>) => {
    const newClient = {
      ...client,
      id: `client-${Date.now()}`,
      orderCount: 0,
      totalSpent: 0
    };
    setClients([...clientsState, newClient]);
    toast({
      title: "Cliente adicionado",
      description: `${newClient.name} foi adicionado com sucesso.`
    });
  };

  const updateClient = (id: string, client: Partial<Client>) => {
    setClients(clientsState.map(c => 
      c.id === id ? { ...c, ...client } : c
    ));
    toast({
      title: "Cliente atualizado",
      description: "O cliente foi atualizado com sucesso."
    });
  };

  const deleteClient = (id: string) => {
    const clientToDelete = clientsState.find(c => c.id === id);
    setClients(clientsState.filter(c => c.id !== id));
    if (clientToDelete) {
      toast({
        title: "Cliente excluído",
        description: `${clientToDelete.name} foi excluído com sucesso.`
      });
    }
  };

  // Table actions
  const addTable = (table: Omit<Table, 'id'>) => {
    const newTable = {
      ...table,
      id: `table-${Date.now()}`
    };
    setTables([...tablesState, newTable]);
    toast({
      title: "Mesa adicionada",
      description: `Mesa ${newTable.name} foi adicionada com sucesso.`
    });
  };

  const updateTable = (id: string, table: Partial<Table>) => {
    setTables(tablesState.map(t => 
      t.id === id ? { ...t, ...table } : t
    ));
    toast({
      title: "Mesa atualizada",
      description: "A mesa foi atualizada com sucesso."
    });
  };

  const deleteTable = (id: string) => {
    const tableToDelete = tablesState.find(t => t.id === id);
    
    // Verificar se há pedidos ativos na mesa
    const activeOrders = ordersState.filter(order => 
      order.tableId === id && 
      order.status !== "Entregue" && 
      order.status !== "Cancelado"
    );
    
    if (activeOrders.length > 0) {
      toast({
        title: "Não é possível excluir",
        description: "A mesa possui pedidos ativos. Finalize os pedidos antes de excluir.",
        variant: "destructive"
      });
      return;
    }

    // Se a mesa foi juntada com outras, desfazer a junção primeiro
    if (tableToDelete?.mergedWith?.length) {
      tableToDelete.mergedWith.forEach((mergedTableId: string) => {
        updateTable(mergedTableId, {
          isAvailable: true,
          notes: ""
        });
      });
    }
    
    setTables(tablesState.filter(t => t.id !== id));
    if (tableToDelete) {
      toast({
        title: "Mesa excluída",
        description: `Mesa ${tableToDelete.name} foi excluída com sucesso.`
      });
    }
  };

  // Order actions
  const addOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
    console.log('=== ADICIONANDO NOVO PEDIDO ===');
    console.log('Dados do pedido recebido:', order);
    
    const newOrder = {
      ...order,
      id: `#${Math.random().toString(36).substr(2, 8)}`,
      createdAt: new Date()
    };
    
    console.log('Novo pedido criado:', newOrder);
    
    // Atualizar lista de pedidos
    const updatedOrders = [newOrder, ...ordersState];
    setOrders(updatedOrders);
    console.log('Orders state atualizado. Total de pedidos:', updatedOrders.length);
    
    // Atualizar kitchen orders
    console.log('Estado atual do kitchen orders:', kitchenOrdersState);
    
    if (newOrder.status === 'Pendente') {
      const newKitchenOrders = {
        ...kitchenOrdersState,
        pending: [...kitchenOrdersState.pending, newOrder]
      };
      setKitchenOrders(newKitchenOrders);
      console.log('Kitchen orders atualizado - Pendentes:', newKitchenOrders.pending.length);
      console.log('Todos os kitchen orders:', newKitchenOrders);
    }
    
    // Notify n8n about new order
    notifyNewOrder(newOrder);
    
    toast({
      title: "Pedido criado",
      description: `Pedido ${newOrder.id} foi criado com sucesso.`
    });
    
    console.log('=== FIM ADIÇÃO PEDIDO ===');
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    console.log('=== ATUALIZANDO STATUS DO PEDIDO ===');
    console.log('ID:', id, 'Novo status:', status);
    
    const orderToUpdate = ordersState.find(o => o.id === id);
    
    if (!orderToUpdate) {
      console.log('Pedido não encontrado!');
      return;
    }
    
    const previousStatus = orderToUpdate.status;
    console.log('Status anterior:', previousStatus);
    
    // Update order status
    const updatedOrders = ordersState.map(o => 
      o.id === id ? { ...o, status } : o
    );
    setOrders(updatedOrders);
    
    // Update kitchen orders
    const updatedOrder = { ...orderToUpdate, status };
    const newKitchenOrders = { ...kitchenOrdersState };
    
    // Remove from all categories
    newKitchenOrders.pending = newKitchenOrders.pending.filter(o => o.id !== id);
    newKitchenOrders.preparing = newKitchenOrders.preparing.filter(o => o.id !== id);
    newKitchenOrders.ready = newKitchenOrders.ready.filter(o => o.id !== id);
    newKitchenOrders.delivering = newKitchenOrders.delivering.filter(o => o.id !== id);
    newKitchenOrders.delivered = newKitchenOrders.delivered.filter(o => o.id !== id);
    
    // Add to correct category
    switch (status) {
      case 'Pendente':
        newKitchenOrders.pending.push(updatedOrder);
        break;
      case 'Em Preparo':
        newKitchenOrders.preparing.push(updatedOrder);
        break;
      case 'Pronto':
        newKitchenOrders.ready.push(updatedOrder);
        break;
      case 'Em Entrega':
        newKitchenOrders.delivering.push(updatedOrder);
        break;
      case 'Entregue':
        newKitchenOrders.delivered.push(updatedOrder);
        break;
    }
    
    setKitchenOrders(newKitchenOrders);
    console.log('Kitchen orders após atualização:', newKitchenOrders);
    
    // Notify n8n about status update
    notifyStatusUpdate(id, status, previousStatus);
    
    toast({
      title: "Status atualizado",
      description: `Pedido ${id} alterado para ${status}.`
    });
    
    console.log('=== FIM ATUALIZAÇÃO STATUS ===');
  };

  const updateOrderPriority = (id: string, priority: Priority) => {
    const updatedOrders = ordersState.map(o => 
      o.id === id ? { ...o, priority } : o
    );
    setOrders(updatedOrders);
    
    // Update kitchen orders as well
    const newKitchenOrders = { ...kitchenOrdersState };
    Object.keys(newKitchenOrders).forEach(key => {
      const orderList = newKitchenOrders[key as keyof typeof newKitchenOrders];
      newKitchenOrders[key as keyof typeof newKitchenOrders] = orderList.map(o => 
        o.id === id ? { ...o, priority } : o
      );
    });
    
    setKitchenOrders(newKitchenOrders);
    
    toast({
      title: "Prioridade atualizada",
      description: `Prioridade do pedido ${id} alterada para ${priority}.`
    });
  };

  const deleteOrder = (id: string) => {
    const orderToDelete = ordersState.find(o => o.id === id);
    setOrders(ordersState.filter(o => o.id !== id));
    
    // Update kitchen orders
    const newKitchenOrders = { ...kitchenOrdersState };
    newKitchenOrders.pending = newKitchenOrders.pending.filter(o => o.id !== id);
    newKitchenOrders.preparing = newKitchenOrders.preparing.filter(o => o.id !== id);
    newKitchenOrders.ready = newKitchenOrders.ready.filter(o => o.id !== id);
    newKitchenOrders.delivering = newKitchenOrders.delivering.filter(o => o.id !== id);
    newKitchenOrders.delivered = newKitchenOrders.delivered.filter(o => o.id !== id);
    
    setKitchenOrders(newKitchenOrders);
    
    // Notify n8n about order cancellation
    if (orderToDelete) {
      notifyCancelOrder(id, "Pedido cancelado pelo sistema");
    }
    
    if (orderToDelete) {
      toast({
        title: "Pedido excluído",
        description: `Pedido ${orderToDelete.id} foi excluído com sucesso.`
      });
    }
  };

  const toggleAutoUpdate = () => {
    setAutoUpdateEnabled(!autoUpdateEnabled);
    toast({
      title: `Atualização automática ${!autoUpdateEnabled ? 'ativada' : 'desativada'}`,
      description: `Os pedidos ${!autoUpdateEnabled ? 'serão atualizados' : 'não serão atualizados'} automaticamente.`
    });
  };

  return (
    <AppContext.Provider value={{
      products: productsState,
      clients: clientsState,
      tables: tablesState,
      orders: ordersState,
      dashboardData: dashboardDataState,
      kitchenOrders: kitchenOrdersState,
      
      addProduct,
      updateProduct,
      deleteProduct,
      
      addClient,
      updateClient,
      deleteClient,
      
      addTable,
      updateTable,
      deleteTable,
      
      addOrder,
      updateOrderStatus,
      updateOrderPriority,
      deleteOrder,
      
      autoUpdateEnabled,
      toggleAutoUpdate
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
