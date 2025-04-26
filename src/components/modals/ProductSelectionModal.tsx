
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Minus } from "lucide-react";
import { PizzaSize } from "@/types";

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (product: any, quantity: number, size: any, observations?: string) => void;
}

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
}) => {
  const { products } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<PizzaSize>("M");
  const [productType, setProductType] = useState<"whole" | "half">("whole");
  const [observations, setObservations] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setSize(product.prices[0].size);
    setStep(2);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      onAddItem(selectedProduct, quantity, size, observations);
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setStep(1);
    setQuantity(1);
    setSize("M");
    setProductType("whole");
    setObservations("");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const calculateTotal = () => {
    if (!selectedProduct) return 0;
    const priceObject = selectedProduct.prices.find((p: any) => p.size === size);
    return priceObject ? priceObject.price * quantity : 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        resetForm();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Adicionar ao Pedido" : selectedProduct?.name}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <>
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

            <div className="max-h-96 overflow-y-auto">
              {filteredProducts.length === 0 ? (
                <p className="text-center py-4 text-gray-500">
                  Nenhum produto encontrado
                </p>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center p-3 border-b cursor-pointer hover:bg-gray-50"
                    onClick={() => handleProductClick(product)}
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-md mr-3"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {product.description}
                      </p>
                      <p className="text-sm font-medium">
                        A partir de {formatCurrency(product.prices[0].price)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            {selectedProduct?.image && (
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}

            <p className="text-gray-700">{selectedProduct?.description}</p>

            {selectedProduct?.type === "pizza" && (
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
              <Select value={size} onValueChange={(value: any) => setSize(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedProduct?.prices.map((price: any) => (
                    <SelectItem key={price.size} value={price.size}>
                      {price.size} - {formatCurrency(price.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Voltar
                </Button>
                <Button onClick={handleAddToCart}>Adicionar ao Carrinho</Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductSelectionModal;
