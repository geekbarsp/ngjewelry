export type Product = { id: number; name: string; category: string; price: number; oldPrice?: number; image: string; tag?: string; material: string; rating: number };

const photos = [
  "photo-1605100804763-247f67b3557e", "photo-1599643478518-a784e5dc4c8f", "photo-1535632066927-ab7c9ab60908",
  "photo-1611652022419-a9419f74343d", "photo-1515562141207-7a88fb7ce338", "photo-1598560917505-59a3ad559071",
  "photo-1573408301185-9146fe634ad0", "photo-1627293509201-cd0c780043e6", "photo-1617038220319-276d3cfab638",
  "photo-1602173574767-37ac01994b2a"
];
const img = (id: string, n: number) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${n}&q=86`;

export const products: Product[] = [
  ["Luna Diamond Ring","Rings",48900,"New"],["Aurelia Pendant","Necklaces",26500,"Bestseller"],["Celeste Hoops","Earrings",18900,"New"],["Eternity Pavé Band","Rings",35900,"Bestseller"],
  ["Isla Chain Bracelet","Bracelets",22400,""],["Solitaire Grace","Rings",78500,"Exclusive"],["Seraphina Drops","Earrings",29800,""],["Golden Hour Necklace","Necklaces",32500,"New"],
  ["Amara Signet","Rings",28400,""],["Marquise Light","Pendants",44500,"Exclusive"],["Vela Tennis Bracelet","Bracelets",89900,"Bestseller"],["Mira Pearl Studs","Earrings",16800,""],
  ["Promise Wedding Band","Wedding",24900,""],["North Star Pendant","Pendants",21900,"New"],["Heritage Cufflinks","Men",27900,""],["Devotion Ring","Rings",56900,"Exclusive"],
  ["Rosario Chain","Necklaces",38500,""],["Classic Huggies","Earrings",14500,"Bestseller"],["Elan Bangle","Bracelets",41900,""],["Radiance Halo","Rings",94500,"New"],
  ["Subasta Diamond Cluster Ring","Subasta",42750,"One of One"],["Subasta Vintage Gold Bangle","Subasta",31800,"One of One"],["Subasta Sapphire Pendant","Subasta",38500,"One of One"],["Subasta Heritage Earrings","Subasta",24600,"One of One"]
].map((p, i) => ({ id:i+1, name:p[0], category:p[1], price:p[2], tag:p[3] || undefined, oldPrice:i%7===3 ? Number(p[2])+6500 : undefined, image:img(photos[i%photos.length], 900), material:i%3===0?"18K Yellow Gold":i%3===1?"14K Yellow Gold":"18K White Gold", rating:4.7+(i%3)*.1 } as Product));

export const peso = (value: number) => new Intl.NumberFormat("en-PH", { style:"currency", currency:"PHP", maximumFractionDigits:0 }).format(value);
