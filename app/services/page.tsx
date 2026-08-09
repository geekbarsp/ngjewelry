import type { Metadata } from "next";
import Storefront from "@/components/storefront";

export const metadata: Metadata = { title: "Jewelry Services | Narciso Geronimo", description: "Request a private consultation, ask for Subasta assistance, or schedule an atelier visit." };
export default function ServicesPage(){ return <Storefront view="services"/>; }
