
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [observations, setObservations] = useState("");

  React.useEffect(() => {
    if (product && product.prices && product.prices.length > 0) {
      setSelectedSize(product.prices[0].size);
    }
  }, [product]);

  if (!product) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getSelectedPrice = () => {
    if (!selectedSize) return 0;
    const priceObj = product.prices.find((p: any) => p.size === selectedSize);
    return priceObj ? priceObj.price : 0;
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Selecione um tamanho");
      return;
    }
    
    // Simular adição ao carrinho
    toast.success("Produto adicionado ao carrinho!", {
      description: `${quantity}x ${product.name} (${selectedSize})`
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {product.image && (
            <div className="h-32 sm:h-40 w-full">
              <img 
                src={product.image} 
                alt={product.name} 
                className="h-full w-full object-cover rounded-lg" 
              />
            </div>
          )}
          
          <div>
            <p className="text-gray-700 mb-2 text-sm">{product.description}</p>
            <Badge variant="outline" className="text-xs">{product.category}</Badge>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tamanho</label>
            <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
              {product.prices.map((price: any, index: number) => (
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
                className="h-8 w-8"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="px-3 py-1 border rounded text-center min-w-12 text-sm">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Observações (opcional)</label>
            <Textarea
              placeholder="Observações especiais..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={2}
              className="text-sm"
            />
          </div>

          <div className="flex justify-between items-center border-t pt-4">
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="font-bold text-lg">
                {formatCurrency(getSelectedPrice() * quantity)}
              </p>
            </div>
            <Button onClick={handleAddToCart} disabled={!selectedSize} className="text-sm">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
