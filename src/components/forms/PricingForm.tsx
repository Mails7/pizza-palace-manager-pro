
import React from "react";
import { Control, FieldErrors, useFieldArray } from "react-hook-form";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { PizzaSize } from "@/types";
import { ProductFormValues } from "@/types/form-types";

interface PricingFormProps {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

const pizzaSizes: PizzaSize[] = ['MINI', 'P', 'M', 'G', 'GG'];

const PricingForm = ({ control, errors }: PricingFormProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "prices",
  });

  // Watch the type field to determine if it's a pizza
  const watchType = React.useMemo(() => {
    return control._formValues?.type || "";
  }, [control._formValues?.type]);

  const isPizza = watchType.toLowerCase().includes('pizza');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preços</CardTitle>
        <CardDescription>
          {isPizza ? "Defina os preços para os diferentes tamanhos." : "Defina o preço do produto."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPizza ? (
          // Campos para pizza (com tamanhos)
          <>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-4">
                <FormField
                  control={control}
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
                  control={control}
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
          </>
        ) : (
          // Campo simples para produtos não-pizza
          <FormField
            control={control}
            name="prices.0.price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="0,00"
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
        )}
      </CardContent>
    </Card>
  );
};

export default PricingForm;
