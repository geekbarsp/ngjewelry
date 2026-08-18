import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Gem } from "lucide-react";
import { signIn, signUp } from "./actions";

export const metadata: Metadata = { title: "Account | Narciso Geronimo Jewelry", description: "Sign in or create your Narciso Geronimo Jewelry account." };

export default async function AuthPage({ searchParams }: { searchParams: Promise<{ mode?: string; error?: string; message?: string }> }) {
  const params = await searchParams;
  const isSignUp = params.mode === "signup";
  return <main className="auth-page">
    <section className="auth-visual">
      <Image src="/images/hero-ring.png" alt="Fine jewelry by Narciso Geronimo" fill priority sizes="(max-width: 850px) 100vw, 50vw" />
      <div className="auth-visual-shade" />
      <Link className="auth-back" href="/"><ArrowLeft /> Back to the collection</Link>
      <div className="auth-visual-copy"><p className="eyebrow">YOUR PRIVATE COLLECTION</p><h1>Jewelry feels more personal when it remembers you.</h1><p>Keep your account details and future saved pieces together in one secure place.</p></div>
    </section>
    <section className="auth-panel">
      <Link className="auth-brand" href="/"><Gem /><span>Narciso Geronimo<small>Jewelry Shop</small></span></Link>
      <div className="auth-card">
        <p className="eyebrow">{isSignUp ? "BECOME A CLIENT" : "WELCOME BACK"}</p>
        <h2>{isSignUp ? "Create your account." : "Sign in to your account."}</h2>
        <p className="auth-intro">{isSignUp ? "Create an account, then confirm your email with a six-digit code." : "Enter your email and password to continue."}</p>
        <div className="auth-tabs" aria-label="Account options"><Link className={!isSignUp ? "active" : ""} href="/auth?mode=signin">Sign in</Link><Link className={isSignUp ? "active" : ""} href="/auth?mode=signup">Sign up</Link></div>
        {params.error && <p className="auth-alert error" role="alert">{params.error}</p>}
        {params.message && <p className="auth-alert success" role="status">{params.message}</p>}
        <form action={isSignUp ? signUp : signIn} className="auth-form">
          {isSignUp && <label>Full name<input name="fullName" type="text" autoComplete="name" required /></label>}
          <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" autoComplete={isSignUp ? "new-password" : "current-password"} minLength={8} required />{isSignUp && <small>At least 8 characters</small>}</label>
          <button className="btn dark" type="submit">{isSignUp ? "Create account" : "Sign in"}</button>
        </form>
        <p className="auth-switch">{isSignUp ? "Already have an account?" : "New to Narciso Geronimo?"} <Link href={isSignUp ? "/auth?mode=signin" : "/auth?mode=signup"}>{isSignUp ? "Sign in" : "Create one"}</Link></p>
      </div>
    </section>
  </main>;
}
