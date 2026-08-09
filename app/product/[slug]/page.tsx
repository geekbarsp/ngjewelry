import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/product-detail";
import { productBySlug, products, relatedProducts } from "@/data/products";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map(product => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) return { title: "Product not found | Narciso Geronimo" };
  return {
    title: `${product.name} | Narciso Geronimo Jewelry`,
    description: `${product.material}, ${product.stone.toLowerCase()}. ${product.availability}. View specifications, certification, care, and insured delivery.`,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: { title: product.name, description: product.description, images: [{ url: product.image, alt: product.name }] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();
  return <ProductDetail product={product} related={relatedProducts(product)} />;
}
