
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PizzaOptionsSelectorProps {
  isHalfPizza: boolean;
  setIsHalfPizza: (value: boolean) => void;
  flavor1: string;
  setFlavor1: (flavor: string) => void;
  flavor2: string;
  setFlavor2: (flavor: string) => void;
  hasCrust: boolean;
  setHasCrust: (value: boolean) => void;
  pizzaProducts: any[];
  selectedProduct?: any; // Pizza principal selecionada
}

const PizzaOptionsSelector: React.FC<PizzaOptionsSelectorProps> = ({
  isHalfPizza,
  setIsHalfPizza,
  flavor1,
  setFlavor1,
  flavor2,
  setFlavor2,
  hasCrust,
  setHasCrust,
  pizzaProducts,
  selectedProduct,
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Meia Pizza (adicionar um sabor)</label>
        <Switch 
          checked={isHalfPizza}
          onCheckedChange={setIsHalfPizza}
        />
      </div>

      {isHalfPizza && (
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
          <div className="mb-3">
            <p className="text-sm text-gray-600">
              <strong>Pizza Principal:</strong> {selectedProduct?.name || 'Produto selecionado'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Sabor Adicional (segunda metade)</label>
            <Select value={flavor2} onValueChange={setFlavor2}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o sabor adicional" />
              </SelectTrigger>
              <SelectContent>
                {pizzaProducts
                  .filter(pizza => pizza.id !== selectedProduct?.id) // Exclui a pizza principal
                  .map((pizza) => (
                    <SelectItem key={pizza.id} value={pizza.name}>
                      {pizza.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              O preço será baseado no sabor mais caro entre os dois
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Com Borda</label>
        <Switch 
          checked={hasCrust}
          onCheckedChange={setHasCrust}
        />
      </div>
    </>
  );
};

export default PizzaOptionsSelector;
