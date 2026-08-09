"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Heart, MessageCircle, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { peso, products } from "@/data/products";

type Filters = {
  categories: string[]; karats: string[]; metals: string[]; stones: string[]; shapes: string[]; sizes: string[];
  availability: string[]; flags: string[]; maxPrice: number; minCarat: number;
};
const emptyFilters: Filters = { categories: [], karats: [], metals: [], stones: [], shapes: [], sizes: [], availability: [], flags: [], maxPrice: 100000, minCarat: 0 };
const groups = [
  ["Jewelry type", "categories", ["Rings", "Necklaces", "Earrings", "Bracelets", "Pendants", "Wedding", "Men"]],
  ["Gold purity", "karats", ["14K", "18K"]],
  ["Metal color", "metals", ["Yellow Gold", "White Gold", "Rose Gold"]],
  ["Stone", "stones", ["Diamond", "Gemstone", "Pearl", "None"]],
  ["Stone shape", "shapes", ["Round", "Oval", "Princess", "Emerald", "Pear", "Cushion", "Marquise"]],
  ["Ring size", "sizes", ["US 4", "US 5", "US 6", "US 7", "US 8", "US 9"]],
  ["Availability", "availability", ["In stock", "Only 1 available", "Made to order"]],
  ["Curated", "flags", ["New arrivals", "Bestseller", "Subasta", "Sale"]],
] as const;

export default function CatalogExperience({ subasta = false }: { subasta?: boolean }) {
  const [filters, setFilters] = useState<Filters>(subasta ? { ...emptyFilters, flags: ["Subasta"] } : emptyFilters);
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [liked, setLiked] = useState<number[]>([]);

  const toggle = (key: keyof Filters, value: string) => setFilters(current => {
    const values = current[key] as string[];
    return { ...current, [key]: values.includes(value) ? values.filter(item => item !== value) : [...values, value] };
  });
  const activeCount = groups.reduce((count, [, key]) => count + (filters[key] as string[]).length, 0) + (filters.maxPrice < 100000 ? 1 : 0) + (filters.minCarat > 0 ? 1 : 0);
  const visible = useMemo(() => {
    const result = products.filter(product => {
      if (subasta && (product.category !== "Subasta" || product.availability === "Sold")) return false;
      if (filters.categories.length && !filters.categories.includes(product.category)) return false;
      if (filters.karats.length && !filters.karats.includes(product.karat)) return false;
      if (filters.metals.length && !filters.metals.includes(product.metal)) return false;
      if (filters.stones.length && !filters.stones.includes(product.stoneType)) return false;
      if (filters.shapes.length && !filters.shapes.includes(product.shape)) return false;
      if (filters.sizes.length && !filters.sizes.some(size => product.sizes.includes(size))) return false;
      if (filters.availability.length && !filters.availability.includes(product.availability)) return false;
      if (product.price > filters.maxPrice || product.carat < filters.minCarat) return false;
      if (filters.flags.includes("New arrivals") && !product.isNew) return false;
      if (filters.flags.includes("Bestseller") && !product.bestseller) return false;
      if (filters.flags.includes("Subasta") && product.category !== "Subasta") return false;
      if (filters.flags.includes("Sale") && !product.sale) return false;
      return true;
    });
    return result.sort((a, b) => sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : sort === "newest" ? Number(b.isNew) - Number(a.isNew) || b.id - a.id : sort === "popular" ? b.popularity - a.popularity : Number(b.featured) - Number(a.featured) || a.id - b.id);
  }, [filters, sort, subasta]);

  const sidebar = <div className="catalog-filter-panel">
    <div className="filter-panel-head"><b>Filter pieces</b><button onClick={() => setFiltersOpen(false)}><X /></button></div>
    {groups.map(([label, key, options]) => !subasta || key !== "flags" ? <details key={label} open={["Jewelry type", "Gold purity", "Curated"].includes(label)}><summary>{label}<ChevronDown /></summary><div>{options.map(option => <label key={option}><input type="checkbox" checked={(filters[key] as string[]).includes(option)} onChange={() => toggle(key, option)} /><i>{(filters[key] as string[]).includes(option) && <Check />}</i>{option}</label>)}</div></details> : null)}
    <details open><summary>Price range<ChevronDown /></summary><div className="range-filter"><output>Up to {peso(filters.maxPrice)}</output><input type="range" min="15000" max="100000" step="5000" value={filters.maxPrice} onChange={event => setFilters(current => ({ ...current, maxPrice: Number(event.target.value) }))} /><span>₱15k</span><span>₱100k+</span></div></details>
    <details><summary>Minimum carat<ChevronDown /></summary><div className="carat-options">{[0, .25, .5, .75, 1].map(value => <button className={filters.minCarat === value ? "active" : ""} onClick={() => setFilters(current => ({ ...current, minCarat: value }))} key={value}>{value ? `${value}+ ct` : "Any"}</button>)}</div></details>
    <button className="clear-filters" onClick={() => setFilters(subasta ? { ...emptyFilters, flags: ["Subasta"] } : emptyFilters)}>Clear all filters</button>
  </div>;

  return <section className="catalog-experience" id="catalog">
    <div className="catalog-title"><p className="eyebrow">{subasta ? "AVAILABLE NOW" : "THE CATALOG"}</p><h2>{subasta ? "Current Subasta" : "All jewelry"}</h2><p>{subasta ? "Singular pieces, individually inspected and available only while in stock." : "Filter every piece by the details that matter to you."}</p></div>
    <div className="catalog-toolbar"><button onClick={() => setFiltersOpen(true)}><SlidersHorizontal /> Filters {activeCount > 0 && <i>{activeCount}</i>}</button><span>{visible.length} pieces</span><label>Sort by<select value={sort} onChange={event => setSort(event.target.value)}><option value="featured">Featured</option><option value="newest">Newest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="popular">Popularity</option></select><ChevronDown /></label></div>
    <div className="catalog-layout"><aside>{sidebar}</aside><motion.div layout className="catalog-results">{visible.map(product => <motion.article layout key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Link href={`/product/${product.slug}`} className="catalog-image"><Image src={product.image} alt={product.name} fill sizes="(max-width: 700px) 50vw, 28vw" />{product.tag && <span>{product.tag}</span>}<b>View details</b></Link>
      <button className={liked.includes(product.id) ? "catalog-heart liked" : "catalog-heart"} onClick={() => setLiked(current => current.includes(product.id) ? current.filter(id => id !== product.id) : [...current, product.id])}><Heart /></button>
      <p>{product.material} · {product.stoneType}</p><Link href={`/product/${product.slug}`}><h3>{product.name}</h3></Link><div><b>{peso(product.price)}</b>{product.oldPrice && <del>{peso(product.oldPrice)}</del>}</div><small>{product.availability}</small><a className="catalog-message" href="https://m.me/narciso.geronimo.jewels" target="_blank" rel="noreferrer" aria-label={`Message us about ${product.name}`}><MessageCircle/> Message us</a>
    </motion.article>) }{visible.length === 0 && <div className="catalog-empty"><h3>No exact matches.</h3><p>Try widening your price, material, or stone preferences.</p><button className="btn dark" onClick={() => setFilters(emptyFilters)}>Reset filters</button></div>}</motion.div></div>
    <AnimatePresence>{filtersOpen && <><motion.div className="filter-backdrop" onClick={() => setFiltersOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} /><motion.div className="mobile-filter-drawer" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}>{sidebar}</motion.div></>}</AnimatePresence>
  </section>;
}
