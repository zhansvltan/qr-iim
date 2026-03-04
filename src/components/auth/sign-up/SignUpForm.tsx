"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { registerLocalUser } from "@/src/lib/auth/localAuth";
import { useI18n } from "@/src/lib/i18n";

type SignUpFormProps = {
  onSuccess?: (message: string) => void;
};

const IIN_REGEX = /^\d{12}$/;

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
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
      setError(t("auth.error.iin12"));
      return;
    }

    if (!name.trim() || !surname.trim()) {
      setError(t("auth.error.fillNameSurname"));
      return;
    }

    if (!birthDay) {
      setError(t("auth.error.birthDay"));
      return;
    }

    if (!gender) {
      setError(t("auth.error.gender"));
      return;
    }

    if (!phone.trim()) {
      setError(t("auth.error.phone"));
      return;
    }

    if (!agreed) {
      setError(t("auth.error.consent"));
      return;
    }

    setLoading(true);

    const result = registerLocalUser({
      iin: Number(iin),
      name: name.trim(),
      surname: surname.trim(),
      patronymic: patronymic.trim(),
      birthDay,
      gender,
      phone: phone.trim(),
      email,
      password,
      agreed,
    });

    if (!result.ok) {
      if (result.message === "Пользователь с таким email уже существует.") {
        setError(t("auth.error.emailExists"));
      } else if (result.message === "Пользователь с таким ИИН уже существует.") {
        setError(t("auth.error.iinExists"));
      } else {
        setError(result.message);
      }
      setLoading(false);
      return;
    }

    const message = t("auth.signUpSuccess");

    onSuccess?.(message);
    setSuccessMessage(message);

    setEmail("");
    setPassword("");
    setIin("");
    setName("");
    setSurname("");
    setPatronymic("");
    setBirthDay("");
    setGender("");
    setPhone("");
    setAgreed(false);
    setLoading(false);
    router.push("/sign-in");
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
            placeholder={t("auth.iin")}
          />
        </div>

        <div className="form-group my-8">
          <input
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="montserrat text-center w-full py-2 px-4 bg-gray-1 border-solid border-0 border-b border-black"
            placeholder={t("auth.name")}
          />
        </div>

        <div className="form-group my-8">
          <input
            type="text"
            required
            value={surname}
            onChange={(event) => setSurname(event.target.value)}
            className="montserrat text-center w-full py-2 px-4 bg-gray-1 border-solid border-0 border-b border-black"
            placeholder={t("auth.surname")}
          />
        </div>

        <div className="form-group my-8">
          <input
            type="text"
            value={patronymic}
            onChange={(event) => setPatronymic(event.target.value)}
            className="montserrat text-center w-full py-2 px-4 bg-gray-1 border-solid border-0 border-b border-black"
            placeholder={t("auth.patronymic")}
          />
        </div>

        <div className="form-group my-8">
          <input
            type="date"
            required
            value={birthDay}
            onChange={(event) => setBirthDay(event.target.value)}
            className="montserrat text-center w-full py-2 px-4 bg-gray-1 border-solid border-0 border-b border-black"
          />
        </div>

        <div className="form-group my-8">
          <select
            required
            value={gender}
            onChange={(event) => setGender(event.target.value)}
            className="montserrat text-center w-full py-2 px-4 bg-gray-1 border-solid border-0 border-b border-black"
          >
            <option value="" disabled>
              {t("auth.gender")}
            </option>
            <option value="male">{t("auth.genderMale")}</option>
            <option value="female">{t("auth.genderFemale")}</option>
          </select>
        </div>

        <div className="form-group my-8">
          <input
            type="text"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="montserrat text-center w-full py-2 px-4 bg-gray-1 border-solid border-0 border-b border-black"
            placeholder={t("auth.phone")}
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
            {t("auth.emailHint")}
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
            placeholder={t("auth.password")}
          />
          <small>
            {t("auth.passwordMin6")}
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
            {t("auth.agreePersonalData")}
          </label>
        </div>

        {error ? <p className="text-sm text-error-text">{error}</p> : null}
        {successMessage ? <p className="text-sm text-success-text">{successMessage}</p> : null}

        <button type="submit" disabled={loading} className="bg-gray-500 inline-block montserrat mt-5 px-8 py-3 rounded text-sm text-white">
          {loading ? t("auth.signUpLoading") : t("auth.signUp")}
        </button>

        <section className="auth-links w-full py-4">
          <Link href="/sign-in" className="text-gray-700 underline">
            {t("auth.hasAccount")}
          </Link>
        </section>
      </div>
    </form>
  );
}
