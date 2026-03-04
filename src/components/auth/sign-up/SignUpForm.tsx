"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { supabase } from "@/src/lib/supabase/client";

type SignUpFormProps = {
  onSuccess?: (message: string) => void;
};

const IIN_REGEX = /^\d{12}$/;

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [iin, setIin] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!IIN_REGEX.test(iin)) {
      setError("ИИН должен состоять из 12 цифр.");
      return;
    }

    if (!agreed) {
      setError("Необходимо согласие на обработку персональных данных.");
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          iin,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.session.user.id,
        email,
        iin,
      });

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }
    }

    const message = data.session
      ? "Аккаунт создан и вы авторизованы."
      : "Аккаунт создан. Подтвердите email и войдите.";

    onSuccess?.(message);
    setSuccessMessage(message);

    setEmail("");
    setPassword("");
    setIin("");
    setAgreed(false);
    setLoading(false);
  };

  return (
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
            placeholder="ИИН"
          />
        </div>

        <div className="form-group my-8">
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="montserrat text-center w-full py-2 px-4 bg-gray-1 border-solid border-0 border-b border-black"
            placeholder="Email"
          />
          <small>
            Этот email будет использоваться для подтверждения аккаунта и сброса пароля.
          </small>
        </div>

        <div className="form-group my-8">
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="montserrat text-center w-full py-2 px-4 bg-gray-1 border-solid border-0 border-b border-black"
            placeholder="Пароль"
          />
          <small>
            Минимальная длина пароля: 6 символов.
          </small>
        </div>

        <div className="items-center my-8">
          <input
            type="checkbox"
            id="confirmation"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
          />
          <label htmlFor="confirmation" className="ml-2 montserrat light-gray-1 cursor-pointer text-sm">
            Я согласен на обработку персональных данных
          </label>
        </div>

        {error ? <p className="text-sm text-error-text">{error}</p> : null}
        {successMessage ? <p className="text-sm text-success-text">{successMessage}</p> : null}

        <button type="submit" disabled={loading} className="auth-submit bg-gray-500 inline-block montserrat mt-5 px-8 py-3 rounded text-sm text-white">
          {loading ? "Регистрация..." : "Регистрация"}
        </button>

        <section className="auth-links w-full py-4">
          <Link href="/sign-in" className="text-gray-700 underline">
            Уже есть аккаунт? Войти
          </Link>
        </section>
      </div>
    </form>
  );
}
