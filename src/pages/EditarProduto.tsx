import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useApp } from "@/contexts/AppContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowDown, Edit, Sparkles, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PizzaSize, Price } from "@/types";
import { ProductFormValues } from "@/types/form-types";
import BasicInfoForm from "@/components/forms/BasicInfoForm";
import PricingForm from "@/components/forms/PricingForm";
import ConfigurationForm from "@/components/forms/ConfigurationForm";
import PizzaCrustOptions from "@/components/forms/PizzaCrustOptions";

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

const pizzaSizes: PizzaSize[] = ['MINI', 'P', 'M', 'G', 'GG'];

const EditarProduto = () => {
  const { updateProduct, products } = useApp();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Encontrar o produto a ser editado
  const product = products.find(p => p.id === id);

  // Se o produto não existir, redirecionar
  React.useEffect(() => {
    if (!product) {
      navigate('/produtos');
    }
  }, [product, navigate]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      category: product?.category || "",
      type: product?.type || "Bebida",
      image: product?.image || "",
      prices: product?.prices || [{ size: 'M' as PizzaSize, price: 0 }],
      available: product?.available ?? true,
      isKitchenItem: product?.isKitchenItem ?? true,
      taxExempt: product?.taxExempt ?? false,
      preparationTime: product?.preparationTime,
      hasCrust: product?.hasCrust || false,
      crustFlavors: product?.crustFlavors || [{ id: "0", name: "" }],
      crustPrices: product?.crustPrices || pizzaSizes.map(size => ({ size, price: 0 })),
    },
  });

  // Estados separados para campos especiais de pizza
  const watchType = form.watch("type");
  const [hasCrust, setHasCrust] = React.useState(product?.hasCrust || false);
  const [crustFlavors, setCrustFlavors] = React.useState(product?.crustFlavors || [{ id: "0", name: "" }]);
  const [crustPrices, setCrustPrices] = React.useState(
    product?.crustPrices || pizzaSizes.map(size => ({ size, price: 0 }))
  );
  const watchPrices = form.watch("prices");

  // Atualizar preços quando o tipo muda
  React.useEffect(() => {
    const isPizza = watchType?.toLowerCase().includes('pizza');

    if (!isPizza) {
      // Se mudou para não-pizza, garantir que tem apenas um preço
      const currentPrices = form.getValues("prices");
      if (currentPrices.length > 1) {
        form.setValue("prices", [{ size: 'M' as PizzaSize, price: currentPrices[0]?.price || 0 }]);
      }
    }
  }, [watchType, form]);

  React.useEffect(() => {
    // Mantém crustPrices sincronizado com os tamanhos selecionados na pricing
    setCrustPrices(prev =>
      (watchPrices || []).map(
        p => prev.find(crust => crust.size === p.size) || { size: p.size, price: 0 }
      )
    );
  }, [JSON.stringify(watchPrices)]);

  function onSubmit(data: ProductFormValues) {
    if (!product) return;

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

    updateProduct(product.id, productData);
    navigate('/produtos');
  }

  if (!product) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link to="/produtos" className="text-gray-500 mr-2 hover:text-orange-600 transition-all duration-200 hover:scale-105">
          Produtos
        </Link>
        <ArrowDown className="h-4 w-4 text-gray-400 mx-2 rotate-90" />
        <span className="font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          ✏️ Editar Produto
        </span>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-xl">
          <Edit className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            Editar Produto
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span>Atualize as informações do produto</span>
            <Zap className="h-4 w-4 text-orange-500" />
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-200 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Informações do Produto
                  </h3>
                </div>
                <div className="p-6">
                  <BasicInfoForm control={form.control} errors={form.formState.errors} />
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-yellow-200 overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <span>💰</span>
                    Configuração de Preços
                  </h3>
                </div>
                <div className="p-6">
                  <PricingForm control={form.control} errors={form.formState.errors} />
                </div>
              </div>

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
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <span>⚙️</span>
                    Configurações
                  </h3>
                </div>
                <div className="p-6">
                  <ConfigurationForm control={form.control} errors={form.formState.errors} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/produtos')}
              className="hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
            >
              ❌ Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg transition-all duration-200 hover:scale-105"
            >
              💾 Salvar Alterações
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditarProduto;
