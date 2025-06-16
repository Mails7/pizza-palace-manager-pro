
import React from "react";
import { Search, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  category: string;
  available: boolean;
  prices: Array<{ size: string; price: number }>;
}

interface ProductsGridProps {
  products: Product[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchTerm: string;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  formatCurrency: (value: number) => string;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onProductClick,
  onAddToCart,
  formatCurrency
}) => {
  const categories = ["all", ...Array.from(new Set(products.map(product => product.category)))];

  const filterProducts = (category: string) => {
    return products.filter(product => {
      const matchesCategory = category === "all" || product.category === category;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch && product.available;
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Tabs defaultValue="all" value={selectedCategory} onValueChange={onCategoryChange} className="mb-4 sm:mb-6">
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="w-full overflow-x-auto">
            <TabsList className="bg-white shadow-lg rounded-xl p-1 flex gap-1 min-w-max mx-auto">
              <TabsTrigger 
                value="all" 
                className="rounded-lg px-3 sm:px-4 py-2 text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white whitespace-nowrap"
              >
                Todos
              </TabsTrigger>
              {Array.from(new Set(products.map(product => product.category))).map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="rounded-lg px-3 sm:px-4 py-2 text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white whitespace-nowrap"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {filterProducts(category).map(product => (
                <Card 
                  key={product.id} 
                  className="group overflow-hidden bg-white rounded-xl border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" 
                >
                  {product.image && (
                    <div className="h-36 sm:h-44 md:h-48 overflow-hidden rounded-t-xl">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" 
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2 p-3 sm:p-4">
                    <CardTitle className="text-base sm:text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-xs sm:text-sm text-gray-600">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center pt-0 p-3 sm:p-4">
                    <div>
                      <p className="text-xs text-gray-500">A partir de</p>
                      <p className="text-base sm:text-lg font-bold text-orange-600">
                        {formatCurrency(product.prices[0].price)}
                      </p>
                    </div>
                    <div className="flex gap-1 sm:gap-2">
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => onProductClick(product)}
                        className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm"
                      >
                        Ver
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => onAddToCart(product)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-2 sm:px-3 py-1.5 text-xs sm:text-sm"
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {filterProducts(category).length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-md mx-auto">
                  <Search className="h-10 sm:h-12 w-10 sm:w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">
                    Nenhum produto encontrado
                  </h3>
                  <p className="text-sm text-gray-500">
                    Tente buscar por outro termo ou categoria
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ProductsGrid;
