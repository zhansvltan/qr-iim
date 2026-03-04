"use client";

import { SignInForm } from "@/src/components/auth/sign-in/SignInForm";
import "@/src/content/qyzmet-auth.exact.css";
import { useI18n } from "@/src/lib/i18n";

export default function SignInPage() {
  const { t } = useI18n();

  return (
    <main className="container mx-auto h-auto text-center min-h-screen">
      <h1 className="montserrat light-gray-1 text-2xl px-2">{t("auth.signIn.title")}</h1>
      <SignInForm />
    </main>
  );
}
