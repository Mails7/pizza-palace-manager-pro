
import { useState, useEffect } from 'react';
import { OrderItem } from '@/types';

interface CartItem extends Omit<OrderItem, 'id'> {
  cartId: string;
}

export const useShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Carregar itens do localStorage na inicialização
  useEffect(() => {
    const savedCart = localStorage.getItem('publicMenuCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        localStorage.removeItem('publicMenuCart');
      }
    }
  }, []);

  // Salvar no localStorage sempre que o carrinho mudar
  useEffect(() => {
    localStorage.setItem('publicMenuCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, 'cartId'>) => {
    const cartId = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newItem: CartItem = {
      ...item,
      cartId
    };
    setCartItems(prev => [...prev, newItem]);
  };

  const removeFromCart = (cartId: string) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    
    setCartItems(prev => prev.map(item => 
      item.cartId === cartId 
        ? { ...item, quantity: newQuantity, price: item.unitPrice * newQuantity }
        : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('publicMenuCart');
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.price, 0);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };
};
