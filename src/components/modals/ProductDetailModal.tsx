
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import { PizzaSize } from "@/types";
import { toast } from "@/components/ui/sonner";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<PizzaSize>(product?.prices[0]?.size || "M");
  const [productType, setProductType] = useState<"whole" | "half">("whole");
  const [observations, setObservations] = useState("");

  if (!product) return null;

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    toast.success("Produto adicionado ao carrinho", {
      description: `${quantity}x ${product.name} (${size})`
    });
    onClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const calculateTotal = () => {
    const priceObject = product.prices.find((p: any) => p.size === size);
    return priceObject ? priceObject.price * quantity : 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}

          <p className="text-gray-700">{product.description}</p>

          {product.type === "pizza" && (
            <div>
              <p className="mb-2 font-medium">Tipo</p>
              <RadioGroup
                value={productType}
                onValueChange={(value: any) => setProductType(value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="whole" id="whole" />
                  <label htmlFor="whole">Pizza Inteira</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="half" id="half" />
                  <label htmlFor="half">Meia Pizza</label>
                </div>
              </RadioGroup>
            </div>
          )}

          <div>
            <p className="mb-2 font-medium">Tamanho</p>
            <div className="grid grid-cols-4 gap-2">
              {product.prices.map((price: any) => (
                <Button
                  key={price.size}
                  type="button"
                  variant={size === price.size ? "default" : "outline"}
                  onClick={() => setSize(price.size)}
                  className="w-full"
                >
                  {price.size} <br />
                  <span className="text-xs">{formatCurrency(price.price)}</span>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium">Quantidade</p>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center">{quantity}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 10}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium">Observações</p>
            <Textarea
              placeholder="Alguma observação especial?"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
            />
          </div>

          <div className="pt-4 border-t flex justify-between items-center">
            <p className="font-bold">Total: {formatCurrency(calculateTotal())}</p>
            <Button onClick={handleAddToCart} className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
