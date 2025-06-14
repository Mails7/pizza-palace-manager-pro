
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, CreditCard, Sparkles } from "lucide-react";
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
    <div className="space-y-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 shadow-lg">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <div className="p-2 bg-gradient-to-r from-pizza to-pizza-dark rounded-lg shadow-sm">
          <Clock className="h-4 w-4 text-white" />
        </div>
        <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          Detalhes do Pedido
        </span>
      </h3>

      {estimatedTime > 0 && (
        <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg border border-blue-200">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          <span className="text-sm text-gray-700 font-medium">Tempo estimado:</span>
          <Badge variant="outline" className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300">
            {formatTime(estimatedTime)}
          </Badge>
        </div>
      )}

      {orderType === "Entrega" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium flex items-center gap-2">
            <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded">
              <MapPin className="h-3 w-3 text-white" />
            </div>
            Endereço de Entrega
          </label>
          <Textarea
            placeholder="Digite o endereço completo para entrega..."
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            rows={2}
            className="bg-white/80 border-purple-200 focus:border-purple-400 transition-colors"
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium flex items-center gap-2">
          <div className="p-1 bg-gradient-to-r from-green-500 to-blue-500 rounded">
            <CreditCard className="h-3 w-3 text-white" />
          </div>
          Método de Pagamento
        </label>
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger className="bg-white/80 border-purple-200 focus:border-purple-400 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border border-purple-200 shadow-xl">
            <SelectItem value="Dinheiro" className="hover:bg-green-50">
              💵 Dinheiro
            </SelectItem>
            <SelectItem value="Cartão" className="hover:bg-blue-50">
              💳 Cartão
            </SelectItem>
            <SelectItem value="PIX" className="hover:bg-purple-50">
              📱 PIX
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          📝 Observações do Pedido
        </label>
        <Textarea
          placeholder="Observações especiais para o pedido..."
          value={orderNotes}
          onChange={(e) => setOrderNotes(e.target.value)}
          rows={2}
          className="bg-white/80 border-purple-200 focus:border-purple-400 transition-colors"
        />
      </div>
    </div>
  );
};

export default OrderDetailsSection;
