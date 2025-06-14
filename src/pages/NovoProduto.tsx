
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
import BasicInfoForm from "@/components/forms/BasicInfoForm";
import PricingForm from "@/components/forms/PricingForm";
import ConfigurationForm from "@/components/forms/ConfigurationForm";

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
});

type ProductFormValues = z.infer<typeof productFormSchema>;

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
    },
  });

  function onSubmit(data: ProductFormValues) {
    // Transform data to ensure it matches the Product interface
    const productData = {
      name: data.name,
      description: data.description,
      category: data.category,
      type: data.type,
      image: data.image || '/placeholder.svg',
      prices: data.prices as Price[], // Type assertion since we know the schema validates correctly
      available: data.available,
      isKitchenItem: data.isKitchenItem,
      taxExempt: data.taxExempt,
      preparationTime: data.preparationTime,
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
