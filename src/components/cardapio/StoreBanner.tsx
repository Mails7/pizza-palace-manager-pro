
import React from "react";
import { Clock, MapPin, Star } from "lucide-react";

interface BannerConfig {
  title: string;
  subtitle: string;
  backgroundImage: string;
  operatingHours: string;
  deliveryInfo: string;
  rating: string;
}

interface StoreBannerProps {
  bannerConfig: BannerConfig;
}

const StoreBanner: React.FC<StoreBannerProps> = ({ bannerConfig }) => {
  return (
    <div className="w-full px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl overflow-hidden shadow-lg border border-orange-200/50">
          <div className="relative h-auto min-h-32 sm:min-h-40 md:min-h-48 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 p-6">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative h-full flex flex-col items-center justify-center text-center">
              <div className="text-white">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                  {bannerConfig.title}
                </h2>
                <p className="text-sm sm:text-lg opacity-90 mb-4">
                  {bannerConfig.subtitle}
                </p>
                {bannerConfig.backgroundImage && (
                  <div className="mt-4">
                    <img 
                      src={bannerConfig.backgroundImage} 
                      alt="Imagem promocional"
                      className="mx-auto max-w-xs sm:max-w-sm md:max-w-md rounded-lg shadow-lg border-2 border-white/30"
                      onLoad={() => console.log('Imagem carregada com sucesso!')}
                      onError={(e) => console.error('Erro ao carregar imagem:', e)}
                    />
                  </div>
                )}
                {!bannerConfig.backgroundImage && (
                  <p className="text-xs opacity-60 mt-2">
                    Configure uma imagem promocional nas configurações
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Horário</p>
                  <p className="text-xs text-gray-500">{bannerConfig.operatingHours}</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Delivery</p>
                  <p className="text-xs text-gray-500">{bannerConfig.deliveryInfo}</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Star className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Avaliação</p>
                  <p className="text-xs text-gray-500">{bannerConfig.rating}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreBanner;
