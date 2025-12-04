
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Edit, Trash2, Search } from "lucide-react";

const Clientes = () => {
  const { clients, deleteClient } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const filteredClients = clients.filter(client => {
    return client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);
  });

  return (
    <div className="p-6">
      <PageHeader title="Clientes" actionLabel="Novo Cliente" actionHref="/clientes/novo" />

      <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 mb-6 border border-purple-100">
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-purple-500" />
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Filtros
          </span>
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
          <Input
            className="pl-10 border-purple-200 focus:border-purple-400 bg-white/70 transition-all duration-200"
            placeholder="🔍 Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden border border-purple-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
              <TableHead className="font-semibold text-purple-700">Nome</TableHead>
              <TableHead className="font-semibold text-purple-700">Contato</TableHead>
              <TableHead className="font-semibold text-purple-700">Endereço</TableHead>
              <TableHead className="font-semibold text-purple-700">Pedidos</TableHead>
              <TableHead className="font-semibold text-purple-700">Total Gasto</TableHead>
              <TableHead className="font-semibold text-purple-700">Último Pedido</TableHead>
              <TableHead className="text-right font-semibold text-purple-700">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client, index) => (
              <TableRow
                key={client.id}
                className={`hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 border-b border-purple-100 ${index % 2 === 0 ? 'bg-white' : 'bg-purple-25'
                  }`}
              >
                <TableCell className="font-medium text-gray-800">{client.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4 text-purple-500" />
                    <span>{client.phone}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {client.address ? (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4 text-pink-500" />
                      <span>{client.address}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                    {client.orderCount} pedidos
                  </span>
                </TableCell>
                <TableCell className="font-medium text-green-600">{formatCurrency(client.totalSpent)}</TableCell>
                <TableCell>
                  {client.lastOrderDate ? (
                    <span className="text-gray-600">{new Date(client.lastOrderDate).toLocaleDateString()}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="ghost" className="hover:bg-blue-100 hover:text-blue-700 rounded-full">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteClient(client.id)}
                      className="hover:bg-red-100 hover:text-red-700 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Clientes;
