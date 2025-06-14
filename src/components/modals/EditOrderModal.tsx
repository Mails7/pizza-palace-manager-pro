
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/contexts/AppContext";
import { Order, OrderStatus, Priority } from "@/types";
import { toast } from "@/components/ui/use-toast";

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({
  isOpen,
  onClose,
  order
}) => {
  const { updateOrderStatus, updateOrderPriority } = useApp();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [priority, setPriority] = useState<Priority>(order.priority);

  const handleSubmit = () => {
    if (status !== order.status) {
      updateOrderStatus(order.id, status);
    }
    
    if (priority !== order.priority) {
      updateOrderPriority(order.id, priority);
    }

    toast({
      title: "Pedido atualizado",
      description: `Pedido ${order.id} foi atualizado com sucesso.`
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Pedido #{order.id}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Cliente</Label>
            <Input value={order.clientName} disabled />
          </div>
          
          <div>
            <Label className="text-sm font-medium">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as OrderStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Em Preparo">Em Preparo</SelectItem>
                <SelectItem value="Pronto">Pronto</SelectItem>
                <SelectItem value="Em Entrega">Em Entrega</SelectItem>
                <SelectItem value="Entregue">Entregue</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Prioridade</Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Baixa">Baixa</SelectItem>
                <SelectItem value="Média">Média</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderModal;
