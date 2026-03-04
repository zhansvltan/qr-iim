import Link from "next/link";
import { SignInForm } from "@/src/components/auth/sign-in/SignInForm";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <section className="w-full max-w-md rounded-2xl border border-break-light-line bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-main-text">Sign in</h1>
        <p className="mt-1 text-sm text-hint-text">
          Enter your email and password to continue.
        </p>

        <div className="mt-6">
          <SignInForm />
        </div>

        <p className="mt-4 text-sm text-hint-text">
          No account yet?{" "}
          <Link href="/sign-up" className="font-medium text-interactive-color hover:opacity-90">
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}
