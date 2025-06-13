
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table } from "@/types";

interface OrderTypeSelectorProps {
  orderType: "delivery" | "takeaway" | "table";
  setOrderType: (type: "delivery" | "takeaway" | "table") => void;
  selectedTable: string;
  setSelectedTable: (table: string) => void;
  tables: Table[];
}

const OrderTypeSelector: React.FC<OrderTypeSelectorProps> = ({
  orderType,
  setOrderType,
  selectedTable,
  setSelectedTable,
  tables,
}) => {
  return (
    <>
      <div>
        <p className="mb-2 font-medium">Tipo de Pedido</p>
        <RadioGroup
          value={orderType}
          onValueChange={(value: any) => setOrderType(value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="delivery" id="delivery" />
            <label htmlFor="delivery">Delivery</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="takeaway" id="takeaway" />
            <label htmlFor="takeaway">Retirada</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="table" id="table" />
            <label htmlFor="table">Mesa</label>
          </div>
        </RadioGroup>
      </div>

      {orderType === "table" && (
        <div>
          <p className="mb-2 font-medium">Mesa</p>
          <Select value={selectedTable} onValueChange={setSelectedTable}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma mesa" />
            </SelectTrigger>
            <SelectContent>
              {tables
                .filter((table) => table.isAvailable)
                .map((table) => (
                  <SelectItem key={table.id} value={table.id}>
                    {table.name} ({table.capacity} lugares)
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
};

export default OrderTypeSelector;
