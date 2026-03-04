import { SignUpForm } from "@/src/components/auth/sign-up/SignUpForm";
import "@/src/content/qyzmet-auth.exact.css";

export default function SignUpPage() {
  return (
    <main className="container mx-auto h-auto py-4 text-center min-h-screen">
      <h1 className="montserrat font-bold light-gray-1 text-2xl font-bold px-2">Регистрация</h1>
      <SignUpForm />
    </main>
  );
}
