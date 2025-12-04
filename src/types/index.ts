
export type PizzaSize = 'MINI' | 'P' | 'M' | 'G' | 'GG';

export type OrderStatus = 'Pendente' | 'Em Preparo' | 'Pronto' | 'Em Entrega' | 'Entregue' | 'Cancelado';

export type Priority = 'Alta' | 'Média' | 'Baixa';

export type OrderType = 'Balcão' | 'Mesa' | 'Entrega';

export type PaymentMethod = 'Dinheiro' | 'Cartão' | 'PIX';

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
  preparationTime?: number; // em minutos

  // Campos para borda de pizza
  hasCrust?: boolean;
  crustFlavors?: Array<{ id: string; name: string }>;
  crustPrices?: Array<{ size: PizzaSize; price: number }>;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  size: PizzaSize;
  unitPrice: number;
  observations?: string;
  preparationTime?: number;
  isHalfPizza?: boolean;
  halfPizzaFlavors?: {
    flavor1: string;
    flavor2: string;
  };
  hasCrust?: boolean;
  crustFlavorName?: string;
  crustPrice?: number;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate?: Date;
  notes?: string; // observações sobre o cliente
  tableId?: string;
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
  tableId?: string;
  orderType: OrderType;
  preparationTime?: number;
  estimatedTime?: number;
  estimatedDeliveryTime?: Date;
  deliveryAddress?: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
  orderNotes?: string;
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  isAvailable: boolean;
  location?: string;
  notes?: string;
  attendant?: string;
  isReserved?: boolean;
  reservationName?: string;
  reservationTime?: string;
  reservationNotes?: string;
  currentOrderId?: string;
  mergedWith?: string[]; // IDs das mesas que foram juntadas com esta
  isSplit?: boolean; // Se esta mesa foi dividida de outra
  originalTableId?: string; // ID da mesa original se foi dividida
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
