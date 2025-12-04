
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AspectRatio } from "@/components/ui/aspect-ratio";
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

      <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 mb-6 border border-purple-100">
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-purple-500" />
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Filtros
          </span>
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
            <Input
              className="pl-10 border-purple-200 focus:border-purple-400 bg-white/70 transition-all duration-200"
              placeholder="🔍 Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="mb-6 bg-white/50 backdrop-blur-sm border border-purple-100 p-1 rounded-xl">
          <TabsTrigger value="all" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 rounded-lg">Todos</TabsTrigger>
          {categories.slice(1).map(category => (
            <TabsTrigger key={category} value={category} className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 rounded-lg">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <Card key={product.id} className={`bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-purple-100 ${!product.available ? "opacity-70" : ""}`}>
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="flex-1">
                    <CardTitle className="flex items-center mb-1 text-gray-800">
                      {product.name}
                      {!product.available && (
                        <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
                          Indisponível
                        </Badge>
                      )}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200">
                      {product.category}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)} className="hover:bg-purple-100 hover:text-purple-700 rounded-full">
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="mb-4">
                    <AspectRatio ratio={16 / 9} className="bg-muted rounded-xl overflow-hidden shadow-md">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                    </AspectRatio>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="space-y-2">
                    {product.prices.map((price: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm bg-purple-50/50 p-2 rounded-lg border border-purple-100">
                        <span className="text-gray-700">Tamanho {price.size}</span>
                        <span className="font-bold text-purple-700">{formatCurrency(price.price)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-4 border-t border-purple-100">
                  <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${product.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {product.available ? 'Disponível' : 'Indisponível'}
                  </span>
                  <Switch
                    checked={product.available}
                    onCheckedChange={(checked) => handleAvailabilityChange(product.id, checked)}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
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
