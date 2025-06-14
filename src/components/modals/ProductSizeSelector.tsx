
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ProductSizeSelectorProps {
  prices: any[];
  selectedSize: string;
  onSizeChange: (size: string) => void;
  formatCurrency: (value: number) => string;
}

const ProductSizeSelector: React.FC<ProductSizeSelectorProps> = ({
  prices,
  selectedSize,
  onSizeChange,
  formatCurrency,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Tamanho</label>
      <RadioGroup value={selectedSize} onValueChange={onSizeChange}>
        {prices.map((price: any, index: number) => (
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
  );
};

export default ProductSizeSelector;
