"use client";

import { notFound, redirect } from "next/navigation";
import { getProductById } from "../../product";
import { ProductImage } from "../../components/product-image";

export default function PDP({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  const handleBack = () => {
    redirect("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-col items-center justify-between pt-[20px]">
        <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col items-center justify-center p-4">
          <ProductImage
            product={product}
            maxWidth="100%"
            maxHeight="calc(100vh - 250px - env(safe-area-inset-top) - env(safe-area-inset-bottom))"
            className="w-full"
            layoutId={`product-image-${product.id}`}
          />
          123
        </div>
      </main>
    </div>
  );
}
