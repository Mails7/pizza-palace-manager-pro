
import React from "react";

interface ProductDetailsProps {
  selectedProduct: any;
  isPizzaProduct: boolean;
  hasBordaCampos: boolean;
  crustFlavorsArray: any[];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  selectedProduct,
  isPizzaProduct,
  hasBordaCampos,
  crustFlavorsArray,
}) => {
  return (
    <div className="border-b pb-4">
      <h3 className="font-medium text-lg">{selectedProduct.name}</h3>
      <p className="text-sm text-gray-500">{selectedProduct.description}</p>
      <p className="text-xs text-blue-500">Categoria: {selectedProduct.category}</p>
      <p className="text-xs text-purple-500">Type: {selectedProduct.type}</p>
      
      {/* Debug info - remover depois */}
      <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
        <p><strong>Debug:</strong></p>
        <p>isPizzaProduct: {isPizzaProduct ? 'SIM' : 'NÃO'}</p>
        <p>hasBordaCampos: {hasBordaCampos ? 'SIM' : 'NÃO'}</p>
        <p>selectedProduct.hasCrust: {selectedProduct.hasCrust ? 'SIM' : 'NÃO'}</p>
        <p>crustFlavors length: {crustFlavorsArray.length}</p>
        <p>Categoria inclui pizza: {selectedProduct.category?.toLowerCase().includes('pizza') ? 'SIM' : 'NÃO'}</p>
        <p>Type inclui pizza: {selectedProduct.type?.toLowerCase().includes('pizza') ? 'SIM' : 'NÃO'}</p>
      </div>
    </div>
  );
};

export default ProductDetails;
