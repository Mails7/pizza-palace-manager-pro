
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface PrintSettings {
  autoprint: boolean;
  printerName: string;
  copies: number;
  printCustomerCopy: boolean;
  printKitchenCopy: boolean;
}

export const usePrintService = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const getPrintSettings = (): PrintSettings => {
    return {
      autoprint: localStorage.getItem('print_autoprint') === 'true' || true,
      printerName: localStorage.getItem('print_printerName') || 'Impressora Principal',
      copies: parseInt(localStorage.getItem('print_copies') || '1'),
      printCustomerCopy: localStorage.getItem('print_printCustomerCopy') === 'true' || true,
      printKitchenCopy: localStorage.getItem('print_printKitchenCopy') === 'true' || true,
    };
  };

  const savePrintSettings = (settings: PrintSettings) => {
    localStorage.setItem('print_autoprint', settings.autoprint.toString());
    localStorage.setItem('print_printerName', settings.printerName);
    localStorage.setItem('print_copies', settings.copies.toString());
    localStorage.setItem('print_printCustomerCopy', settings.printCustomerCopy.toString());
    localStorage.setItem('print_printKitchenCopy', settings.printKitchenCopy.toString());
  };

  const formatOrderForPrint = (order: any, type: 'customer' | 'kitchen') => {
    const storeInfo = {
      name: localStorage.getItem('store_name') || 'Pizzaria do Kassio',
      phone: localStorage.getItem('store_phone') || '(11) 99999-9999',
      address: localStorage.getItem('store_address') || 'Rua das Pizzas, 123',
    };

    let printContent = `
      <div style="font-family: monospace; font-size: 12px; line-height: 1.4; max-width: 300px;">
        <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px;">
          <h2 style="margin: 0; font-size: 16px;">${storeInfo.name}</h2>
          <p style="margin: 2px 0;">${storeInfo.phone}</p>
          <p style="margin: 2px 0;">${storeInfo.address}</p>
        </div>
        
        <div style="margin-bottom: 10px;">
          <strong>PEDIDO #${order.id}</strong><br>
          Data: ${new Date(order.createdAt).toLocaleString()}<br>
          ${type === 'customer' ? `Cliente: ${order.customer.name}<br>` : ''}
          ${type === 'customer' && order.customer.phone ? `Telefone: ${order.customer.phone}<br>` : ''}
          ${type === 'customer' && order.customer.address ? `Endereço: ${order.customer.address}<br>` : ''}
          Tipo: ${order.type === 'delivery' ? 'Entrega' : order.type === 'pickup' ? 'Retirada' : 'Balcão'}<br>
          Status: ${order.status}
        </div>
        
        <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 5px 0;">
          <strong>ITENS DO PEDIDO</strong>
        </div>
        
        ${order.items.map((item: any) => `
          <div style="margin: 5px 0;">
            <strong>${item.quantity}x ${item.name}</strong><br>
            ${item.size ? `Tamanho: ${item.size}<br>` : ''}
            ${item.crust ? `Massa: ${item.crust}<br>` : ''}
            ${item.observations ? `Obs: ${item.observations}<br>` : ''}
            <span style="float: right;">R$ ${item.price.toFixed(2)}</span>
          </div>
        `).join('')}
        
        <div style="border-top: 1px solid #000; margin-top: 10px; padding-top: 5px;">
          <div style="display: flex; justify-content: space-between;">
            <span>Subtotal:</span>
            <span>R$ ${order.subtotal.toFixed(2)}</span>
          </div>
          ${order.deliveryFee > 0 ? `
            <div style="display: flex; justify-content: space-between;">
              <span>Taxa de Entrega:</span>
              <span>R$ ${order.deliveryFee.toFixed(2)}</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; font-weight: bold; border-top: 1px solid #000; padding-top: 5px;">
            <span>TOTAL:</span>
            <span>R$ ${order.total.toFixed(2)}</span>
          </div>
        </div>
        
        ${type === 'customer' ? `
          <div style="margin-top: 15px; text-align: center; font-size: 10px;">
            <p>Obrigado pela preferência!</p>
            <p>Pedidos: ${storeInfo.phone}</p>
          </div>
        ` : ''}
        
        ${type === 'kitchen' ? `
          <div style="margin-top: 15px; text-align: center;">
            <strong>*** COZINHA ***</strong><br>
            ${order.priority === 'urgent' ? '<strong style="color: red;">URGENTE</strong><br>' : ''}
            Preparar até: ${new Date(Date.now() + 30 * 60000).toLocaleTimeString()}
          </div>
        ` : ''}
      </div>
    `;

    return printContent;
  };

  const printOrder = async (order: any, type?: 'customer' | 'kitchen' | 'both') => {
    setIsLoading(true);
    const settings = getPrintSettings();

    try {
      const printTypes = type === 'both' ? ['customer', 'kitchen'] : [type || 'customer'];

      for (const printType of printTypes) {
        if (printType === 'customer' && !settings.printCustomerCopy) continue;
        if (printType === 'kitchen' && !settings.printKitchenCopy) continue;

        const printContent = formatOrderForPrint(order, printType as 'customer' | 'kitchen');

        // Criar uma nova janela para impressão
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Pedido #${order.id} - ${printType === 'customer' ? 'Cliente' : 'Cozinha'}</title>
                <style>
                  @media print {
                    body { margin: 0; }
                    @page { margin: 0.5cm; }
                  }
                </style>
              </head>
              <body>
                ${printContent}
              </body>
            </html>
          `);
          printWindow.document.close();

          // Aguardar um pouco e então imprimir
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 500);
        }
      }

      console.log(`Pedido #${order.id} enviado para impressão`);
      toast({
        title: "Impressão enviada",
        description: `Pedido #${order.id} enviado para impressão`,
      });

    } catch (error) {
      console.error('Erro ao imprimir:', error);
      toast({
        title: "Erro na impressão",
        description: "Não foi possível imprimir o pedido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testPrint = async () => {
    const testOrder = {
      id: 'TEST-001',
      createdAt: new Date(),
      customer: {
        name: 'Cliente Teste',
        phone: '(11) 99999-9999',
        address: 'Rua Teste, 123',
      },
      type: 'delivery',
      status: 'pending',
      items: [
        {
          name: 'Pizza Margherita',
          size: 'Grande',
          crust: 'Tradicional',
          quantity: 1,
          price: 35.90,
          observations: 'Sem cebola'
        },
        {
          name: 'Refrigerante Coca-Cola',
          quantity: 2,
          price: 8.00
        }
      ],
      subtotal: 43.90,
      deliveryFee: 5.00,
      total: 48.90,
      priority: 'normal'
    };

    await printOrder(testOrder, 'customer');
  };

  return {
    printOrder,
    testPrint,
    getPrintSettings,
    savePrintSettings,
    isLoading,
  };
};
