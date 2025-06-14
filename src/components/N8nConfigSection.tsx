
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useN8nIntegration } from "@/hooks/useN8nIntegration";
import { Webhook, TestTube, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const N8nConfigSection = () => {
  const { webhooks, saveWebhooks } = useN8nIntegration();
  const { toast } = useToast();
  const [localWebhooks, setLocalWebhooks] = useState(webhooks);
  const [isTestingWebhook, setIsTestingWebhook] = useState<string | null>(null);

  const handleSave = () => {
    saveWebhooks(localWebhooks);
  };

  const testWebhook = async (webhookUrl: string, type: string) => {
    if (!webhookUrl) {
      toast({
        title: "Erro",
        description: "Configure o webhook antes de testar",
        variant: "destructive",
      });
      return;
    }

    setIsTestingWebhook(type);
    
    try {
      const testData = {
        event: `test_${type}`,
        timestamp: new Date().toISOString(),
        data: {
          test: true,
          message: `Teste do webhook ${type} realizado com sucesso`,
        },
      };

      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(testData),
      });

      toast({
        title: "Teste enviado",
        description: `Webhook de ${type} testado. Verifique o histórico do n8n.`,
      });
    } catch (error) {
      toast({
        title: "Erro no teste",
        description: `Falha ao testar o webhook de ${type}`,
        variant: "destructive",
      });
    } finally {
      setIsTestingWebhook(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="h-5 w-5" />
          Integração com n8n
        </CardTitle>
        <CardDescription>
          Configure webhooks do n8n para automatizar processos com os pedidos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="newOrderWebhook">Webhook para Novos Pedidos</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="newOrderWebhook"
                placeholder="https://sua-instancia-n8n.com/webhook/novo-pedido"
                value={localWebhooks.newOrderWebhook}
                onChange={(e) => setLocalWebhooks({
                  ...localWebhooks,
                  newOrderWebhook: e.target.value
                })}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => testWebhook(localWebhooks.newOrderWebhook, 'novo_pedido')}
                disabled={isTestingWebhook === 'novo_pedido'}
              >
                {isTestingWebhook === 'novo_pedido' ? (
                  "Testando..."
                ) : (
                  <TestTube className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Será chamado sempre que um novo pedido for criado
            </p>
          </div>

          <Separator />

          <div>
            <Label htmlFor="cancelOrderWebhook">Webhook para Cancelamentos</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="cancelOrderWebhook"
                placeholder="https://sua-instancia-n8n.com/webhook/cancelar-pedido"
                value={localWebhooks.cancelOrderWebhook}
                onChange={(e) => setLocalWebhooks({
                  ...localWebhooks,
                  cancelOrderWebhook: e.target.value
                })}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => testWebhook(localWebhooks.cancelOrderWebhook, 'cancelamento')}
                disabled={isTestingWebhook === 'cancelamento'}
              >
                {isTestingWebhook === 'cancelamento' ? (
                  "Testando..."
                ) : (
                  <TestTube className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Será chamado quando um pedido for cancelado
            </p>
          </div>

          <Separator />

          <div>
            <Label htmlFor="statusUpdateWebhook">Webhook para Mudanças de Status</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="statusUpdateWebhook"
                placeholder="https://sua-instancia-n8n.com/webhook/status-pedido"
                value={localWebhooks.statusUpdateWebhook}
                onChange={(e) => setLocalWebhooks({
                  ...localWebhooks,
                  statusUpdateWebhook: e.target.value
                })}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => testWebhook(localWebhooks.statusUpdateWebhook, 'status')}
                disabled={isTestingWebhook === 'status'}
              >
                {isTestingWebhook === 'status' ? (
                  "Testando..."
                ) : (
                  <TestTube className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Será chamado quando o status de um pedido mudar
            </p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Como configurar no n8n:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>1. Crie um workflow no n8n</li>
            <li>2. Adicione um nó "Webhook" como trigger</li>
            <li>3. Configure o método como POST</li>
            <li>4. Copie a URL do webhook e cole nos campos acima</li>
            <li>5. Adicione as ações que deseja automatizar (enviar emails, notificações, etc.)</li>
          </ul>
        </div>

        <Button onClick={handleSave} className="w-full">
          <CheckCircle className="h-4 w-4 mr-2" />
          Salvar Configurações do n8n
        </Button>
      </CardContent>
    </Card>
  );
};

export default N8nConfigSection;
