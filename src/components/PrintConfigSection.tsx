
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { usePrintService } from "@/hooks/usePrintService";
import { Printer, TestTube, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PrintConfigSection = () => {
  const { getPrintSettings, savePrintSettings, testPrint, isLoading } = usePrintService();
  const { toast } = useToast();
  const [settings, setSettings] = useState(getPrintSettings());

  useEffect(() => {
    setSettings(getPrintSettings());
  }, []);

  const handleSave = () => {
    savePrintSettings(settings);
    toast({
      title: "Configurações salvas",
      description: "Configurações de impressão salvas com sucesso!",
    });
  };

  const handleTestPrint = async () => {
    await testPrint();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Printer className="h-5 w-5" />
          Configurações de Impressão
        </CardTitle>
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
            checked={settings.autoprint}
            onCheckedChange={(checked) => setSettings({...settings, autoprint: checked})}
          />
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="printerName">Nome da Impressora</Label>
            <Select value={settings.printerName} onValueChange={(value) => setSettings({...settings, printerName: value})}>
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
            <Select value={settings.copies.toString()} onValueChange={(value) => setSettings({...settings, copies: parseInt(value)})}>
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
            checked={settings.printCustomerCopy}
            onCheckedChange={(checked) => setSettings({...settings, printCustomerCopy: checked})}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Imprimir Cópia da Cozinha</Label>
            <p className="text-sm text-gray-500">Imprimir pedido para a cozinha</p>
          </div>
          <Switch
            checked={settings.printKitchenCopy}
            onCheckedChange={(checked) => setSettings({...settings, printKitchenCopy: checked})}
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Como funciona a impressão:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• A impressão é feita através do navegador</li>
            <li>• Configure sua impressora padrão no sistema</li>
            <li>• Os pedidos são formatados automaticamente</li>
            <li>• Você pode imprimir cópias separadas para cliente e cozinha</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Salvar Configurações
          </Button>
          <Button 
            variant="outline" 
            onClick={handleTestPrint}
            disabled={isLoading}
          >
            <TestTube className="h-4 w-4 mr-2" />
            {isLoading ? "Imprimindo..." : "Teste de Impressão"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrintConfigSection;
