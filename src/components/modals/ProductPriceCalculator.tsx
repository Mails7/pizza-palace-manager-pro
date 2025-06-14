
import React from "react";

interface ProductPriceCalculatorProps {
  selectedProduct: any;
  selectedSize: string;
  quantity: number;
  isPizzaProduct: boolean;
  hasCrust: boolean;
  selectedCrustPrice: number;
}

const ProductPriceCalculator: React.FC<ProductPriceCalculatorProps> = ({
  selectedProduct,
  selectedSize,
  quantity,
  isPizzaProduct,
  hasCrust,
  selectedCrustPrice,
}) => {
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
    <div className="flex justify-between items-center border-t pt-4">
      <div>
        <p className="text-sm text-gray-500">Total</p>
        <p className="font-bold text-lg">
          {formatCurrency(getSelectedPrice() * quantity)}
        </p>
      </div>
    </div>
  );
};

export default ProductPriceCalculator;
