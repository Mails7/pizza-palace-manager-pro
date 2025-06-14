
import React from "react";
import { Control, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormValues } from "@/types/form-types";
import { Settings, CheckCircle, ChefHat, Receipt, Clock } from "lucide-react";

interface ConfigurationFormProps {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

const ConfigurationForm = ({ control, errors }: ConfigurationFormProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
          <Settings className="h-4 w-4 text-white" />
        </div>
        <h3 className="font-semibold text-lg bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Configurações
        </h3>
      </div>
      
      <FormField
        control={control}
        name="available"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-green-200 p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-200">
            <div className="space-y-0.5">
              <FormLabel className="flex items-center gap-2 text-green-700 font-medium">
                <CheckCircle className="h-4 w-4" />
                Disponível
              </FormLabel>
              <FormDescription className="text-green-600">
                ✅ Se o produto está disponível para venda
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-green-500"
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="isKitchenItem"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-blue-200 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-all duration-200">
            <div className="space-y-0.5">
              <FormLabel className="flex items-center gap-2 text-blue-700 font-medium">
                <ChefHat className="h-4 w-4" />
                Item de Cozinha
              </FormLabel>
              <FormDescription className="text-blue-600">
                👨‍🍳 Se o item precisa ser preparado na cozinha
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-blue-500"
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="taxExempt"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 border-purple-200 p-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-200">
            <div className="space-y-0.5">
              <FormLabel className="flex items-center gap-2 text-purple-700 font-medium">
                <Receipt className="h-4 w-4" />
                Isento de Impostos
              </FormLabel>
              <FormDescription className="text-purple-600">
                📋 Se o produto é isento de impostos
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-purple-500"
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="preparationTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-orange-700 font-medium">
              <Clock className="h-4 w-4 text-orange-500" />
              Tempo de Preparo (minutos)
            </FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="15 ⏰" 
                {...field} 
                onChange={e => {
                  const value = parseInt(e.target.value, 10);
                  field.onChange(isNaN(value) ? undefined : value);
                }}
                className="border-2 border-orange-200 focus:border-orange-400 transition-all duration-200 bg-gradient-to-r from-orange-50 to-yellow-50"
              />
            </FormControl>
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ConfigurationForm;
