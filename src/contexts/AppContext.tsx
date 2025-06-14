import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  Client, 
  Order, 
  Product, 
  Table, 
  OrderStatus,
  Priority,
  DashboardData
} from '@/types';
import { products, clients, tables, orders, dashboardData } from '@/services/mockData';
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

// Função helper para organizar pedidos por status
const organizeOrdersByStatus = (orders: Order[]) => {
  console.log('🔧 Organizando pedidos por status. Total de pedidos:', orders.length);
  
  const organized = {
    pending: orders.filter(order => order.status === 'Pendente'),
    preparing: orders.filter(order => order.status === 'Em Preparo'),
    ready: orders.filter(order => order.status === 'Pronto'),
    delivering: orders.filter(order => order.status === 'Em Entrega'),
    delivered: orders.filter(order => order.status === 'Entregue')
  };
  
  console.log('🍳 Pedidos organizados:', {
    pending: organized.pending.length,
    preparing: organized.preparing.length,
    ready: organized.ready.length,
    delivering: organized.delivering.length,
    delivered: organized.delivered.length
  });
  
  return organized;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [productsState, setProducts] = useState<Product[]>(products);
  const [clientsState, setClients] = useState<Client[]>(clients);
  const [tablesState, setTables] = useState<Table[]>(tables);
  const [ordersState, setOrders] = useState<Order[]>(orders);
  const [dashboardDataState, setDashboardData] = useState<DashboardData>(dashboardData);
  const [kitchenOrdersState, setKitchenOrders] = useState(organizeOrdersByStatus(orders));
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(false);
  
  const { notifyNewOrder, notifyCancelOrder, notifyStatusUpdate } = useN8nIntegration();

  // Sincronizar kitchenOrders sempre que ordersState mudar
  useEffect(() => {
    console.log('🔄 === SINCRONIZANDO KITCHEN ORDERS ===');
    console.log('📊 Pedidos atuais no estado:', ordersState.length);
    
    const newKitchenOrders = organizeOrdersByStatus(ordersState);
    setKitchenOrders(newKitchenOrders);
    
    console.log('✅ Kitchen orders sincronizado com sucesso');
  }, [ordersState]);

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
    console.log('🚀 === FUNÇÃO addOrder CHAMADA ===');
    console.log('📋 Dados do pedido recebido:', order);
    console.log('📊 Estado atual dos pedidos antes da adição:', ordersState.length);
    
    try {
      const newOrder = {
        ...order,
        id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
        createdAt: new Date()
      };
      
      console.log('✅ Novo pedido criado com sucesso:', newOrder);
      console.log('🆔 ID do novo pedido:', newOrder.id);
      console.log('📍 Status do novo pedido:', newOrder.status);
      
      // Atualizar lista de pedidos - isso automaticamente vai sincronizar kitchenOrders via useEffect
      const updatedOrders = [newOrder, ...ordersState];
      console.log('📝 Atualizando ordersState. Novo total:', updatedOrders.length);
      setOrders(updatedOrders);
      
      // Notify n8n about new order
      console.log('📡 Enviando notificação n8n...');
      notifyNewOrder(newOrder);
      
      console.log('🎉 Mostrando toast de sucesso...');
      toast({
        title: "Pedido criado",
        description: `Pedido ${newOrder.id} foi criado com sucesso.`
      });
      
      console.log('✅ === addOrder FINALIZADA COM SUCESSO ===');
      
    } catch (error) {
      console.error('❌ ERRO na função addOrder:', error);
      toast({
        title: "Erro ao criar pedido",
        description: "Ocorreu um erro ao processar o pedido. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    console.log('🔄 === ATUALIZANDO STATUS DO PEDIDO ===');
    console.log('🆔 ID:', id, '📍 Novo status:', status);
    
    const orderToUpdate = ordersState.find(o => o.id === id);
    
    if (!orderToUpdate) {
      console.log('❌ Pedido não encontrado!');
      return;
    }
    
    const previousStatus = orderToUpdate.status;
    console.log('📍 Status anterior:', previousStatus);
    
    // Update order status - isso automaticamente vai sincronizar kitchenOrders via useEffect
    const updatedOrders = ordersState.map(o => 
      o.id === id ? { ...o, status } : o
    );
    setOrders(updatedOrders);
    
    // Notify n8n about status update
    notifyStatusUpdate(id, status, previousStatus);
    
    toast({
      title: "Status atualizado",
      description: `Pedido ${id} alterado para ${status}.`
    });
    
    console.log('✅ === FIM ATUALIZAÇÃO STATUS ===');
  };

  const updateOrderPriority = (id: string, priority: Priority) => {
    const updatedOrders = ordersState.map(o => 
      o.id === id ? { ...o, priority } : o
    );
    setOrders(updatedOrders);
    
    toast({
      title: "Prioridade atualizada",
      description: `Prioridade do pedido ${id} alterada para ${priority}.`
    });
  };

  const deleteOrder = (id: string) => {
    const orderToDelete = ordersState.find(o => o.id === id);
    
    // Atualizar orders - isso automaticamente vai sincronizar kitchenOrders via useEffect
    setOrders(ordersState.filter(o => o.id !== id));
    
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
