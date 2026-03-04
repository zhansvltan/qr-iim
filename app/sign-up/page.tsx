"use client";

import { SignUpForm } from "@/src/components/auth/sign-up/SignUpForm";
import "@/src/content/qyzmet-auth.exact.css";
import { useI18n } from "@/src/lib/i18n";

export default function SignUpPage() {
  const { t } = useI18n();

  return (
    <main className="container mx-auto h-auto py-4 text-center min-h-screen">
      <h1 className="montserrat font-bold light-gray-1 text-2xl font-bold px-2">{t("auth.signUp.title")}</h1>
      <SignUpForm />
    </main>
  );
}
