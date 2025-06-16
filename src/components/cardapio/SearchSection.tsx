
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="w-full px-4 sm:px-6 py-4 sm:py-6">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 max-w-7xl mx-auto">
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            className="pl-10 h-10 sm:h-12 text-sm sm:text-base border-2 border-gray-200 focus:border-orange-500 rounded-lg"
            placeholder="Buscar seus pratos favoritos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
