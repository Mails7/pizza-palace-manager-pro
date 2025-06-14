
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useApp } from "@/contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tableFormSchema = z.object({
  name: z.string().min(1, "O nome/número da mesa é obrigatório."),
  capacity: z.coerce.number().int().min(1, "A capacidade deve ser pelo menos 1."),
  isAvailable: z.boolean().default(true),
  location: z.string().optional(),
  notes: z.string().optional(),
});

type TableFormValues = z.infer<typeof tableFormSchema>;

const NovaMesa = () => {
  const { addTable } = useApp();
  const navigate = useNavigate();

  const form = useForm<TableFormValues>({
    resolver: zodResolver(tableFormSchema),
    defaultValues: {
      name: "",
      capacity: 4,
      isAvailable: true,
      location: "",
      notes: "",
    },
  });

  function onSubmit(data: TableFormValues) {
    addTable({
      name: data.name,
      capacity: data.capacity,
      isAvailable: data.isAvailable,
      location: data.location || "",
      notes: data.notes || "",
      isReserved: false,
      reservationName: "",
      reservationTime: "",
      reservationNotes: "",
      attendant: "",
    });
    navigate('/mesas');
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Link to="/mesas" className="text-gray-500 mr-2">
          Mesas
        </Link>
        <ArrowDown className="h-4 w-4 text-gray-400 mx-2 rotate-90" />
        <span className="font-medium">Nova Mesa</span>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Nova Mesa</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Informações da Mesa</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome/Número da Mesa *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 1, A1, Varanda 1..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacidade (pessoas) *</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Salão principal, Varanda, Área externa..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Informações adicionais sobre a mesa..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Mesa Disponível</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        A mesa estará disponível para novos pedidos
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-4 pt-6">
                <Button type="button" variant="outline" onClick={() => navigate('/mesas')}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-black text-white hover:bg-gray-800">
                  Criar Mesa
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NovaMesa;
