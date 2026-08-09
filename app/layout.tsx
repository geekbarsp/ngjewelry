import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-serif", weight: ["400", "500", "600"] });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Narciso Geronimo Jewelry | Fine Jewelry Philippines",
  description: "Timeless fine jewelry in the Philippines. Discover rings, necklaces, earrings, Subasta pieces, and private consultations.",
  icons: { icon: "/images/narciso-geronimo-logo.png", apple: "/images/narciso-geronimo-logo.png" },
  openGraph: { title: "Narciso Geronimo Jewelry", description: "Timeless elegance, crafted to be remembered.", type: "website" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#faf9f6" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${serif.variable} ${sans.variable}`}>{children}</body></html>;
}
