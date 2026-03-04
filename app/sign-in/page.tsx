import { SignInForm } from "@/src/components/auth/sign-in/SignInForm";
import "@/src/content/qyzmet-auth.exact.css";

export default function SignInPage() {
  return (
    <main className="container mx-auto h-auto text-center min-h-screen">
      <h1 className="montserrat light-gray-1 text-2xl px-2">Войти</h1>
      <SignInForm />
    </main>
  );
}
