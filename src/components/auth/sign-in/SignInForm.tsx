"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signInLocalUser } from "@/src/lib/auth/localAuth";
import { useI18n } from "@/src/lib/i18n";

type SignInFormProps = {
  onSuccess?: (message: string) => void;
};

export function SignInForm({ onSuccess }: SignInFormProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [iin, setIin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    const normalizedIin = iin.replace(/\D/g, "").slice(0, 12);
    const result = signInLocalUser(normalizedIin, password);
    if (!result.ok) {
      if (result.message === "Неверный ИИН или пароль.") {
        setError(t("auth.error.invalidCredentials"));
      } else {
        setError(result.message);
      }
      setLoading(false);
      return;
    }

    const message = t("auth.signInSuccess");
    onSuccess?.(message);
    setSuccessMessage(message);
    setLoading(false);
    if (normalizedIin === "222222222222") {
      router.push("/exec/applications");
      return;
    }
    if (normalizedIin === "444444444444") {
      router.push("/vvk/applications");
      return;
    }
    router.push("/");
  };

  return (
    <>
      <ul id="tabs-tabFill" role="tablist" className="nav nav-tabs flex flex-col md:flex-row flex-wrap list-none border-b-0 pl-0 mb-4">
        <li role="login" className="nav-item flex-auto text-center px-4">
          <span className="cursor-pointer montserrat nav-link w-full block text-lg leading-tight border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-2 text-black active">
            {t("auth.loginPassword")}
          </span>
        </li>
        <li role="ecp" className="nav-item flex-auto text-center px-4">
          <span className="cursor-pointer montserrat nav-link w-full block text-lg leading-tight border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-2 text-black non-active">
            {t("auth.ecp")}
          </span>
        </li>
      </ul>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mx-auto mt-8 sm:w-full md:w-1/2 text-center px-4">
          <div className="form-group my-8">
            <input
              type="text"
              required
              inputMode="numeric"
              pattern="\\d{12}"
              maxLength={12}
              value={iin}
              onChange={(event) => setIin(event.target.value.replace(/\D/g, ""))}
              className="montserrat text-center w-full py-2 px-4 bg-gray-1 border-solid border-0 border-b border-black"
              placeholder={t("auth.iin")}
            />
          </div>

          <div className="form-group my-8">
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="montserrat text-center w-full py-2 px-4 bg-gray-1 border-solid border-0 border-b border-black"
              placeholder={t("auth.password")}
            />
            <small>
              {t("auth.passwordHint")}
            </small>
          </div>

          {error ? <p className="text-sm text-error-text">{error}</p> : null}
          {successMessage ? <p className="text-sm text-success-text">{successMessage}</p> : null}

          <button type="submit" disabled={loading} className="bg-gray-500 inline-block montserrat mt-5 px-8 py-3 rounded text-sm text-white">
            {loading ? t("auth.signInLoading") : t("auth.signIn")}
          </button>
        </div>
      </form>

      <section className="auth-links w-full py-4">
        <Link href="/sign-up" className="text-gray-700 underline">
          {t("auth.registration")}
        </Link>
        <br />
        <a className="text-gray-700 underline">{t("auth.confirmAccount")}</a>
        <br />
        <a className="text-gray-700 underline">{t("auth.forgotPassword")}</a>
      </section>
    </>
  );
}
