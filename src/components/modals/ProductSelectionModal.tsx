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
  const [hasCrust, setHasCrust] = useState(false);
  const [selectedCrustFlavor, setSelectedCrustFlavor] = useState<string>("");

  // Encontra todos os produtos pizza disponíveis
  const pizzaProducts = products.filter(
    (product) => product.available && (
      product.category?.toLowerCase().includes('pizza') ||
      product.type?.toLowerCase().includes('pizza')
    )
  );

  const handleProductSelect = (product: any) => {
    console.log('=== PRODUTO SELECIONADO ===');
    console.log('Nome:', product.name);
    console.log('Categoria:', product.category);
    console.log('Type:', product.type);
    console.log('Produto completo:', product);
    
    setSelectedProduct(product);
    setSelectedSize(product.prices[0]?.size || "");
    setQuantity(1);
    setObservations("");
    setIsHalfPizza(false);
    setFlavor1("");
    setFlavor2("");
    
    // Verificar se é pizza baseado na categoria OU no type
    const isPizza = product.category?.toLowerCase().includes('pizza') || 
                   product.type?.toLowerCase().includes('pizza');
    console.log('É pizza?', isPizza);
    console.log('Categoria inclui pizza?', product.category?.toLowerCase().includes('pizza'));
    console.log('Type inclui pizza?', product.type?.toLowerCase().includes('pizza'));
    
    // Definir se tem borda baseado no produto
    const productHasCrust = isPizza && (product.hasCrust || product.crustFlavors?.length > 0);
    console.log('Produto tem borda?', productHasCrust);
    console.log('product.hasCrust:', product.hasCrust);
    console.log('product.crustFlavors:', product.crustFlavors);
    
    setHasCrust(productHasCrust);
    setSelectedCrustFlavor("");
  };

  // Verifica se o produto selecionado é uma pizza
  const isPizzaProduct = selectedProduct && (
    selectedProduct.category?.toLowerCase().includes('pizza') ||
    selectedProduct.type?.toLowerCase().includes('pizza')
  );
  
  // Verifica se o produto tem opções de borda configuradas
  const hasBordaCampos = selectedProduct && 
    (selectedProduct.hasCrust || 
     (Array.isArray(selectedProduct.crustFlavors) && selectedProduct.crustFlavors.length > 0));

  console.log('=== STATUS ATUAL ===');
  console.log('selectedProduct:', selectedProduct?.name);
  console.log('isPizzaProduct:', isPizzaProduct);
  console.log('hasBordaCampos:', hasBordaCampos);
  console.log('hasCrust state:', hasCrust);

  const crustFlavorsArray = (selectedProduct && selectedProduct.crustFlavors) || [];
  const crustPricesArray = (selectedProduct && selectedProduct.crustPrices) || [];
  const selectedCrustPrice = crustPricesArray.find((p: { size: PizzaSize; price: number }) => p.size === selectedSize)?.price ?? 0;

  const handleAddToOrder = () => {
    if (selectedProduct && selectedSize && quantity > 0) {
      const isPizza = isPizzaProduct;
      
      // Para meia pizza, agora só precisa do flavor2 (sabor adicional)
      let halfPizzaFlavors = undefined;
      if (isHalfPizza) {
        if (!flavor2) {
          alert("Para meia pizza, selecione o sabor adicional");
          return;
        }
        // O flavor1 será o nome da pizza principal, flavor2 é o adicional
        halfPizzaFlavors = { 
          flavor1: selectedProduct.name, 
          flavor2: flavor2 
        };
      }

      let crustFlavorName: string | undefined = undefined;
      let crustPrice: number | undefined = undefined;

      if (isPizza && hasCrust) {
        if (!selectedCrustFlavor) {
          alert("Para pizza com borda, selecione o sabor da borda");
          return;
        }
        crustFlavorName = selectedCrustFlavor;
        crustPrice = selectedCrustPrice;
      }

      console.log('Adicionando item:', {
        product: selectedProduct.name,
        isPizza,
        hasCrust,
        crustFlavorName,
        crustPrice,
        isHalfPizza,
        halfPizzaFlavors
      });

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
    setHasCrust(false);
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
    if (isPizzaProduct && hasCrust && selectedCrustPrice > 0) {
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
              <p className="text-xs text-blue-500">Categoria: {selectedProduct.category}</p>
              <p className="text-xs text-purple-500">Type: {selectedProduct.type}</p>
              
              {/* Debug info - remover depois */}
              <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                <p><strong>Debug:</strong></p>
                <p>isPizzaProduct: {isPizzaProduct ? 'SIM' : 'NÃO'}</p>
                <p>hasBordaCampos: {hasBordaCampos ? 'SIM' : 'NÃO'}</p>
                <p>selectedProduct.hasCrust: {selectedProduct.hasCrust ? 'SIM' : 'NÃO'}</p>
                <p>crustFlavors length: {crustFlavorsArray.length}</p>
                <p>Categoria inclui pizza: {selectedProduct.category?.toLowerCase().includes('pizza') ? 'SIM' : 'NÃO'}</p>
                <p>Type inclui pizza: {selectedProduct.type?.toLowerCase().includes('pizza') ? 'SIM' : 'NÃO'}</p>
              </div>
            </div>

            <ProductSizeSelector
              prices={selectedProduct.prices}
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
              formatCurrency={formatCurrency}
            />

            {/* Opções de Pizza - agora deve aparecer corretamente */}
            {isPizzaProduct && (
              <div className="border rounded-lg p-4 bg-blue-50">
                <h4 className="font-medium mb-3 text-blue-900">Opções da Pizza</h4>
                <p className="text-xs mb-3 text-gray-600">
                  Esta seção aparece para produtos de pizza
                </p>
                
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
                  selectedProduct={selectedProduct}
                  selectedCrustFlavor={selectedCrustFlavor}
                  setSelectedCrustFlavor={setSelectedCrustFlavor}
                />
              </div>
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
