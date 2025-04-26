
import React from "react";
import { useApp } from "@/contexts/AppContext";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Edit, Trash2 } from "lucide-react";

const Mesas = () => {
  const { tables, deleteTable } = useApp();

  return (
    <div className="p-6">
      <PageHeader title="Mesas" actionLabel="Nova Mesa" actionHref="/mesas/nova" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tables.map((table) => (
          <Card key={table.id} className="relative">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold mb-1">Mesa {table.name}</h3>
                  <div className="flex items-center text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{table.capacity} lugares</span>
                  </div>
                </div>
                <Badge variant="outline" className={
                  table.isAvailable 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }>
                  {table.isAvailable ? "Disponível" : "Ocupada"}
                </Badge>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button size="icon" variant="ghost">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={() => deleteTable(table.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Mesas;
