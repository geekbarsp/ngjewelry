"use server";

import { headers } from "next/headers";
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
  redirect("/account");
}

export async function signUp(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!fullName || !email || !password) authRedirect("signup", "error", "Complete every field to create your account.");
  if (password.length < 8) authRedirect("signup", "error", "Use a password with at least 8 characters.");

  const origin = (await headers()).get("origin") ?? "http://localhost:3000";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName }, emailRedirectTo: `${origin}/auth/callback?next=/account` },
  });
  if (error) authRedirect("signup", "error", error.message);
  if (data.session) redirect("/account");
  authRedirect("signin", "message", "Check your email to confirm your account, then sign in.");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
