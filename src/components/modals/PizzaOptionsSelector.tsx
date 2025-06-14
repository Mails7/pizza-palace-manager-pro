
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
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Meia Pizza (máximo 2 sabores)</label>
        <Switch 
          checked={isHalfPizza}
          onCheckedChange={setIsHalfPizza}
        />
      </div>

      {isHalfPizza && (
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-2">Primeiro Sabor</label>
            <Select value={flavor1} onValueChange={setFlavor1}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o primeiro sabor" />
              </SelectTrigger>
              <SelectContent>
                {pizzaProducts.map((pizza) => (
                  <SelectItem key={pizza.id} value={pizza.name}>
                    {pizza.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Segundo Sabor</label>
            <Select value={flavor2} onValueChange={setFlavor2}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o segundo sabor" />
              </SelectTrigger>
              <SelectContent>
                {pizzaProducts.map((pizza) => (
                  <SelectItem key={pizza.id} value={pizza.name}>
                    {pizza.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
