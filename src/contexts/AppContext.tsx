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
  if (import.meta.env.DEV) {
    console.log('🔧 === ORGANIZANDO PEDIDOS POR STATUS ===');
    console.log('📊 Total de pedidos recebidos:', orders.length);
    console.log('📋 Pedidos completos:', orders.map(o => ({ id: o.id, status: o.status, clientName: o.clientName })));
  }

  const organized = {
    pending: orders.filter(order => order.status === 'Pendente'),
    preparing: orders.filter(order => order.status === 'Em Preparo'),
    ready: orders.filter(order => order.status === 'Pronto'),
    delivering: orders.filter(order => order.status === 'Em Entrega'),
    delivered: orders.filter(order => order.status === 'Entregue')
  };

  if (import.meta.env.DEV) {
    console.log('🍳 Resultado da organização:', {
      pending: organized.pending.length,
      preparing: organized.preparing.length,
      ready: organized.ready.length,
      delivering: organized.delivering.length,
      delivered: organized.delivered.length
    });
  }

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
    if (import.meta.env.DEV) {
      console.log('🔄 === USEEFFECT SINCRONIZAÇÃO DISPARADO ===');
      console.log('📊 ordersState atual:', ordersState.length);
      console.log('📋 Detalhes dos pedidos:', ordersState.map(order => ({
        id: order.id,
        status: order.status,
        clientName: order.clientName
      })));
    }

    const newKitchenOrders = organizeOrdersByStatus(ordersState);
    setKitchenOrders(newKitchenOrders);

    if (import.meta.env.DEV) {
      console.log('✅ === FIM USEEFFECT SINCRONIZAÇÃO ===');
    }
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
    if (import.meta.env.DEV) {
      console.log('🚀 === [AppContext] ADDORDER FUNÇÃO INICIADA (CARDÁPIO PÚBLICO OU SISTEMA) ===');
      console.log('📋 [AppContext] Dados do pedido recebido:', JSON.stringify(order, null, 2));
      console.log('📍 [AppContext] Status recebido:', order.status);
      console.log('📱 [AppContext] Cliente ID recebido:', order.clientId);
    }

    // Validação de dados obrigatórios do pedido
    if (!order.clientName || !order.clientId || !order.phone || !order.items || !Array.isArray(order.items)) {
      console.error("[AppContext] ERRO: Pedido faltando dados obrigatórios!", order);
      toast({
        title: "Erro ao criar pedido",
        description: "Faltam dados obrigatórios do cliente ou itens.",
        variant: "destructive"
      });
      return;
    }
    if (!order.status) {
      if (import.meta.env.DEV) {
        console.warn("[AppContext] Corrigindo status vazio para 'Pendente'");
      }
      order.status = "Pendente";
    }
    if (!order.priority) {
      order.priority = "Média";
    }
    if (!order.orderType) {
      order.orderType = "Entrega";
    }
    if (!order.paymentMethod) {
      order.paymentMethod = "Dinheiro";
    }
    if (!order.total) order.total = 0;
    if (!order.estimatedTime) order.estimatedTime = 30;

    try {
      // Verificar se o cliente existe, se não, criar um temporário
      let finalClientId = order.clientId;
      const clientAlreadyExists = clientsState.some(client => client.id === order.clientId);
      if (!clientAlreadyExists && order.clientId.startsWith('public-client-')) {
        // Cliente temporário vindo da pública! Criar!
        if (import.meta.env.DEV) {
          console.log('🆔 Criando cliente temporário para pedido público...');
        }
        const tempClient = {
          id: order.clientId,
          name: order.clientName,
          phone: order.phone,
          address: order.deliveryAddress || '',
          orderCount: 1,
          totalSpent: order.total || 0,
          lastOrderDate: new Date()
        };
        setClients(currentClients => {
          // Não adicionar duplicado!
          if (currentClients.some(c => c.id === tempClient.id)) {
            if (import.meta.env.DEV) {
              console.log('⚠️ Cliente temporário já existe, não adicionando duplicado:', tempClient);
            }
            return currentClients;
          }
          if (import.meta.env.DEV) {
            console.log('✅ Cliente temporário criado e adicionado:', tempClient);
          }
          return [...currentClients, tempClient];
        });
      }

      // Criar o novo pedido com dados padronizados
      const newOrder: Order = {
        ...order,
        id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
        clientId: order.clientId,
        createdAt: new Date(),
        clientName: order.clientName.trim(),
        phone: order.phone.trim(),
        status: order.status || 'Pendente',
        priority: order.priority || 'Média',
        orderType: order.orderType || 'Entrega',
        paymentMethod: order.paymentMethod || 'Dinheiro',
        total: order.total || 0,
        items: order.items || [],
        estimatedTime: order.estimatedTime || 30,
        notes: order.notes || ''
      };

      if (import.meta.env.DEV) {
        console.log('✅ Novo pedido formatado (inserindo):', newOrder);
      }

      setOrders(currentOrders => {
        const updatedOrders = [newOrder, ...currentOrders];
        if (import.meta.env.DEV) {
          console.log('📊 [addOrder] Pedidos após inserir novo pedido:', updatedOrders.map(o => o.id));
        }
        return updatedOrders;
      });

      // Notify n8n about new order
      notifyNewOrder(newOrder);

      toast({
        title: "Pedido criado",
        description: `Pedido criado com sucesso para ${newOrder.clientName}!`
      });

      if (import.meta.env.DEV) {
        console.log('✅ === ADDORDER FINALIZADA COM SUCESSO ===');
      }

    } catch (error) {
      console.error('❌ ERRO CRÍTICO na função addOrder:', error);
      toast({
        title: "Erro ao criar pedido",
        description: "Ocorreu um erro ao processar o pedido. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    if (import.meta.env.DEV) {
      console.log('🔄 === ATUALIZANDO STATUS DO PEDIDO ===');
      console.log('🆔 ID:', id, '📍 Novo status:', status);
    }

    const orderToUpdate = ordersState.find(o => o.id === id);

    if (!orderToUpdate) {
      if (import.meta.env.DEV) {
        console.log('❌ Pedido não encontrado!');
      }
      return;
    }

    const previousStatus = orderToUpdate.status;
    if (import.meta.env.DEV) {
      console.log('📍 Status anterior:', previousStatus);
    }

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

    if (import.meta.env.DEV) {
      console.log('✅ === FIM ATUALIZAÇÃO STATUS ===');
    }
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

  if (import.meta.env.DEV) {
    console.log('🏪 === ESTADO ATUAL DO CONTEXTO ===');
    console.log('📊 Total de pedidos no estado:', ordersState.length);
    console.log('📋 IDs de todos os pedidos:', ordersState.map(o => o.id));
    console.log('📋 Status de todos os pedidos:', ordersState.map(o => ({ id: o.id, status: o.status })));
    console.log('🍳 Kitchen orders:', {
      pending: kitchenOrdersState.pending.length,
      preparing: kitchenOrdersState.preparing.length,
      ready: kitchenOrdersState.ready.length,
      delivering: kitchenOrdersState.delivering.length,
      delivered: kitchenOrdersState.delivered.length
    });
  }

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
