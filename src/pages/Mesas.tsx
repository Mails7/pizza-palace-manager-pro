
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Edit, Trash2, Settings, Calendar, UserCheck, Receipt } from "lucide-react";
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
      return { status: "Reservada", color: "bg-yellow-100 text-yellow-800" };
    }
    
    if (tableOrders.length > 0) {
      return { status: "Com Pedidos", color: "bg-blue-100 text-blue-800" };
    }
    
    if (table.isAvailable) {
      return { status: "Disponível", color: "bg-green-100 text-green-800" };
    }
    
    return { status: "Ocupada", color: "bg-red-100 text-red-800" };
  };

  return (
    <>
      <div className="p-6">
        <PageHeader title="Mesas" actionLabel="Nova Mesa" actionHref="/mesas/nova" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tables.map((table) => {
            const tableOrders = getTableOrders(table.id);
            const tableTotal = getTableTotal(table.id);
            const tableStatus = getTableStatus(table);
            
            return (
              <Card key={table.id} className="relative hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-1">Mesa {table.name}</h3>
                      <div className="flex items-center text-gray-500 mb-2">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{table.capacity} lugares</span>
                      </div>
                      
                      {table.attendant && (
                        <div className="flex items-center text-gray-500 mb-2">
                          <UserCheck className="h-4 w-4 mr-2" />
                          <span className="text-sm">{table.attendant}</span>
                        </div>
                      )}
                      
                      {table.isReserved && table.reservationName && (
                        <div className="flex items-center text-gray-500 mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="text-sm">{table.reservationName}</span>
                        </div>
                      )}
                    </div>
                    
                    <Badge variant="outline" className={tableStatus.color}>
                      {tableStatus.status}
                    </Badge>
                  </div>
                  
                  {/* Informações dos pedidos */}
                  {tableOrders.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Receipt className="h-4 w-4 mr-1" />
                          <span>{tableOrders.length} pedido(s)</span>
                        </div>
                        <span className="text-sm font-medium text-green-600">
                          {formatCurrency(tableTotal)}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {tableOrders.slice(0, 2).map((order, index) => (
                          <div key={index}>
                            {order.clientName} - {order.items.length} itens
                          </div>
                        ))}
                        {tableOrders.length > 2 && (
                          <div>+ {tableOrders.length - 2} pedido(s)...</div>
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
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => handleEditTable(table)}
                      title="Editar Mesa"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => deleteTable(table.id)}
                      title="Excluir Mesa"
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
