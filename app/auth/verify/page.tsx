import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Gem, MailCheck } from "lucide-react";
import { resendSignupOtp, verifySignupOtp } from "../actions";

export const metadata: Metadata = { title: "Verify Email | Narciso Geronimo Jewelry" };

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const email = params.email?.trim() ?? "";
  if (!email) {
    return <main className="otp-missing"><Gem /><h1>Start by creating your account.</h1><Link className="btn dark" href="/auth?mode=signup">Return to sign up</Link></main>;
  }

  return <main className="otp-page">
    <Link className="otp-back" href="/auth?mode=signup"><ArrowLeft /> Use another email</Link>
    <section className="otp-card">
      <div className="otp-icon"><MailCheck /></div>
      <p className="eyebrow">CHECK YOUR INBOX</p>
      <h1>Enter your six-digit code.</h1>
      <p>We sent a one-time code to <strong>{email}</strong>. It expires shortly and can only be used once.</p>
      {params.error && <p className="auth-alert error" role="alert">{params.error}</p>}
      {params.message && <p className="auth-alert success" role="status">{params.message}</p>}
      <form action={verifySignupOtp} className="otp-form">
        <input name="email" type="hidden" value={email} />
        <label htmlFor="token">Verification code</label>
        <input id="token" name="token" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="000000" required autoFocus />
        <button className="btn dark" type="submit">Verify and continue</button>
      </form>
      <form action={resendSignupOtp} className="otp-resend">
        <input name="email" type="hidden" value={email} />
        <span>Didn&apos;t receive it?</span><button type="submit">Send a new code</button>
      </form>
    </section>
  </main>;
}
