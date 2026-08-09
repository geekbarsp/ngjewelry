import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Gem, ShieldCheck } from "lucide-react";
import type { SiteArticle } from "@/data/site-content";

export default function ContentPage({ article }: { article: SiteArticle }) {
  return <main className="content-page"><header><Link href="/">NARCISO GERONIMO <span>JEWELRY SHOP</span></Link><nav><Link href="/shop">Shop</Link><Link href="/visit">Visit us</Link><Link href="/services">Consultation</Link></nav></header><section className="content-hero"><Link href="/"><ArrowLeft /> Home</Link><p className="eyebrow">{article.eyebrow}</p><h1>{article.title}</h1><p>{article.intro}</p></section><section className="content-body"><aside><Gem /><span>Clear guidance</span><p>Prepared by the Narciso Geronimo client care team.</p></aside><div>{article.sections.map((section,index)=><article key={section.title}><span>0{index+1}</span><h2>{section.title}</h2><p>{section.body}</p>{section.points&&<ul>{section.points.map(point=><li key={point}><Check />{point}</li>)}</ul>}</article>)}</div></section><section className="content-cta"><ShieldCheck /><div><p className="eyebrow">STILL HAVE A QUESTION?</p><h2>Speak with our team.</h2><p>We’ll explain the details that apply to your piece before you decide.</p></div><Link href="/services" className="btn light">Book a consultation <ArrowRight /></Link></section></main>;
}
