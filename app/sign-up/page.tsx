import { SignUpForm } from "@/src/components/auth/sign-up/SignUpForm";

export default function SignUpPage() {
  return (
    <main className="container mx-auto h-auto py-4 text-center min-h-screen">
      <h1 className="montserrat font-bold light-gray-1 text-2xl font-bold px-2">Регистрация</h1>
      <div className="mx-auto mt-8 sm:w-full md:w-3/4 text-center px-4">
        <SignUpForm />
      </div>
    </main>
  );
}
