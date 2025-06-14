
import React, { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import ProductDetailModal from "@/components/modals/ProductDetailModal";
import ClientDataForm from "@/components/forms/ClientDataForm";

interface ClientData {
  name: string;
  phone: string;
  email: string;
  address: string;
}

const CardapioPublico = () => {
  const { products } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  // Verificar se já existe dados do cliente salvos no localStorage
  useEffect(() => {
    const savedClientData = localStorage.getItem('cardapioClientData');
    if (savedClientData) {
      try {
        const parsedData = JSON.parse(savedClientData);
        setClientData(parsedData);
        setHasAccess(true);
      } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
        localStorage.removeItem('cardapioClientData');
      }
    }
  }, []);

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

  const handleClientDataSubmit = (data: ClientData) => {
    // Salvar dados no localStorage
    localStorage.setItem('cardapioClientData', JSON.stringify(data));
    setClientData(data);
    
    // Aguardar um pouco antes de dar acesso para mostrar o toast
    setTimeout(() => {
      setHasAccess(true);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('cardapioClientData');
    setClientData(null);
    setHasAccess(false);
    toast.success("Dados removidos com sucesso!");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Se não tem acesso, mostrar o formulário de dados
  if (!hasAccess) {
    return <ClientDataForm onSubmit={handleClientDataSubmit} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <h1 className="text-3xl font-bold">Nosso Cardápio</h1>
          {clientData && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>Olá, {clientData.name.split(' ')[0]}!</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700"
              >
                Sair
              </Button>
            </div>
          )}
        </div>
        
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
