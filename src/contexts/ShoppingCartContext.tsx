
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

  // Carregar itens do localStorage na inicialização
  useEffect(() => {
    const savedCart = localStorage.getItem('publicMenuCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        console.log('Carrinho carregado do localStorage:', parsedCart);
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        localStorage.removeItem('publicMenuCart');
      }
    }
  }, []);

  // Salvar no localStorage sempre que o carrinho mudar
  useEffect(() => {
    localStorage.setItem('publicMenuCart', JSON.stringify(cartItems));
    console.log('Carrinho salvo no localStorage:', cartItems);
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, 'cartId'>) => {
    const cartId = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newItem: CartItem = {
      ...item,
      cartId
    };
    console.log('Adicionando item ao carrinho:', newItem);
    setCartItems(prev => {
      const newCartItems = [...prev, newItem];
      console.log('Novo estado do carrinho:', newCartItems);
      return newCartItems;
    });
  };

  const removeFromCart = (cartId: string) => {
    console.log('Removendo item do carrinho:', cartId);
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    
    console.log('Atualizando quantidade:', cartId, newQuantity);
    setCartItems(prev => prev.map(item => 
      item.cartId === cartId 
        ? { ...item, quantity: newQuantity, price: item.unitPrice * newQuantity }
        : item
    ));
  };

  const clearCart = () => {
    console.log('Limpando carrinho');
    setCartItems([]);
    localStorage.removeItem('publicMenuCart');
  };

  const getTotalItems = () => {
    const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    console.log('Total de itens no carrinho:', total);
    return total;
  };

  const getTotalPrice = () => {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    console.log('Preço total do carrinho:', total);
    return total;
  };

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
  return context;
};
