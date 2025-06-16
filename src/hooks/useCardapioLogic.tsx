
import { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import { toast } from "@/components/ui/sonner";
import { OrderItem } from "@/types";

interface ClientData {
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface BannerConfig {
  title: string;
  subtitle: string;
  backgroundImage: string;
  storeName: string;
  operatingHours: string;
  deliveryInfo: string;
  rating: string;
}

export const useCardapioLogic = () => {
  const { products, addOrder, clients, addClient } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [bannerConfig, setBannerConfig] = useState<BannerConfig>({
    title: "🍕 Promoção Especial! 🍕",
    subtitle: "Pizzas grandes a partir de R$ 29,90",
    backgroundImage: "",
    storeName: "Pizzaria do Kassio",
    operatingHours: "18h às 23h",
    deliveryInfo: "Grátis ac. R$ 50",
    rating: "4.8 estrelas"
  });

  const { 
    addToCart, 
    getTotalItems, 
    getTotalPrice, 
    cartItems,
    clearCart 
  } = useShoppingCart();

  console.log('🎯 === CARDÁPIO PÚBLICO CARREGADO ===');
  console.log('📋 Função addOrder disponível:', typeof addOrder);
  console.log('📋 Produtos disponíveis:', products.length);
  console.log('👥 Clientes no sistema:', clients.length);

  // Log detalhado do carrinho sempre que mudar
  useEffect(() => {
    console.log('🛒 === ESTADO DO CARRINHO ATUALIZADO ===');
    console.log('🛒 Itens no carrinho:', cartItems);
    console.log('🛒 Quantidade total de itens:', getTotalItems());
    console.log('🛒 Preço total:', getTotalPrice());
    console.log('🛒 Deve mostrar FloatingCartButton?', getTotalItems() > 0);
  }, [cartItems, getTotalItems, getTotalPrice]);

  // Verificar se já existe dados do cliente salvos no localStorage
  useEffect(() => {
    const savedClientData = localStorage.getItem('cardapioClientData');
    if (savedClientData) {
      try {
        const parsedData = JSON.parse(savedClientData);
        setClientData(parsedData);
        setHasAccess(true);
        console.log('👤 Dados do cliente carregados:', parsedData);
      } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
        localStorage.removeItem('cardapioClientData');
      }
    }

    // Carregar configurações do banner
    const savedBannerConfig = localStorage.getItem('bannerConfig');
    if (savedBannerConfig) {
      try {
        const parsedConfig = JSON.parse(savedBannerConfig);
        setBannerConfig(parsedConfig);
      } catch (error) {
        console.error('Erro ao carregar configurações do banner:', error);
      }
    }
  }, []);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsProductDetailOpen(true);
  };

  const handleAddToCart = (product: any) => {
    console.log('🛒 === ADICIONANDO PRODUTO AO CARRINHO ===');
    console.log('🛒 Produto selecionado:', product);
    
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

    console.log('🛒 Item que será adicionado ao carrinho:', cartItem);
    
    try {
      addToCart(cartItem);
      console.log('🛒 ✅ Item adicionado com sucesso!');
      toast.success(`${product.name} adicionado ao carrinho!`);
    } catch (error) {
      console.error('🛒 ❌ Erro ao adicionar item ao carrinho:', error);
      toast.error("Erro ao adicionar item ao carrinho");
    }
  };

  const handleClientDataSubmit = (data: ClientData) => {
    console.log('👤 === DADOS DO CLIENTE SUBMETIDOS ===');
    console.log('👤 Dados recebidos:', data);
    
    localStorage.setItem('cardapioClientData', JSON.stringify(data));
    setClientData(data);
    
    setTimeout(() => {
      setHasAccess(true);
      console.log('✅ Acesso liberado para o cliente');
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('cardapioClientData');
    setClientData(null);
    setHasAccess(false);
    clearCart();
    toast.success("Dados removidos com sucesso!");
  };

  const getEstimatedPreparationTime = () => {
    const maxTime = Math.max(...cartItems.map(item => item.preparationTime || 15));
    return maxTime + Math.floor(cartItems.length / 3) * 5;
  };

  const handleCheckout = () => {
    console.log('🚀 === CHECKOUT CARDÁPIO PÚBLICO INICIADO ===');
    console.log('🛒 Itens no carrinho:', cartItems);
    console.log('📊 Total de itens:', cartItems.length);
    console.log('💰 Preço total:', getTotalPrice());
    console.log('👤 Dados do cliente:', clientData);

    if (cartItems.length === 0) {
      console.log('❌ Carrinho vazio - abortando checkout');
      toast.error("Carrinho vazio!");
      return;
    }

    if (!clientData || !clientData.name || !clientData.phone) {
      console.log('❌ Dados do cliente incompletos - abortando checkout');
      toast.error("Dados do cliente incompletos!");
      return;
    }

    try {
      const publicClientId = `public-client-${Date.now()}-${clientData.phone.replace(/\D/g, '').slice(-6)}`;
      console.log('🆔 ID do cliente público gerado:', publicClientId);

      const existingClient = clients.find(c => 
        c.phone === clientData.phone || 
        (c.name === clientData.name && c.phone === clientData.phone)
      );

      let finalClientId = publicClientId;

      if (!existingClient) {
        console.log('👤 Criando novo cliente no sistema...');
        
        const newClient = {
          name: clientData.name.trim(),
          phone: clientData.phone.trim(),
          address: clientData.address ? clientData.address.trim() : '',
          notes: 'Cliente criado via cardápio público'
        };

        console.log('👤 Dados do novo cliente:', newClient);
        addClient(newClient);
        finalClientId = publicClientId;
      } else {
        console.log('👤 Cliente já existe no sistema:', existingClient);
        finalClientId = existingClient.id;
      }

      const orderItems: OrderItem[] = cartItems.map((cartItem, index) => {
        const itemId = `item-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 6)}`;
        return {
          id: itemId,
          productId: cartItem.productId,
          productName: cartItem.productName,
          quantity: cartItem.quantity,
          price: cartItem.unitPrice,
          unitPrice: cartItem.unitPrice,
          size: cartItem.size,
          observations: cartItem.observations || "",
          preparationTime: cartItem.preparationTime || 15
        };
      });

      console.log('📦 Itens do pedido formatados:', orderItems);

      const orderData = {
        clientName: clientData.name.trim(),
        clientId: finalClientId,
        phone: clientData.phone.trim(),
        items: orderItems,
        total: getTotalPrice(),
        status: "Pendente" as const,
        priority: "Média" as const,
        orderType: "Entrega" as const,
        paymentMethod: "Dinheiro" as const,
        notes: `Pedido feito via cardápio público. Endereço: ${clientData.address || 'Não informado'}`,
        estimatedTime: getEstimatedPreparationTime(),
        deliveryAddress: clientData.address ? clientData.address.trim() : '',
      };

      console.log('✅ === DADOS FINAIS DO PEDIDO ===');
      console.log('📋 Pedido completo:', JSON.stringify(orderData, null, 2));

      if (typeof addOrder !== 'function') {
        throw new Error('addOrder não é uma função válida');
      }

      addOrder(orderData);
      
      console.log('🎉 === PEDIDO ENVIADO COM SUCESSO ===');
      
      clearCart();
      setIsCartOpen(false);
      
      toast.success("Pedido enviado com sucesso! 🎉");
      
      setTimeout(() => {
        toast.success("Seu pedido foi enviado para a cozinha! 👨‍🍳");
        toast.success("Acompanhe o status na tela da cozinha!");
      }, 1500);

    } catch (error) {
      console.error('❌ ERRO CRÍTICO no checkout:', error);
      toast.error("Erro ao criar pedido. Tente novamente.");
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return {
    // State
    products,
    searchTerm,
    selectedCategory,
    selectedProduct,
    isProductDetailOpen,
    isCartOpen,
    clientData,
    hasAccess,
    bannerConfig,
    // Shopping cart
    getTotalItems,
    getTotalPrice,
    cartItems,
    // Handlers
    setSearchTerm,
    setSelectedCategory,
    setIsProductDetailOpen,
    setIsCartOpen,
    handleProductClick,
    handleAddToCart,
    handleClientDataSubmit,
    handleLogout,
    handleCheckout,
    formatCurrency
  };
};
