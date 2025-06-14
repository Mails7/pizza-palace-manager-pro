
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
        return "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 hover:from-amber-200 hover:to-yellow-200 border border-amber-300 shadow-sm";
      case "Em Preparo":
        return "bg-gradient-to-r from-blue-100 to-sky-100 text-blue-800 hover:from-blue-200 hover:to-sky-200 border border-blue-300 shadow-sm";
      case "Pronto":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 hover:from-green-200 hover:to-emerald-200 border border-green-300 shadow-sm";
      case "Em Entrega":
        return "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 hover:from-purple-200 hover:to-violet-200 border border-purple-300 shadow-sm";
      case "Entregue":
        return "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 hover:from-slate-200 hover:to-gray-200 border border-slate-300 shadow-sm";
      case "Cancelado":
        return "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 hover:from-red-200 hover:to-rose-200 border border-red-300 shadow-sm";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 hover:from-gray-200 hover:to-slate-200 border border-gray-300 shadow-sm";
    }
  };

  return (
    <Badge className={`font-semibold transition-all duration-200 ${getStatusColor(status)}`} variant="outline">
      {status}
    </Badge>
  );
};

export default StatusBadge;
