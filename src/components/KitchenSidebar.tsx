
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  ChefHat, 
  Clock, 
  CheckCircle, 
  Truck, 
  Package,
  Settings,
  Bell,
  BarChart3
} from "lucide-react";

interface KitchenSidebarProps {
  kitchenOrders: any;
  autoUpdateEnabled: boolean;
  toggleAutoUpdate: () => void;
}

const KitchenSidebar: React.FC<KitchenSidebarProps> = ({
  kitchenOrders,
  autoUpdateEnabled,
  toggleAutoUpdate
}) => {
  console.log("KitchenSidebar rendering with orders:", kitchenOrders);
  
  const menuItems = [
    {
      title: "Pendentes",
      icon: Clock,
      count: kitchenOrders.pending.length,
      color: "bg-amber-500"
    },
    {
      title: "Em Preparo", 
      icon: ChefHat,
      count: kitchenOrders.preparing.length,
      color: "bg-blue-500"
    },
    {
      title: "Prontos",
      icon: CheckCircle,
      count: kitchenOrders.ready.length,
      color: "bg-green-500"
    },
    {
      title: "Em Entrega",
      icon: Truck,
      count: kitchenOrders.delivering.length,
      color: "bg-purple-500"
    },
    {
      title: "Entregues",
      icon: Package,
      count: kitchenOrders.delivered.length,
      color: "bg-gray-500"
    }
  ];

  return (
    <Sidebar className="border-r" collapsible="icon" variant="overlay">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <ChefHat className="h-8 w-8 text-orange-500" />
          <div>
            <h2 className="font-bold text-lg">Cozinha</h2>
            <p className="text-sm text-gray-500">Sistema de Pedidos</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          <div className="p-4">
            <h3 className="font-semibold mb-3">Status dos Pedidos</h3>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title} className="mb-2">
                <SidebarMenuButton>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.title}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.count}
                    </Badge>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </div>

          <SidebarSeparator />

          <div className="p-4">
            <h3 className="font-semibold mb-3">Configurações</h3>
            
            <SidebarMenuItem className="mb-3">
              <SidebarMenuButton>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Atualização Automática</span>
                  </div>
                  <Switch 
                    checked={autoUpdateEnabled}
                    onCheckedChange={toggleAutoUpdate}
                  />
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton>
                <Bell className="h-4 w-4" />
                <span className="text-sm">Notificações</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton>
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm">Relatórios</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </div>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default KitchenSidebar;
