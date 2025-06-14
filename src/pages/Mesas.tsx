
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Edit, Trash2, Settings, Calendar, UserCheck, Receipt, Star } from "lucide-react";
import TableManagementModal from "@/components/modals/TableManagementModal";

const Mesas = () => {
  const { tables, deleteTable, orders } = useApp();
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);

  const handleManageTable = (table: any) => {
    setSelectedTable(table);
    setIsManagementModalOpen(true);
  };

  const handleEditTable = (table: any) => {
    setSelectedTable(table);
    setIsManagementModalOpen(true);
  };

  const getTableOrders = (tableId: string) => {
    return orders.filter(order => 
      order.tableId === tableId && 
      order.status !== "Entregue" && 
      order.status !== "Cancelado"
    );
  };

  const getTableTotal = (tableId: string) => {
    const tableOrders = getTableOrders(tableId);
    return tableOrders.reduce((sum, order) => sum + order.total, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getTableStatus = (table: any) => {
    const tableOrders = getTableOrders(table.id);
    
    if (table.isReserved) {
      return { 
        status: "Reservada", 
        color: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200",
        cardBg: "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200"
      };
    }
    
    if (tableOrders.length > 0) {
      return { 
        status: "Com Pedidos", 
        color: "bg-gradient-to-r from-blue-100 to-sky-100 text-blue-800 border border-blue-200",
        cardBg: "bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200"
      };
    }
    
    if (table.isAvailable) {
      return { 
        status: "Disponível", 
        color: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200",
        cardBg: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
      };
    }
    
    return { 
      status: "Ocupada", 
      color: "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200",
      cardBg: "bg-gradient-to-br from-red-50 to-rose-50 border-red-200"
    };
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <PageHeader title="Mesas" actionLabel="Nova Mesa" actionHref="/mesas/nova" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tables.map((table) => {
            const tableOrders = getTableOrders(table.id);
            const tableTotal = getTableTotal(table.id);
            const tableStatus = getTableStatus(table);
            
            return (
              <Card key={table.id} className={`relative hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 ${tableStatus.cardBg}`}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pizza-light to-pizza animate-pulse"></div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                          Mesa {table.name}
                        </h3>
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Users className="h-4 w-4 mr-2 text-pizza" />
                        <span>{table.capacity} lugares</span>
                      </div>
                      
                      {table.attendant && (
                        <div className="flex items-center text-gray-600 mb-2">
                          <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                          <span className="text-sm font-medium">{table.attendant}</span>
                        </div>
                      )}
                      
                      {table.isReserved && table.reservationName && (
                        <div className="flex items-center text-gray-600 mb-2">
                          <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                          <span className="text-sm font-medium">{table.reservationName}</span>
                        </div>
                      )}
                    </div>
                    
                    <Badge variant="outline" className={`${tableStatus.color} font-semibold shadow-sm`}>
                      {tableStatus.status}
                    </Badge>
                  </div>
                  
                  {/* Informações dos pedidos */}
                  {tableOrders.length > 0 && (
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border border-gray-200 shadow-inner">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-sm text-gray-700">
                          <Receipt className="h-4 w-4 mr-2 text-pizza" />
                          <span className="font-medium">{tableOrders.length} pedido(s)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-bold text-green-600">
                            {formatCurrency(tableTotal)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-600 space-y-1">
                        {tableOrders.slice(0, 2).map((order, index) => (
                          <div key={index} className="flex justify-between items-center bg-white p-2 rounded border">
                            <span className="font-medium">{order.clientName}</span>
                            <span className="text-pizza">{order.items.length} itens</span>
                          </div>
                        ))}
                        {tableOrders.length > 2 && (
                          <div className="text-center text-pizza font-medium">
                            + {tableOrders.length - 2} pedido(s)...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => handleManageTable(table)}
                      title="Gerenciar Mesa"
                      className="hover:bg-purple-100 hover:text-purple-700 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => handleEditTable(table)}
                      title="Editar Mesa"
                      className="hover:bg-blue-100 hover:text-blue-700 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => deleteTable(table.id)}
                      title="Excluir Mesa"
                      className="hover:bg-red-100 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {selectedTable && (
        <TableManagementModal
          isOpen={isManagementModalOpen}
          onClose={() => {
            setIsManagementModalOpen(false);
            setSelectedTable(null);
          }}
          table={selectedTable}
        />
      )}
    </>
  );
};

export default Mesas;
