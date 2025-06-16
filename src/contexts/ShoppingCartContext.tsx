
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OrderItem } from '@/types';

interface CartItem extends Omit<OrderItem, 'id'> {
  cartId: string;
}

interface ShoppingCartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'cartId'>) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, newQuantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export const ShoppingCartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  console.log('🛒 === SHOPPING CART PROVIDER INICIADO ===');

  // Carregar itens do localStorage na inicialização
  useEffect(() => {
    console.log('🛒 Carregando carrinho do localStorage...');
    const savedCart = localStorage.getItem('publicMenuCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log('🛒 Carrinho carregado do localStorage:', parsedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('🛒 Erro ao carregar carrinho:', error);
        localStorage.removeItem('publicMenuCart');
      }
    } else {
      console.log('🛒 Nenhum carrinho encontrado no localStorage');
    }
  }, []);

  // Salvar no localStorage sempre que o carrinho mudar
  useEffect(() => {
    console.log('🛒 Salvando carrinho no localStorage:', cartItems);
    localStorage.setItem('publicMenuCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, 'cartId'>) => {
    console.log('🛒 === FUNÇÃO ADD TO CART CHAMADA ===');
    console.log('🛒 Item recebido:', item);
    
    const cartId = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newItem: CartItem = {
      ...item,
      cartId
    };
    
    console.log('🛒 Novo item com cartId:', newItem);
    console.log('🛒 Estado atual do carrinho:', cartItems);
    
    setCartItems(prev => {
      const newCartItems = [...prev, newItem];
      console.log('🛒 Novo estado do carrinho após adição:', newCartItems);
      return newCartItems;
    });
    
    console.log('🛒 ✅ addToCart executado com sucesso');
  };

  const removeFromCart = (cartId: string) => {
    console.log('🛒 Removendo item do carrinho:', cartId);
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    
    console.log('🛒 Atualizando quantidade:', cartId, newQuantity);
    setCartItems(prev => prev.map(item => 
      item.cartId === cartId 
        ? { ...item, quantity: newQuantity, price: item.unitPrice * newQuantity }
        : item
    ));
  };

  const clearCart = () => {
    console.log('🛒 Limpando carrinho');
    setCartItems([]);
    localStorage.removeItem('publicMenuCart');
  };

  const getTotalItems = () => {
    const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    console.log('🛒 getTotalItems calculado:', total, 'baseado em:', cartItems);
    return total;
  };

  const getTotalPrice = () => {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    console.log('🛒 getTotalPrice calculado:', total, 'baseado em:', cartItems);
    return total;
  };

  // Log sempre que cartItems mudar
  useEffect(() => {
    console.log('🛒 === CART ITEMS ATUALIZADOS ===');
    console.log('🛒 Novos cartItems:', cartItems);
    console.log('🛒 Total de itens:', getTotalItems());
    console.log('🛒 Preço total:', getTotalPrice());
  }, [cartItems]);

  return (
    <ShoppingCartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </ShoppingCartContext.Provider>
  );
};

export const useShoppingCart = () => {
  const context = useContext(ShoppingCartContext);
  if (context === undefined) {
    throw new Error('useShoppingCart deve ser usado dentro de ShoppingCartProvider');
  }
  
  console.log('🛒 useShoppingCart hook chamado, contexto:', context);
  return context;
};
