import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Gem, MailCheck } from "lucide-react";
import { resendOtp, verifyOtp } from "../actions";

export const metadata: Metadata = { title: "Verify Email | Narciso Geronimo Jewelry" };

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; mode?: string; error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const email = params.email?.trim() ?? "";
  const mode = params.mode === "signup" ? "signup" : "signin";

  if (!email) {
    return <main className="otp-missing"><Gem /><h1>Start with your email.</h1><Link className="btn dark" href={`/auth?mode=${mode}`}>Return to sign in</Link></main>;
  }

  return <main className="otp-page">
    <Link className="otp-back" href={`/auth?mode=${mode}`}><ArrowLeft /> Use another email</Link>
    <section className="otp-card">
      <div className="otp-icon"><MailCheck /></div>
      <p className="eyebrow">CHECK YOUR INBOX</p>
      <h1>Enter your six-digit code.</h1>
      <p>We sent a one-time code to <strong>{email}</strong>. It expires shortly and can only be used once.</p>
      {params.error && <p className="auth-alert error" role="alert">{params.error}</p>}
      {params.message && <p className="auth-alert success" role="status">{params.message}</p>}
      <form action={verifyOtp} className="otp-form">
        <input name="email" type="hidden" value={email} />
        <input name="mode" type="hidden" value={mode} />
        <label htmlFor="token">Verification code</label>
        <input id="token" name="token" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="000000" required autoFocus />
        <button className="btn dark" type="submit">Verify and continue</button>
      </form>
      <form action={resendOtp} className="otp-resend">
        <input name="email" type="hidden" value={email} />
        <input name="mode" type="hidden" value={mode} />
        <span>Didn&apos;t receive it?</span><button type="submit">Send a new code</button>
      </form>
    </section>
  </main>;
}
