import { products } from "../product";
import { ReactNode } from "react";

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage() {
  return <></>;
}
