import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Search, Edit, Share } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const Cardapio = () => {
  const { products, updateProduct } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const publicCardapioUrl = `${window.location.origin}/cardapio-publico`;

  // Obter categorias únicas dos produtos
  const categories = ["all", ...Array.from(new Set(products.map(product => product.category)))];

  // Filtrar produtos por categoria e termo de pesquisa
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleAvailabilityChange = (id: string, available: boolean) => {
    updateProduct(id, { available });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicCardapioUrl)
      .then(() => {
        toast.success("Link copiado para a área de transferência!");
      })
      .catch((err) => {
        toast.error("Erro ao copiar o link");
        console.error("Erro ao copiar: ", err);
      });
  };

  const handleEditProduct = (product: any) => {
    navigate(`/produtos/editar/${product.id}`);
  };

  return (
    <div className="p-6">
      <PageHeader 
        title="Cardápio" 
        actionLabel="Compartilhar Cardápio"
        actionIcon={Share}
        onAction={handleShare}
      />
      
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Filtros</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="mb-6">
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
                <Card key={product.id} className={!product.available ? "opacity-70" : ""}>
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div>
                      <CardTitle className="flex items-center">
                        {product.name}
                        {!product.available && (
                          <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 hover:bg-red-100">
                            Indisponível
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-2">{product.description}</p>
                    <div className="space-y-1">
                      {product.prices.map((price: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>Tamanho {price.size}</span>
                          <span className="font-medium">{formatCurrency(price.price)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t">
                    <span className="text-sm text-gray-500">
                      Disponível
                    </span>
                    <Switch 
                      checked={product.available} 
                      onCheckedChange={(checked) => handleAvailabilityChange(product.id, checked)}
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compartilhar Cardápio</DialogTitle>
            <DialogDescription>
              Compartilhe o cardápio com seus clientes através do link abaixo
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                readOnly
                value={publicCardapioUrl}
                className="w-full"
              />
            </div>
            <Button onClick={copyToClipboard}>
              Copiar
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              variant="secondary"
              onClick={() => {
                window.open(publicCardapioUrl, '_blank');
              }}
            >
              Abrir em nova aba
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cardapio;
