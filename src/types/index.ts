
export type PizzaSize = 'MINI' | 'P' | 'M' | 'G' | 'GG';

export type OrderStatus = 'Pendente' | 'Em Preparo' | 'Pronto' | 'Em Entrega' | 'Entregue' | 'Cancelado';

export type Priority = 'Alta' | 'Média' | 'Baixa';

export interface Price {
  size: PizzaSize;
  price: number;
  costPrice?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  image: string;
  prices: Price[];
  available: boolean;
  isKitchenItem?: boolean;
  taxExempt?: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  size: PizzaSize;
  unitPrice: number;
  observations?: string;
  isHalfPizza?: boolean;
  halfPizzaFlavors?: {
    flavor1: string;
    flavor2: string;
  };
  hasCrust?: boolean;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate?: Date;
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  phone: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  priority: Priority;
  createdAt: Date;
  table?: string;
  preparationTime?: number;
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  isAvailable: boolean;
  currentOrderId?: string;
}

export interface DailySales {
  day: string;
  sales: number;
}

export interface TopProduct {
  name: string;
  sales: number;
  changePercentage: number;
}

export interface DashboardData {
  totalOrders: number;
  totalOrdersChange: number;
  totalClients: number;
  totalClientsChange: number;
  revenue: number;
  revenueChange: number;
  pendingOrders: number;
  pendingOrdersChange: number;
  dailySales: DailySales[];
  topProducts: TopProduct[];
  recentOrders: Order[];
}
