
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppProvider } from "@/contexts/AppContext";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Pedidos from "./pages/Pedidos";
import Cardapio from "./pages/Cardapio";
import Produtos from "./pages/Produtos";
import Mesas from "./pages/Mesas";
import Clientes from "./pages/Clientes";
import Cozinha from "./pages/Cozinha";
import NotFound from "./pages/NotFound";
import NovoPedido from "./pages/NovoPedido";
import NovoProduto from "./pages/NovoProduto";
import NovoCliente from "./pages/NovoCliente";
import NovaMesa from "./pages/NovaMesa";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <SidebarProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="pedidos" element={<Pedidos />} />
                <Route path="pedidos/novo" element={<NovoPedido />} />
                <Route path="cardapio" element={<Cardapio />} />
                <Route path="produtos" element={<Produtos />} />
                <Route path="produtos/novo" element={<NovoProduto />} />
                <Route path="mesas" element={<Mesas />} />
                <Route path="mesas/nova" element={<NovaMesa />} />
                <Route path="clientes" element={<Clientes />} />
                <Route path="clientes/novo" element={<NovoCliente />} />
                <Route path="cozinha" element={<Cozinha />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
