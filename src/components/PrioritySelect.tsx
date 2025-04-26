
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Priority } from "@/types";

interface PrioritySelectProps {
  value: Priority;
  onChange: (value: Priority) => void;
}

const PrioritySelect: React.FC<PrioritySelectProps> = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as Priority)}>
      <SelectTrigger>
        <SelectValue placeholder="Prioridade" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Alta">Alta</SelectItem>
        <SelectItem value="Média">Média</SelectItem>
        <SelectItem value="Baixa">Baixa</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default PrioritySelect;
