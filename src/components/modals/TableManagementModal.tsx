import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/contexts/AppContext";
import { Users, Plus, Calendar, UserCheck, Receipt, Split, Merge, Scissors } from "lucide-react";
import OrderFormModal from "./OrderFormModal";
import ClientSearchModal from "./ClientSearchModal";

interface TableManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: any;
}

const TableManagementModal: React.FC<TableManagementModalProps> = ({
  isOpen,
  onClose,
  table,
}) => {
  const { orders, clients, addOrder, updateTable, tables, addTable } = useApp();
  const [activeTab, setActiveTab] = useState("orders");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [attendant, setAttendant] = useState(table?.attendant || "");
  const [reservationName, setReservationName] = useState(table?.reservationName || "");
  const [reservationTime, setReservationTime] = useState(table?.reservationTime || "");
  const [reservationNotes, setReservationNotes] = useState(table?.reservationNotes || "");
  const [billSplit, setBillSplit] = useState({ people: 1, method: "equal" });
  const [selectedTableToMerge, setSelectedTableToMerge] = useState("");

  // Buscar pedidos da mesa
  const tableOrders = orders.filter(order => 
    order.tableId === table?.id && order.status !== "Entregue" && order.status !== "Cancelado"
  );

  // Calcular total da mesa
  const tableTotal = tableOrders.reduce((sum, order) => sum + order.total, 0);

  // Todos os itens da mesa
  const allTableItems = tableOrders.flatMap(order => 
    order.items.map(item => ({
      ...item,
      orderId: order.id,
      clientName: order.clientName
    }))
  );

  // Mesas disponíveis para juntar (excluindo a atual)
  const availableTablesForMerge = tables.filter(t => 
    t.id !== table?.id && t.isAvailable && !t.mergedWith?.length
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleSaveReservation = () => {
    updateTable(table.id, {
      reservationName,
      reservationTime,
      reservationNotes,
      isReserved: true,
      attendant
    });
  };

  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
    setIsClientModalOpen(false);
    setIsOrderModalOpen(true);
  };

  const handleOrderComplete = () => {
    setIsOrderModalOpen(false);
    setSelectedClient(null);
  };

  const handleMergeTables = () => {
    if (!selectedTableToMerge) return;
    
    const tableToMerge = tables.find(t => t.id === selectedTableToMerge);
    if (!tableToMerge) return;

    // Atualizar mesa principal
    updateTable(table.id, {
      mergedWith: [...(table.mergedWith || []), selectedTableToMerge],
      capacity: table.capacity + tableToMerge.capacity,
      name: `${table.name} + ${tableToMerge.name}`
    });

    // Marcar mesa secundária como não disponível
    updateTable(selectedTableToMerge, {
      isAvailable: false,
      notes: `Juntada com Mesa ${table.name}`
    });

    setSelectedTableToMerge("");
  };

  const handleSplitTable = () => {
    const splitCapacity = Math.floor(table.capacity / 2);
    
    // Criar nova mesa dividida
    const newTable = {
      name: `${table.name}B`,
      capacity: splitCapacity,
      isAvailable: true,
      location: table.location,
      isSplit: true,
      originalTableId: table.id
    };

    addTable(newTable);

    // Atualizar mesa original
    updateTable(table.id, {
      capacity: table.capacity - splitCapacity,
      name: `${table.name}A`
    });
  };

  const handleUnsplitTable = () => {
    if (!table.mergedWith?.length) return;

    // Restaurar mesas juntadas
    table.mergedWith.forEach((mergedTableId: string) => {
      const mergedTable = tables.find(t => t.id === mergedTableId);
      if (mergedTable) {
        updateTable(mergedTableId, {
          isAvailable: true,
          notes: ""
        });
      }
    });

    // Restaurar mesa principal
    updateTable(table.id, {
      mergedWith: [],
      capacity: table.capacity, // Seria necessário calcular a capacidade original
      name: table.name.split(' + ')[0] // Pegar apenas o primeiro nome
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) onClose();
      }}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Mesa {table?.name} - Gerenciamento
              {table?.mergedWith?.length > 0 && (
                <Badge variant="secondary">Mesa Juntada</Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="orders">Pedidos</TabsTrigger>
              <TabsTrigger value="reservation">Reserva</TabsTrigger>
              <TabsTrigger value="attendant">Atendente</TabsTrigger>
              <TabsTrigger value="payment">Pagamento</TabsTrigger>
              <TabsTrigger value="management">Gerenciar</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Pedidos da Mesa</h3>
                <Button
                  onClick={() => setIsClientModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Pedido
                </Button>
              </div>

              {tableOrders.length > 0 ? (
                <div className="space-y-4">
                  {tableOrders.map((order, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-sm">
                            Pedido {order.id} - {order.clientName}
                          </CardTitle>
                          <Badge variant="outline">{order.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {order.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.productName}</span>
                              <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
                            </div>
                          ))}
                          <Separator />
                          <div className="flex justify-between font-medium">
                            <span>Total do Pedido:</span>
                            <span>{formatCurrency(order.total)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center text-lg font-bold text-green-800">
                        <span>Total da Mesa:</span>
                        <span>{formatCurrency(tableTotal)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum pedido na mesa ainda</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="reservation" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reservationName">Nome da Reserva</Label>
                  <Input
                    id="reservationName"
                    value={reservationName}
                    onChange={(e) => setReservationName(e.target.value)}
                    placeholder="Nome do cliente"
                  />
                </div>
                
                <div>
                  <Label htmlFor="reservationTime">Horário da Reserva</Label>
                  <Input
                    id="reservationTime"
                    type="datetime-local"
                    value={reservationTime}
                    onChange={(e) => setReservationTime(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="reservationNotes">Observações</Label>
                  <Textarea
                    id="reservationNotes"
                    value={reservationNotes}
                    onChange={(e) => setReservationNotes(e.target.value)}
                    placeholder="Observações especiais da reserva..."
                    rows={3}
                  />
                </div>
                
                <Button onClick={handleSaveReservation} className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Salvar Reserva
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="attendant" className="space-y-4">
              <div>
                <Label htmlFor="attendant">Atendente Responsável</Label>
                <Input
                  id="attendant"
                  value={attendant}
                  onChange={(e) => setAttendant(e.target.value)}
                  placeholder="Nome do atendente"
                />
                <Button 
                  onClick={() => updateTable(table.id, { attendant })}
                  className="mt-4 w-full"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Atribuir Atendente
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="payment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Split className="h-5 w-5" />
                    Divisão da Conta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="people">Número de Pessoas</Label>
                      <Input
                        id="people"
                        type="number"
                        min="1"
                        value={billSplit.people}
                        onChange={(e) => setBillSplit({...billSplit, people: parseInt(e.target.value) || 1})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="method">Método de Divisão</Label>
                      <Select
                        value={billSplit.method}
                        onValueChange={(value) => setBillSplit({...billSplit, method: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equal">Dividir Igualmente</SelectItem>
                          <SelectItem value="items">Por Itens Consumidos</SelectItem>
                          <SelectItem value="custom">Valores Personalizados</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total da Mesa:</span>
                      <span>{formatCurrency(tableTotal)}</span>
                    </div>
                    
                    {billSplit.method === "equal" && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>Valor por Pessoa:</span>
                        <span>{formatCurrency(tableTotal / billSplit.people)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Itens da Mesa:</h4>
                    {allTableItems.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm border-b pb-1">
                        <span>{item.quantity}x {item.productName} ({item.clientName})</span>
                        <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="management" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Merge className="h-5 w-5" />
                    Juntar Mesas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="mergeTable">Selecionar mesa para juntar</Label>
                    <Select value={selectedTableToMerge} onValueChange={setSelectedTableToMerge}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha uma mesa" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTablesForMerge.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            Mesa {t.name} ({t.capacity} lugares)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleMergeTables}
                      disabled={!selectedTableToMerge}
                      className="flex-1"
                    >
                      <Merge className="h-4 w-4 mr-2" />
                      Juntar Mesas
                    </Button>
                    
                    {table?.mergedWith?.length > 0 && (
                      <Button 
                        onClick={handleUnsplitTable}
                        variant="outline"
                        className="flex-1"
                      >
                        Desfazer Junção
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scissors className="h-5 w-5" />
                    Dividir Mesa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Dividir esta mesa criará uma nova mesa com metade da capacidade.
                  </p>
                  <Button 
                    onClick={handleSplitTable}
                    variant="outline"
                    className="w-full"
                    disabled={table?.capacity < 2}
                  >
                    <Scissors className="h-4 w-4 mr-2" />
                    Dividir Mesa (Criar Mesa {table?.name}B)
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ClientSearchModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onClientSelected={handleClientSelect}
      />

      {selectedClient && (
        <OrderFormModal
          isOpen={isOrderModalOpen}
          onClose={handleOrderComplete}
          client={{
            ...selectedClient,
            tableId: table?.id
          }}
          forceTableOrder={true}
          tableId={table?.id}
        />
      )}
    </>
  );
};

export default TableManagementModal;
