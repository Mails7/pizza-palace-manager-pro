
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircle } from "lucide-react";
import { PizzaSize } from "@/types";

interface CrustFlavor {
  id: string;
  name: string;
}

interface CrustPrice {
  size: PizzaSize;
  price: number;
}

interface PizzaCrustOptionsProps {
  hasCrust: boolean;
  setHasCrust: (value: boolean) => void;
  crustFlavors: CrustFlavor[];
  setCrustFlavors: (flavors: CrustFlavor[]) => void;
  crustPrices: CrustPrice[];
  setCrustPrices: (prices: CrustPrice[]) => void;
  pizzaSizes: PizzaSize[];
}

const PizzaCrustOptions: React.FC<PizzaCrustOptionsProps> = ({
  hasCrust,
  setHasCrust,
  crustFlavors,
  setCrustFlavors,
  crustPrices,
  setCrustPrices,
  pizzaSizes,
}) => {
  // Gera um id simples para novos sabores
  const handleAddFlavor = () => {
    setCrustFlavors([...crustFlavors, { id: `${Date.now()}-${crustFlavors.length}`, name: "" }]);
  };

  const handleFlavorChange = (id: string, value: string) => {
    setCrustFlavors(crustFlavors.map(f => (f.id === id ? { ...f, name: value } : f)));
  };

  const handleRemoveFlavor = (id: string) => {
    setCrustFlavors(crustFlavors.filter(f => f.id !== id));
  };

  const handleCrustPriceChange = (size: PizzaSize, value: number) => {
    setCrustPrices(
      crustPrices.map(p => (p.size === size ? { ...p, price: value } : p))
    );
  };

  // Sincroniza os preços da borda com os tamanhos disponíveis da pizza
  React.useEffect(() => {
    // Garante sempre um preço por tamanho selecionado (sincronismo com pizzaSizes)
    setCrustPrices(
      pizzaSizes.map(
        (size) =>
          crustPrices.find((p) => p.size === size) || { size, price: 0 }
      )
    );
    // eslint-disable-next-line
  }, [JSON.stringify(pizzaSizes)]);

  return (
    <div className="border rounded-lg p-4 mt-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-medium">Borda recheada?</span>
        <Switch checked={hasCrust} onCheckedChange={setHasCrust} />
      </div>
      {hasCrust && (
        <div className="space-y-4 mt-4">
          <div>
            <p className="mb-1 text-sm font-medium">Sabores de borda</p>
            <div className="space-y-2">
              {crustFlavors.map((flavor, idx) => (
                <div key={flavor.id} className="flex gap-2 items-center">
                  <Input
                    type="text"
                    placeholder={`Sabor ${idx + 1}`}
                    value={flavor.name}
                    onChange={e => handleFlavorChange(flavor.id, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveFlavor(flavor.id)}
                    title="Remover sabor"
                    disabled={crustFlavors.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddFlavor}
                className="mt-1"
              >
                <PlusCircle className="w-4 h-4 mr-1" /> Adicionar sabor
              </Button>
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium">Preço da borda por tamanho</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {crustPrices.map(cp => (
                <div key={cp.size} className="flex items-center gap-2">
                  <span className="w-14 text-xs">{cp.size}</span>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={cp.price}
                    onChange={e => handleCrustPriceChange(cp.size, Number(e.target.value))}
                    className="w-32"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PizzaCrustOptions;
