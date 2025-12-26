import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard,
  ShoppingBag,
  Pizza,
  Package,
  CoffeeIcon,
  Users,
  ChefHat,
  Settings,
  LogOut
} from "lucide-react";

const MainLayout = () => {
  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { title: "Pedidos", icon: ShoppingBag, href: "/pedidos" },
    { title: "Cardápio", icon: Pizza, href: "/cardapio" },
    { title: "Produtos", icon: Package, href: "/produtos" },
    { title: "Mesas", icon: CoffeeIcon, href: "/mesas" },
    { title: "Clientes", icon: Users, href: "/clientes" },
    { title: "Cozinha", icon: ChefHat, href: "/cozinha" },
    { title: "Configurações", icon: Settings, href: "/configuracoes" },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Sidebar className="border-r" collapsible="none">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <Pizza className="h-8 w-8 text-orange-500" />
              <div>
                <h2 className="font-bold text-lg">Pizza Palace</h2>
                <p className="text-sm text-gray-500">Sistema de Gestão</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              <div className="p-4">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title} className="mb-2">
                    <SidebarMenuButton asChild>
                      <Link to={item.href} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </div>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-14 border-b bg-white/50 backdrop-blur-sm flex items-center justify-between px-6">
            <h1 className="text-lg font-semibold">Sistema de Gestão</h1>
            <div className="flex items-center gap-4">
              <Link 
                to="/cardapio-publico"
                className="text-sm font-medium text-primary hover:underline"
              >
                Ver Cardápio Público
              </Link>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
