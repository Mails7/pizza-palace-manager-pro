
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useShoppingCart } from '@/hooks/useShoppingCart';

interface ShoppingCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const ShoppingCartModal: React.FC<ShoppingCartModalProps> = ({
  isOpen,
  onClose,
  onCheckout
}) => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalPrice 
  } = useShoppingCart();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleCheckout = () => {
    onCheckout();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Seu Carrinho ({cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'})
          </DialogTitle>
        </DialogHeader>

        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Carrinho vazio
            </h3>
            <p className="text-gray-500 mb-4">
              Adicione produtos do cardápio ao seu carrinho
            </p>
            <Button onClick={onClose}>
              Continuar Comprando
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Lista de itens */}
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.cartId} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.productName}</h4>
                      {item.observations && (
                        <p className="text-sm text-gray-600 mt-1">
                          Obs: {item.observations}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Badge variant="secondary" className="px-3 py-1">
                        {item.quantity}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.unitPrice)} cada
                      </p>
                      <p className="font-semibold text-orange-600">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Total */}
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-orange-600">
                  {formatCurrency(getTotalPrice())}
                </span>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={clearCart}
                className="flex-1"
              >
                Limpar Carrinho
              </Button>
              <Button
                onClick={handleCheckout}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                Finalizar Pedido
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShoppingCartModal;
