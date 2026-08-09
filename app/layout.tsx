import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const serif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif", display: "swap", fallback: ["Georgia", "serif"], style: ["normal", "italic"] });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap", fallback: ["Arial", "sans-serif"] });

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
