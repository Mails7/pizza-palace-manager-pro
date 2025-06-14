
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { ShoppingBag, User, Phone, MapPin, CreditCard, Clock } from "lucide-react";
import { OrderType, PaymentMethod, OrderItem } from "@/types";

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getEstimatedPreparationTime = () => {
    const maxTime = Math.max(...cartItems.map(item => item.preparationTime || 15));
    return maxTime + Math.floor(cartItems.length / 3) * 5;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Dados do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="clientName">Nome do Cliente *</Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="clientPhone">Telefone *</Label>
                  <Input
                    id="clientPhone"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="orderType">Tipo do Pedido *</Label>
                  <Select value={orderType} onValueChange={(value: OrderType) => setOrderType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Balcão">Balcão</SelectItem>
                      <SelectItem value="Mesa">Mesa</SelectItem>
                      <SelectItem value="Entrega">Entrega</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {orderType === "Mesa" && (
                  <div>
                    <Label htmlFor="table">Mesa *</Label>
                    <Select value={selectedTable} onValueChange={setSelectedTable}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma mesa" />
                      </SelectTrigger>
                      <SelectContent>
                        {tables
                          .filter(table => table.isAvailable)
                          .map((table) => (
                            <SelectItem key={table.id} value={table.id}>
                              {table.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {orderType === "Entrega" && (
                  <div>
                    <Label htmlFor="deliveryAddress">Endereço de Entrega *</Label>
                    <Textarea
                      id="deliveryAddress"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Endereço completo para entrega"
                      rows={3}
                      required
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
                  <Select value={paymentMethod} onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="Cartão">Cartão</SelectItem>
                      <SelectItem value="PIX">PIX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="orderNotes">Observações</Label>
                  <Textarea
                    id="orderNotes"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Observações adicionais sobre o pedido"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/cardapio-publico")}
                    className="flex-1"
                  >
                    Voltar ao Cardápio
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                  >
                    Finalizar Pedido
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Resumo do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Resumo do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.cartId} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-gray-800">{item.productName}</h4>
                      <Badge variant="secondary">{item.quantity}x</Badge>
                    </div>
                    {item.observations && (
                      <p className="text-sm text-gray-600 mb-2">
                        Obs: {item.observations}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {formatCurrency(item.unitPrice)} cada
                      </span>
                      <span className="font-semibold text-orange-600">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Tempo estimado:
                  </span>
                  <span className="font-medium">{getEstimatedPreparationTime()} min</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Forma de pagamento:
                  </span>
                  <span className="font-medium">{paymentMethod}</span>
                </div>

                {orderType === "Entrega" && (
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Tipo:
                    </span>
                    <span className="font-medium">Entrega</span>
                  </div>
                )}

                {orderType === "Mesa" && selectedTable && (
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Mesa:
                    </span>
                    <span className="font-medium">
                      {tables.find(t => t.id === selectedTable)?.name}
                    </span>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-orange-600">
                    {formatCurrency(getTotalPrice())}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NovoPedido;
