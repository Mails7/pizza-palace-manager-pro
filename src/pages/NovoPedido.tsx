
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import { toast } from "@/components/ui/sonner";
import { ShoppingBag } from "lucide-react";
import { OrderType, PaymentMethod, OrderItem } from "@/types";
import ClientInfoForm from "@/components/forms/ClientInfoForm";
import CartSummary from "@/components/cart/CartSummary";
import OrderFormActions from "@/components/forms/OrderFormActions";

const NovoPedido = () => {
  const navigate = useNavigate();
  const { addOrder, tables } = useApp();
  const { cartItems, clearCart, getTotalPrice } = useShoppingCart();

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("Balcão");
  const [selectedTable, setSelectedTable] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Dinheiro");
  const [orderNotes, setOrderNotes] = useState("");

  // Carregar dados do cliente do localStorage se existirem
  useEffect(() => {
    const savedClientData = localStorage.getItem('cardapioClientData');
    if (savedClientData) {
      try {
        const clientData = JSON.parse(savedClientData);
        setClientName(clientData.name || "");
        setClientPhone(clientData.phone || "");
        setDeliveryAddress(clientData.address || "");
      } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
      }
    }
  }, []);

  // Se não há itens no carrinho, redirecionar para pedidos
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/pedidos");
    }
  }, [cartItems, navigate]);

  const getEstimatedPreparationTime = () => {
    const maxTime = Math.max(...cartItems.map(item => item.preparationTime || 15));
    return maxTime + Math.floor(cartItems.length / 3) * 5;
  };

  const handleSubmit = () => {
    if (!clientName.trim()) {
      toast.error("Nome do cliente é obrigatório");
      return;
    }

    if (!clientPhone.trim()) {
      toast.error("Telefone do cliente é obrigatório");
      return;
    }

    if (orderType === "Entrega" && !deliveryAddress.trim()) {
      toast.error("Endereço de entrega é obrigatório");
      return;
    }

    if (orderType === "Mesa" && !selectedTable) {
      toast.error("Selecione uma mesa");
      return;
    }

    // Converter itens do carrinho para OrderItem
    const orderItems: OrderItem[] = cartItems.map(cartItem => ({
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId: cartItem.productId,
      productName: cartItem.productName,
      quantity: cartItem.quantity,
      price: cartItem.unitPrice,
      unitPrice: cartItem.unitPrice,
      size: cartItem.size,
      observations: cartItem.observations || "",
      preparationTime: cartItem.preparationTime || 15
    }));

    const orderData = {
      clientName: clientName.trim(),
      clientId: `client-${Date.now()}`,
      phone: clientPhone.trim(),
      items: orderItems,
      total: getTotalPrice(),
      status: "Pendente" as const,
      priority: "Média" as const,
      orderType,
      paymentMethod,
      notes: orderNotes.trim(),
      estimatedTime: getEstimatedPreparationTime(),
      ...(orderType === "Mesa" && selectedTable && { tableId: selectedTable }),
      ...(orderType === "Entrega" && { deliveryAddress: deliveryAddress.trim() }),
    };

    console.log('Criando pedido:', orderData);
    addOrder(orderData);
    clearCart();
    toast.success("Pedido criado com sucesso!");
    navigate("/pedidos");
  };

  const handleBack = () => {
    navigate("/cardapio-publico");
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-orange-600" />
            Finalizar Pedido
          </h1>
          <p className="text-gray-600">Confirme os dados e finalize seu pedido</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário do Pedido */}
          <div>
            <ClientInfoForm
              clientName={clientName}
              setClientName={setClientName}
              clientPhone={clientPhone}
              setClientPhone={setClientPhone}
              deliveryAddress={deliveryAddress}
              setDeliveryAddress={setDeliveryAddress}
              orderType={orderType}
              setOrderType={setOrderType}
              selectedTable={selectedTable}
              setSelectedTable={setSelectedTable}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              orderNotes={orderNotes}
              setOrderNotes={setOrderNotes}
              tables={tables}
            />
            
            <OrderFormActions
              onBack={handleBack}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Resumo do Pedido */}
          <CartSummary
            cartItems={cartItems}
            orderType={orderType}
            paymentMethod={paymentMethod}
            selectedTable={selectedTable}
            tables={tables}
            getTotalPrice={getTotalPrice}
            getEstimatedPreparationTime={getEstimatedPreparationTime}
          />
        </div>
      </div>
    </div>
  );
};

export default NovoPedido;
