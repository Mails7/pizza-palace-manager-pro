
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Edit, Trash2, Clock, MapPin, CreditCard } from "lucide-react";
import { Order, Priority } from "@/types";
import StatusBadge from "@/components/StatusBadge";
import PrioritySelect from "@/components/PrioritySelect";
import { useFormatters } from "@/hooks/useFormatters";

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
  const { formatDate, formatCurrency, formatTime, formatPhone } = useFormatters();
  
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

  const getPaymentMethodColor = (method?: string) => {
    switch (method) {
      case 'PIX':
        return 'bg-green-100 text-green-800';
      case 'Cartão':
        return 'bg-blue-100 text-blue-800';
      case 'Dinheiro':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progresso</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Tempo</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{order.clientName}</p>
                  {order.tableId && (
                    <Badge variant="outline" className="text-xs">
                      Mesa {order.tableId}
                    </Badge>
                  )}
                  {order.deliveryAddress && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate max-w-32">{order.deliveryAddress}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{formatPhone(order.phone)}</span>
              </TableCell>
              <TableCell className="font-medium">
                {formatCurrency(order.total)}
              </TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell className="w-24">
                <Progress value={calculateProgress(order.status)} className="h-2" />
              </TableCell>
              <TableCell>
                <PrioritySelect 
                  value={order.priority} 
                  onChange={(value) => onPriorityChange(order.id, value)} 
                />
              </TableCell>
              <TableCell>
                {order.preparationTime && (
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(order.preparationTime)}</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {order.paymentMethod && (
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getPaymentMethodColor(order.paymentMethod)}`}
                    >
                      {order.paymentMethod}
                    </Badge>
                  </div>
                )}
              </TableCell>
              <TableCell className="text-sm">
                {formatDate(order.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => onEditOrder(order)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => onDeleteOrder(order.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-3 w-3" />
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
