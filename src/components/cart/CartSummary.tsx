
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Clock, CreditCard, MapPin } from "lucide-react";
import { OrderType, PaymentMethod } from "@/types";
import { Table } from "@/types";

interface CartItem {
  cartId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  price: number;
  observations?: string;
  preparationTime?: number;
}

interface CartSummaryProps {
  cartItems: CartItem[];
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  selectedTable: string;
  tables: Table[];
  getTotalPrice: () => number;
  getEstimatedPreparationTime: () => number;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  cartItems,
  orderType,
  paymentMethod,
  selectedTable,
  tables,
  getTotalPrice,
  getEstimatedPreparationTime
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Resumo do Pedido
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.cartId} className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium text-gray-800">{item.productName}</h4>
                <Badge variant="secondary">{item.quantity}x</Badge>
              </div>
              {item.observations && (
                <p className="text-sm text-gray-600 mb-2">
                  Obs: {item.observations}
                </p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {formatCurrency(item.unitPrice)} cada
                </span>
                <span className="font-semibold text-orange-600">
                  {formatCurrency(item.price)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Tempo estimado:
            </span>
            <span className="font-medium">{getEstimatedPreparationTime()} min</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Forma de pagamento:
            </span>
            <span className="font-medium">{paymentMethod}</span>
          </div>

          {orderType === "Entrega" && (
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Tipo:
              </span>
              <span className="font-medium">Entrega</span>
            </div>
          )}

          {orderType === "Mesa" && selectedTable && (
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Mesa:
              </span>
              <span className="font-medium">
                {tables.find(t => t.id === selectedTable)?.name}
              </span>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total:</span>
            <span className="text-orange-600">
              {formatCurrency(getTotalPrice())}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartSummary;
