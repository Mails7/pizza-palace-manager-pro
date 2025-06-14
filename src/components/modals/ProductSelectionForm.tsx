
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import ProductSizeSelector from "./ProductSizeSelector";
import PizzaOptionsSelector from "./PizzaOptionsSelector";
import QuantitySelector from "./QuantitySelector";
import ProductDetails from "./ProductDetails";
import ProductPriceCalculator from "./ProductPriceCalculator";
import ProductSelectionActions from "./ProductSelectionActions";
import { PizzaSize } from "@/types";

interface ProductSelectionFormProps {
  selectedProduct: any;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  observations: string;
  setObservations: (observations: string) => void;
  isHalfPizza: boolean;
  setIsHalfPizza: (value: boolean) => void;
  flavor1: string;
  setFlavor1: (flavor: string) => void;
  flavor2: string;
  setFlavor2: (flavor: string) => void;
  hasCrust: boolean;
  setHasCrust: (value: boolean) => void;
  selectedCrustFlavor: string;
  setSelectedCrustFlavor: (flavor: string) => void;
  pizzaProducts: any[];
  onBack: () => void;
  onAddToOrder: () => void;
}

const ProductSelectionForm: React.FC<ProductSelectionFormProps> = ({
  selectedProduct,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  observations,
  setObservations,
  isHalfPizza,
  setIsHalfPizza,
  flavor1,
  setFlavor1,
  flavor2,
  setFlavor2,
  hasCrust,
  setHasCrust,
  selectedCrustFlavor,
  setSelectedCrustFlavor,
  pizzaProducts,
  onBack,
  onAddToOrder,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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

  const crustFlavorsArray = (selectedProduct && selectedProduct.crustFlavors) || [];
  const crustPricesArray = (selectedProduct && selectedProduct.crustPrices) || [];
  const selectedCrustPrice = crustPricesArray.find((p: { size: PizzaSize; price: number }) => p.size === selectedSize)?.price ?? 0;

  return (
    <div className="space-y-4">
      <ProductDetails
        selectedProduct={selectedProduct}
        isPizzaProduct={isPizzaProduct}
        hasBordaCampos={hasBordaCampos}
        crustFlavorsArray={crustFlavorsArray}
      />

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

      <ProductPriceCalculator
        selectedProduct={selectedProduct}
        selectedSize={selectedSize}
        quantity={quantity}
        isPizzaProduct={isPizzaProduct}
        hasCrust={hasCrust}
        selectedCrustPrice={selectedCrustPrice}
      />
      
      <ProductSelectionActions
        onBack={onBack}
        onAddToOrder={onAddToOrder}
        selectedSize={selectedSize}
      />
    </div>
  );
};

export default ProductSelectionForm;
