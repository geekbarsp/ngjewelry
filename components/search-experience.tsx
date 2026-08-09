"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, Search, TrendingUp, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { peso, products } from "@/data/products";

const popular = ["18K diamond ring", "Gold earrings", "Subasta", "Gift under ₱50,000"];
const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const distance = (a: string, b: string) => {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) { let previous = row[0]; row[0] = i; for (let j = 1; j <= b.length; j++) { const next = row[j]; row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1)); previous = next; } }
  return row[b.length];
};
const matches = (query: string, text: string) => {
  const q = normalize(query); const target = normalize(text); if (!q) return true; if (target.includes(q)) return true;
  return q.split(" ").every(token => target.split(" ").some(word => word.includes(token) || distance(token, word) <= (token.length > 5 ? 2 : 1)));
};

export default function SearchExperience({ close }: { close: () => void }) {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => { const timer = window.setTimeout(() => { try { setRecent(JSON.parse(localStorage.getItem("ng-recent-searches") || "[]")); } catch {} }, 0); return () => window.clearTimeout(timer); }, []);
  const results = useMemo(() => products.filter(product => matches(query, [product.name, product.material, product.category, product.collection, product.stoneType, product.stone, product.shape, product.tag].filter(Boolean).join(" "))).slice(0, 6), [query]);
  const collections = useMemo(() => [...new Set(products.flatMap(product => [product.collection, product.category]))].filter(value => matches(query, value)).slice(0, 5), [query]);
  const save = (value: string) => { if (!value.trim()) return; const next = [value, ...recent.filter(item => item !== value)].slice(0, 5); setRecent(next); localStorage.setItem("ng-recent-searches", JSON.stringify(next)); };
  const choose = (value: string) => { setQuery(value); save(value); };

  return <div className="search-experience">
    <button className="close" onClick={close}><X /></button>
    <p className="eyebrow">SEARCH NARCISO GERONIMO</p>
    <div className="luxury-search-input"><Search /><input autoFocus value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => event.key === "Enter" && save(query)} placeholder="Try “18K diamond ring”" /><span>{query && `${results.length} matches`}</span></div>
    {!query ? <div className="search-discovery">
      {recent.length > 0 && <section><h3><Clock3 /> Recent searches</h3>{recent.map(item => <button key={item} onClick={() => choose(item)}>{item}<ArrowRight /></button>)}</section>}
      <section><h3><TrendingUp /> Popular searches</h3>{popular.map(item => <button key={item} onClick={() => choose(item)}>{item}<ArrowRight /></button>)}</section>
      <aside><span>PERSONAL SEARCH</span><h2>Not sure where<br />to begin?</h2><p>Our Gift Finder narrows the collection around the person, moment, and details you have in mind.</p><Link href="/services#gift" onClick={close}>Start the Gift Finder <ArrowRight /></Link></aside>
    </div> : <div className="search-live-results">
      <section><div className="search-section-title"><h3>Pieces</h3><Link href={`/shop?search=${encodeURIComponent(query)}`} onClick={() => save(query)}>View all <ArrowRight /></Link></div>{results.length ? <div className="search-product-results">{results.map(product => <Link href={`/product/${product.slug}`} key={product.id} onClick={() => save(query)}><div><Image src={product.image} alt={product.name} fill sizes="90px" /></div><span><small>{product.material}</small><b>{product.name}</b><em>{peso(product.price)}</em></span></Link>)}</div> : <div className="no-search-results"><h3>No exact piece found.</h3><p>We checked close spellings too. Try a material, stone, or jewelry type.</p></div>}</section>
      <aside><h3>Collections & categories</h3>{collections.map(value => <Link href={value === "Subasta" ? "/subasta" : `/shop?category=${encodeURIComponent(value)}`} onClick={() => save(query)} key={value}>{value}<ArrowRight /></Link>)}<div><span>Search understands</span><p>Product names, 18K Gold, Japan Gold necklaces, metal color, stone type, shape, collection, and close spellings.</p></div></aside>
    </div>}
  </div>;
}
