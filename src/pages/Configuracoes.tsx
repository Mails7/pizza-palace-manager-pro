
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";
import { 
  Settings, 
  Store, 
  Bell, 
  Printer, 
  CreditCard, 
  Users, 
  Shield,
  Save,
  Palette
} from "lucide-react";

const Configuracoes = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Estados para configurações da loja
  const [storeSettings, setStoreSettings] = useState({
    name: "Pizzaria do Kassio",
    phone: "(11) 99999-9999",
    email: "contato@pizzariadokassio.com",
    address: "Rua das Pizzas, 123",
    city: "São Paulo",
    zipCode: "01234-567",
    openTime: "18:00",
    closeTime: "23:30",
    deliveryFee: "5.00",
    minimumOrder: "25.00"
  });

  // Estados para notificações
  const [notifications, setNotifications] = useState({
    newOrders: true,
    orderUpdates: true,
    lowStock: true,
    dailyReports: false,
    emailNotifications: true,
    soundAlerts: true
  });

  // Estados para impressão
  const [printSettings, setPrintSettings] = useState({
    autoprint: true,
    printerName: "Impressora Principal",
    copies: 1,
    printCustomerCopy: true,
    printKitchenCopy: true
  });

  // Estados para pagamento
  const [paymentSettings, setPaymentSettings] = useState({
    acceptCash: true,
    acceptCard: true,
    acceptPix: true,
    cardFee: "3.5",
    pixDiscount: "5.0"
  });

  const handleSave = async () => {
    setIsLoading(true);
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram salvas com sucesso!",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader 
        title="Configurações" 
        actionLabel="Salvar Alterações"
        actionIcon={Save}
        onAction={handleSave}
      />

      <Tabs defaultValue="store" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Loja
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="print" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Impressão
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Pagamento
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Sistema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Loja</CardTitle>
              <CardDescription>
                Configure as informações básicas da sua pizzaria
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeName">Nome da Loja</Label>
                  <Input
                    id="storeName"
                    value={storeSettings.name}
                    onChange={(e) => setStoreSettings({...storeSettings, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={storeSettings.phone}
                    onChange={(e) => setStoreSettings({...storeSettings, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={storeSettings.email}
                    onChange={(e) => setStoreSettings({...storeSettings, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={storeSettings.address}
                    onChange={(e) => setStoreSettings({...storeSettings, address: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={storeSettings.city}
                    onChange={(e) => setStoreSettings({...storeSettings, city: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    value={storeSettings.zipCode}
                    onChange={(e) => setStoreSettings({...storeSettings, zipCode: e.target.value})}
                  />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="openTime">Horário de Abertura</Label>
                  <Input
                    id="openTime"
                    type="time"
                    value={storeSettings.openTime}
                    onChange={(e) => setStoreSettings({...storeSettings, openTime: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="closeTime">Horário de Fechamento</Label>
                  <Input
                    id="closeTime"
                    type="time"
                    value={storeSettings.closeTime}
                    onChange={(e) => setStoreSettings({...storeSettings, closeTime: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryFee">Taxa de Entrega (R$)</Label>
                  <Input
                    id="deliveryFee"
                    type="number"
                    step="0.01"
                    value={storeSettings.deliveryFee}
                    onChange={(e) => setStoreSettings({...storeSettings, deliveryFee: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="minimumOrder">Pedido Mínimo (R$)</Label>
                  <Input
                    id="minimumOrder"
                    type="number"
                    step="0.01"
                    value={storeSettings.minimumOrder}
                    onChange={(e) => setStoreSettings({...storeSettings, minimumOrder: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Personalize como você recebe notificações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Novos Pedidos</Label>
                  <p className="text-sm text-gray-500">Receber notificação quando um novo pedido for feito</p>
                </div>
                <Switch
                  checked={notifications.newOrders}
                  onCheckedChange={(checked) => setNotifications({...notifications, newOrders: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Atualizações de Pedidos</Label>
                  <p className="text-sm text-gray-500">Notificar sobre mudanças de status dos pedidos</p>
                </div>
                <Switch
                  checked={notifications.orderUpdates}
                  onCheckedChange={(checked) => setNotifications({...notifications, orderUpdates: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Estoque Baixo</Label>
                  <p className="text-sm text-gray-500">Alertar quando produtos estiverem em falta</p>
                </div>
                <Switch
                  checked={notifications.lowStock}
                  onCheckedChange={(checked) => setNotifications({...notifications, lowStock: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Relatórios Diários</Label>
                  <p className="text-sm text-gray-500">Receber relatório de vendas diário por email</p>
                </div>
                <Switch
                  checked={notifications.dailyReports}
                  onCheckedChange={(checked) => setNotifications({...notifications, dailyReports: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-gray-500">Receber notificações também por email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications({...notifications, emailNotifications: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertas Sonoros</Label>
                  <p className="text-sm text-gray-500">Reproduzir som quando receber notificações</p>
                </div>
                <Switch
                  checked={notifications.soundAlerts}
                  onCheckedChange={(checked) => setNotifications({...notifications, soundAlerts: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="print" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Impressão</CardTitle>
              <CardDescription>
                Configure como os pedidos são impressos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Impressão Automática</Label>
                  <p className="text-sm text-gray-500">Imprimir automaticamente quando um pedido chegar</p>
                </div>
                <Switch
                  checked={printSettings.autoprint}
                  onCheckedChange={(checked) => setPrintSettings({...printSettings, autoprint: checked})}
                />
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="printerName">Nome da Impressora</Label>
                  <Select value={printSettings.printerName} onValueChange={(value) => setPrintSettings({...printSettings, printerName: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Impressora Principal">Impressora Principal</SelectItem>
                      <SelectItem value="Impressora Cozinha">Impressora Cozinha</SelectItem>
                      <SelectItem value="Impressora Balcão">Impressora Balcão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="copies">Número de Cópias</Label>
                  <Select value={printSettings.copies.toString()} onValueChange={(value) => setPrintSettings({...printSettings, copies: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Cópia</SelectItem>
                      <SelectItem value="2">2 Cópias</SelectItem>
                      <SelectItem value="3">3 Cópias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Imprimir Cópia do Cliente</Label>
                  <p className="text-sm text-gray-500">Imprimir comprovante para o cliente</p>
                </div>
                <Switch
                  checked={printSettings.printCustomerCopy}
                  onCheckedChange={(checked) => setPrintSettings({...printSettings, printCustomerCopy: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Imprimir Cópia da Cozinha</Label>
                  <p className="text-sm text-gray-500">Imprimir pedido para a cozinha</p>
                </div>
                <Switch
                  checked={printSettings.printKitchenCopy}
                  onCheckedChange={(checked) => setPrintSettings({...printSettings, printKitchenCopy: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Formas de Pagamento</CardTitle>
              <CardDescription>
                Configure as formas de pagamento aceitas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dinheiro</Label>
                  <p className="text-sm text-gray-500">Aceitar pagamento em dinheiro</p>
                </div>
                <Switch
                  checked={paymentSettings.acceptCash}
                  onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, acceptCash: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cartão</Label>
                  <p className="text-sm text-gray-500">Aceitar pagamento com cartão</p>
                </div>
                <Switch
                  checked={paymentSettings.acceptCard}
                  onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, acceptCard: checked})}
                />
              </div>
              {paymentSettings.acceptCard && (
                <div>
                  <Label htmlFor="cardFee">Taxa do Cartão (%)</Label>
                  <Input
                    id="cardFee"
                    type="number"
                    step="0.1"
                    value={paymentSettings.cardFee}
                    onChange={(e) => setPaymentSettings({...paymentSettings, cardFee: e.target.value})}
                  />
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>PIX</Label>
                  <p className="text-sm text-gray-500">Aceitar pagamento via PIX</p>
                </div>
                <Switch
                  checked={paymentSettings.acceptPix}
                  onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, acceptPix: checked})}
                />
              </div>
              {paymentSettings.acceptPix && (
                <div>
                  <Label htmlFor="pixDiscount">Desconto PIX (%)</Label>
                  <Input
                    id="pixDiscount"
                    type="number"
                    step="0.1"
                    value={paymentSettings.pixDiscount}
                    onChange={(e) => setPaymentSettings({...paymentSettings, pixDiscount: e.target.value})}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Sistema</CardTitle>
              <CardDescription>
                Informações sobre o sistema e configurações avançadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Versão do Sistema</Label>
                  <Badge variant="outline">v1.0.0</Badge>
                </div>
                <div className="space-y-2">
                  <Label>Última Atualização</Label>
                  <Badge variant="outline">14/06/2025</Badge>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Ações do Sistema</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    Fazer Backup
                  </Button>
                  <Button variant="outline" size="sm">
                    Limpar Cache
                  </Button>
                  <Button variant="outline" size="sm">
                    Exportar Dados
                  </Button>
                  <Button variant="outline" size="sm">
                    Ver Logs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="bg-black hover:bg-gray-800 text-white"
        >
          {isLoading ? "Salvando..." : "Salvar Todas as Configurações"}
        </Button>
      </div>
    </div>
  );
};

export default Configuracoes;
