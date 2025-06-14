import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useApp } from "@/contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { ArrowDown, Trash2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PizzaSize, Price } from "@/types";

const priceSchema = z.object({
  size: z.enum(['MINI', 'P', 'M', 'G', 'GG']),
  price: z.number().positive("O preço deve ser maior que zero."),
}) satisfies z.ZodType<Price>;

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
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "prices",
  });

  function onSubmit(data: ProductFormValues) {
    // Ensure all required fields are present and properly typed
    const productData = {
      name: data.name,
      description: data.description,
      category: data.category,
      type: data.type,
      image: data.image || '/placeholder.svg',
      prices: data.prices,
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
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                  <CardDescription>Nome, descrição, categoria e imagem do produto.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Produto</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Pizza de Calabresa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Molho de tomate, queijo mussarela, calabresa..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Pizzas Salgadas" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Pizza">Pizza</SelectItem>
                              <SelectItem value="Bebida">Bebida</SelectItem>
                              <SelectItem value="Sobremesa">Sobremesa</SelectItem>
                              <SelectItem value="Outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL da Imagem</FormLabel>
                        <FormControl>
                          <Input placeholder="https://exemplo.com/imagem.png" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preços</CardTitle>
                  <CardDescription>Defina os preços para os diferentes tamanhos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-4">
                      <FormField
                        control={form.control}
                        name={`prices.${index}.size`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Tamanho</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Tamanho" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {pizzaSizes.map(size => <SelectItem key={size} value={size}>{size}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`prices.${index}.price`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Preço (R$)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                {...field} 
                                onChange={e => {
                                  const value = parseFloat(e.target.value);
                                  field.onChange(isNaN(value) ? 0 : value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ size: 'P' as PizzaSize, price: 0 })}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Preço
                  </Button>
                </CardContent>
              </Card>

            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="available"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Disponível</FormLabel>
                          <FormDescription>Se o produto está disponível para venda.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isKitchenItem"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Item de Cozinha</FormLabel>
                          <FormDescription>Se o item precisa ser preparado na cozinha.</FormDescription>
                        </div>
                        <FormControl>
                           <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="taxExempt"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Isento de Impostos</FormLabel>
                          <FormDescription>Se o produto é isento de impostos.</FormDescription>
                        </div>
                        <FormControl>
                           <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="preparationTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tempo de Preparo (minutos)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="15" 
                            {...field} 
                            onChange={e => {
                              const value = parseInt(e.target.value, 10);
                              field.onChange(isNaN(value) ? undefined : value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
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
