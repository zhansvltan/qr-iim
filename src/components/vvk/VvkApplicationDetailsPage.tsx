"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HomeExactSupportButton } from "@/src/components/home/HomeExactSupportButton";
import { getVvkApplicationsClient, type VvkApplicationRecord } from "@/src/lib/vvkData";
import { VvkShell } from "./VvkShell";

type VvkApplicationDetailsPageProps = {
  id: string;
};

export function VvkApplicationDetailsPage({ id }: VvkApplicationDetailsPageProps) {
  const [applications, setApplications] = useState<VvkApplicationRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const [medicalCode, setMedicalCode] = useState("Заключение не вынесено");
  const [comment, setComment] = useState("");
  const [attachComment, setAttachComment] = useState("");
  const [attachFile, setAttachFile] = useState("");
  const [selectedDossierFile, setSelectedDossierFile] = useState("");

  useEffect(() => {
    const load = () => {
      setApplications(getVvkApplicationsClient());
      setLoaded(true);
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  const application = useMemo(
    () => applications.find((item) => item.id === id) ?? null,
    [applications, id],
  );

  if (!loaded) {
    return (
      <>
        <VvkShell medCount={applications.length || 0}>
          <div className="container mx-auto py-14">
            <div className="shadow-lg bg-white rounded p-8">Загрузка...</div>
          </div>
        </VvkShell>
        <HomeExactSupportButton />
      </>
    );
  }

  if (loaded && !application) {
    return (
      <>
        <VvkShell medCount={applications.length || 0}>
          <div className="container mx-auto py-14">
            <div className="shadow-lg bg-white rounded p-8">
              <p className="text-xl">Заявка не найдена</p>
              <Link href="/vvk/applications" className="inline-block mt-4 text-white bg-red-600 text-sm px-8 py-3 rounded hover:bg-red-900 shadow-md">
                Назад
              </Link>
            </div>
          </div>
        </VvkShell>
        <HomeExactSupportButton />
      </>
    );
  }

  const medicalCodes = ["А", "Б", "В", "Г", "Д", "Е", "НГ", "В-ИНД", "ИНД", "Заключение не вынесено"];
  const dossierFiles = [
    application.diplomaFileName || "edu.pdf",
    application.testCertificateFileName || "ent.pdf",
    application.parentsConsentFileName || "",
  ].filter(Boolean);

  const toPublicFileHref = (fileName: string) => {
    const safeName = fileName.trim();
    if (!safeName) return "";
    if (safeName.startsWith("/")) return safeName;
    return `/${safeName}`;
  };

  return (
    <>
      <VvkShell medCount={applications.length || 0}>
        <div className="container mx-auto py-14">
          <div className="overflow-x-auto shadow-lg bg-white rounded px-8 py-8">
            <div className="grid grid-cols-12 grid-rows-6 px-2 request-header">
              <div className="col-span-12 md:col-span-10 row-span-2 border-solid border-b border-black md:flex items-end justify-between">
                <p className="comforta-bold text-center md:text-left text-lg sm:text-xl md:text-xl2">{application.candidateName}</p>
                <p className="comforta text-center md:text-right text-sm sm:text-md">Заявка № {application.requestNumber}</p>
              </div>

              <div className="col-span-12 md:col-span-4 row-span-4">
                <table className="w-full border-none text-left">
                  <tbody>
                    <tr className="text-sm md:text-md">
                      <th className="comforta-bold py-2">Дата подачи:</th>
                      <td className="comforta py-2">{application.submittedAt}</td>
                    </tr>
                    <tr className="text-sm md:text-md">
                      <th className="comforta-bold py-2">Вакансия :</th>
                      <td className="comforta py-2">{application.vacancyTitle || "⠀"}</td>
                    </tr>
                    <tr className="text-sm md:text-md">
                      <th className="comforta-bold py-2">Регион :</th>
                      <td className="comforta py-2">{application.region || "—"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="col-span-12 md:col-span-4 row-span-4">
                <table className="w-full border-none text-left">
                  <tbody>
                    <tr className="text-sm md:text-md">
                      <th className="comforta-bold py-2">Контакты:</th>
                      <td className="comforta py-2"></td>
                    </tr>
                    <tr className="text-sm md:text-md">
                      <th className="comforta-bold py-2">Телефон:</th>
                      <td className="comforta py-2">{application.phone || "—"}</td>
                    </tr>
                    <tr className="text-sm md:text-md">
                      <th className="comforta-bold py-2">E-mail:</th>
                      <td className="comforta py-2">{application.email || "—"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-3 mt-14 px-2 py-12">
              <div className="col-span-12 px-2 md:px-4 my-5 sm:flex text-center" style={{ flexDirection: "column" }}>
                <p className="text-xl sm:text-2xl md:text-4xl montserrat-bold text-center self-center">Досье</p>
                <a className="light-blue self-end cursor-pointer">Свернуть</a>
              </div>

              <div className="col-span-12 px-2 md:px-4 request-header">
                <div className="form-group text-md md:text-lg py-4 sm:flex justify-between">
                  <p className="font-bold text-md sm:text-lg md:text-xl">Сформированное досье</p>
                  <span>
                    <button type="button" onClick={() => setIsDossierModalOpen(true)} className="cursor-pointer underline light-blue text-sm sm:text-md md:text-lg">
                      Посмотреть
                    </button>
                    <span className="success-color mx-2">✓</span>
                  </span>
                </div>
                <hr className="h-1 text-black" />
              </div>
            </div>

            <div className="grid grid-cols-12">
              <div className="col-span-12">
                <hr className="h-1 text-black" />
                <div className="form-group text-md md:text-lg py-4">
                  <div className="md:flex justify-between">
                    <p className="comforta font-bold text-md sm:text-lg md:text-xl">Прохождение медобследования</p>
                    <span>
                      <button type="button" onClick={() => setIsInfoModalOpen(true)} className="underline light-blue text-sm sm:text-md md:text-lg cursor-pointer">
                        Посмотреть
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-3 px-4 py-12">
              <div className="col-span-12 px-4 my-5 comfortaa">
                <p className="font-normal text-black my-4 text-xl px-2">
                  Комментарий и файлы <span className="text-red-600">*</span>
                  <span className="text-red-600 text-sm">(Требуется прикрепить документ)</span>
                </p>
                <div className="comforta overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-4 border-solid border-0 border-b border-black">
                      <tr>
                        <th scope="col" className="text-md md:text-lg font-medium text-black px-6 py-4 text-left">Файл</th>
                        <th scope="col" className="text-md md:text-lg font-medium text-black px-6 py-4 text-left">Комментарий</th>
                        <th scope="col" className="text-md md:text-lg font-medium text-black px-6 py-4 text-left">Загрузил</th>
                        <th scope="col" className="text-md md:text-lg font-medium text-black px-6 py-4 text-left">Действия</th>
                      </tr>
                    </thead>
                    <tbody />
                  </table>

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setIsAttachModalOpen(true)}
                      className="my-5 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700"
                    >
                      Прикрепить файл и комментарии
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-span-12 px-4 my-5 comfortaa">
                <p className="font-normal text-black my-4 text-xl px-2">Статус годности</p>
                <div className="flex">
                  <div>
                    {medicalCodes.map((code) => (
                      <div key={code} className="form-check">
                        <input
                          type="radio"
                          name="medicalStatusCode"
                          className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                          id={`code-${code}`}
                          checked={medicalCode === code}
                          onChange={() => setMedicalCode(code)}
                        />
                        <label className="form-check-label inline-block text-gray-800" htmlFor={`code-${code}`}>
                          {code}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-span-12 px-4 my-5 comfortaa">
                <p className="font-normal text-black my-4 text-xl px-2">Комментарий</p>
                <textarea rows={10} className="w-full p-2" value={comment} onChange={(event) => setComment(event.target.value)} />
              </div>

              <div className="md:flex justify-between col-span-12">
                <Link href="/vvk/applications" className="w-80 text-center text-white bg-red-600 mt-5 text-sm px-8 py-3 rounded hover:bg-red-900 shadow-md">
                  Назад
                </Link>
                <button className="w-80 text-white main-blue-bg mt-5 text-sm px-8 py-3 rounded shadow-md opacity-50d">
                  Принять
                </button>
              </div>
            </div>
          </div>
        </div>

        {isAttachModalOpen ? (
          <div className="fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto z-50 bg-black/50">
            <div className="modal-dialog modal-dialog-centered relative w-auto pointer-events-none mt-12 max-w-2xl mx-auto">
              <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                  <h5 className="text-xl font-medium leading-normal text-gray-800">Прикрепить файл</h5>
                  <button type="button" onClick={() => setIsAttachModalOpen(false)} className="btn-close box-content w-4 h-4 p-1 text-black">×</button>
                </div>
                <div className="modal-body relative p-4">
                  <div className="mb-3 w-full">
                    <label htmlFor="comment" className="form-label inline-block mb-2 text-gray-700">Комментарий</label>
                    <textarea
                      cols={10}
                      id="comment"
                      placeholder="Комментарий"
                      className="w-full form-control block px-3 py-1.5 text-base font-normal text-gray-700 bg-white border border-solid border-gray-300 rounded"
                      value={attachComment}
                      onChange={(event) => setAttachComment(event.target.value)}
                    />
                  </div>
                  <div className="mb-3 w-full">
                    <label htmlFor="formFile" className="form-label inline-block mb-2 text-gray-700">Файл</label>
                    <input
                      type="file"
                      id="formFile"
                      className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white border border-solid border-gray-300 rounded"
                      onChange={(event) => setAttachFile(event.target.files?.[0]?.name ?? "")}
                    />
                    {attachFile ? <p className="text-sm mt-2">{attachFile}</p> : null}
                  </div>
                </div>
                <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                  <button type="button" onClick={() => setIsAttachModalOpen(false)} className="text-white bg-red-600 mt-2 text-sm px-8 py-3 rounded hover:bg-red-900 shadow-md mx-2">
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {isInfoModalOpen ? (
          <div className="fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto z-50 bg-black/50">
            <div className="modal-dialog modal-lg modal-dialog-centered relative w-auto pointer-events-none mt-12 max-w-4xl mx-auto">
              <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                <div className="justify-center flex modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                  <h5 className="text-xl font-medium leading-normal text-gray-800 text-center">Информация о заявке</h5>
                  <button type="button" onClick={() => setIsInfoModalOpen(false)} className="btn-close box-content w-4 h-4 p-1 text-black">×</button>
                </div>
                <div className="modal-body relative p-4">
                  <div className="overflow-hidden">
                    <table className="min-w-full">
                      <thead className="bg-white border-b">
                        <tr>
                          <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Наименование</th>
                          <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Значение</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white border-b"><td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">№ Заявки</td><td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{application.requestNumber}</td></tr>
                        <tr className="bg-white border-b"><td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">Этап</td><td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{application.stage}</td></tr>
                        <tr className="bg-white border-b"><td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">Номер запроса</td><td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{application.id}</td></tr>
                        <tr className="bg-white border-b"><td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">Статус Заявителя</td><td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">Принято</td></tr>
                        <tr className="bg-white border-b"><td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">Статус Подтвердающего</td><td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">В работе</td></tr>
                        <tr className="bg-white border-b"><td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">Категория годности</td><td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{medicalCode}</td></tr>
                        <tr className="bg-white border-b"><td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">Комментарий</td><td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{comment || ""}</td></tr>
                        <tr className="bg-white border-b"><td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">Дата создания</td><td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{application.submittedAt}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                  <button type="button" onClick={() => setIsInfoModalOpen(false)} className="text-white bg-red-600 mt-5 text-sm px-8 py-3 rounded hover:bg-red-900 shadow-md mx-2">
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {isDossierModalOpen ? (
          <div className="fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto z-50 bg-black/50">
            <div className="modal-dialog modal-dialog-centered modal-lg relative w-auto pointer-events-none mt-12 max-w-4xl mx-auto">
              <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                  <h4>Просмотр файла</h4>
                  <button type="button" onClick={() => setIsDossierModalOpen(false)} className="btn-close box-content w-4 h-4 p-1 text-black">×</button>
                </div>
                <div className="modal-body relative p-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-white border-b">
                        <tr>
                          <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Файл</th>
                          <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dossierFiles.map((fileName) => (
                          <tr key={fileName} className="bg-white border-b">
                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{fileName}</td>
                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => setSelectedDossierFile(fileName)}
                                className="underline light-blue mr-4"
                              >
                                Посмотреть
                              </button>
                              <a
                                href={toPublicFileHref(fileName)}
                                download
                                target="_blank"
                                rel="noreferrer"
                                className="underline light-blue"
                              >
                                Скачать
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {selectedDossierFile ? (
                    <div className="mt-4 border border-gray-200 rounded overflow-hidden" style={{ height: "55vh" }}>
                      <object
                        data={toPublicFileHref(selectedDossierFile)}
                        type="application/pdf"
                        width="100%"
                        height="100%"
                      >
                        <p className="p-4">
                          Браузер не поддерживает предпросмотр PDF.
                          <a
                            href={toPublicFileHref(selectedDossierFile)}
                            target="_blank"
                            rel="noreferrer"
                            className="underline light-blue ml-2"
                          >
                            Открыть
                          </a>
                        </p>
                      </object>
                    </div>
                  ) : null}
                </div>
                <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                  <button type="button" onClick={() => setIsDossierModalOpen(false)} className="inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700">
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </VvkShell>
      <HomeExactSupportButton />
    </>
  );
}
