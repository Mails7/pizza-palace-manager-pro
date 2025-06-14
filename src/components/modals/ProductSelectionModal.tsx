
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProductSearch from "./ProductSearch";
import ProductSelectionForm from "./ProductSelectionForm";
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
          <ProductSelectionForm
            selectedProduct={selectedProduct}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            quantity={quantity}
            setQuantity={setQuantity}
            observations={observations}
            setObservations={setObservations}
            isHalfPizza={isHalfPizza}
            setIsHalfPizza={setIsHalfPizza}
            flavor1={flavor1}
            setFlavor1={setFlavor1}
            flavor2={flavor2}
            setFlavor2={setFlavor2}
            hasCrust={hasCrust}
            setHasCrust={setHasCrust}
            selectedCrustFlavor={selectedCrustFlavor}
            setSelectedCrustFlavor={setSelectedCrustFlavor}
            pizzaProducts={pizzaProducts}
            onBack={() => setSelectedProduct(null)}
            onAddToOrder={handleAddToOrder}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductSelectionModal;
