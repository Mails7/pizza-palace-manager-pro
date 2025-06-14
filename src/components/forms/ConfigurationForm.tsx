
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
import { PizzaSize } from "@/types";

interface ProductFormValues {
  name: string;
  description: string;
  category: string;
  type: string;
  image?: string;
  prices: Array<{ size: PizzaSize; price: number }>;
  available: boolean;
  isKitchenItem: boolean;
  taxExempt: boolean;
  preparationTime?: number;
}

interface ConfigurationFormProps {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

const ConfigurationForm = ({ control, errors }: ConfigurationFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
  );
};

export default ConfigurationForm;
