import React, { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Search, User, Star, Clock, MapPin, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import ProductDetailModal from "@/components/modals/ProductDetailModal";
import ClientDataForm from "@/components/forms/ClientDataForm";
import ShoppingCartModal from "@/components/modals/ShoppingCartModal";
import FloatingCartButton from "@/components/FloatingCartButton";
import { ShoppingCartProvider, useShoppingCart } from "@/contexts/ShoppingCartContext";

interface ClientData {
  name: string;
  phone: string;
  email: string;
  address: string;
}

const CardapioPublicoContent = () => {
  const { products } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  const { 
    addToCart, 
    getTotalItems, 
    getTotalPrice, 
    cartItems 
  } = useShoppingCart();

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

  const handleAddToCart = (product: any) => {
    const defaultSize = product.prices[0]?.size || "M";
    const defaultPrice = product.prices[0]?.price || 0;
    
    const cartItem = {
      productId: product.id,
      productName: product.name,
      quantity: 1,
      price: defaultPrice,
      unitPrice: defaultPrice,
      size: defaultSize,
      preparationTime: product.preparationTime || 15
    };

    console.log('Tentando adicionar ao carrinho:', cartItem);
    addToCart(cartItem);
    toast.success(`${product.name} adicionado ao carrinho!`);
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

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Carrinho vazio!");
      return;
    }
    
    // Aqui você pode implementar a lógica de checkout
    // Por exemplo, redirecionar para uma página de finalização
    toast.success("Redirecionando para finalização do pedido...");
    console.log("Dados do pedido:", {
      cliente: clientData,
      itens: cartItems,
      total: getTotalPrice()
    });
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 animate-fade-in">
                Nosso Cardápio
              </h1>
              <p className="text-base sm:text-lg lg:text-xl mb-4 opacity-90 max-w-2xl">
                Sabores únicos que despertam seus sentidos
              </p>
              <div className="flex flex-col sm:flex-row gap-3 text-sm justify-center lg:justify-start">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Clock className="h-4 w-4" />
                  <span>Aberto das 18h às 23h</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <MapPin className="h-4 w-4" />
                  <span>Delivery disponível</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Star className="h-4 w-4" />
                  <span>4.8 estrelas</span>
                </div>
              </div>
            </div>
            
            {clientData && (
              <div className="w-full sm:w-auto lg:w-64 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center gap-3 text-white mb-3">
                  <User className="h-5 w-5" />
                  <span className="font-medium text-sm sm:text-base">
                    Olá, {clientData.name.split(' ')[0]}!
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white hover:bg-white/20 w-full text-sm"
                >
                  Alterar Dados
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              className="pl-10 h-10 sm:h-12 text-sm sm:text-base border-2 border-gray-200 focus:border-orange-500 rounded-lg"
              placeholder="Buscar seus pratos favoritos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Tabs */}
        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory} className="mb-4 sm:mb-6">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-full overflow-x-auto">
              <TabsList className="bg-white shadow-lg rounded-xl p-1 flex gap-1 min-w-max mx-auto">
                <TabsTrigger 
                  value="all" 
                  className="rounded-lg px-3 sm:px-4 py-2 text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white whitespace-nowrap"
                >
                  Todos
                </TabsTrigger>
                {categories.slice(1).map(category => (
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

          {/* Products Grid */}
          {categories.map(category => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {filteredProducts.map(product => (
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
                          onClick={() => handleProductClick(product)}
                          className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm"
                        >
                          Ver
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-2 sm:px-3 py-1.5 text-xs sm:text-sm"
                        >
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {filteredProducts.length === 0 && (
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

      {/* Footer */}
      <div className="bg-gray-800 text-white py-6 sm:py-8 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm sm:text-base mb-2">Obrigado por escolher nosso restaurante!</p>
          <p className="text-xs sm:text-sm text-gray-400">Fazemos com amor, servimos com carinho ❤️</p>
        </div>
      </div>

      {/* Floating Cart Button */}
      <FloatingCartButton
        itemCount={getTotalItems()}
        totalPrice={getTotalPrice()}
        onClick={() => setIsCartOpen(true)}
      />

      {/* Modals */}
      <ProductDetailModal 
        isOpen={isProductDetailOpen}
        onClose={() => setIsProductDetailOpen(false)}
        product={selectedProduct}
      />

      <ShoppingCartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

const CardapioPublico = () => {
  return (
    <ShoppingCartProvider>
      <CardapioPublicoContent />
    </ShoppingCartProvider>
  );
};

export default CardapioPublico;
