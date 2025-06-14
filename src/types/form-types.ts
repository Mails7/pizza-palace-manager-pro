
import { PizzaSize } from "./index";

export interface ProductFormValues {
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
