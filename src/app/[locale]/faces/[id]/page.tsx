import { products } from "../product";
import PDP from "./@modal/page";
import { ReactNode } from "react";

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
