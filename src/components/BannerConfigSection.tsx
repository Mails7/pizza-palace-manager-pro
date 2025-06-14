
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BannerConfig {
  title: string;
  subtitle: string;
  backgroundImage: string;
  storeName: string;
  operatingHours: string;
  deliveryInfo: string;
  rating: string;
}

const BannerConfigSection = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [bannerConfig, setBannerConfig] = useState<BannerConfig>({
    title: "🍕 Promoção Especial! 🍕",
    subtitle: "Pizzas grandes a partir de R$ 29,90",
    backgroundImage: "",
    storeName: "Pizzaria do Kassio",
    operatingHours: "18h às 23h",
    deliveryInfo: "Grátis ac. R$ 50",
    rating: "4.8 estrelas"
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerConfig({
          ...bannerConfig,
          backgroundImage: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Salvar configurações do banner no localStorage
    localStorage.setItem('bannerConfig', JSON.stringify(bannerConfig));
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    toast({
      title: "Banner configurado",
      description: "As configurações do banner foram salvas com sucesso!",
    });
  };

  // Carregar configurações salvas
  React.useEffect(() => {
    const savedConfig = localStorage.getItem('bannerConfig');
    if (savedConfig) {
      try {
        setBannerConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Erro ao carregar configurações do banner:', error);
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Banner Principal</CardTitle>
          <CardDescription>
            Configure o banner que aparece no cardápio público
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="bannerImage">Imagem de Fundo do Banner</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <label htmlFor="bannerImage" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Escolher Imagem
                  </label>
                </Button>
                <Input
                  id="bannerImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {bannerConfig.backgroundImage && (
                  <span className="text-sm text-green-600">Imagem carregada</span>
                )}
              </div>
              {bannerConfig.backgroundImage && (
                <div className="border rounded-lg p-2">
                  <img 
                    src={bannerConfig.backgroundImage} 
                    alt="Preview do banner" 
                    className="h-24 w-full object-cover rounded"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="bannerTitle">Título da Promoção</Label>
            <Input
              id="bannerTitle"
              value={bannerConfig.title}
              onChange={(e) => setBannerConfig({...bannerConfig, title: e.target.value})}
              placeholder="Ex: 🍕 Promoção Especial! 🍕"
            />
          </div>

          <div>
            <Label htmlFor="bannerSubtitle">Descrição da Promoção</Label>
            <Textarea
              id="bannerSubtitle"
              value={bannerConfig.subtitle}
              onChange={(e) => setBannerConfig({...bannerConfig, subtitle: e.target.value})}
              placeholder="Ex: Pizzas grandes a partir de R$ 29,90"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Loja</CardTitle>
          <CardDescription>
            Configure as informações que aparecem abaixo do banner
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="storeName">Nome da Loja</Label>
            <Input
              id="storeName"
              value={bannerConfig.storeName}
              onChange={(e) => setBannerConfig({...bannerConfig, storeName: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="operatingHours">Horário de Funcionamento</Label>
              <Input
                id="operatingHours"
                value={bannerConfig.operatingHours}
                onChange={(e) => setBannerConfig({...bannerConfig, operatingHours: e.target.value})}
                placeholder="Ex: 18h às 23h"
              />
            </div>

            <div>
              <Label htmlFor="deliveryInfo">Informações de Entrega</Label>
              <Input
                id="deliveryInfo"
                value={bannerConfig.deliveryInfo}
                onChange={(e) => setBannerConfig({...bannerConfig, deliveryInfo: e.target.value})}
                placeholder="Ex: Grátis ac. R$ 50"
              />
            </div>

            <div>
              <Label htmlFor="rating">Avaliação</Label>
              <Input
                id="rating"
                value={bannerConfig.rating}
                onChange={(e) => setBannerConfig({...bannerConfig, rating: e.target.value})}
                placeholder="Ex: 4.8 estrelas"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Salvando..." : "Salvar Configurações do Banner"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BannerConfigSection;
