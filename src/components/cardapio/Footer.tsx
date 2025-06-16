
import React from "react";

interface BannerConfig {
  storeName: string;
}

interface FooterProps {
  bannerConfig: BannerConfig;
}

const Footer: React.FC<FooterProps> = ({ bannerConfig }) => {
  return (
    <div className="bg-gray-800 text-white py-6 sm:py-8 mt-8 sm:mt-12 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-sm sm:text-base mb-2">Obrigado por escolher {bannerConfig.storeName}!</p>
        <p className="text-xs sm:text-sm text-gray-400">Fazemos com amor, servimos com carinho ❤️</p>
      </div>
    </div>
  );
};

export default Footer;
