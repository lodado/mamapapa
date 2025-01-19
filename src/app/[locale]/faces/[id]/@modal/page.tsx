"use client";

import { notFound, redirect } from "next/navigation";
import { getProductById } from "../../product";

export default function PDP({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-col items-center justify-between pt-[20px]">
        <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col items-center justify-center p-4">123</div>
      </main>
    </div>
  );
}
