
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import PageHeader from "@/components/PageHeader";
import EditProductModal from "@/components/modals/EditProductModal";
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
import { Search, Package, Eye, Edit, Trash2 } from "lucide-react";
import { Product } from "@/types";

const Produtos = () => {
  const { products, deleteProduct } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("Todas as Categorias");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
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
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    if (window.confirm(`Tem certeza que deseja excluir ${product.name}?`)) {
      deleteProduct(product.id);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="p-6">
      <PageHeader title="Produtos" actionLabel="Novo Produto" actionHref="/produtos/novo" />
      
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
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Todas as Categorias" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Preços</TableHead>
              <TableHead>Disponível</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="h-12 w-12 rounded overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-slate-100">
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-black text-white">
                    {product.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {product.prices.map((price, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{price.size}: {formatCurrency(price.price)}</span>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={product.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {product.available ? "Sim" : "Não"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => handleViewProduct(product)}
                      title="Visualizar produto"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => handleEditProduct(product)}
                      title="Editar produto"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => handleDeleteProduct(product)}
                      title="Excluir produto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditProductModal 
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        product={selectedProduct}
      />
    </div>
  );
};

export default Produtos;
