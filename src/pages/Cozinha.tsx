
import React from "react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, RefreshCw } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import { Switch } from "@/components/ui/switch";
import { OrderStatus } from "@/types";

const Cozinha = () => {
  const { kitchenOrders, updateOrderStatus, autoUpdateEnabled, toggleAutoUpdate } = useApp();
  
  const moveToNextStatus = (orderId: string, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus;
    
    switch (currentStatus) {
      case 'Pendente':
        nextStatus = 'Em Preparo';
        break;
      case 'Em Preparo':
        nextStatus = 'Pronto';
        break;
      case 'Pronto':
        nextStatus = 'Em Entrega';
        break;
      case 'Em Entrega':
        nextStatus = 'Entregue';
        break;
      default:
        return;
    }
    
    updateOrderStatus(orderId, nextStatus);
  };
  
  const OrderItem = ({ productName, quantity, size, observations }: { 
    productName: string, 
    quantity: number, 
    size: string,
    observations?: string 
  }) => (
    <div className="py-2 border-b border-gray-100 last:border-0">
      <div className="flex justify-between">
        <span className="font-medium">{quantity}x {productName}</span>
        <span className="text-sm text-gray-500">Tamanho: {size}</span>
      </div>
      {observations && (
        <p className="text-sm text-gray-500 mt-1">Obs: {observations}</p>
      )}
    </div>
  );
  
  const OrderCard = ({ 
    order, 
    statusLabel, 
    actionLabel, 
    nextAction 
  }: { 
    order: any, 
    statusLabel: string, 
    actionLabel: string,
    nextAction: () => void
  }) => (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle>
            Cliente: {order.clientName}
          </CardTitle>
          {order.preparationTime && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-sm text-gray-500">
                {order.preparationTime} min
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          {order.items.map((item: any, index: number) => (
            <OrderItem
              key={index}
              productName={item.productName}
              quantity={item.quantity}
              size={item.size}
              observations={item.observations}
            />
          ))}
        </div>
        <div className="flex justify-between">
          <Button onClick={nextAction} className="w-full">
            {actionLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
  
  const KitchenSection = ({ 
    title, 
    orders, 
    actionLabel, 
    count 
  }: { 
    title: string, 
    orders: any[],
    actionLabel: string,
    count: number
  }) => (
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Badge variant="outline" className="bg-gray-100">
          ({count})
        </Badge>
      </div>
      
      {orders.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 border-dashed rounded-lg p-6 text-center">
          <p className="text-gray-500">Nenhum pedido {title.toLowerCase()}</p>
        </div>
      ) : (
        <div>
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              statusLabel={order.status}
              actionLabel={actionLabel}
              nextAction={() => moveToNextStatus(order.id, order.status)}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Cozinha</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <span>Atualização automática:</span>
            <Switch 
              checked={autoUpdateEnabled}
              onCheckedChange={toggleAutoUpdate}
            />
          </div>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <KitchenSection
          title="Pendentes"
          orders={kitchenOrders.pending}
          actionLabel="Iniciar Preparo"
          count={kitchenOrders.pending.length}
        />
        
        <KitchenSection
          title="Em Preparo"
          orders={kitchenOrders.preparing}
          actionLabel="Marcar como Pronto"
          count={kitchenOrders.preparing.length}
        />
        
        <KitchenSection
          title="Prontos"
          orders={kitchenOrders.ready}
          actionLabel="Enviar para Entrega"
          count={kitchenOrders.ready.length}
        />
        
        <KitchenSection
          title="Em Entrega"
          orders={kitchenOrders.delivering}
          actionLabel="Confirmar Entrega"
          count={kitchenOrders.delivering.length}
        />
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold">Entregues</h2>
            <Badge variant="outline" className="bg-gray-100">
              ({kitchenOrders.delivered.length})
            </Badge>
          </div>
          
          {kitchenOrders.delivered.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 border-dashed rounded-lg p-6 text-center">
              <p className="text-gray-500">Nenhum pedido entregue</p>
            </div>
          ) : (
            <div>
              {kitchenOrders.delivered.map(order => (
                <Card key={order.id} className="mb-4">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>
                        <Badge variant="outline" className="bg-gray-100 text-gray-800 mr-2">Baixa</Badge>
                        Cliente: {order.clientName}
                      </CardTitle>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="text-sm text-gray-500">
                          {order.preparationTime || 0} min
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {order.items.map((item: any, index: number) => (
                        <OrderItem
                          key={index}
                          productName={item.productName}
                          quantity={item.quantity}
                          size={item.size}
                          observations={item.observations}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cozinha;
