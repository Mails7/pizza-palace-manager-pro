
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { Order, Priority } from "@/types";
import StatusBadge from "@/components/StatusBadge";
import PrioritySelect from "@/components/PrioritySelect";

interface OrdersTableProps {
  orders: Order[];
  onDeleteOrder: (id: string) => void;
  onEditOrder: (order: Order) => void;
  onPriorityChange: (orderId: string, priority: Priority) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onDeleteOrder,
  onEditOrder,
  onPriorityChange,
}) => {
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
          {orders.map((order) => (
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
                  onChange={(value) => onPriorityChange(order.id, value)} 
                />
              </TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => onEditOrder(order)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => onDeleteOrder(order.id)}
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
  );
};

export default OrdersTable;
