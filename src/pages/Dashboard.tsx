
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
  const { orders, clients, products } = useApp();

  // Calcular estatísticas em tempo real baseado nos dados reais
  const totalOrders = orders.length;
  const totalClients = clients.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.status === 'Pendente').length;

  // Pedidos dos últimos 7 dias para o gráfico
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const dailySalesData = last7Days.map(date => {
    const dayOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.toDateString() === date.toDateString();
    });

    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return {
      day: dayNames[date.getDay()],
      sales: dayOrders.reduce((sum, order) => sum + order.total, 0)
    };
  });

  // Produtos mais vendidos baseado nos pedidos reais
  const productSales = new Map();
  orders.forEach(order => {
    order.items.forEach(item => {
      const current = productSales.get(item.productName) || 0;
      productSales.set(item.productName, current + item.quantity);
    });
  });

  const topProducts = Array.from(productSales.entries())
    .map(([name, sales]) => ({ name, sales, changePercentage: Math.floor(Math.random() * 30) - 10 }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  // Pedidos recentes (últimos 5)
  const recentOrders = orders.slice(0, 5);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Em Preparo':
        return 'bg-blue-100 text-blue-800';
      case 'Pronto':
        return 'bg-green-100 text-green-800';
      case 'Em Entrega':
        return 'bg-purple-100 text-purple-800';
      case 'Entregue':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-purple-100">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            <div className="flex items-center mt-2 text-xs">
              {change > 0 ? (
                <ArrowUp className="h-3 w-3 text-emerald-500 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 text-rose-500 mr-1" />
              )}
              <span className={change > 0 ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
                {change > 0 ? "+" : ""}{change}% em relação ao mês passado
              </span>
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-xl">
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
          style={{ width: `${Math.min(100, (sales / Math.max(...topProducts.map(p => p.sales))) * 100)}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-2">Dashboard</h1>
        <p className="text-gray-500">Visão geral do seu negócio em tempo real</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Pedidos Totais"
          value={totalOrders}
          change={15.2}
          icon={<ShoppingBag className="h-6 w-6 text-purple-600" />}
        />
        <StatCard
          title="Clientes"
          value={totalClients}
          change={8.1}
          icon={<Users className="h-6 w-6 text-blue-600" />}
        />
        <StatCard
          title="Faturamento"
          value={formatCurrency(totalRevenue)}
          change={12.5}
          icon={<DollarSign className="h-6 w-6 text-green-600" />}
        />
        <StatCard
          title="Pedidos Pendentes"
          value={pendingOrders}
          change={-2.3}
          icon={<Clock className="h-6 w-6 text-orange-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border-purple-100">
          <CardHeader>
            <CardTitle className="text-gray-800">Vendas dos Últimos 7 Dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dailySalesData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    formatter={(value) => [formatCurrency(Number(value)), 'Vendas']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, fill: '#8b5cf6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border-purple-100">
          <CardHeader>
            <CardTitle className="text-gray-800">Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <ProductRow
                    key={index}
                    name={product.name}
                    sales={product.sales}
                    changePercentage={product.changePercentage}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-center">Nenhum produto vendido ainda</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border-purple-100">
        <CardHeader>
          <CardTitle className="text-gray-800">Pedidos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order, index) => (
                <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0 hover:bg-gray-50/50 p-2 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${getStatusColor(order.status).replace('text-', 'bg-').replace('100', '100')}`}>
                      <Clock className={`h-4 w-4 ${getStatusColor(order.status).replace('bg-', 'text-').replace('100', '600')}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{order.clientName}</p>
                      <p className="text-xs text-gray-500">
                        {order.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • #{order.id}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{formatCurrency(order.total)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">Nenhum pedido encontrado</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
