"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Box, CalendarDays, Check, ChevronDown, Gem, Heart, Menu, PackageCheck, Share2, ShieldCheck, Sparkles, X, ZoomIn } from "lucide-react";
import { useMemo, useState } from "react";
import { peso, type Product } from "@/data/products";

export default function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const [activeImage, setActiveImage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [liked, setLiked] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [notice, setNotice] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const isSubasta = product.category === "Subasta";
  const specs = useMemo(() => [
    ["Metal / karat", product.material], ["Estimated weight", product.weight], ["Stone", product.stone],
    ["Stone weight", product.carat ? `${product.carat.toFixed(2)} ct` : "Not applicable"], ["Shape", product.shape],
    ["Dimensions", product.dimensions], ["SKU", product.sku], ["Availability", product.availability],
  ], [product]);

  const share = async () => {
    const data = { title: product.name, text: `View ${product.name} at Narciso Geronimo Jewelry Shop`, url: location.href };
    if (navigator.share) await navigator.share(data);
    else { await navigator.clipboard.writeText(location.href); setNotice("Link copied"); setTimeout(() => setNotice(""), 1800); }
  };

  return <main className="product-page">
    <header className="detail-header">
      <button className="detail-menu" onClick={() => setMobileMenu(true)} aria-label="Open navigation"><Menu /></button>
      <Link href="/" className="detail-brand">NARCISO GERONIMO <span>JEWELRY SHOP</span></Link>
      <nav><Link href="/shop">Shop</Link><Link href="/collections">Collections</Link><Link href="/subasta">Subasta</Link><Link href="/visit">Visit us</Link></nav>
      <Link href="/services" className="detail-consult">Book a consultation</Link>
    </header>
    <AnimatePresence>{mobileMenu && <motion.aside className="detail-mobile-menu" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}><button onClick={() => setMobileMenu(false)}><X /></button><p>MENU</p>{[["Home", "/"], ["Shop", "/shop"], ["Collections", "/collections"], ["Subasta", "/subasta"], ["Visit us", "/visit"], ["Client services", "/services"]].map(([label, href]) => <Link key={href} href={href}>{label}<ArrowRight /></Link>)}</motion.aside>}</AnimatePresence>

    <div className="product-breadcrumb"><Link href="/shop"><ArrowLeft /> Shop</Link><span>/</span><span>{product.category}</span><span>/</span><b>{product.name}</b></div>
    <section className="product-main">
      <div className="product-gallery">
        <div className="gallery-thumbs" aria-label="Product photos">{product.images.map((image, index) => <button key={image} className={activeImage === index ? "active" : ""} onClick={() => setActiveImage(index)}><Image src={image} alt={`${product.name} view ${index + 1}`} fill sizes="90px" /></button>)}</div>
        <motion.button className="gallery-stage" onClick={() => setZoom(true)} aria-label="Open fullscreen product image" key={activeImage} initial={{ opacity: .6 }} animate={{ opacity: 1 }}>
          <Image src={product.images[activeImage]} alt={`${product.name}, detailed view ${activeImage + 1}`} fill priority sizes="(max-width: 900px) 100vw, 58vw" />
          <span><ZoomIn /> Fullscreen zoom</span>
        </motion.button>
      </div>

      <div className="product-summary">
        <div className="product-labels"><span>{product.collection}</span>{product.tag && <b>{product.tag}</b>}</div>
        <h1>{product.name}</h1>
        <div className="product-price"><b>{peso(product.price)}</b>{product.oldPrice && <del>{peso(product.oldPrice)}</del>}</div>
        <p className="product-description">{product.description}</p>
        <div className={`availability ${product.availability === "Sold" ? "sold" : ""}`}><i /><b>{product.availability}</b><span>·</span><span>{product.shipping}</span></div>
        <label className="size-picker">{product.sizes[0] === "One size" ? "Configuration" : "Select size"}<span><Link href="/guides/ring-size">Size guide</Link></span><div><select value={selectedSize} onChange={event => setSelectedSize(event.target.value)}>{product.sizes.map(size => <option key={size}>{size}</option>)}</select><ChevronDown /></div></label>
        <button className="btn dark product-primary" onClick={() => setNotice(isSubasta ? "Piece reserved for 30 minutes" : `${product.name} added to your bag`)}>{isSubasta ? "Reserve this piece" : "Add to bag"}<ArrowRight /></button>
        <div className="product-actions"><button className={liked ? "liked" : ""} onClick={() => setLiked(!liked)}><Heart />{liked ? "Saved to wishlist" : "Add to wishlist"}</button><button onClick={share}><Share2 /> Share</button></div>
        {notice && <motion.p className="product-notice" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><Check />{notice}</motion.p>}
        <div className="product-assurances"><span><ShieldCheck /><b>Authenticity guaranteed</b><small>Inspected and documented</small></span><span><PackageCheck /><b>Insured delivery</b><small>Tracked from our store to you</small></span><span><CalendarDays /><b>Personal guidance</b><small>Private consultation available</small></span></div>
      </div>
    </section>

    <section className="product-spec-section">
      <div><p className="eyebrow">THE DETAILS</p><h2>Every detail,<br />considered.</h2><p>Transparent specifications help you understand exactly what you are choosing. Measurements are approximate and each piece is inspected before dispatch.</p></div>
      <dl>{specs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    </section>

    {isSubasta && <section className="condition-report">
      <div className="condition-heading"><p className="eyebrow">SUBASTA CONDITION REPORT</p><h2>Character,<br />clearly disclosed.</h2><span><Check /> {product.authenticity}</span></div>
      <div className="condition-copy"><h3>{product.condition}</h3><p>{product.provenance}</p><ul>{product.conditionNotes?.map(note => <li key={note}><Check />{note}</li>)}</ul><p className="condition-note">Close-up gallery images form part of this report. We welcome requests for additional photographs or a live video inspection before reservation.</p><a className="btn outline" href="https://www.facebook.com/narciso.geronimo.jewels" target="_blank" rel="noreferrer">Inquire on Messenger <ArrowRight /></a></div>
      {product.restoration && <div className="restoration"><article><div><Image src={product.restoration.before} alt={`${product.name} before conservation`} fill sizes="50vw" /></div><span>Before</span></article><article><div><Image src={product.restoration.after} alt={`${product.name} after conservation`} fill sizes="50vw" /></div><span>After gentle conservation</span></article></div>}
    </section>}

    <section className="product-care-grid">
      <article><Sparkles /><p className="eyebrow">CARE</p><h3>Made to be worn.</h3><p>{product.care}</p><Link href="/guides/jewelry-care">Read the care guide <ArrowRight /></Link></article>
      <article><Gem /><p className="eyebrow">CERTIFICATION</p><h3>Confidence included.</h3><p>{product.certification}. Your documentation is packed securely with the piece.</p><Link href="/policies/authenticity">Our authenticity promise <ArrowRight /></Link></article>
      <article><Box /><p className="eyebrow">PRESENTATION</p><h3>Ready for the moment.</h3><p>Signature box, protective pouch, care card, and discreet insured packaging are included.</p><Link href="/policies/shipping">Shipping and insurance <ArrowRight /></Link></article>
    </section>

    <section className="consultation-banner"><div><p className="eyebrow">PERSONAL GUIDANCE</p><h2>Would you like to see it closer?</h2><p>Meet a jewelry specialist in store or request a private video consultation.</p></div><Link href={`/services?piece=${product.slug}`} className="btn light"><CalendarDays /> Book a consultation</Link></section>

    <section className="related-products"><div className="related-heading"><p className="eyebrow">COMPLETE THE STORY</p><h2>Related pieces</h2><Link href="/shop">View all jewelry <ArrowRight /></Link></div><div>{related.map(item => <Link className="related-card" href={`/product/${item.slug}`} key={item.id}><div><Image src={item.image} alt={item.name} fill sizes="(max-width: 700px) 50vw, 25vw" /></div><p>{item.material}</p><h3>{item.name}</h3><b>{peso(item.price)}</b></Link>)}</div></section>

    <footer className="detail-footer"><div><b>NARCISO GERONIMO</b><span>JEWELRY SHOP</span><p>Fine jewelry in Cabanatuan City, shaped by more than 30 years of trust and craft.</p></div><div><Link href="/visit">Visit us</Link><Link href="/policies/authenticity">Authenticity</Link><Link href="/guides/jewelry-care">Jewelry care</Link><Link href="/policies/privacy">Privacy & terms</Link></div><small>© 2026 Narciso Geronimo Jewelry Shop</small></footer>

    <AnimatePresence>{zoom && <motion.div className="fullscreen-gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><button className="fullscreen-close" onClick={() => setZoom(false)}><X /> Close</button><Image src={product.images[activeImage]} alt={`${product.name} fullscreen view`} fill sizes="100vw" priority /><div>{product.images.map((image, index) => <button key={image} onClick={() => setActiveImage(index)} className={activeImage === index ? "active" : ""}><Image src={image} alt="" fill sizes="70px" /></button>)}</div></motion.div>}</AnimatePresence>
  </main>;
}
