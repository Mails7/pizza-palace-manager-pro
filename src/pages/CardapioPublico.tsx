
import React from "react";
import { ShoppingCartProvider } from "@/contexts/ShoppingCartContext";
import { useCardapioLogic } from "@/hooks/useCardapioLogic";
import ClientDataForm from "@/components/forms/ClientDataForm";
import ProductDetailModal from "@/components/modals/ProductDetailModal";
import ShoppingCartModal from "@/components/modals/ShoppingCartModal";
import FloatingCartButton from "@/components/FloatingCartButton";
import HeroSection from "@/components/cardapio/HeroSection";
import StoreBanner from "@/components/cardapio/StoreBanner";
import SearchSection from "@/components/cardapio/SearchSection";
import ProductsGrid from "@/components/cardapio/ProductsGrid";
import Footer from "@/components/cardapio/Footer";
import { Toaster } from "@/components/ui/sonner";

const CardapioPublicoContent = () => {
  const {
    // State
    products,
    searchTerm,
    selectedCategory,
    selectedProduct,
    isProductDetailOpen,
    isCartOpen,
    clientData,
    hasAccess,
    bannerConfig,
    // Shopping cart
    getTotalItems,
    getTotalPrice,
    // Handlers
    setSearchTerm,
    setSelectedCategory,
    setIsProductDetailOpen,
    setIsCartOpen,
    handleProductClick,
    handleAddToCart,
    handleClientDataSubmit,
    handleLogout,
    handleCheckout,
    formatCurrency
  } = useCardapioLogic();

  // Se não tem acesso, mostrar o formulário de dados
  if (!hasAccess) {
    return (
      <>
        <ClientDataForm onSubmit={handleClientDataSubmit} />
        <Toaster
          position="top-right"
          expand={true}
          richColors={true}
          closeButton={true}
          toastOptions={{
            duration: 4000,
            style: {
              zIndex: 10000,
              fontSize: '14px',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
          }}
        />
      </>
    );
  }

  // Log antes de renderizar o FloatingCartButton
  const shouldShowCart = getTotalItems() > 0;
  console.log('🛒 === RENDERIZAÇÃO ===');
  console.log('🛒 Deve mostrar carrinho?', shouldShowCart);
  console.log('🛒 Total de itens para mostrar:', getTotalItems());
  console.log('🛒 Preço total para mostrar:', getTotalPrice());

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-20 w-full">
        <HeroSection
          bannerConfig={bannerConfig}
          clientData={clientData}
          onLogout={handleLogout}
        />

        <StoreBanner bannerConfig={bannerConfig} />

        <SearchSection
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div className="w-full px-4 sm:px-6 py-4 sm:py-6">
          <ProductsGrid
            products={products}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchTerm={searchTerm}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            formatCurrency={formatCurrency}
          />
        </div>

        <Footer bannerConfig={bannerConfig} />

        {/* Floating Cart Button */}
        {shouldShowCart && (
          <FloatingCartButton
            itemCount={getTotalItems()}
            totalPrice={getTotalPrice()}
            onClick={() => {
              console.log('🛒 FloatingCartButton clicado!');
              setIsCartOpen(true);
            }}
          />
        )}

        {/* Modals */}
        <ProductDetailModal
          isOpen={isProductDetailOpen}
          onClose={() => setIsProductDetailOpen(false)}
          product={selectedProduct}
        />

        <ShoppingCartModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onCheckout={handleCheckout}
        />
      </div>

      {/* Toaster com configurações otimizadas para melhor visibilidade */}
      <Toaster
        position="top-right"
        expand={true}
        richColors={true}
        closeButton={true}
        offset={16}
        toastOptions={{
          duration: 4000,
          style: {
            zIndex: 10000,
            fontSize: '14px',
            fontWeight: '500',
            padding: '16px 20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            color: '#374151',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            minWidth: '300px',
            maxWidth: '400px',
          },
          className: 'font-medium',
        }}
      />
    </>
  );
};

const CardapioPublico = () => {
  console.log('🛒 === CARDÁPIO PÚBLICO WRAPPER RENDERIZADO ===');
  return (
    <ShoppingCartProvider>
      <CardapioPublicoContent />
    </ShoppingCartProvider>
  );
};

export default CardapioPublico;
