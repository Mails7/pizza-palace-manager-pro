
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";
import { OrderType, PaymentMethod } from "@/types";
import { Table } from "@/types";

interface ClientInfoFormProps {
  clientName: string;
  setClientName: (name: string) => void;
  clientPhone: string;
  setClientPhone: (phone: string) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  selectedTable: string;
  setSelectedTable: (table: string) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
  tables: Table[];
}

const ClientInfoForm: React.FC<ClientInfoFormProps> = ({
  clientName,
  setClientName,
  clientPhone,
  setClientPhone,
  deliveryAddress,
  setDeliveryAddress,
  orderType,
  setOrderType,
  selectedTable,
  setSelectedTable,
  paymentMethod,
  setPaymentMethod,
  orderNotes,
  setOrderNotes,
  tables
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Dados do Pedido
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="clientName">Nome do Cliente *</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Digite o nome completo"
              required
            />
          </div>

          <div>
            <Label htmlFor="clientPhone">Telefone *</Label>
            <Input
              id="clientPhone"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="(00) 00000-0000"
              required
            />
          </div>

          <div>
            <Label htmlFor="orderType">Tipo do Pedido *</Label>
            <Select value={orderType} onValueChange={(value: OrderType) => setOrderType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Balcão">Balcão</SelectItem>
                <SelectItem value="Mesa">Mesa</SelectItem>
                <SelectItem value="Entrega">Entrega</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {orderType === "Mesa" && (
            <div>
              <Label htmlFor="table">Mesa *</Label>
              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma mesa" />
                </SelectTrigger>
                <SelectContent>
                  {tables
                    .filter(table => table.isAvailable)
                    .map((table) => (
                      <SelectItem key={table.id} value={table.id}>
                        {table.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {orderType === "Entrega" && (
            <div>
              <Label htmlFor="deliveryAddress">Endereço de Entrega *</Label>
              <Textarea
                id="deliveryAddress"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Endereço completo para entrega"
                rows={3}
                required
              />
            </div>
          )}

          <div>
            <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
            <Select value={paymentMethod} onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                <SelectItem value="Cartão">Cartão</SelectItem>
                <SelectItem value="PIX">PIX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="orderNotes">Observações</Label>
            <Textarea
              id="orderNotes"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="Observações adicionais sobre o pedido"
              rows={3}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInfoForm;
