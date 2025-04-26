
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import ProductDetailModal from "@/components/modals/ProductDetailModal";

const CardapioPublico = () => {
  const { products } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);

  // Obter categorias únicas dos produtos
  const categories = ["all", ...Array.from(new Set(products.map(product => product.category)))];

  // Filtrar produtos por categoria e termo de pesquisa
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch && product.available;
  });

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsProductDetailOpen(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Nosso Cardápio</h1>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="all">Todos</TabsTrigger>
          {categories.slice(1).map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Card key={product.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300" onClick={() => handleProductClick(product)}>
                  {product.image && (
                    <div className="h-48">
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between pt-2">
                    <p className="font-medium">A partir de {formatCurrency(product.prices[0].price)}</p>
                    <Button size="sm" variant="ghost">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <ProductDetailModal 
        isOpen={isProductDetailOpen}
        onClose={() => setIsProductDetailOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default CardapioPublico;
