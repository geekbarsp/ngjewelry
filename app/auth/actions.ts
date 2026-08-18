"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function authRedirect(mode: "signin" | "signup", kind: "error" | "message", text: string): never {
  redirect(`/auth?mode=${mode}&${kind}=${encodeURIComponent(text)}`);
}

export async function requestOtp(formData: FormData) {
  const mode = formData.get("mode") === "signup" ? "signup" : "signin";
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  if (!email || !email.includes("@")) authRedirect(mode, "error", "Enter a valid email address.");
  if (mode === "signup" && !fullName) authRedirect(mode, "error", "Enter your full name.");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: mode === "signup",
      ...(mode === "signup" ? { data: { full_name: fullName } } : {}),
    },
  });
  if (error) authRedirect(mode, "error", error.message);
  redirect(`/auth/verify?email=${encodeURIComponent(email)}&mode=${mode}`);
}

export async function verifyOtp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const token = String(formData.get("token") ?? "").replace(/\D/g, "");
  const mode = formData.get("mode") === "signup" ? "signup" : "signin";
  const verifyUrl = `/auth/verify?email=${encodeURIComponent(email)}&mode=${mode}`;

  if (!email || !/^\d{6}$/.test(token)) {
    redirect(`${verifyUrl}&error=${encodeURIComponent("Enter the six-digit code from your email.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
  if (error) redirect(`${verifyUrl}&error=${encodeURIComponent(error.message)}`);
  redirect("/");
}

export async function resendOtp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const mode = formData.get("mode") === "signup" ? "signup" : "signin";
  if (!email || !email.includes("@")) authRedirect(mode, "error", "Enter a valid email address.");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false },
  });
  if (error) {
    redirect(`/auth/verify?email=${encodeURIComponent(email)}&mode=${mode}&error=${encodeURIComponent(error.message)}`);
  }
  redirect(`/auth/verify?email=${encodeURIComponent(email)}&mode=${mode}&message=${encodeURIComponent("A new code was sent.")}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
