
import React from "react";
import { Control, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProductFormValues } from "@/types/form-types";
import { FileText, Image, Tag, Package } from "lucide-react";

interface BasicInfoFormProps {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

const BasicInfoForm = ({ control, errors }: BasicInfoFormProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
          <FileText className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Informações Básicas
          </h3>
          <p className="text-sm text-gray-600">Nome, descrição, categoria e imagem do produto</p>
        </div>
      </div>
      
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
              <Package className="h-4 w-4 text-blue-500" />
              Nome do Produto
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: Pizza de Calabresa 🍕" 
                {...field} 
                className="border-2 border-blue-200 focus:border-blue-400 transition-all duration-200 bg-gradient-to-r from-blue-50 to-purple-50"
              />
            </FormControl>
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
              <FileText className="h-4 w-4 text-green-500" />
              Descrição
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Molho de tomate, queijo mussarela, calabresa... ✨" 
                {...field} 
                className="border-2 border-green-200 focus:border-green-400 transition-all duration-200 bg-gradient-to-r from-green-50 to-blue-50 min-h-[100px]"
              />
            </FormControl>
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                <Tag className="h-4 w-4 text-purple-500" />
                Categoria
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Pizzas Salgadas 🍕" 
                  {...field} 
                  className="border-2 border-purple-200 focus:border-purple-400 transition-all duration-200 bg-gradient-to-r from-purple-50 to-pink-50"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                <Tag className="h-4 w-4 text-orange-500" />
                Tipo
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-2 border-orange-200 focus:border-orange-400 transition-all duration-200 bg-gradient-to-r from-orange-50 to-red-50">
                    <SelectValue placeholder="Selecione um tipo 🏷️" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white border-2 border-orange-200 shadow-xl">
                  <SelectItem value="Pizza" className="hover:bg-orange-50">🍕 Pizza</SelectItem>
                  <SelectItem value="Bebida" className="hover:bg-blue-50">🥤 Bebida</SelectItem>
                  <SelectItem value="Sobremesa" className="hover:bg-pink-50">🍰 Sobremesa</SelectItem>
                  <SelectItem value="Outro" className="hover:bg-gray-50">📦 Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
              <Image className="h-4 w-4 text-pink-500" />
              URL da Imagem
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="https://exemplo.com/imagem.png 📸" 
                {...field} 
                className="border-2 border-pink-200 focus:border-pink-400 transition-all duration-200 bg-gradient-to-r from-pink-50 to-purple-50"
              />
            </FormControl>
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicInfoForm;
