
import React from "react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
} from "recharts";
import { ShoppingBag, Users, DollarSign, Clock, ArrowDown, ArrowUp } from "lucide-react";

const Dashboard = () => {
  const { dashboardData } = useApp();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon 
  }: { 
    title: string, 
    value: string | number, 
    change: number, 
    icon: React.ReactNode 
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            <div className="flex items-center mt-2 text-xs">
              {change > 0 ? (
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={change > 0 ? "text-green-600" : "text-red-600"}>
                {change > 0 ? "+" : ""}{change}% em relação ao mês passado
              </span>
            </div>
          </div>
          <div className="bg-gray-100 p-2 rounded-md">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  const ProductRow = ({ name, sales, changePercentage }: { name: string, sales: number, changePercentage: number }) => (
    <div className="mb-6">
      <div className="flex justify-between mb-1">
        <span className="font-medium">{name}</span>
        <span className={`flex items-center ${changePercentage > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {changePercentage > 0 ? (
            <ArrowUp className="h-4 w-4 inline mr-1" />
          ) : (
            <ArrowDown className="h-4 w-4 inline mr-1" />
          )}
          {Math.abs(changePercentage)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${changePercentage > 0 ? 'bg-blue-600' : 'bg-purple-600'} h-2 rounded-full`} 
          style={{ width: `${Math.min(100, sales)}%` }}
        ></div>
      </div>
    </div>
  );
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Pedidos Totais" 
          value={dashboardData.totalOrders} 
          change={dashboardData.totalOrdersChange} 
          icon={<ShoppingBag className="h-6 w-6 text-gray-700" />} 
        />
        <StatCard 
          title="Clientes" 
          value={dashboardData.totalClients} 
          change={dashboardData.totalClientsChange} 
          icon={<Users className="h-6 w-6 text-gray-700" />} 
        />
        <StatCard 
          title="Faturamento" 
          value={formatCurrency(dashboardData.revenue)} 
          change={dashboardData.revenueChange} 
          icon={<DollarSign className="h-6 w-6 text-gray-700" />} 
        />
        <StatCard 
          title="Pedidos Pendentes" 
          value={dashboardData.pendingOrders} 
          change={dashboardData.pendingOrdersChange} 
          icon={<Clock className="h-6 w-6 text-gray-700" />} 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Visão Geral de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dashboardData.dailySales}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis 
                    domain={[0, 10000]}
                    ticks={[0, 2500, 5000, 7500, 10000]}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#8884d8"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {dashboardData.topProducts.map((product, index) => (
                <ProductRow
                  key={index}
                  name={product.name}
                  sales={product.sales}
                  changePercentage={product.changePercentage}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.recentOrders.map((order, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-500 mr-2">{order.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="mr-2 bg-red-100 text-red-800 px-2 py-0.5 rounded-sm text-xs">Cancelado</span>
                  <span>{order.id} - {order.clientName}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{formatCurrency(order.total)}</span>
                  <span className="ml-4 text-gray-500">{order.items.length} itens</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
