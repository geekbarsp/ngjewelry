import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Gem, LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { signOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My Account | Narciso Geronimo Jewelry" };

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  if (!claims?.sub) redirect("/auth?mode=signin");

  const { data: profile } = await supabase.from("profiles").select("full_name, created_at").eq("id", claims.sub).maybeSingle();
  const email = typeof claims.email === "string" ? claims.email : "";
  const metadata = claims.user_metadata as { full_name?: string } | undefined;
  const fullName = profile?.full_name || metadata?.full_name || "Valued client";
  const memberSince = profile?.created_at ? new Intl.DateTimeFormat("en-PH", { month: "long", year: "numeric" }).format(new Date(profile.created_at)) : "Recently joined";

  return <main className="account-page">
    <header className="account-header"><Link href="/"><ArrowLeft /> Continue shopping</Link><Link className="account-brand" href="/"><Gem /> Narciso Geronimo</Link><form action={signOut}><button type="submit">Sign out <LogOut /></button></form></header>
    <section className="account-hero"><p className="eyebrow">YOUR ACCOUNT</p><h1>Welcome, {fullName}.</h1><p>Your private place for a more personal jewelry experience.</p></section>
    <section className="account-content">
      <article className="account-profile"><div className="account-monogram">{fullName.charAt(0).toUpperCase()}</div><div><span>Client profile</span><h2>{fullName}</h2><p>{email}</p><small>Member since {memberSince}</small></div></article>
      <div className="account-benefits"><article><Sparkles /><span>Saved pieces</span><h3>Your collection starts here.</h3><p>Wishlist syncing is ready for the next storefront update.</p><Link href="/shop">Explore the collection</Link></article><article><ShieldCheck /><span>Private by design</span><h3>Your account is protected.</h3><p>Authentication is handled securely by Supabase with row-level database access.</p><Link href="/policies/privacy">Read our privacy policy</Link></article></div>
    </section>
  </main>;
}
