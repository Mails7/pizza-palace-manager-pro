
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/contexts/AppContext";
import { Product, PizzaSize } from "@/types";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

const sizeLabels: { [key in PizzaSize]: string } = {
  MINI: "Mini",
  P: "P",
  M: "M",
  G: "G",
  GG: "GG",
};

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { updateProduct } = useApp();
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    available: true,
    prices: [] as { size: PizzaSize; price: number }[],
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        category: product.category,
        available: product.available,
        prices: product.prices.map(({ size, price }) => ({
          size,
          price,
        })),
      });
    }
  }, [product]);

  if (!product) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handlePriceChange = (size: PizzaSize, price: number) => {
    setForm((prev) => ({
      ...prev,
      prices: prev.prices.map((p) => (p.size === size ? { ...p, price } : p)),
    }));
  };

  const handleSave = () => {
    updateProduct(product.id, {
      name: form.name,
      description: form.description,
      category: form.category,
      available: form.available,
      prices: form.prices.map((p) => ({ size: p.size, price: Number(p.price) })),
    });
    onClose();
  };

  // reset form if closed
  useEffect(() => {
    if (!isOpen) {
      setForm({
        name: "",
        description: "",
        category: "",
        available: true,
        prices: [],
      });
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>
            Atualize as informações do produto abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              maxLength={48}
              className="w-full"
              placeholder="Nome do produto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              maxLength={120}
              className="w-full"
              placeholder="Descrição"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <Input
              name="category"
              value={form.category}
              onChange={handleChange}
              maxLength={32}
              className="w-full"
              placeholder="Categoria"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">Disponível</span>
            <Switch
              checked={form.available}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, available: checked }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 mb-2">
              Preços
            </label>
            <div className="space-y-2">
              {form.prices.map((p, idx) => (
                <div key={p.size} className="flex items-center gap-2">
                  <span className="w-14 text-xs text-gray-700">{sizeLabels[p.size]}</span>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={p.price}
                    onChange={e =>
                      handlePriceChange(p.size, Number(e.target.value))
                    }
                    className="w-32"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
