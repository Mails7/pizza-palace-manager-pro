
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ProductSearch from "./ProductSearch";
import ProductSizeSelector from "./ProductSizeSelector";
import PizzaOptionsSelector from "./PizzaOptionsSelector";
import QuantitySelector from "./QuantitySelector";
import { PizzaSize } from "@/types";

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (
    product: any,
    quantity: number,
    size: string,
    observations?: string,
    isHalfPizza?: boolean,
    halfPizzaFlavors?: any,
    hasCrust?: boolean,
    crustFlavorName?: string,
    crustPrice?: number
  ) => void;
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
  const [selectedCrustFlavor, setSelectedCrustFlavor] = useState<string>("");

  // Encontra todos os produtos pizza disponíveis
  const pizzaProducts = products.filter(
    (product) => product.available && product.category?.toLowerCase().includes('pizza')
  );

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setSelectedSize(product.prices[0]?.size || "");
    setQuantity(1);
    setObservations("");
    setIsHalfPizza(false);
    setFlavor1("");
    setFlavor2("");
    setHasCrust(product.hasCrust ?? true);
    setSelectedCrustFlavor("");
  };

  const isPizzaProduct = selectedProduct && selectedProduct.category?.toLowerCase().includes('pizza');
  const hasBordaCampos = selectedProduct && selectedProduct.hasCrust && Array.isArray(selectedProduct.crustFlavors) && selectedProduct.crustFlavors.length > 0;

  const crustFlavorsArray = (selectedProduct && selectedProduct.crustFlavors) || [];
  const crustPricesArray = (selectedProduct && selectedProduct.crustPrices) || [];
  const selectedCrustPrice = crustPricesArray.find((p: { size: PizzaSize; price: number }) => p.size === selectedSize)?.price ?? 0;

  const handleAddToOrder = () => {
    if (selectedProduct && selectedSize && quantity > 0) {
      const isPizza = isPizzaProduct;
      const halfPizzaFlavors = isHalfPizza ? { flavor1, flavor2 } : undefined;
      
      if (isHalfPizza && (!flavor1 || !flavor2)) {
        alert("Para meia pizza, selecione dois sabores");
        return;
      }

      let crustFlavorName: string | undefined = undefined;
      let crustPrice: number | undefined = undefined;

      if (isPizza && hasBordaCampos && hasCrust) {
        crustFlavorName = selectedCrustFlavor;
        crustPrice = selectedCrustPrice;
      }

      onAddItem(
        selectedProduct,
        quantity,
        selectedSize,
        observations,
        isHalfPizza,
        halfPizzaFlavors,
        isPizza ? hasCrust : undefined,
        crustFlavorName,
        crustPrice
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
    setSelectedCrustFlavor("");
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
    let priceObj = selectedProduct.prices.find((p: any) => p.size === selectedSize);
    let basePrice = priceObj ? priceObj.price : 0;

    // Se for pizza com borda, some o preço da borda
    if (isPizzaProduct && hasCrust && hasBordaCampos && selectedCrustPrice > 0) {
      basePrice += selectedCrustPrice;
    }

    return basePrice;
  };

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

            {/* Pizza: opções padrão */}
            {isPizzaProduct && (
              <>
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

                {/* Se a pizza tem sabores de borda e borda marcada, mostra campos para sabor e preço da borda */}
                {hasCrust && hasBordaCampos && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Sabor da borda
                    </label>
                    <select
                      className="border rounded px-2 py-1 w-full"
                      value={selectedCrustFlavor}
                      onChange={e => setSelectedCrustFlavor(e.target.value)}
                    >
                      <option value="">Selecione o sabor da borda</option>
                      {crustFlavorsArray.map((flavor: { id: string; name: string }) => (
                        <option key={flavor.id} value={flavor.name}>
                          {flavor.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs mt-1">
                      Preço da borda: <strong>{formatCurrency(selectedCrustPrice)}</strong>
                    </p>
                  </div>
                )}
              </>
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
