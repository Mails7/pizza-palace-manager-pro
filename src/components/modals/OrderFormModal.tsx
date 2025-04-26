
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Minus, Search } from "lucide-react";
import ProductSelectionModal from "./ProductSelectionModal";
import { OrderItem } from "@/types";
import { toast } from "@/components/ui/sonner";

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: any;
}

const OrderFormModal: React.FC<OrderFormModalProps> = ({
  isOpen,
  onClose,
  client,
}) => {
  const { tables, addOrder } = useApp();
  const [orderType, setOrderType] = useState<"delivery" | "takeaway" | "table">("delivery");
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [isProductSelectionOpen, setIsProductSelectionOpen] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([]);

  // Calcular o total do pedido
  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  };

  const handleAddItem = (product: any, quantity: number, size: any, observations?: string) => {
    setItems((prevItems) => [
      ...prevItems,
      {
        productId: product.id,
        productName: product.name,
        quantity,
        size,
        unitPrice: product.prices.find((p: any) => p.size === size).price,
        observations,
      },
    ]);
    setIsProductSelectionOpen(false);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (items.length === 0) {
      toast.error("Adicione pelo menos um produto ao pedido");
      return;
    }

    if (orderType === "table" && !selectedTable) {
      toast.error("Selecione uma mesa");
      return;
    }

    const newOrder = {
      clientId: client.id,
      clientName: client.name,
      phone: client.phone,
      items,
      total: calculateTotal(),
      status: "Pendente" as const,
      priority: "Média" as const,
      table: orderType === "table" ? selectedTable : undefined,
    };

    addOrder(newOrder);
    toast.success("Pedido criado com sucesso!");
    onClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) onClose();
      }}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Novo Pedido</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="mb-2 font-medium">Tipo de Pedido</p>
              <RadioGroup
                value={orderType}
                onValueChange={(value: any) => setOrderType(value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <label htmlFor="delivery">Delivery</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="takeaway" id="takeaway" />
                  <label htmlFor="takeaway">Retirada</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="table" id="table" />
                  <label htmlFor="table">Mesa</label>
                </div>
              </RadioGroup>
            </div>

            {orderType === "table" && (
              <div>
                <p className="mb-2 font-medium">Mesa</p>
                <Select value={selectedTable} onValueChange={setSelectedTable}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma mesa" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables
                      .filter((table) => table.isAvailable)
                      .map((table) => (
                        <SelectItem key={table.id} value={table.id}>
                          {table.name} ({table.capacity} lugares)
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <p className="mb-2 font-medium">Cliente</p>
              <div className="p-2 bg-gray-50 rounded-md">
                <p>{client.name} - {client.phone}</p>
                {client.address && <p className="text-sm text-gray-500">{client.address}</p>}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <p className="font-medium">Produtos</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsProductSelectionOpen(true)}
                >
                  Adicionar produto
                </Button>
              </div>

              {items.length === 0 ? (
                <div className="p-4 text-center border border-dashed rounded-md">
                  <p className="text-gray-500">Nenhum produto adicionado</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 border rounded-md"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {item.quantity}x {item.productName}
                          </span>
                          <Badge variant="outline">{item.size}</Badge>
                        </div>
                        {item.observations && (
                          <p className="text-sm text-gray-500">
                            Obs: {item.observations}
                          </p>
                        )}
                        <p className="text-sm">
                          {formatCurrency(item.unitPrice)} cada
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className="font-medium mr-2">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center border-t pt-4">
              <p className="font-bold">Total: {formatCurrency(calculateTotal())}</p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>Salvar Pedido</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ProductSelectionModal
        isOpen={isProductSelectionOpen}
        onClose={() => setIsProductSelectionOpen(false)}
        onAddItem={handleAddItem}
      />
    </>
  );
};

export default OrderFormModal;
