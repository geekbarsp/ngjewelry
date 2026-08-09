import type { Metadata } from "next";
import Storefront from "@/components/storefront";

export const metadata: Metadata = { title: "Jewelry Collections | Narciso Geronimo", description: "Explore jewelry collections organized by story, occasion, material, and character." };
export default function CollectionsPage(){ return <Storefront view="collections"/>; }
