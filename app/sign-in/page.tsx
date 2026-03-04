import { SignInForm } from "@/src/components/auth/sign-in/SignInForm";

export default function SignInPage() {
  return (
    <main className="container mx-auto h-auto text-center min-h-screen py-8">
      <h1 className="montserrat light-gray-1 text-2xl px-2">Войти</h1>
      <div className="mx-auto mt-8 sm:w-full md:w-3/4 text-center px-4">
        <SignInForm />
      </div>
    </main>
  );
}
