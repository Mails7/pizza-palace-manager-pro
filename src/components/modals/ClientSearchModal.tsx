
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, X } from "lucide-react";
import NewClientForm from "../forms/NewClientForm";

interface ClientSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientSelected: (client: any) => void;
}

const ClientSearchModal: React.FC<ClientSearchModalProps> = ({
  isOpen,
  onClose,
  onClientSelected,
}) => {
  const { clients } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewClientFormOpen, setIsNewClientFormOpen] = useState(false);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
  );

  const handleClientClick = (client: any) => {
    onClientSelected(client);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buscar Cliente</DialogTitle>
        </DialogHeader>
        {!isNewClientFormOpen ? (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Buscar por telefone ou nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>

            <div className="mt-2">
              {searchTerm && filteredClients.length === 0 ? (
                <p className="text-sm text-gray-500 mb-2">
                  Nenhum cliente encontrado
                </p>
              ) : (
                <p className="text-sm text-gray-500 mb-2">
                  Digite um telefone ou nome para buscar
                </p>
              )}

              <div className="max-h-64 overflow-y-auto">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="p-3 border-b cursor-pointer hover:bg-gray-50"
                    onClick={() => handleClientClick(client)}
                  >
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-gray-500">{client.phone}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                className="flex items-center gap-2 mt-2"
                onClick={() => setIsNewClientFormOpen(true)}
              >
                <UserPlus className="h-4 w-4" />
                Novo Cliente
              </Button>
            </div>
          </>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Novo Cliente</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNewClientFormOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <NewClientForm 
              onSubmitSuccess={(client) => {
                setIsNewClientFormOpen(false);
                handleClientClick(client);
              }}
              onCancel={() => setIsNewClientFormOpen(false)}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClientSearchModal;
