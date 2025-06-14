
import React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface ProductSearchProps {
  products: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onProductSelect: (product: any) => void;
  formatCurrency: (value: number) => string;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  products,
  searchTerm,
  setSearchTerm,
  onProductSelect,
  formatCurrency,
}) => {
  const filteredProducts = products.filter(
    (product) =>
      product.available &&
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
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

      <div className="max-h-96 overflow-y-auto space-y-2">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => onProductSelect(product)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.description}</p>
                <Badge variant="outline" className="mt-1">{product.category}</Badge>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  A partir de {formatCurrency(Math.min(...product.prices.map((p: any) => p.price)))}
                </p>
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            Nenhum produto encontrado
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
