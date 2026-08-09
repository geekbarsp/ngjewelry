import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { guides, policies } from "@/data/site-content";
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/shop", "/collections", "/subasta", "/about", "/services", "/visit"];
  const staticPages: MetadataRoute.Sitemap = pages.map((path, index) => ({ url: `https://narcisogeronimo.com${path}`, lastModified: new Date(), changeFrequency: "weekly", priority: index === 0 ? 1 : .8 }));
  const productPages: MetadataRoute.Sitemap = products.map(product => ({ url: `https://narcisogeronimo.com/product/${product.slug}`, lastModified: new Date(), changeFrequency: "weekly", priority: .75 }));
  const knowledgePages: MetadataRoute.Sitemap = [...guides.map(article => `/guides/${article.slug}`), ...policies.map(article => `/policies/${article.slug}`)].map(path => ({ url: `https://narcisogeronimo.com${path}`, lastModified: new Date(), changeFrequency: "monthly", priority: .6 }));
  return [...staticPages, ...productPages, ...knowledgePages];
}
