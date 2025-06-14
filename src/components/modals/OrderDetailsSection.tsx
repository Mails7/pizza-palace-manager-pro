
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, CreditCard } from "lucide-react";
import { useFormatters } from "@/hooks/useFormatters";
import { OrderType } from "@/types";

interface OrderDetailsSectionProps {
  orderType: OrderType;
  paymentMethod: 'Dinheiro' | 'Cartão' | 'PIX';
  setPaymentMethod: (method: 'Dinheiro' | 'Cartão' | 'PIX') => void;
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  estimatedTime: number;
}

const OrderDetailsSection: React.FC<OrderDetailsSectionProps> = ({
  orderType,
  paymentMethod,
  setPaymentMethod,
  orderNotes,
  setOrderNotes,
  deliveryAddress,
  setDeliveryAddress,
  estimatedTime,
}) => {
  const { formatTime } = useFormatters();

  return (
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Detalhes do Pedido
      </h3>

      {estimatedTime > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Tempo estimado:</span>
          <Badge variant="outline">{formatTime(estimatedTime)}</Badge>
        </div>
      )}

      {orderType === "Entrega" && (
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Endereço de Entrega
          </label>
          <Textarea
            placeholder="Digite o endereço completo para entrega..."
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            rows={2}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Método de Pagamento
        </label>
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
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
        <label className="block text-sm font-medium mb-2">
          Observações do Pedido
        </label>
        <Textarea
          placeholder="Observações especiais para o pedido..."
          value={orderNotes}
          onChange={(e) => setOrderNotes(e.target.value)}
          rows={2}
        />
      </div>
    </div>
  );
};

export default OrderDetailsSection;
