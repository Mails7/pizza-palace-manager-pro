
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useApp } from "@/contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PizzaSize, Price } from "@/types";
import { ProductFormValues } from "@/types/form-types";
import BasicInfoForm from "@/components/forms/BasicInfoForm";
import PricingForm from "@/components/forms/PricingForm";
import ConfigurationForm from "@/components/forms/ConfigurationForm";
import PizzaCrustOptions from "@/components/forms/PizzaCrustOptions";

// ... schemas the same ...

const priceSchema = z.object({
  size: z.enum(['MINI', 'P', 'M', 'G', 'GG']),
  price: z.number().positive("O preço deve ser maior que zero."),
});

const productFormSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres."),
  category: z.string().min(2, "A categoria é obrigatória."),
  type: z.string().min(2, "O tipo é obrigatório."),
  image: z.string().url("URL da imagem inválida.").or(z.literal("")).optional(),
  prices: z.array(priceSchema).min(1, "Adicione pelo menos um preço."),
  available: z.boolean().default(true),
  isKitchenItem: z.boolean().default(true),
  taxExempt: z.boolean().default(false),
  preparationTime: z.coerce.number().int().positive("Deve ser um número positivo.").optional(),

  // Os campos de borda não são validados pelo zod aqui, pois são opcionais/dinâmicos 
});

const pizzaSizes: PizzaSize[] = ['MINI', 'P', 'M', 'G', 'GG'];

const NovoProduto = () => {
  const { addProduct } = useApp();
  const navigate = useNavigate();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      type: "Pizza",
      image: "",
      prices: [{ size: 'M' as PizzaSize, price: 0 }],
      available: true,
      isKitchenItem: true,
      taxExempt: false,
      hasCrust: false,
      crustFlavors: [{ id: "0", name: "" }],
      crustPrices: pizzaSizes.map(size => ({ size, price: 0 })),
    },
  });

  // Estados separados para campos especiais de pizza
  const watchType = form.watch("type");
  const [hasCrust, setHasCrust] = React.useState(false);
  const [crustFlavors, setCrustFlavors] = React.useState([{ id: "0", name: "" }]);
  const [crustPrices, setCrustPrices] = React.useState(
    pizzaSizes.map(size => ({ size, price: 0 }))
  );
  const watchPrices = form.watch("prices");

  React.useEffect(() => {
    // Mantém crustPrices sincronizado com os tamanhos selecionados na pricing (caso usuário adicione/remova tamanhos)
    setCrustPrices(prev =>
      (watchPrices || []).map(
        p => prev.find(crust => crust.size === p.size) || { size: p.size, price: 0 }
      )
    );
    // eslint-disable-next-line
  }, [JSON.stringify(watchPrices)]);

  function onSubmit(data: ProductFormValues) {
    // Se for pizza e tiver borda, adicionar campos extras
    const isPizza = data.type?.toLowerCase().includes('pizza');
    const hasCrustSelected = isPizza && hasCrust;

    const productData = {
      name: data.name,
      description: data.description,
      category: data.category,
      type: data.type,
      image: data.image || '/placeholder.svg',
      prices: data.prices as Price[],
      available: data.available,
      isKitchenItem: data.isKitchenItem,
      taxExempt: data.taxExempt,
      preparationTime: data.preparationTime,
      ...(hasCrustSelected && {
        hasCrust: true,
        crustFlavors: crustFlavors.filter(f => f.name.trim().length > 0),
        crustPrices,
      }),
    };
    addProduct(productData);
    navigate('/produtos');
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link to="/produtos" className="text-gray-500 mr-2">
          Produtos
        </Link>
        <ArrowDown className="h-4 w-4 text-gray-400 mx-2 rotate-90" />
        <span className="font-medium">Novo Produto</span>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Novo Produto</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <BasicInfoForm control={form.control} errors={form.formState.errors} />
              <PricingForm control={form.control} errors={form.formState.errors} />
              {/* Só exibe opções de borda para pizza */}
              {watchType && watchType.toLowerCase().includes('pizza') && (
                <PizzaCrustOptions
                  hasCrust={hasCrust}
                  setHasCrust={setHasCrust}
                  crustFlavors={crustFlavors}
                  setCrustFlavors={setCrustFlavors}
                  crustPrices={crustPrices}
                  setCrustPrices={setCrustPrices}
                  pizzaSizes={watchPrices?.map(p => p.size) || pizzaSizes}
                />
              )}
            </div>
            <div className="lg:col-span-1 space-y-6">
              <ConfigurationForm control={form.control} errors={form.formState.errors} />
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/produtos')}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-black text-white">Salvar Produto</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NovoProduto;
