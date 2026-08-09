import type { Metadata } from "next";
import Storefront from "@/components/storefront";

export const metadata: Metadata = { title: "Subasta Jewelry | Narciso Geronimo", description: "Discover individually reviewed, one-of-one Subasta jewelry." };
export default function SubastaPage(){ return <Storefront view="subasta"/>; }
