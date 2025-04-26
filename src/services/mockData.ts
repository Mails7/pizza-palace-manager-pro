
import { 
  Client, 
  Order, 
  Product, 
  Table, 
  DashboardData, 
  OrderStatus,
  Priority
} from "@/types";

// Mock products
export const products: Product[] = [
  {
    id: "1",
    name: "Pizza Margherita",
    description: "Molho de tomate, mussarela, manjericão fresco",
    category: "Tradicionais",
    type: "Pizza",
    image: "/lovable-uploads/2353a143-0353-4f1b-93d9-aaf551b97732.png",
    prices: [
      { size: "P", price: 35.90, costPrice: 22.50 },
      { size: "G", price: 45.90, costPrice: 35.80 }
    ],
    available: true,
    isKitchenItem: true
  },
  {
    id: "2",
    name: "Pizza Calabresa",
    description: "Molho de tomate, calabresa, cebola",
    category: "Tradicionais",
    type: "Pizza",
    image: "/lovable-uploads/60b6cc5d-07f1-48ca-8be5-6109ea7c7068.png",
    prices: [
      { size: "P", price: 32.90, costPrice: 19.90 },
      { size: "G", price: 42.90, costPrice: 29.90 }
    ],
    available: true,
    isKitchenItem: true
  },
  {
    id: "3",
    name: "Pizza Margherita Especial",
    description: "Molho de tomate, mussarela, tomate, manjericão fresco e orégano",
    category: "Tradicionais",
    type: "Pizza",
    image: "/lovable-uploads/b67349c8-36e6-43d2-87b0-787d8a5cb0fc.png",
    prices: [
      { size: "P", price: 39.90, costPrice: 25.90 },
      { size: "M", price: 49.90, costPrice: 28.50 },
      { size: "G", price: 59.90, costPrice: 38.50 },
      { size: "GG", price: 69.90, costPrice: 42.00 }
    ],
    available: true,
    isKitchenItem: true
  },
  {
    id: "4",
    name: "Pizza Calabresa Especial",
    description: "Molho de tomate, calabresa especial, cebola, pimentão e azeitonas",
    category: "Tradicionais",
    type: "Pizza",
    image: "/lovable-uploads/3529df08-0115-4f0f-a097-f63727c7764f.png",
    prices: [
      { size: "P", price: 42.90, costPrice: 28.90 },
      { size: "M", price: 52.90, costPrice: 32.90 },
      { size: "G", price: 62.90, costPrice: 38.80 },
      { size: "GG", price: 72.90, costPrice: 42.00 }
    ],
    available: true,
    isKitchenItem: true
  }
];

// Mock clients
export const clients: Client[] = [
  {
    id: "1",
    name: "masdfgh",
    phone: "4567890",
    address: "currais",
    orderCount: 5,
    totalSpent: 289.40,
    lastOrderDate: new Date('2025-04-26T03:45:00')
  },
  {
    id: "2",
    name: "MAILSON ALVES DOS SANTOS",
    phone: "61983606393",
    address: "Rua pedreiras",
    orderCount: 8,
    totalSpent: 324.10,
    lastOrderDate: new Date('2025-04-25T15:12:00')
  },
  {
    id: "3",
    name: "Mailson",
    phone: "89",
    address: "",
    orderCount: 2,
    totalSpent: 98.70,
    lastOrderDate: new Date('2025-04-25T15:16:00')
  }
];

// Mock tables
export const tables: Table[] = [
  {
    id: "1",
    name: "Mesa 02",
    capacity: 4,
    isAvailable: true
  },
  {
    id: "2",
    name: "mesa vip",
    capacity: 10,
    isAvailable: true
  },
  {
    id: "3",
    name: "mesa 03",
    capacity: 2,
    isAvailable: true
  },
  {
    id: "4",
    name: "mesa 03",
    capacity: 2,
    isAvailable: true
  },
  {
    id: "5",
    name: "mesa 04",
    capacity: 2,
    isAvailable: true
  },
  {
    id: "6",
    name: "mesa 04",
    capacity: 2,
    isAvailable: true
  },
  {
    id: "7",
    name: "mesa",
    capacity: 2,
    isAvailable: true
  },
  {
    id: "8",
    name: "mesa",
    capacity: 2,
    isAvailable: true
  }
];

// Mock orders
export const orders: Order[] = [
  {
    id: "#680a2a45",
    clientId: "1",
    clientName: "masdfgh",
    phone: "4567890",
    items: [
      {
        productId: "1",
        productName: "Pizza Calabresa",
        quantity: 1,
        size: "P",
        unitPrice: 32.90
      },
      {
        productId: "3",
        productName: "Pizza Margherita Especial",
        quantity: 1,
        size: "P",
        unitPrice: 39.90
      }
    ],
    total: 75.80,
    status: "Entregue" as OrderStatus,
    priority: "Baixa" as Priority,
    createdAt: new Date('2025-04-26T03:45:00')
  },
  {
    id: "#680a2a46",
    clientId: "2",
    clientName: "MAILSON ALVES DOS SANTOS",
    phone: "61983606393",
    items: [
      {
        productId: "2",
        productName: "Pizza Calabresa",
        quantity: 1,
        size: "G",
        unitPrice: 42.90
      },
      {
        productId: "3",
        productName: "Pizza Margherita Especial",
        quantity: 1,
        size: "G",
        unitPrice: 59.90
      }
    ],
    total: 107.70,
    status: "Cancelado" as OrderStatus,
    priority: "Baixa" as Priority,
    createdAt: new Date('2025-04-25T21:43:00')
  },
  {
    id: "#680a2a47",
    clientId: "2",
    clientName: "MAILSON ALVES DOS SANTOS",
    phone: "61983606393",
    items: [
      {
        productId: "1",
        productName: "Pizza Margherita",
        quantity: 1,
        size: "P",
        unitPrice: 35.90
      },
      {
        productId: "2",
        productName: "Pizza Calabresa",
        quantity: 1,
        size: "P",
        unitPrice: 32.90
      }
    ],
    total: 71.80,
    status: "Cancelado" as OrderStatus,
    priority: "Baixa" as Priority,
    createdAt: new Date('2025-04-25T21:36:00')
  },
  {
    id: "#680a2a48",
    clientId: "3",
    clientName: "Mailson",
    phone: "89",
    items: [
      {
        productId: "3",
        productName: "Pizza Margherita Especial",
        quantity: 2,
        size: "P",
        unitPrice: 39.90
      },
      {
        productId: "4",
        productName: "Pizza Calabresa Especial",
        quantity: 1,
        size: "P",
        unitPrice: 18.90
      }
    ],
    total: 98.70,
    status: "Cancelado" as OrderStatus,
    priority: "Baixa" as Priority,
    createdAt: new Date('2025-04-25T15:16:00')
  },
  {
    id: "#680a2a49",
    clientId: "2",
    clientName: "MAILSON ALVES DOS SANTOS",
    phone: "61983606393",
    items: [
      {
        productId: "4",
        productName: "Pizza Calabresa Especial",
        quantity: 2,
        size: "G",
        unitPrice: 62.90
      },
      {
        productId: "1",
        productName: "Pizza Margherita",
        quantity: 1,
        size: "P",
        unitPrice: 18.80
      }
    ],
    total: 144.60,
    status: "Entregue" as OrderStatus,
    priority: "Baixa" as Priority,
    createdAt: new Date('2025-04-25T15:12:00')
  },
  {
    id: "#680a2a50",
    clientId: "1",
    clientName: "masdfgh",
    phone: "4567890",
    items: [
      {
        productId: "1",
        productName: "Pizza Calabresa",
        quantity: 1,
        size: "P",
        unitPrice: 32.90
      },
      {
        productId: "1",
        productName: "Pizza Calabresa",
        quantity: 1,
        size: "P",
        unitPrice: 32.90
      }
    ],
    total: 65.80,
    status: "Entregue" as OrderStatus,
    priority: "Baixa" as Priority,
    createdAt: new Date('2025-04-25T13:45:00'),
    preparationTime: 2
  }
];

// Dashboard data
export const dashboardData: DashboardData = {
  totalOrders: 24,
  totalOrdersChange: 20.1,
  totalClients: 23,
  totalClientsChange: 15,
  revenue: 2298.20,
  revenueChange: 10.5,
  pendingOrders: 0,
  pendingOrdersChange: -2,
  dailySales: [
    { day: "Seg", sales: 3500 },
    { day: "Ter", sales: 2800 },
    { day: "Qua", sales: 5000 },
    { day: "Qui", sales: 2700 },
    { day: "Sex", sales: 6500 },
    { day: "Sáb", sales: 8400 },
    { day: "Dom", sales: 4300 }
  ],
  topProducts: [
    { name: "Pizza Margherita", sales: 42, changePercentage: 12 },
    { name: "Pizza Calabresa", sales: 36, changePercentage: -8 }
  ],
  recentOrders: [orders[0]]
};

// Kitchen data
export const kitchenOrders = {
  pending: [] as Order[],
  preparing: [] as Order[],
  ready: [] as Order[],
  delivering: [] as Order[],
  delivered: [orders[0], orders[5]] as Order[]
};
