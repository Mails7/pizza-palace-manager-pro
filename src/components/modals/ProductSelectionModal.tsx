
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ProductSearch from "./ProductSearch";
import ProductSizeSelector from "./ProductSizeSelector";
import PizzaOptionsSelector from "./PizzaOptionsSelector";
import QuantitySelector from "./QuantitySelector";

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (product: any, quantity: number, size: string, observations?: string, isHalfPizza?: boolean, halfPizzaFlavors?: any, hasCrust?: boolean) => void;
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
  const [isHalfPizza, setIsHalfPizza] = useState(false);
  const [flavor1, setFlavor1] = useState("");
  const [flavor2, setFlavor2] = useState("");
  const [hasCrust, setHasCrust] = useState(true);

  const pizzaProducts = products.filter(
    (product) => product.available && product.category.toLowerCase().includes('pizza')
  );

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setSelectedSize(product.prices[0]?.size || "");
    setQuantity(1);
    setObservations("");
    setIsHalfPizza(false);
    setFlavor1("");
    setFlavor2("");
    setHasCrust(true);
  };

  const handleAddToOrder = () => {
    if (selectedProduct && selectedSize && quantity > 0) {
      const isPizzaProduct = selectedProduct.category.toLowerCase().includes('pizza');
      const halfPizzaFlavors = isHalfPizza ? { flavor1, flavor2 } : undefined;
      
      if (isHalfPizza && (!flavor1 || !flavor2)) {
        alert("Para meia pizza, selecione dois sabores");
        return;
      }
      
      onAddItem(
        selectedProduct, 
        quantity, 
        selectedSize, 
        observations, 
        isHalfPizza, 
        halfPizzaFlavors, 
        isPizzaProduct ? hasCrust : undefined
      );
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setSelectedSize("");
    setQuantity(1);
    setObservations("");
    setIsHalfPizza(false);
    setFlavor1("");
    setFlavor2("");
    setHasCrust(true);
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

  const isPizzaProduct = selectedProduct && selectedProduct.category.toLowerCase().includes('pizza');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose();
    }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Selecionar Produto</DialogTitle>
        </DialogHeader>

        {!selectedProduct ? (
          <ProductSearch
            products={products}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onProductSelect={handleProductSelect}
            formatCurrency={formatCurrency}
          />
        ) : (
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium text-lg">{selectedProduct.name}</h3>
              <p className="text-sm text-gray-500">{selectedProduct.description}</p>
            </div>

            <ProductSizeSelector
              prices={selectedProduct.prices}
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
              formatCurrency={formatCurrency}
            />

            {isPizzaProduct && (
              <PizzaOptionsSelector
                isHalfPizza={isHalfPizza}
                setIsHalfPizza={setIsHalfPizza}
                flavor1={flavor1}
                setFlavor1={setFlavor1}
                flavor2={flavor2}
                setFlavor2={setFlavor2}
                hasCrust={hasCrust}
                setHasCrust={setHasCrust}
                pizzaProducts={pizzaProducts}
              />
            )}

            <QuantitySelector
              quantity={quantity}
              setQuantity={setQuantity}
            />

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
