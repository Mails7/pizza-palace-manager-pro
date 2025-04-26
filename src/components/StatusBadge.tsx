
import React from "react";
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types";

interface StatusBadgeProps {
  status: OrderStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Pendente":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "Em Preparo":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Pronto":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Em Entrega":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "Entregue":
        return "bg-slate-100 text-slate-800 hover:bg-slate-100";
      case "Cancelado":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Badge className={`font-medium ${getStatusColor(status)}`} variant="outline">
      {status}
    </Badge>
  );
};

export default StatusBadge;
