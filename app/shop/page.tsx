import type { Metadata } from "next";
import Storefront from "@/components/storefront";

export const metadata: Metadata = { title: "Shop Fine Jewelry | Narciso Geronimo", description: "Browse fine rings, necklaces, earrings, bracelets, pendants, and Subasta finds." };
export default function ShopPage(){ return <Storefront view="shop"/>; }
