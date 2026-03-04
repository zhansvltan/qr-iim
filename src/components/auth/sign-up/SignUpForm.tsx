"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { supabase } from "@/src/lib/supabase/client";

type SignUpFormProps = {
  onSuccess?: (message: string) => void;
};

const IIN_REGEX = /^\d{12}$/;

export function SignUpForm({ onSuccess }: SignUpFormProps) {
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
      setError("ИИН должен состоять из 12 цифр.");
      return;
    }

    if (!name.trim() || !surname.trim()) {
      setError("Заполните имя и фамилию.");
      return;
    }

    if (!birthDay) {
      setError("Укажите дату рождения.");
      return;
    }

    if (!gender) {
      setError("Выберите пол.");
      return;
    }

    if (!phone.trim()) {
      setError("Укажите номер телефона.");
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
          name: name.trim(),
          surname: surname.trim(),
          patronymic: patronymic.trim(),
          birthDay,
          gender,
          phone: phone.trim(),
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
    setName("");
    setSurname("");
    setPatronymic("");
    setBirthDay("");
    setGender("");
    setPhone("");
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
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="montserrat text-center w-full py-2 px-4 bg-gray-1 border-solid border-0 border-b border-black"
            placeholder="Имя"
          />
        </div>

        <div className="form-group my-8">
          <input
            type="text"
            required
            value={surname}
            onChange={(event) => setSurname(event.target.value)}
            className="montserrat text-center w-full py-2 px-4 bg-gray-1 border-solid border-0 border-b border-black"
            placeholder="Фамилия"
          />
        </div>

        <div className="form-group my-8">
          <input
            type="text"
            value={patronymic}
            onChange={(event) => setPatronymic(event.target.value)}
            className="montserrat text-center w-full py-2 px-4 bg-gray-1 border-solid border-0 border-b border-black"
            placeholder="Отчество"
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
              Пол
            </option>
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
          </select>
        </div>

        <div className="form-group my-8">
          <input
            type="text"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="montserrat text-center w-full py-2 px-4 bg-gray-1 border-solid border-0 border-b border-black"
            placeholder="Телефон"
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
            Данный email будет использоваться для подтверждения аккаунта и сброса пароля.
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

        <button type="submit" disabled={loading} className="bg-gray-500 inline-block montserrat mt-5 px-8 py-3 rounded text-sm text-white">
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
