export type MetalColor = "Yellow Gold" | "White Gold" | "Rose Gold";
export type StoneType = "Diamond" | "Gemstone" | "Pearl" | "None";
export type Availability = "In stock" | "Only 1 available" | "Made to order" | "Sold";

export type Product = {
  id: number;
  slug: string;
  sku: string;
  name: string;
  category: string;
  collection: string;
  price: number;
  oldPrice?: number;
  image: string;
  images: string[];
  video?: string;
  tag?: string;
  material: string;
  karat: "18K";
  metal: MetalColor;
  stoneType: StoneType;
  stone: string;
  shape: string;
  carat: number;
  weight: string;
  dimensions: string;
  sizes: string[];
  availability: Availability;
  certification: string;
  care: string;
  shipping: string;
  rating: number;
  popularity: number;
  featured: boolean;
  isNew: boolean;
  bestseller: boolean;
  sale: boolean;
  description: string;
  condition?: string;
  conditionNotes?: string[];
  provenance?: string;
  authenticity?: string;
  restoration?: { before: string; after: string };
};

const photos = [
  "photo-1605100804763-247f67b3557e", "photo-1599643478518-a784e5dc4c8f", "photo-1535632066927-ab7c9ab60908",
  "photo-1611652022419-a9419f74343d", "photo-1515562141207-7a88fb7ce338", "photo-1598560917505-59a3ad559071",
  "photo-1573408301185-9146fe634ad0", "photo-1627293509201-cd0c780043e6", "photo-1617038220319-276d3cfab638",
  "photo-1602173574767-37ac01994b2a",
];
const img = (id: string, width = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=88`;
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const catalog = [
  ["Luna Diamond Ring", "Rings", 48900, "New"], ["Aurelia Pendant", "Necklaces", 26500, "Bestseller"], ["Celeste Hoops", "Earrings", 18900, "New"], ["Eternity Pavé Band", "Rings", 35900, "Bestseller"],
  ["Isla Chain Bracelet", "Bracelets", 22400, ""], ["Solitaire Grace", "Rings", 78500, "Exclusive"], ["Seraphina Drops", "Earrings", 29800, ""], ["Golden Hour Necklace", "Necklaces", 32500, "New"],
  ["Amara Signet", "Rings", 28400, ""], ["Marquise Light", "Pendants", 44500, "Exclusive"], ["Vela Tennis Bracelet", "Bracelets", 89900, "Bestseller"], ["Mira Pearl Studs", "Earrings", 16800, ""],
  ["Promise Wedding Band", "Wedding", 24900, ""], ["North Star Pendant", "Pendants", 21900, "New"], ["Heritage Cufflinks", "Men", 27900, ""], ["Devotion Ring", "Rings", 56900, "Exclusive"],
  ["Rosario Chain", "Necklaces", 38500, ""], ["Classic Huggies", "Earrings", 14500, "Bestseller"], ["Elan Bangle", "Bracelets", 41900, ""], ["Radiance Halo", "Rings", 94500, "New"],
  ["Subasta Diamond Cluster Ring", "Subasta", 42750, "One of One"], ["Subasta Vintage Gold Bangle", "Subasta", 31800, "One of One"], ["Subasta Sapphire Pendant", "Subasta", 38500, "One of One"], ["Subasta Heritage Earrings", "Subasta", 24600, "One of One"],
] as const;

const stoneFor = (index: number): Pick<Product, "stoneType" | "stone" | "shape" | "carat"> => {
  if ([4, 8, 12, 14, 16, 18, 21].includes(index)) return { stoneType: "None", stone: "No center stone", shape: "—", carat: 0 };
  if ([11, 23].includes(index)) return { stoneType: "Pearl", stone: "Freshwater pearl", shape: "Round", carat: 0 };
  if ([9, 22].includes(index)) return { stoneType: "Gemstone", stone: index === 22 ? "Natural blue sapphire" : "Blue topaz", shape: index === 9 ? "Marquise" : "Oval", carat: index === 22 ? 0.72 : 0.58 };
  const shapes = ["Round", "Oval", "Princess", "Emerald", "Pear", "Cushion"];
  return { stoneType: "Diamond", stone: "Natural diamond", shape: shapes[index % shapes.length], carat: Number((0.18 + (index % 6) * 0.12).toFixed(2)) };
};

export const products: Product[] = catalog.map(([name, category, price, tag], index) => {
  const isSubasta = category === "Subasta";
  const karat = "18K" as const;
  const metal: MetalColor = category === "Necklaces" ? "Yellow Gold" : index % 5 === 2 ? "Rose Gold" : index % 3 === 2 ? "White Gold" : "Yellow Gold";
  const stone = stoneFor(index);
  const primaryPhoto = photos[index % photos.length];
  const gallery = [primaryPhoto, photos[(index + 3) % photos.length], photos[(index + 6) % photos.length], photos[(index + 8) % photos.length]].map(id => img(id));
  const oldPrice = index % 7 === 3 ? price + 6500 : undefined;
  return {
    id: index + 1,
    slug: slugify(name),
    sku: `NG-${category.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(4, "0")}`,
    name,
    category,
    collection: isSubasta ? "Subasta" : index % 4 === 0 ? "Everyday Gold" : index % 4 === 1 ? "Diamond Icons" : index % 4 === 2 ? "Modern Heirlooms" : "Celebration",
    price,
    oldPrice,
    image: gallery[0],
    images: gallery,
    tag: tag || undefined,
    material: category === "Necklaces" ? "18K Japan Gold" : `${karat} ${metal}`,
    karat,
    metal,
    ...stone,
    weight: `${(2.1 + (index % 7) * 0.65).toFixed(1)} g${isSubasta ? " estimated" : ""}`,
    dimensions: category === "Rings" || name.includes("Ring") || name.includes("Band") ? "Band 2.1 mm · Setting 6.4 mm" : category === "Earrings" ? "12 × 9 mm" : category === "Bracelets" ? "18 cm length" : "Chain 45 cm · Pendant 14 × 9 mm",
    sizes: category === "Rings" || name.includes("Ring") || name.includes("Band") ? ["US 4", "US 5", "US 6", "US 7", "US 8", "US 9"] : ["One size"],
    availability: isSubasta ? (index === 23 ? "Sold" : "Only 1 available") : index % 8 === 6 ? "Made to order" : "In stock",
    certification: stone.stoneType === "Diamond" ? "NG authenticity card · Diamond assessment included" : `${karat} gold purity and authenticity card`,
    care: "Store separately in the provided pouch. Avoid chemicals and remove before swimming. Complimentary annual inspection is available in store.",
    shipping: isSubasta ? "Dispatch in 2–4 business days after final inspection" : "Insured delivery in 3–7 business days",
    rating: 4.7 + (index % 3) * 0.1,
    popularity: 100 - index * 3 + (tag === "Bestseller" ? 30 : 0),
    featured: [0, 5, 10, 19, 20].includes(index),
    isNew: tag === "New",
    bestseller: tag === "Bestseller",
    sale: Boolean(oldPrice),
    description: isSubasta
      ? "A singular, independently inspected piece selected for its design, character, and enduring wearability. Its individual marks are part of its story and are disclosed in the condition report."
      : "Designed as a modern heirloom, this piece balances refined proportions with everyday wearability. Each setting is inspected by hand before it leaves our jewelry house.",
    condition: isSubasta ? (index % 2 ? "Very good vintage condition" : "Excellent pre-owned condition") : undefined,
    conditionNotes: isSubasta ? ["Light surface marks visible under magnification", "Setting and clasp checked and secure", "Professionally cleaned; original proportions preserved"] : undefined,
    provenance: isSubasta ? "Acquired from a private Central Luzon collection; ownership details remain confidential." : undefined,
    authenticity: isSubasta ? "Verified by Narciso Geronimo Jewelry Shop" : undefined,
    restoration: isSubasta ? { before: gallery[2], after: gallery[0] } : undefined,
  };
});

export const productBySlug = (slug: string) => products.find(product => product.slug === slug);
export const relatedProducts = (product: Product, limit = 4) => products.filter(item => item.id !== product.id && (item.category === product.category || item.stoneType === product.stoneType)).slice(0, limit);
export const peso = (value: number) => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(value);
