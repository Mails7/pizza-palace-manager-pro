
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface N8nWebhooks {
  newOrderWebhook: string;
  cancelOrderWebhook: string;
  statusUpdateWebhook: string;
}

export const useN8nIntegration = () => {
  const [webhooks, setWebhooks] = useState<N8nWebhooks>({
    newOrderWebhook: localStorage.getItem('n8n_new_order_webhook') || '',
    cancelOrderWebhook: localStorage.getItem('n8n_cancel_order_webhook') || '',
    statusUpdateWebhook: localStorage.getItem('n8n_status_update_webhook') || '',
  });

  const saveWebhooks = (newWebhooks: N8nWebhooks) => {
    setWebhooks(newWebhooks);
    localStorage.setItem('n8n_new_order_webhook', newWebhooks.newOrderWebhook);
    localStorage.setItem('n8n_cancel_order_webhook', newWebhooks.cancelOrderWebhook);
    localStorage.setItem('n8n_status_update_webhook', newWebhooks.statusUpdateWebhook);
    
    toast({
      title: "Webhooks salvos",
      description: "As configurações do n8n foram salvas com sucesso.",
    });
  };

  const sendToN8n = async (webhookUrl: string, data: any, eventType: string) => {
    if (!webhookUrl) {
      console.log(`Webhook do n8n não configurado para ${eventType}`);
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          event: eventType,
          timestamp: new Date().toISOString(),
          data,
        }),
      });

      console.log(`Dados enviados para n8n (${eventType}):`, data);
    } catch (error) {
      console.error(`Erro ao enviar para n8n (${eventType}):`, error);
    }
  };

  const notifyNewOrder = (order: any) => {
    sendToN8n(webhooks.newOrderWebhook, order, 'new_order');
  };

  const notifyCancelOrder = (orderId: string, reason?: string) => {
    sendToN8n(webhooks.cancelOrderWebhook, { orderId, reason }, 'cancel_order');
  };

  const notifyStatusUpdate = (orderId: string, status: string, previousStatus?: string) => {
    sendToN8n(webhooks.statusUpdateWebhook, { orderId, status, previousStatus }, 'status_update');
  };

  return {
    webhooks,
    saveWebhooks,
    notifyNewOrder,
    notifyCancelOrder,
    notifyStatusUpdate,
  };
};
