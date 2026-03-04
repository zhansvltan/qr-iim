"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HomeExactSupportButton } from "@/src/components/home/HomeExactSupportButton";
import {
  getFizoApplicationsClient,
  type FizoApplicationRecord,
} from "@/src/lib/fizoData";
import { FizoShell } from "./FizoShell";

type FizoApplicationDetailsPageProps = { id: string };

export function FizoApplicationDetailsPage({
  id,
}: FizoApplicationDetailsPageProps) {
  const [applications, setApplications] = useState<FizoApplicationRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isBrowseModalOpen, setIsBrowseModalOpen] = useState(false);
  const [isAnketaModalOpen, setIsAnketaModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [fizoResult, setFizoResult] = useState<"pass" | "fail" | "">("");

  useEffect(() => {
    const load = () => {
      setApplications(getFizoApplicationsClient());
      setLoaded(true);
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  useEffect(() => {
    if (!showSuccessToast) return;
    const timeout = window.setTimeout(() => setShowSuccessToast(false), 3000);
    return () => window.clearTimeout(timeout);
  }, [showSuccessToast]);

  const application = useMemo(
    () => applications.find((item) => item.id === id) ?? null,
    [applications, id],
  );

  if (!loaded) {
    return (
      <>
        <FizoShell totalCount={applications.length || 0}>
          <div className="container mx-auto py-14">
            <div className="shadow-lg bg-white rounded p-8">Загрузка...</div>
          </div>
        </FizoShell>
        <HomeExactSupportButton />
      </>
    );
  }

  if (!application) {
    return (
      <>
        <FizoShell totalCount={applications.length || 0}>
          <div className="container mx-auto py-14">
            <div className="shadow-lg bg-white rounded p-8">
              <p className="text-xl">Заявка не найдена</p>
              <Link
                href="/fizo/applications"
                className="inline-block mt-4 text-white bg-red-600 text-sm px-8 py-3 rounded hover:bg-red-900 shadow-md"
              >
                Назад
              </Link>
            </div>
          </div>
        </FizoShell>
        <HomeExactSupportButton />
      </>
    );
  }

  const toPublicHref = (fileName: string) =>
    fileName.startsWith("/") ? fileName : `/${fileName}`;

  return (
    <>
      <FizoShell totalCount={applications.length || 0}>
        <div className="container mx-auto py-14">
          <div className="overflow-x-auto shadow-lg bg-white rounded px-8 py-8">
            <div className="w-full px-4">
              <div className="text-right">
                <button
                  type="button"
                  className="btn main-blue-bg px-4 py-4 text-white"
                  onClick={() => setShowSuccessToast(true)}
                >
                  Сформировать отчет
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 grid-rows-6 px-2 request-header">
              <div className="col-span-12 md:col-span-10 row-span-2 border-solid border-b border-black md:flex items-end justify-between">
                <p className="comforta-bold text-center md:text-left text-lg sm:text-xl md:text-xl2">
                  {application.candidateName}
                </p>
                <p className="comforta text-center md:text-right text-sm sm:text-md">
                  Заявка № {application.requestNumber}
                </p>
              </div>
              <div className="col-span-12 md:col-span-4 row-span-4">
                <table className="w-full border-none text-left">
                  <tbody>
                    <tr className="text-sm md:text-md">
                      <th className="comforta-bold py-2">Дата подачи :</th>
                      <td className="comforta py-2">
                        {application.submittedAt}
                      </td>
                    </tr>
                    <tr className="text-sm md:text-md">
                      <th className="comforta-bold py-2">Специальность :</th>
                      <td className="comforta py-2">
                        <h3>{application.specialization}</h3>
                      </td>
                    </tr>
                    <tr className="text-sm md:text-md">
                      <th className="comforta-bold py-2">Регион :</th>
                      <td className="comforta py-2">
                        {application.region || ""}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-span-12 md:col-span-4 row-span-4">
                <table className="w-full border-none text-left">
                  <tbody>
                    <tr className="text-sm md:text-md">
                      <th className="comforta-bold py-2">Контакты:</th>
                      <td className="comforta py-2" />
                    </tr>
                    <tr className="text-sm md:text-md">
                      <th className="comforta-bold py-2">Телефон:</th>
                      <td className="comforta py-2">{application.phone}</td>
                    </tr>
                    <tr className="text-sm md:text-md">
                      <th className="comforta-bold py-2">E-mail:</th>
                      <td className="comforta py-2">{application.email}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-3 mt-14 px-2 py-12">
              <div
                className="col-span-12 px-2 md:px-4 my-5 sm:flex text-center"
                style={{ flexDirection: "column" }}
              >
                <p className="text-xl sm:text-2xl md:text-4xl montserrat-bold text-center self-center">
                  Досье
                </p>
                <a className="light-blue self-end cursor-pointer">Свернуть</a>
              </div>

              <div className="col-span-12 px-2 md:px-4 request-header">
                <div className="form-group text-md md:text-lg py-4 sm:flex justify-between">
                  <p className="comforta font-bold text-md sm:text-lg md:text-xl">
                    Анкета
                  </p>
                  <span>
                    <button
                      type="button"
                      onClick={() => setIsAnketaModalOpen(true)}
                      className="underline light-blue text-sm sm:text-md md:text-lg cursor-pointer"
                    >
                      Посмотреть
                    </button>
                    <span className="success-color mx-2">✓</span>
                  </span>
                </div>
                <div className="form-group text-md md:text-lg py-4 sm:flex justify-between">
                  <p className="comforta font-bold text-md sm:text-lg md:text-xl">
                    Документ об образовании
                  </p>
                  <span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(application.diplomaFileName);
                        setIsBrowseModalOpen(true);
                      }}
                      className="cursor-pointer underline light-blue text-sm sm:text-md md:text-lg"
                    >
                      Посмотреть
                    </button>
                    <span className="success-color mx-2">✓</span>
                  </span>
                </div>

                <a
                  href="/report.pdf"
                  download
                  className="inline-flex items-center gap-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded px-3 py-1 mt-3 sm:mt-0 self-end sm:self-auto"
                >
                  Скачать отчёт ПКБ
                </a>
                <a
                  href="/vvk-fizo.pdf"
                  download
                  className="inline-flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded px-3 py-1 mt-3 ml-2"
                >
                  Скачать заключение ВВК
                </a>
                <div className="form-group text-md md:text-lg py-4 sm:flex justify-between">
                  <p className="comforta font-bold text-md sm:text-lg md:text-xl">
                    Согласие на сбор и обработку Персональных данных
                  </p>
                  <span>
                    <span className="success-color mx-2">✓</span>
                  </span>
                </div>
                <hr className="h-1 text-black" />
              </div>

              <div className="col-span-12 px-4 my-5 comfortaa">
                <p className="font-normal text-black my-4 text-xl px-2">
                  Анкета на близких родственников
                </p>
                <div className="comforta overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-4 border-solid border-0 border-b border-black">
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
                      </tr>
                    </thead>
                    <tbody>
                      {(application.relatives.length
                        ? application.relatives
                        : [
                            {
                              fullName: "-",
                              status: "-",
                              birthYear: "-",
                              iin: "-",
                            },
                          ]
                      ).map((relative, index) => (
                        <tr
                          key={`${relative.iin}-${index}`}
                          className="comforta bg-gray-5 border-b transition duration-300 ease-in-out hover:bg-gray-2"
                        >
                          <td className="text-md md:text-lg text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {relative.fullName}
                          </td>
                          <td className="text-md md:text-lg text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {relative.status}
                          </td>
                          <td className="text-md md:text-lg text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {relative.birthYear}
                          </td>
                          <td className="text-md md:text-lg text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {relative.iin}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-span-12 px-4 my-5 comfortaa">
                <p className="font-normal text-black my-4 text-xl px-2">
                  Комментарий и файлы <span className="text-red-600">*</span>
                </p>
                <div className="comforta overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-4 border-solid border-0 border-b border-black">
                      <tr>
                        <th
                          scope="col"
                          className="text-md md:text-lg font-medium text-black px-6 py-4 text-left"
                        >
                          Файл
                        </th>
                        <th
                          scope="col"
                          className="text-md md:text-lg font-medium text-black px-6 py-4 text-left"
                        >
                          Комментарий
                        </th>
                        <th
                          scope="col"
                          className="text-md md:text-lg font-medium text-black px-6 py-4 text-left"
                        >
                          Загрузил
                        </th>
                        <th
                          scope="col"
                          className="text-md md:text-lg font-medium text-black px-6 py-4 text-left"
                        >
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody />
                  </table>
                  <div className="text-right">
                    <button className="my-5 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700">
                      Прикрепить файл и комментарии
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-span-12 px-4 my-5 comfortaa">
                <p className="font-normal text-black my-4 text-xl px-2">
                  Результат ФИЗО:
                </p>
                <div>
                  <p>1. Бег на 100 метро</p>
                  <p>2. Бег (кросс) на 1000 метров</p>
                  <p>
                    3. Подтягивание на высокой перекладине/Комплексное силовое
                    упражнение
                  </p>
                  <div className="form-check">
                    <input
                      type="radio"
                      name="special_check"
                      id="ready"
                      className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                      checked={fizoResult === "pass"}
                      onChange={() => setFizoResult("pass")}
                    />
                    <label
                      htmlFor="ready"
                      className="form-check-label inline-block text-green-700"
                    >
                      Сдал
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      name="special_check"
                      id="not_ready"
                      className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                      checked={fizoResult === "fail"}
                      onChange={() => setFizoResult("fail")}
                    />
                    <label
                      htmlFor="not_ready"
                      className="form-check-label inline-block text-red-500"
                    >
                      Не сдал
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-span-12 sm:col-span-12 md:col-span-12 md:flex justify-between">
                <Link
                  href="/fizo/applications"
                  className="w-80 text-white bg-red-600 mt-5 text-sm px-8 py-3 rounded hover:bg-red-900 shadow-md text-center"
                >
                  Назад
                </Link>
              </div>
            </div>
          </div>
        </div>

        {isBrowseModalOpen ? (
          <div className="fixed top-0 left-0 w-full h-full outline-none z-20 overflow-x-hidden overflow-y-auto bg-black/50">
            <div className="modal-dialog modal-dialog-centered modal-lg relative w-auto pointer-events-none mt-12 max-w-5xl mx-auto">
              <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                  <h4>Просмотр файла</h4>
                  <button
                    type="button"
                    className="btn-close box-content w-4 h-4 p-1 text-black"
                    onClick={() => setIsBrowseModalOpen(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body relative p-4">
                  <object
                    data={toPublicHref(selectedFile)}
                    type="application/pdf"
                    width="100%"
                    height="550"
                  >
                    <a
                      href={toPublicHref(selectedFile)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Открыть файл
                    </a>
                  </object>
                </div>
                <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                  <button
                    type="button"
                    className="inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md"
                    onClick={() => setIsBrowseModalOpen(false)}
                  >
                    Закрыть
                  </button>
                  <a
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md ml-1"
                    href={toPublicHref(selectedFile)}
                  >
                    Скачать
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {isAnketaModalOpen ? (
          <div className="fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto z-50 bg-black/50">
            <div className="modal-dialog modal-lg modal-dialog-centered relative w-auto pointer-events-none mt-12 max-w-4xl mx-auto">
              <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                <div className="justify-center flex modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                  <h5 className="text-xl font-medium leading-normal text-gray-800 text-center">
                    Анкета
                  </h5>
                  <button
                    type="button"
                    className="btn-close box-content w-4 h-4 p-1 text-black"
                    onClick={() => setIsAnketaModalOpen(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body relative p-4">
                  <div className="w-full">
                    <p className="comforta font-normal text-black my-4 text-xl px-2">
                      Анкета кандидата
                    </p>
                    <div className="text-left">
                      <div className="form-group my-4 text-md md:text-lg">
                        <label
                          htmlFor="iinAnketa"
                          className="comforta cursor-pointer"
                        >
                          ИИН
                        </label>
                        <input
                          id="iinAnketa"
                          type="text"
                          disabled
                          value={application.iin}
                          className="bg-gray-300 my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                        />
                      </div>
                      <div className="form-group my-4 text-md md:text-lg">
                        <label
                          htmlFor="educationAnketa"
                          className="comforta cursor-pointer"
                        >
                          Образование
                        </label>
                        <textarea
                          id="educationAnketa"
                          disabled
                          value={application.education}
                          className="bg-gray-300 my-1 block px-4 py-1.5 bg-white w-full rounded border-black border-solid border"
                        />
                      </div>
                      <div className="form-group mt-2 mb-4 text-md md:text-lg">
                        <label
                          htmlFor="serviceYearAnketa"
                          className="comforta cursor-pointer"
                        >
                          Прохождение воинской службы
                        </label>
                        <select
                          id="serviceYearAnketa"
                          disabled
                          className="bg-gray-300 my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                        >
                          <option>Нет</option>
                        </select>
                      </div>
                      <div className="form-group mt-2 mb-4 text-md md:text-lg">
                        <label
                          htmlFor="vtshAnketa"
                          className="comforta cursor-pointer"
                        >
                          Прошедшие подготовку в филиалах ВТШ МО РК
                        </label>
                        <select
                          id="vtshAnketa"
                          disabled
                          className="bg-gray-300 my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                        >
                          <option>Нет</option>
                        </select>
                      </div>
                      <div className="form-group mt-2 mb-4 text-md md:text-lg">
                        <label
                          htmlFor="vtshNameAnketa"
                          className="comforta cursor-pointer"
                        >
                          Наименование академии
                        </label>
                        <input
                          id="academyAnketa"
                          type="text"
                          disabled
                          value={application.academy}
                          className="bg-gray-300 my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                        />
                      </div>
                      <p className="comforta text-md md:text-lg">
                        Указать специальность, на какую планирует поступить:
                      </p>
                      <div className="form-group mt-2 mb-4 text-md md:text-lg">
                        <label
                          htmlFor="vacancyAnketa"
                          className="comforta cursor-pointer"
                        >
                          Наименование специальности
                        </label>
                        <input
                          id="specAnketa"
                          type="text"
                          disabled
                          value={application.specialization}
                          className="bg-gray-300 my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                        />
                      </div>
                      <div className="form-group mt-2 mb-4 text-md md:text-lg">
                        <label
                          htmlFor="regionAnketa"
                          className="comforta cursor-pointer"
                        >
                          Регион
                        </label>
                        <input
                          id="regionAnketa"
                          type="text"
                          disabled
                          value={application.region}
                          className="bg-gray-300 my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                        />
                      </div>
                      <div className="form-group mt-2 mb-4 text-md md:text-lg">
                        <label
                          htmlFor="phoneAnketa"
                          className="comforta cursor-pointer"
                        >
                          Телефон
                        </label>
                        <input
                          id="phoneAnketa"
                          type="text"
                          disabled
                          value={application.phone}
                          className="bg-gray-300 my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                        />
                      </div>
                      <div className="form-group mt-2 mb-4 text-md md:text-lg">
                        <label
                          htmlFor="emailAnketa"
                          className="comforta cursor-pointer"
                        >
                          Электронная почта
                        </label>
                        <input
                          id="emailAnketa"
                          type="email"
                          disabled
                          value={application.email}
                          className="bg-gray-300 my-1 block px-4 py-1 w-full rounded border-black border-solid border"
                        />
                      </div>
                      <a
                        href="/report.pdf"
                        download
                        className="inline-flex items-center gap-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded px-3 py-1 mt-3 sm:mt-0 self-end sm:self-auto"
                      >
                        Скачать отчёт ПКБ
                      </a>
                      <a
                        href="/vvk-fizo.pdf"
                        download
                        className="inline-flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded px-3 py-1 mt-3 ml-2"
                      >
                        Скачать заключение ВВК
                      </a>
                    </div>
                  </div>
                </div>
                <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                  <button
                    type="button"
                    className="text-white bg-red-600 mt-5 text-sm px-8 py-3 rounded hover:bg-red-900 shadow-md mx-2"
                    onClick={() => setIsAnketaModalOpen(false)}
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </FizoShell>

      {showSuccessToast ? (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] rounded bg-green-600 text-white px-5 py-3 shadow-lg">
          Успешно
        </div>
      ) : null}
      <HomeExactSupportButton />
    </>
  );
}
