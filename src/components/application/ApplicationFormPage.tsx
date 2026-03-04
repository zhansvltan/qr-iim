"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState, useSyncExternalStore } from "react";
import { HomeExactSupportButton } from "@/src/components/home/HomeExactSupportButton";
import {
  getCurrentLocalSession,
  getCurrentLocalUser,
  subscribeToLocalAuthChanges,
} from "@/src/lib/auth/localAuth";
import { getVacancyById } from "@/src/lib/vacancyData";
import { HomeExactNavbar } from "../home/HomeExactNav";

type RelativeItem = {
  fullName: string;
  status: string;
  birthYear: string;
  iin: string;
};

type ApplicationFormPageProps = {
  vacancyId: string;
};

const EDUCATION_OPTIONS = [
  "Дошкольное",
  "Основное общее среднее (9 классов)",
  "Общее среднее (11 классов)",
  "Неоконченное профессиональное среднее (проф.школы, проф.лицеи, колледжи)",
  "Профессиональное среднее (проф.школы, проф.лицеи, колледжи)",
  "Неоконченное высшее",
  "Высшее",
  "Послевузовское Высшее",
];

const APPLICATIONS_STORAGE_KEY = "qyzmet_applications";

function RequiredMark() {
  return <span className="text-red-600 ml-1">*</span>;
}

export function ApplicationFormPage({ vacancyId }: ApplicationFormPageProps) {
  const session = useSyncExternalStore(
    subscribeToLocalAuthChanges,
    getCurrentLocalSession,
    () => null,
  );
  const user = useSyncExternalStore(
    subscribeToLocalAuthChanges,
    getCurrentLocalUser,
    () => null,
  );
  const vacancy = useMemo(() => getVacancyById(vacancyId), [vacancyId]);

  const [education, setEducation] = useState("");
  const [diplomaFileName, setDiplomaFileName] = useState("");
  const [testCertificateFileName, setTestCertificateFileName] = useState("");
  const [isServedContractInNGRK, setIsServedContractInNGRK] = useState("");
  const [isServedInPolice, setIsServedInPolice] = useState("");
  const [isChildOfKilledOfficer, setIsChildOfKilledOfficer] = useState("");
  const [hasEntOver100, setHasEntOver100] = useState("");
  const [hasAltynBelgi, setHasAltynBelgi] = useState("");
  const [consent, setConsent] = useState(false);

  const [relatives, setRelatives] = useState<RelativeItem[]>([]);
  const [relativeFullName, setRelativeFullName] = useState("");
  const [relativeStatus, setRelativeStatus] = useState("");
  const [relativeBirthYear, setRelativeBirthYear] = useState("");
  const [relativeIin, setRelativeIin] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fullName = [user?.surname, user?.name, user?.patronymic]
    .filter(Boolean)
    .join(" ");

  const addRelative = () => {
    if (
      !relativeFullName.trim() ||
      !relativeStatus.trim() ||
      !relativeBirthYear.trim() ||
      !relativeIin.trim()
    ) {
      setError("Заполните все поля для родственника.");
      return;
    }

    setRelatives((prev) => [
      ...prev,
      {
        fullName: relativeFullName.trim(),
        status: relativeStatus.trim(),
        birthYear: relativeBirthYear.trim(),
        iin: relativeIin.trim(),
      },
    ]);

    setRelativeFullName("");
    setRelativeStatus("");
    setRelativeBirthYear("");
    setRelativeIin("");
    setError(null);
  };

  const removeRelative = (index: number) => {
    setRelatives((prev) =>
      prev.filter((_, currentIndex) => currentIndex !== index),
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!vacancy) {
      setError("Вакансия не найдена.");
      return;
    }

    if (!session || !user) {
      setError("Для подачи заявки необходимо авторизоваться.");
      return;
    }

    if (!education || !isServedContractInNGRK || !isServedInPolice) {
      setError("Заполните обязательные поля формы.");
      return;
    }

    if (!isChildOfKilledOfficer || !hasEntOver100 || !hasAltynBelgi) {
      setError("Заполните обязательные поля формы.");
      return;
    }

    if (!consent) {
      setError("Необходимо дать согласие на обработку персональных данных.");
      return;
    }

    const payload = {
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      vacancyId: vacancy.id,
      vacancyTitle: vacancy.title,
      academy: vacancy.academy,
      specialization: vacancy.specialization,
      region: vacancy.region,
      district: vacancy.district,
      user: {
        iin: user.iin,
        name: user.name,
        surname: user.surname,
        patronymic: user.patronymic,
        phone: user.phone,
        email: user.email,
        birthDay: user.birthDay,
      },
      form: {
        education,
        diplomaFileName,
        testCertificateFileName,
        isServedContractInNGRK,
        isServedInPolice,
        isChildOfKilledOfficer,
        hasEntOver100,
        hasAltynBelgi,
        relatives,
        consent,
      },
    };

    const raw = window.localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    const existing = raw ? (JSON.parse(raw) as unknown[]) : [];
    const next = Array.isArray(existing) ? [...existing, payload] : [payload];
    window.localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(next));

    setSuccess("Заявка успешно сохранена.");
  };

  if (!vacancy) {
    return (
      <>
        <HomeExactNavbar />
        <main id="main" className="main">
          <div className="container mx-auto py-8">
            <p className="light-gray-1 text-xl">Вакансия не найдена.</p>
            <Link
              href="/vacancy-academy"
              className="inline-block mt-4 text-white bg-red-600 text-sm px-8 py-3 rounded hover:bg-red-900"
            >
              Вернуться к вакансиям
            </Link>
          </div>
        </main>
        <HomeExactSupportButton />
      </>
    );
  }

  return (
    <>
      <HomeExactNavbar />
      <main id="main" className="main">
        <section>
          <div className="container mx-auto h-auto py-4 text-left">
            <h1 className="light-gray-1 text-2xl px-2">
              Подача заявки на Академию в органы внутренних дел
            </h1>
            <form onSubmit={handleSubmit} noValidate>
              <div
                className="grid grid-cols-12 gap-3 mt-4 shadow-lg px-4"
                style={{ backgroundColor: "#f5f5f7" }}
              >
                <div className="col-span-12 md:col-span-12 px-4">
                  <p className="font-normal text-black my-4 text-xl px-2">
                    Анкета кандидата
                  </p>
                  <div className="text-left">
                    <div className="flex flex-row gap-10">
                      <div className="form-group w-1/2 my-4 text-md md:text-lg">
                        <label
                          htmlFor="vacancyTitle"
                          className="comforta cursor-pointer"
                        >
                          Вакансия
                        </label>
                        <input
                          id="vacancyTitle"
                          type="text"
                          className="my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                          value={vacancy.title}
                          disabled
                        />
                      </div>
                      <div className="form-group w-1/2 my-4 text-md md:text-lg">
                        <label
                          htmlFor="education"
                          className="comforta required cursor-pointer"
                        >
                          Образование
                          <RequiredMark />
                        </label>
                        <select
                          id="education"
                          name="education"
                          className="my-1 block px-4 py-1.5 bg-white w-full rounded border-black border-solid border"
                          value={education}
                          onChange={(event) => setEducation(event.target.value)}
                        >
                          <option value="">Выберите образование</option>
                          {EDUCATION_OPTIONS.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-row gap-10">
                      <div className="form-group w-1/2 my-4 text-md md:text-lg">
                        <label
                          htmlFor="name"
                          className="comforta cursor-pointer"
                        >
                          Ф.И.О
                        </label>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          className="my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                          value={fullName}
                          disabled
                        />
                      </div>
                      <div className="form-group w-1/2 my-4 text-md md:text-lg">
                        <label
                          htmlFor="iin"
                          className="comforta cursor-pointer"
                        >
                          ИИН
                        </label>
                        <input
                          id="iin"
                          type="text"
                          className="my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                          value={user?.iin ?? ""}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="flex flex-row gap-10">
                      <div className="form-group w-1/2 mt-2 mb-4 text-md md:text-lg">
                        <label
                          htmlFor="regionVacancy"
                          className="comforta cursor-pointer"
                        >
                          Область
                        </label>
                        <input
                          id="regionVacancy"
                          type="text"
                          name="region"
                          className="my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                          value={vacancy.region}
                          disabled
                        />
                      </div>
                      <div className="form-group w-1/2 mt-2 mb-4 text-md md:text-lg">
                        <label
                          htmlFor="districtVacancy"
                          className="comforta cursor-pointer"
                        >
                          Район вакансии
                        </label>
                        <input
                          id="districtVacancy"
                          type="text"
                          name="district"
                          className="my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                          value={vacancy.district}
                          disabled
                        />
                      </div>
                      <div className="form-group w-1/2 mt-2 mb-4 text-md md:text-lg">
                        <label
                          htmlFor="phone"
                          className="comforta cursor-pointer"
                        >
                          Телефон
                        </label>
                        <input
                          id="phone"
                          type="text"
                          name="phone"
                          className="my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                          value={user?.phone ?? ""}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="flex flex-row gap-10">
                      <div className="form-group w-1/2 mt-2 mb-4 text-md md:text-lg">
                        <label
                          htmlFor="email"
                          className="comforta cursor-pointer"
                        >
                          Электронная почта
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          className="my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                          value={user?.email ?? ""}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-12 px-4">
                  <p className="font-normal text-black my-4 text-xl px-2">
                    Дополнительные документы
                  </p>
                  <div className="text-left">
                    <div className="flex flex-row gap-10">
                      <div className="form-group w-1/2 text-md md:text-lg py-4">
                        <p className="comforta cursor-pointer">
                          <label className="required">
                            Документ об образовании с приложением(PDF)
                            <RequiredMark />
                          </label>
                        </p>
                        <div className="md:flex">
                          <div className="md:w-full flex flex-col gap-2">
                            <label htmlFor="diploma" className="cursor-pointer text-sm">
                              Прикрепить
                            </label>
                            <input
                              id="diploma"
                              type="file"
                              accept="application/msword,application/pdf"
                              className="hidden"
                              onChange={(event) =>
                                setDiplomaFileName(
                                  event.target.files?.[0]?.name ?? "",
                                )
                              }
                            />
                            {diplomaFileName ? (
                              <span className="text-sm">{diplomaFileName}</span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      {/* <div className="form-group w-1/2 text-md md:text-lg py-4">
                        <p className="comforta cursor-pointer">
                          <label className="required">Программа тестирования</label>
                        </p>
                        <div className="md:flex">
                          <div className="md:w-full">
                            <select
                              className="my-1 block px-4 py-1.5 bg-white w-full rounded border-black border-solid border"
                              value={testProgram}
                              onChange={(event) => setTestProgram(event.target.value)}
                            >
                              <option value="">Выберите программу тестирования</option>
                              {TEST_PROGRAM_OPTIONS.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div> */}
                    </div>
                    <div className="flex flex-row gap-10">
                      <div className="form-group w-1/2 text-md md:text-lg py-4">
                        <p className="comforta cursor-pointer">
                          <label className="required">
                            Результаты ЕНТ (PDF)
                            <RequiredMark />
                          </label>
                        </p>
                        <div className="md:flex">
                          <div className="md:w-full flex flex-col gap-2">
                            <label htmlFor="officerTestCertificate" className="cursor-pointer text-sm">
                              Прикрепить
                            </label>
                            <input
                              id="officerTestCertificate"
                              type="file"
                              accept="application/pdf"
                              className="hidden"
                              onChange={(event) =>
                                setTestCertificateFileName(
                                  event.target.files?.[0]?.name ?? "",
                                )
                              }
                            />
                            {testCertificateFileName ? (
                              <span className="text-sm">
                                {testCertificateFileName}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>

                    <label className="comforta required cursor-pointer">
                      Служили ли вы по контракту в НГ РК?
                      <RequiredMark />
                    </label>
                    <select
                      className="my-1 block px-4 py-1.5 bg-white w-full rounded border-black border-solid border"
                      value={isServedContractInNGRK}
                      onChange={(event) =>
                        setIsServedContractInNGRK(event.target.value)
                      }
                    >
                      <option value="">—</option>
                      <option value="Да">Да</option>
                      <option value="Нет">Нет</option>
                    </select>

                    <label className="comforta required cursor-pointer">
                      Служили ли вы ранее в органах полиции?
                      <RequiredMark />
                    </label>
                    <select
                      className="my-1 block px-4 py-1.5 bg-white w-full rounded border-black border-solid border"
                      value={isChildOfKilledOfficer}
                      onChange={(event) =>
                        setIsChildOfKilledOfficer(event.target.value)
                      }
                    >
                      <option value="">—</option>
                      <option value="Да">Да</option>
                      <option value="Нет">Нет</option>
                    </select>

                    <label className="comforta required cursor-pointer">
                      Являетесь ли вы ребёнком сотрудника ОВД, погибшего или
                      получившего увечье при исполнении
                      <RequiredMark />
                    </label>
                    <select
                      className="my-1 block px-4 py-1.5 bg-white w-full rounded border-black border-solid border"
                      value={hasEntOver100}
                      onChange={(event) =>
                        setHasEntOver100(event.target.value)
                      }
                    >
                      <option value="">—</option>
                      <option value="Да">Да</option>
                      <option value="Нет">Нет</option>
                    </select>

                    <label className="comforta required cursor-pointer">
                      Являетесь ли вы обладателем сертификата более 100 баллов на ЕНТ
                      <RequiredMark />
                    </label>
                    <select
                      className="my-1 block px-4 py-1.5 bg-white w-full rounded border-black border-solid border"
                      value={hasAltynBelgi}
                      onChange={(event) =>
                        setHasAltynBelgi(event.target.value)
                      }
                    >
                      <option value="">—</option>
                      <option value="Да">Да</option>
                      <option value="Нет">Нет</option>
                    </select>

                    <label className="comforta required cursor-pointer">
                      Являетесь ли вы обладателем «Алтын белгі»
                      <RequiredMark />
                    </label>
                    <select
                      className="my-1 block px-4 py-1.5 bg-white w-full rounded border-black border-solid border"
                      value={isServedInPolice}
                      onChange={(event) =>
                        setIsServedInPolice(event.target.value)
                      }
                    >
                      <option value="">—</option>
                      <option value="Да">Да</option>
                      <option value="Нет">Нет</option>
                    </select>

                    <div className="flex items-center my-2">
                      <input
                        type="checkbox"
                        id="confirmation"
                        name="confirmation"
                        className="w-5 h-5"
                        checked={consent}
                        onChange={(event) => setConsent(event.target.checked)}
                      />
                      <label
                        htmlFor="confirmation"
                        className="ml-2 montserrat light-gray-1 cursor-pointer"
                      >
                        Я даю согласие на сбор и обработку своих Персональных
                        данных
                        <RequiredMark />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 px-4 my-5 comfortaa">
                  <p className="font-normal text-black my-4 text-xl px-2">
                    <label className="required">
                      Анкета на близких родственников
                      <RequiredMark />
                    </label>
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead
                        className="border-solid border-0 border-b border-black"
                        style={{ backgroundColor: "#f5f5f7" }}
                      >
                        <tr>
                          <th
                            scope="col"
                            className="text-md md:text-lg font-medium text-black px-6 py-4 text-left"
                          >
                            ФИО
                          </th>
                          <th
                            scope="col"
                            className="text-md md:text-lg font-medium text-black px-6 py-4 text-left"
                          >
                            Статус
                          </th>
                          <th
                            scope="col"
                            className="text-md md:text-lg font-medium text-black px-6 py-4 text-left"
                          >
                            Год рождения
                          </th>
                          <th
                            scope="col"
                            className="text-md md:text-lg font-medium text-black px-6 py-4 text-left"
                          >
                            ИИН
                          </th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {relatives.map((relative, index) => (
                          <tr
                            key={`${relative.iin}-${index}`}
                            className="border-b border-gray-200"
                          >
                            <td className="px-6 py-3">{relative.fullName}</td>
                            <td className="px-6 py-3">{relative.status}</td>
                            <td className="px-6 py-3">{relative.birthYear}</td>
                            <td className="px-6 py-3">{relative.iin}</td>
                            <td className="px-6 py-3">
                              <button
                                type="button"
                                onClick={() => removeRelative(index)}
                                className="text-red-600"
                              >
                                Удалить
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="grid grid-cols-12 gap-3 mt-4">
                    <div className="col-span-12 md:col-span-3">
                      <input
                        type="text"
                        placeholder="ФИО"
                        className="my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                        value={relativeFullName}
                        onChange={(event) =>
                          setRelativeFullName(event.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-12 md:col-span-3">
                      <input
                        type="text"
                        placeholder="Статус"
                        className="my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                        value={relativeStatus}
                        onChange={(event) =>
                          setRelativeStatus(event.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-12 md:col-span-3">
                      <input
                        type="text"
                        placeholder="Год рождения"
                        className="my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                        value={relativeBirthYear}
                        onChange={(event) =>
                          setRelativeBirthYear(event.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-12 md:col-span-2">
                      <input
                        type="text"
                        placeholder="ИИН"
                        className="my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                        value={relativeIin}
                        onChange={(event) => setRelativeIin(event.target.value)}
                      />
                    </div>
                    <div className="col-span-12 md:col-span-1 text-left my-4">
                      <button
                        type="button"
                        onClick={addRelative}
                        className="rounded-full w-8 h-8 bg-transparent border-2 border-black"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 px-4 pb-8">
                  {error ? (
                    <p className="text-sm text-error-text">{error}</p>
                  ) : null}
                  {success ? (
                    <p className="text-sm text-success-text">{success}</p>
                  ) : null}
                  <button
                    type="submit"
                    className="montserrat inline-block text-white bg-red-600 mt-5 text-sm px-8 py-3 rounded hover:bg-red-900"
                  >
                    Подать заявку
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
      <HomeExactSupportButton />
    </>
  );
}
