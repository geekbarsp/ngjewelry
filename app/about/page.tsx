import type { Metadata } from "next";
import Storefront from "@/components/storefront";

export const metadata: Metadata = { title: "About Us | Narciso Geronimo Jewelry Shop", description: "Learn about the standards, values, and personal service behind Narciso Geronimo Jewelry Shop." };
export default function AboutPage(){ return <Storefront view="about"/>; }
