import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/shop", "/collections", "/subasta", "/about", "/services"];
  return pages.map((path, index) => ({ url: `https://narcisogeronimo.com${path}`, lastModified: new Date(), changeFrequency: "weekly", priority: index === 0 ? 1 : .8 }));
}
