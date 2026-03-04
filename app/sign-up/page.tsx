import Link from "next/link";
import { SignUpForm } from "@/src/components/auth/sign-up/SignUpForm";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-break-gray px-4 py-8">
      <section className="w-full max-w-md rounded-2xl border border-break-light-line bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-main-text">Sign up</h1>
        <p className="mt-1 text-sm text-hint-text">
          Create your account using email, password, and IIN.
        </p>

        <div className="mt-6">
          <SignUpForm />
        </div>

        <p className="mt-4 text-sm text-hint-text">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-interactive-color hover:opacity-90">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
