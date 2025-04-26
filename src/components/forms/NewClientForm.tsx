
import React from "react";
import { useForm } from "react-hook-form";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface NewClientFormProps {
  onSubmitSuccess: (client: any) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const NewClientForm: React.FC<NewClientFormProps> = ({ onSubmitSuccess, onCancel }) => {
  const { addClient } = useApp();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    const newClient = {
      name: data.name,
      phone: data.phone,
      address: data.address || "",
    };

    addClient(newClient);
    
    // Find the added client to send back (in a real app we would get the ID from the backend)
    // For now we're simulating by finding the last client added with the same data
    const addedClient = {
      id: `client-${Date.now()}`,
      ...newClient,
      orderCount: 0,
      totalSpent: 0
    };
    
    onSubmitSuccess(addedClient);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(99) 99999-9999" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Endereço (opcional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Salvar Cliente
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewClientForm;
