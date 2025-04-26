
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import PrioritySelect from "@/components/PrioritySelect";
import EmptyState from "@/components/EmptyState";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Edit, Trash2, Search, UserPlus, X } from "lucide-react";
import { Priority } from "@/types";
import ClientSearchModal from "@/components/modals/ClientSearchModal";
import OrderFormModal from "@/components/modals/OrderFormModal";

const Pedidos = () => {
  const { orders, updateOrderStatus, deleteOrder } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [isClientSearchOpen, setIsClientSearchOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const handleClientSelected = (client: any) => {
    setSelectedClient(client);
    setIsClientSearchOpen(false);
    setIsOrderFormOpen(true);
  };

  const handleNewOrderClick = () => {
    setIsClientSearchOpen(true);
  };

  const handleOrderFormClose = () => {
    setIsOrderFormOpen(false);
    setSelectedClient(null);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const handlePriorityChange = (orderId: string, priority: Priority) => {
    // In a real app, we would update the order priority
    console.log(`Updating priority for order ${orderId} to ${priority}`);
  };
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "Todos" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Função para calcular o progresso do pedido
  const calculateProgress = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 20;
      case 'Em Preparo':
        return 40;
      case 'Pronto':
        return 60;
      case 'Em Entrega':
        return 80;
      case 'Entregue':
        return 100;
      case 'Cancelado':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="p-6">
      <PageHeader 
        title="Pedidos" 
        actionLabel="Novo Pedido" 
        onAction={handleNewOrderClick} 
      />
      
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Filtros</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Buscar por cliente ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Em Preparo">Em Preparo</SelectItem>
              <SelectItem value="Pronto">Pronto</SelectItem>
              <SelectItem value="Em Entrega">Em Entrega</SelectItem>
              <SelectItem value="Entregue">Entregue</SelectItem>
              <SelectItem value="Cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <EmptyState 
          message="Nenhum pedido encontrado"
          icon={<ShoppingBag className="h-12 w-12" />}
        />
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.clientName}</TableCell>
                  <TableCell>{order.phone}</TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="w-32">
                    <Progress value={calculateProgress(order.status)} className="h-2" />
                  </TableCell>
                  <TableCell>
                    <PrioritySelect 
                      value={order.priority} 
                      onChange={(value) => handlePriorityChange(order.id, value)} 
                    />
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => deleteOrder(order.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modal de busca de cliente */}
      <ClientSearchModal 
        isOpen={isClientSearchOpen}
        onClose={() => setIsClientSearchOpen(false)}
        onClientSelected={handleClientSelected}
      />

      {/* Modal de formulário de pedido */}
      {selectedClient && (
        <OrderFormModal 
          isOpen={isOrderFormOpen}
          onClose={handleOrderFormClose}
          client={selectedClient}
        />
      )}
    </div>
  );
};

export default Pedidos;
