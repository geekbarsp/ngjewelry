"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function authRedirect(mode: "signin" | "signup", kind: "error" | "message", text: string): never {
  redirect(`/auth?mode=${mode}&${kind}=${encodeURIComponent(text)}`);
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) authRedirect("signin", "error", "Enter your email and password.");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) authRedirect("signin", "error", error.message);
  redirect("/");
}

export async function signUp(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!fullName || !email || !password) authRedirect("signup", "error", "Complete every field to create your account.");
  if (password.length < 8) authRedirect("signup", "error", "Use a password with at least 8 characters.");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) authRedirect("signup", "error", error.message);
  if (data.session) redirect("/");
  redirect(`/auth/verify?email=${encodeURIComponent(email)}`);
}

export async function verifySignupOtp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const token = String(formData.get("token") ?? "").replace(/\D/g, "");
  const verifyUrl = `/auth/verify?email=${encodeURIComponent(email)}`;

  if (!email || !/^\d{6}$/.test(token)) {
    redirect(`${verifyUrl}&error=${encodeURIComponent("Enter the six-digit code from your email.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
  if (error) redirect(`${verifyUrl}&error=${encodeURIComponent(error.message)}`);
  redirect("/");
}

export async function resendSignupOtp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email || !email.includes("@")) authRedirect("signup", "error", "Enter a valid email address.");

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({ type: "signup", email });
  if (error) {
    redirect(`/auth/verify?email=${encodeURIComponent(email)}&error=${encodeURIComponent(error.message)}`);
  }
  redirect(`/auth/verify?email=${encodeURIComponent(email)}&message=${encodeURIComponent("A new code was sent.")}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
