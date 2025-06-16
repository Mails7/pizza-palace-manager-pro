
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag } from 'lucide-react';

interface FloatingCartButtonProps {
  itemCount: number;
  totalPrice: number;
  onClick: () => void;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({
  itemCount,
  totalPrice,
  onClick
}) => {
  console.log('🛒 === FLOATING CART BUTTON RENDERIZADO ===');
  console.log('🛒 Props recebidas:', { itemCount, totalPrice });
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Sempre renderizar quando itemCount > 0
  if (itemCount === 0) {
    console.log('🛒 ❌ FloatingCartButton não renderizado - itemCount é 0');
    return null;
  }

  console.log('🛒 ✅ FloatingCartButton será renderizado');

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={() => {
          console.log('🛒 FloatingCartButton clicado!');
          onClick();
        }}
        size="lg"
        className="bg-orange-500 hover:bg-orange-600 text-white shadow-2xl rounded-full px-6 py-4 h-auto animate-pulse hover:animate-none transition-all transform hover:scale-105"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBag className="h-6 w-6" />
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
              {itemCount}
            </Badge>
          </div>
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-sm font-medium">Ver Carrinho</span>
            <span className="text-xs opacity-90">{formatCurrency(totalPrice)}</span>
          </div>
        </div>
      </Button>
    </div>
  );
};

export default FloatingCartButton;
