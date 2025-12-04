
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Eye, Edit, Trash2, Sparkles, Star } from "lucide-react";
import { Product } from "@/types";
import { useNavigate } from "react-router-dom";

const Produtos = () => {
  const { products, deleteProduct } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("Todas as Categorias");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Get unique categories
  const categories = ["Todas as Categorias", ...new Set(products.map(product => product.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "Todas as Categorias" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleViewProduct = (product: Product) => {
    console.log("Visualizando produto:", product);
    // Aqui você pode implementar um modal de visualização ou navegar para uma página de detalhes
  };

  const handleEditProduct = (product: Product) => {
    navigate(`/produtos/editar/${product.id}`);
  };

  const handleDeleteProduct = (product: Product) => {
    if (window.confirm(`Tem certeza que deseja excluir ${product.name}?`)) {
      deleteProduct(product.id);
    }
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Produtos"
        actionLabel="✨ Novo Produto"
        actionHref="/produtos/novo"
      >
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          <span>Gerencie seus produtos com estilo</span>
        </div>
      </PageHeader>

      <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 mb-6 border border-purple-200">
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-purple-500" />
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Filtros Inteligentes
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
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48 border-purple-200 focus:border-purple-400 bg-white/70">
              <SelectValue placeholder="📂 Todas as Categorias" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-purple-200 shadow-xl">
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="hover:bg-purple-50">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden border border-purple-200">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Star className="h-5 w-5" />
            Lista de Produtos ({filteredProducts.length})
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
              <TableHead className="font-semibold text-purple-700">🖼️ Imagem</TableHead>
              <TableHead className="font-semibold text-purple-700">📝 Nome</TableHead>
              <TableHead className="font-semibold text-purple-700">🏷️ Categoria</TableHead>
              <TableHead className="font-semibold text-purple-700">🔖 Tipo</TableHead>
              <TableHead className="font-semibold text-purple-700">💰 Preços</TableHead>
              <TableHead className="font-semibold text-purple-700">✅ Disponível</TableHead>
              <TableHead className="text-right font-semibold text-purple-700">⚙️ Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product, index) => (
              <TableRow
                key={product.id}
                className={`hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 border-b border-purple-100 ${index % 2 === 0 ? 'bg-white' : 'bg-purple-25'
                  }`}
              >
                <TableCell>
                  <div className="h-14 w-14 rounded-xl overflow-hidden shadow-lg border-2 border-purple-200 hover:scale-105 transition-transform duration-200">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-gray-800">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-300 hover:from-blue-200 hover:to-cyan-200 transition-all duration-200">
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-800 hover:to-black transition-all duration-200 shadow-md">
                    {product.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {product.prices.map((price, index) => (
                      <div key={index} className="text-sm bg-gradient-to-r from-green-50 to-emerald-50 p-2 rounded-lg border border-green-200">
                        <span className="font-medium text-green-800">
                          {price.size}: <span className="text-green-900 font-bold">{formatCurrency(price.price)}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={product.available
                      ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300 hover:from-green-200 hover:to-emerald-200"
                      : "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-300 hover:from-red-200 hover:to-rose-200"
                    }
                  >
                    {product.available ? "✅ Sim" : "❌ Não"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleViewProduct(product)}
                      title="Visualizar produto"
                      className="hover:bg-gradient-to-r hover:from-blue-100 hover:to-cyan-100 hover:text-blue-700 transition-all duration-200 rounded-full"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEditProduct(product)}
                      title="Editar produto"
                      className="hover:bg-gradient-to-r hover:from-yellow-100 hover:to-orange-100 hover:text-yellow-700 transition-all duration-200 rounded-full"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteProduct(product)}
                      title="Excluir produto"
                      className="hover:bg-gradient-to-r hover:from-red-100 hover:to-pink-100 hover:text-red-700 transition-all duration-200 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredProducts.length === 0 && (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
              <p className="text-gray-400 text-sm">Tente ajustar os filtros ou adicione novos produtos</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Produtos;
