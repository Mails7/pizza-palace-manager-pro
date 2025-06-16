
import React from "react";
import { Clock, MapPin, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientData {
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface BannerConfig {
  operatingHours: string;
  rating: string;
}

interface HeroSectionProps {
  bannerConfig: BannerConfig;
  clientData: ClientData | null;
  onLogout: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  bannerConfig,
  clientData,
  onLogout
}) => {
  return (
    <div className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white overflow-hidden w-full">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative w-full px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
          <div className="text-center lg:text-left flex-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 animate-fade-in">
              Nosso Cardápio
            </h1>
            <p className="text-base sm:text-lg lg:text-xl mb-4 opacity-90 max-w-2xl">
              Sabores únicos que despertam seus sentidos
            </p>
            <div className="flex flex-col sm:flex-row gap-3 text-sm justify-center lg:justify-start">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <Clock className="h-4 w-4" />
                <span>{bannerConfig.operatingHours}</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <MapPin className="h-4 w-4" />
                <span>Delivery disponível</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <Star className="h-4 w-4" />
                <span>{bannerConfig.rating}</span>
              </div>
            </div>
          </div>
          
          {clientData && (
            <div className="w-full sm:w-auto lg:w-64 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-3 text-white mb-3">
                <User className="h-5 w-5" />
                <span className="font-medium text-sm sm:text-base">
                  Olá, {clientData.name.split(' ')[0]}!
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-white hover:bg-white/20 w-full text-sm"
              >
                Alterar Dados
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
