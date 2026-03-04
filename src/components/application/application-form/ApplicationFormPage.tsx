"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { HomeExactSupportButton } from "@/src/components/home/HomeExactSupportButton";
import {
  getCurrentLocalSession,
  getCurrentLocalUser,
  subscribeToLocalAuthChanges,
} from "@/src/lib/auth/localAuth";
import { getVacancyById } from "@/src/lib/vacancyData";
import { HomeExactNavbar } from "../../home/HomeExactNav";
import { useI18n } from "@/src/lib/i18n";

type RelativeItem = {
  fullName: string;
  status: string;
  birthYear: string;
  iin: string;
};

type ApplicationFormPageProps = {
  vacancyId: string;
};

const APPLICATIONS_STORAGE_KEY = "qyzmet_applications";
function RequiredMark() {
  return <span className="text-red-600 ml-1">*</span>;
}

export function ApplicationFormPage({ vacancyId }: ApplicationFormPageProps) {
  const { t } = useI18n();
  const router = useRouter();
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
  const [isRelativeModalOpen, setIsRelativeModalOpen] = useState(false);
  const [relativeModalError, setRelativeModalError] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const fullName = [user?.surname, user?.name, user?.patronymic]
    .filter(Boolean)
    .join(" ");
  const EDUCATION_OPTIONS = [
    t("education.1"),
    t("education.2"),
    t("education.3"),
    t("education.4"),
    t("education.5"),
    t("education.6"),
    t("education.7"),
    t("education.8"),
  ];

  const addRelative = () => {
    if (
      !relativeFullName.trim() ||
      !relativeStatus.trim() ||
      !relativeBirthYear.trim() ||
      !relativeIin.trim()
    ) {
      setRelativeModalError(t("application.error.fillRelative"));
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
    setRelativeModalError(null);
    setError(null);
    setIsRelativeModalOpen(false);
  };

  const removeRelative = (index: number) => {
    setRelatives((prev) =>
      prev.filter((_, currentIndex) => currentIndex !== index),
    );
  };

  useEffect(() => {
    if (!showSuccessToast) return;
    const timeout = window.setTimeout(() => setShowSuccessToast(false), 3000);
    return () => window.clearTimeout(timeout);
  }, [showSuccessToast]);

  useEffect(() => {
    if (!success) return;
    const timeout = window.setTimeout(() => {
      router.push("/my-applications");
    }, 1000);
    return () => window.clearTimeout(timeout);
  }, [router, success]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!vacancy) {
      setError(t("application.notFound"));
      return;
    }

    if (!session || !user) {
      setError(t("application.error.needAuth"));
      return;
    }

    if (!education || !isServedContractInNGRK || !isServedInPolice) {
      setError(t("application.error.fillRequired"));
      return;
    }

    if (!isChildOfKilledOfficer || !hasEntOver100 || !hasAltynBelgi) {
      setError(t("application.error.fillRequired"));
      return;
    }

    if (!consent) {
      setError(t("application.error.needConsent"));
      return;
    }

    const payload = {
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      vacancyId: vacancy.id,
      vacancyTitle: vacancy.title,
      academy: vacancy.academy,
      specialization: vacancy.specialization,
      stage: "Принято в работу",
      status: "В работе",
      comment: "Срок обработки заявки до 5 рабочих дней",
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

    setSuccess(t("application.successSaved"));
    setShowSuccessToast(true);
  };

  if (!vacancy) {
    return (
      <>
        <HomeExactNavbar />
        <main id="main" className="main">
          <div className="container mx-auto py-8">
            <p className="light-gray-1 text-xl">{t("application.notFound")}</p>
            <Link
              href="/vacancy-academy"
              className="inline-block mt-4 text-white bg-red-600 text-sm px-8 py-3 rounded hover:bg-red-900"
            >
              {t("application.backToVacancies")}
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
              {t("application.title")}
            </h1>
            <form onSubmit={handleSubmit} noValidate>
              <div
                className="grid grid-cols-12 gap-3 mt-4 shadow-lg px-4"
                style={{ backgroundColor: "#f5f5f7" }}
              >
                <div className="col-span-12 md:col-span-12 px-4">
                  <p className="font-normal text-black my-4 text-xl px-2">
                    {t("application.candidateForm")}
                  </p>
                  <div className="text-left">
                    <div className="flex flex-row gap-10">
                      <div className="form-group w-1/2 my-4 text-md md:text-lg">
                        <label
                          htmlFor="vacancyTitle"
                          className="comforta cursor-pointer"
                        >
                          {t("vacancy.academy")}
                        </label>
                        <input
                          id="vacancyTitle"
                          type="text"
                          className="my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                          value={vacancy.academy}
                          disabled
                        />
                      </div>
                      <div className="form-group w-1/2 my-4 text-md md:text-lg">
                        <label
                          htmlFor="education"
                          className="comforta required cursor-pointer"
                        >
                          {t("application.education")}
                          <RequiredMark />
                        </label>
                        <select
                          id="education"
                          name="education"
                          className="my-1 block px-4 py-1.5 bg-white w-full rounded border-black border-solid border"
                          value={education}
                          onChange={(event) => setEducation(event.target.value)}
                        >
                          <option value="">{t("application.selectEducation")}</option>
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
                          {t("application.fullName")}
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
                          {t("application.relativeIin")}
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
                          htmlFor="specialization"
                          className="comforta cursor-pointer"
                        >
                          {t("application.speciality")}
                        </label>
                        <input
                          id="specialization"
                          type="text"
                          name="specialization"
                          className="my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                          value={vacancy.specialization}
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
                          {t("application.region")}
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
                          htmlFor="phone"
                          className="comforta cursor-pointer"
                        >
                          {t("application.phone")}
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
                          {t("application.email")}
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
                    {t("application.extraDocs")}
                  </p>
                  <div className="text-left">
                    <div className="flex flex-row gap-10">
                      <div className="form-group w-1/2 text-md md:text-lg py-4">
                        <p className="comforta cursor-pointer">
                          <label className="required">
                            {t("application.eduDoc")}
                            <RequiredMark />
                          </label>
                        </p>
                        <div className="md:flex">
                          <div className="md:w-full flex flex-col gap-2">
                            <label
                              htmlFor="diploma"
                              className="cursor-pointer text-sm"
                            >
                              {t("application.attach")}
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
                            {t("application.entDoc")}
                            <RequiredMark />
                          </label>
                        </p>
                        <div className="md:flex">
                          <div className="md:w-full flex flex-col gap-2">
                            <label
                              htmlFor="officerTestCertificate"
                              className="cursor-pointer text-sm"
                            >
                              {t("application.attach")}
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
                      {t("application.servedContract")}
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
                      <option value={t("common.yes")}>{t("common.yes")}</option>
                      <option value={t("common.no")}>{t("common.no")}</option>
                    </select>

                    <label className="comforta required cursor-pointer">
                      {t("application.servedPolice")}
                      <RequiredMark />
                    </label>
                    <select
                      className="my-1 block px-4 py-1.5 bg-white w-full rounded border-black border-solid border"
                      value={isServedInPolice}
                      onChange={(event) => setIsServedInPolice(event.target.value)}
                    >
                      <option value="">—</option>
                      <option value={t("common.yes")}>{t("common.yes")}</option>
                      <option value={t("common.no")}>{t("common.no")}</option>
                    </select>

                    <label className="comforta required cursor-pointer">
                      {t("application.childOfOfficer")}
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
                      <option value={t("common.yes")}>{t("common.yes")}</option>
                      <option value={t("common.no")}>{t("common.no")}</option>
                    </select>

                    <label className="comforta required cursor-pointer">
                      {t("application.ent100")}
                      <RequiredMark />
                    </label>
                    <select
                      className="my-1 block px-4 py-1.5 bg-white w-full rounded border-black border-solid border"
                      value={hasEntOver100}
                      onChange={(event) => setHasEntOver100(event.target.value)}
                    >
                      <option value="">—</option>
                      <option value={t("common.yes")}>{t("common.yes")}</option>
                      <option value={t("common.no")}>{t("common.no")}</option>
                    </select>

                    <label className="comforta required cursor-pointer">
                      {t("application.altynBelgi")}
                      <RequiredMark />
                    </label>
                    <select
                      className="my-1 block px-4 py-1.5 bg-white w-full rounded border-black border-solid border"
                      value={hasAltynBelgi}
                      onChange={(event) => setHasAltynBelgi(event.target.value)}
                    >
                      <option value="">—</option>
                      <option value={t("common.yes")}>{t("common.yes")}</option>
                      <option value={t("common.no")}>{t("common.no")}</option>
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
                        {t("application.consent")}
                        <RequiredMark />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 px-4 my-5 comfortaa">
                  <p className="font-normal text-black my-4 text-xl px-2">
                    <label className="required">
                      {t("application.relativesForm")}
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
                            {t("application.relativeFio")}
                          </th>
                          <th
                            scope="col"
                            className="text-md md:text-lg font-medium text-black px-6 py-4 text-left"
                          >
                            {t("application.relativeStatus")}
                          </th>
                          <th
                            scope="col"
                            className="text-md md:text-lg font-medium text-black px-6 py-4 text-left"
                          >
                            {t("application.relativeBirthYear")}
                          </th>
                          <th
                            scope="col"
                            className="text-md md:text-lg font-medium text-black px-6 py-4 text-left"
                          >
                            {t("application.relativeIin")}
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
                                {t("application.delete")}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="grid grid-cols-12 gap-3 mt-4">
                    <div className="col-span-12 md:col-span-1 text-left my-4">
                      <button
                        type="button"
                        onClick={() => {
                          setRelativeModalError(null);
                          setIsRelativeModalOpen(true);
                        }}
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
                    {t("application.submit")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
      {isRelativeModalOpen ? (
        <div className="fixed top-0 left-0 w-full h-2/3 outline-none overflow-x-hidden overflow-y-auto z-50 bg-black/50">
          <div className="modal-dialog relative w-full pointer-events-none my-0">
            <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-none outline-none text-current min-h-screen">
              <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                <h5 id="surveyRelativesExample" className="text-xl font-medium leading-normal text-gray-800"></h5>
                <button
                  type="button"
                  aria-label="Close"
                  className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                  onClick={() => setIsRelativeModalOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body relative p-4 w-full">
                <div className="form-group my-4 text-md md:text-lg">
                  <label htmlFor="fio" className="comforta cursor-pointer">
                    {t("application.relativeFio")}
                  </label>
                  <input
                    id="fio"
                    type="text"
                    className="my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                    value={relativeFullName}
                    onChange={(event) => setRelativeFullName(event.target.value)}
                  />
                </div>
                <div className="form-group my-4 text-md md:text-lg">
                  <label htmlFor="relativeStatus" className="comforta cursor-pointer">
                    {t("application.relativeStatus")}
                  </label>
                  <input
                    id="relativeStatus"
                    type="text"
                    className="my-1 block px-4 py-1.5 bg-white w-full rounded border-black border-solid border"
                    value={relativeStatus}
                    onChange={(event) => setRelativeStatus(event.target.value)}
                  />
                </div>
                <div className="form-group my-4 text-md md:text-lg">
                  <label htmlFor="relativeBirthday" className="comforta cursor-pointer">
                    {t("application.relativeBirthYear")}
                  </label>
                  <input
                    id="relativeBirthday"
                    placeholder="дд.мм.гггг"
                    type="text"
                    className="my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                    value={relativeBirthYear}
                    onChange={(event) => setRelativeBirthYear(event.target.value)}
                  />
                </div>
                <div className="form-group my-4 text-md md:text-lg">
                  <label htmlFor="relativeIIN" className="comforta cursor-pointer">
                    {t("application.relativeIin")}
                  </label>
                  <input
                    id="relativeIIN"
                    type="text"
                    inputMode="numeric"
                    maxLength={12}
                    className="my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                    value={relativeIin}
                    onChange={(event) =>
                      setRelativeIin(event.target.value.replace(/\D/g, "").slice(0, 12))
                    }
                  />
                </div>
                {relativeModalError ? <span className="text-red-500 my">{relativeModalError}</span> : null}
              </div>
              <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                <button
                  type="button"
                  className="text-white main-blue-bg mt-5 text-sm px-8 py-3 mr-3 rounded hover:bg-blue-700 shadow-md"
                  onClick={addRelative}
                >
                  {t("application.save")}
                </button>
                <button
                  type="button"
                  className="text-white bg-red-600 mt-5 text-sm px-8 py-3 ml-3 rounded hover:bg-red-900 shadow-md"
                  onClick={() => setIsRelativeModalOpen(false)}
                >
                  {t("application.cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {showSuccessToast ? (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] rounded bg-green-600 text-white px-5 py-3 shadow-lg">
          {t("application.successToast")}
        </div>
      ) : null}
      <HomeExactSupportButton />
    </>
  );
}
