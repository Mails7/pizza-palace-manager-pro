
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Minus } from "lucide-react";

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (product: any, quantity: number, size: string, observations?: string) => void;
}

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
}) => {
  const { products } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [observations, setObservations] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.available &&
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setSelectedSize(product.prices[0]?.size || "");
    setQuantity(1);
    setObservations("");
  };

  const handleAddToOrder = () => {
    if (selectedProduct && selectedSize && quantity > 0) {
      onAddItem(selectedProduct, quantity, selectedSize, observations);
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setSelectedSize("");
    setQuantity(1);
    setObservations("");
    setSearchTerm("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getSelectedPrice = () => {
    if (!selectedProduct || !selectedSize) return 0;
    const priceObj = selectedProduct.prices.find((p: any) => p.size === selectedSize);
    return priceObj ? priceObj.price : 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose();
    }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Selecionar Produto</DialogTitle>
        </DialogHeader>

        {!selectedProduct ? (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => handleProductSelect(product)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.description}</p>
                      <Badge variant="outline" className="mt-1">{product.category}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        A partir de {formatCurrency(Math.min(...product.prices.map((p: any) => p.price)))}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  Nenhum produto encontrado
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium text-lg">{selectedProduct.name}</h3>
              <p className="text-sm text-gray-500">{selectedProduct.description}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tamanho</label>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                {selectedProduct.prices.map((price: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={price.size} id={`size-${index}`} />
                      <label htmlFor={`size-${index}`} className="text-sm">
                        {price.size}
                      </label>
                    </div>
                    <span className="text-sm font-medium">
                      {formatCurrency(price.price)}
                    </span>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Quantidade</label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 border rounded text-center min-w-16">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Observações (opcional)</label>
              <Textarea
                placeholder="Observações especiais..."
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-between items-center border-t pt-4">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-bold text-lg">
                  {formatCurrency(getSelectedPrice() * quantity)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                  Voltar
                </Button>
                <Button onClick={handleAddToOrder} disabled={!selectedSize}>
                  Adicionar ao Pedido
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductSelectionModal;
