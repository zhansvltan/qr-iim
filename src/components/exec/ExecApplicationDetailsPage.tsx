"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { HomeExactSupportButton } from "@/src/components/home/HomeExactSupportButton";
import { getExecApplicationsClient, type ExecApplicationRecord } from "@/src/lib/execData";
import { ExecShell } from "./ExecShell";

type ExecApplicationDetailsPageProps = { id: string };

export function ExecApplicationDetailsPage({ id }: ExecApplicationDetailsPageProps) {
  const [applications, setApplications] = useState<ExecApplicationRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isBrowseModalOpen, setIsBrowseModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionText, setRevisionText] = useState("");

  useEffect(() => {
    const load = () => {
      setApplications(getExecApplicationsClient());
      setLoaded(true);
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  const application = useMemo(() => applications.find((item) => item.id === id) ?? null, [applications, id]);

  if (!loaded) {
    return (
      <>
        <ExecShell totalCount={applications.length || 0}>
          <div className="container mx-auto py-14"><div className="shadow-lg bg-white rounded p-8">Загрузка...</div></div>
        </ExecShell>
        <HomeExactSupportButton />
      </>
    );
  }

  if (!application) {
    return (
      <>
        <ExecShell totalCount={applications.length || 0}>
          <div className="container mx-auto py-14">
            <div className="shadow-lg bg-white rounded p-8">
              <p className="text-xl">Заявка не найдена</p>
              <Link href="/exec/applications" className="inline-block mt-4 text-white bg-red-600 text-sm px-8 py-3 rounded hover:bg-red-900 shadow-md">Назад</Link>
            </div>
          </div>
        </ExecShell>
        <HomeExactSupportButton />
      </>
    );
  }

  const toPublicHref = (fileName: string) => (fileName.startsWith("/") ? fileName : `/${fileName}`);

  return (
    <>
      <ExecShell totalCount={applications.length || 0}>
        <div className="container mx-auto py-14">
          <div className="overflow-x-auto shadow-lg bg-white rounded px-8 py-8">
            <div className="w-full px-4"><div className="text-right"><button className="btn main-blue-bg px-4 py-4 text-white">Сформировать отчет</button></div></div>

            <div className="grid grid-cols-12 grid-rows-6 px-2 request-header">
              <div className="flex justify-center w-full items-center col-span-12 sm:col-span-12 md:col-span-2 row-span-6">
                <Image
                  className="max-w-full mx-4"
                  src="/file.svg"
                  alt="no-file"
                  width={120}
                  height={120}
                />
              </div>
              <div className="col-span-12 md:col-span-10 row-span-2 border-solid border-b border-black md:flex items-end justify-between">
                <p className="comforta-bold text-center md:text-left text-lg sm:text-xl md:text-xl2">{application.candidateName}</p>
                <p className="comforta text-center md:text-right text-sm sm:text-md">Заявка № {application.requestNumber}</p>
              </div>
              <div className="col-span-12 md:col-span-4 row-span-4">
                <table className="w-full border-none text-left"><tbody>
                  <tr className="text-sm md:text-md"><th className="comforta-bold py-2">Дата подачи :</th><td className="comforta py-2">{application.submittedAt}</td></tr>
                  <tr className="text-sm md:text-md"><th className="comforta-bold py-2">Специальность :</th><td className="comforta py-2"><p>{ application.specialization}</p></td></tr>
                  <tr className="text-sm md:text-md"><th className="comforta-bold py-2">Регион :</th><td className="comforta py-2">{application.region || ""}</td></tr>
                  <tr className="text-sm md:text-md"><th className="comforta-bold py-2">Район :</th><td className="comforta py-2">{application.district || ""}</td></tr>
                </tbody></table>
              </div>
              <div className="col-span-12 md:col-span-4 row-span-4">
                <table className="w-full border-none text-left"><tbody>
                  <tr className="text-sm md:text-md"><th className="comforta-bold py-2">Контакты:</th><td className="comforta py-2" /></tr>
                  <tr className="text-sm md:text-md"><th className="comforta-bold py-2">Телефон:</th><td className="comforta py-2">{application.phone}</td></tr>
                  <tr className="text-sm md:text-md"><th className="comforta-bold py-2">E-mail:</th><td className="comforta py-2">{application.email}</td></tr>
                </tbody></table>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-3 mt-14 px-4 py-12">
              <div className="col-span-12 md:col-span-6 px-4">
                <p className="comforta font-normal text-black my-4 text-xl px-2">Анкета кандидата</p>
                <div className="text-left">
                  <div className="form-group my-4 text-md md:text-lg"><label htmlFor="name" className="comforta cursor-pointer">Ф.И.О.</label><input id="name" type="text" disabled value={application.candidateName} className="my-1 bg-gray-300 block px-4 py-1 w-full rounded border-black border-solid border" /></div>
                  <div className="form-group my-4 text-md md:text-lg"><label htmlFor="iin" className="comforta cursor-pointer">ИИН</label><input id="iin" type="text" disabled value={application.iin} className="bg-gray-300 my-1 block px-4 py-1 w-full rounded border-black border-solid border" /></div>
                  <div className="form-group my-4 text-md md:text-lg"><label htmlFor="education" className="comforta cursor-pointer">Образование</label><textarea id="education" disabled value={application.education} className="bg-gray-300 my-1 block px-4 py-1.5 bg-white w-full rounded border-black border-solid border" /></div>
                  <p className="comforta text-md md:text-lg">Указать должность, на какую планирует поступить:</p>
                  <div className="form-group mt-2 mb-4 text-md md:text-lg"><label htmlFor="vacancy" className="comforta cursor-pointer">Наименование должности/вакансия</label><div id="vacancy" className="bg-gray-300 my-1 block px-4 py-1 w-full rounded border-black border-solid border min-h-[38px]"><p>{application.specialization }</p></div></div>
                  <div className="form-group mt-2 mb-4 text-md md:text-lg"><label htmlFor="region" className="comforta cursor-pointer">Регион</label><input id="region" type="text" disabled value={application.region} className="bg-gray-300 my-1 block px-4 py-1 w-full rounded border-black border-solid border" /></div>
                  <div className="form-group mt-2 mb-4 text-md md:text-lg"><label htmlFor="district" className="comforta cursor-pointer">Район</label><input id="district" type="text" disabled value={application.district} className="bg-gray-300 my-1 block px-4 py-1 w-full rounded border-black border-solid border" /></div>
                  <div className="form-group mt-2 mb-4 text-md md:text-lg"><label htmlFor="phone" className="comforta cursor-pointer">Телефон</label><input id="phone" type="text" disabled value={application.phone} className="bg-gray-300 my-1 block px-4 py-1 w-full rounded border-black border-solid border" /></div>
                  <div className="form-group mt-2 mb-4 text-md md:text-lg"><label htmlFor="email" className="comforta cursor-pointer">Электронная почта</label><input id="email" type="email" disabled value={application.email} className="bg-gray-300 my-1 block px-4 py-1 w-full rounded border-black border-solid border" /></div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6 px-4">
                <p className="comforta font-normal text-black my-4 text-xl px-2">Дополнительные документы</p>
                <div className="text-left">
                  <div className="form-group text-md md:text-lg py-4 md:flex justify-between">
                    <p className="comforta">Документ об образовании с приложением</p>
                    <span><button type="button" onClick={() => { setSelectedFile(application.diplomaFileName); setIsBrowseModalOpen(true); }} className="cursor-pointer underline light-blue text-sm sm:text-md md:text-lg">Посмотреть</button><span className="success-color mx-2">✓</span></span>
                  </div>
                  <div className="form-group text-md md:text-lg py-4 md:flex justify-between">
                    <p className="comforta">Сертификат об ЕНТ</p>
                    <span><button type="button" onClick={() => { setSelectedFile(application.testCertificateFileName); setIsBrowseModalOpen(true); }} className="cursor-pointer underline light-blue text-sm sm:text-md md:text-lg">Посмотреть</button><span className="success-color mx-2">✓</span></span>
                  </div>
                  <div className="form-group text-md md:text-lg py-4 md:flex justify-between">
                    <p className="comforta">Согласие родителей</p>
                    <span><button type="button" onClick={() => { setSelectedFile(application.parentsConsentFileName); setIsBrowseModalOpen(true); }} className="cursor-pointer underline light-blue text-sm sm:text-md md:text-lg">Посмотреть</button><span className="success-color mx-2">✓</span></span>
                  </div>
                  <a
                    href="/report.pdf"
                    download
                    className="inline-flex items-center gap-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded px-3 py-1 mt-3 sm:mt-0 self-end sm:self-auto"
                  >
                    Скачать отчёт ПКБ
                  </a>
                  <div className="flex items-center my-2"><p className="comforta">Согласие на сбор и обработку Персональных данных</p><span className="success-color mx-2">✓</span></div>
                </div>
              </div>
            </div>

            <div className="col-span-12 px-4 my-5 comfortaa">
              <p className="font-normal text-black my-4 text-xl px-2">Анкета на близких родственников</p>
              <div className="comforta overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-4 border-solid border-0 border-b border-black"><tr><th scope="col" className="text-md md:text-lg font-medium text-black px-6 py-4 text-left">ФИО</th><th scope="col" className="text-md md:text-lg font-medium text-black px-6 py-4 text-left">Статус</th><th scope="col" className="text-md md:text-lg font-medium text-black px-6 py-4 text-left">Год рождения</th><th scope="col" className="text-md md:text-lg font-medium text-black px-6 py-4 text-left">ИИН</th></tr></thead>
                  <tbody>
                    {(application.relatives.length ? application.relatives : [{ fullName: "-", status: "-", birthYear: "-", iin: "-" }]).map((relative, index) => (
                      <tr key={`${relative.iin}-${index}`} className="comforta bg-gray-5 border-b transition duration-300 ease-in-out hover:bg-gray-2">
                        <td className="text-md md:text-lg text-gray-900 font-light px-6 py-4 whitespace-nowrap">{relative.fullName}</td>
                        <td className="text-md md:text-lg text-gray-900 font-light px-6 py-4 whitespace-nowrap">{relative.status}</td>
                        <td className="text-md md:text-lg text-gray-900 font-light px-6 py-4 whitespace-nowrap">{relative.birthYear}</td>
                        <td className="text-md md:text-lg text-gray-900 font-light px-6 py-4 whitespace-nowrap">{relative.iin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <hr />
            <div className="grid grid-cols-12 gap-3 px-4 py-12">
              <div className="col-span-12 sm:col-span-12 md:col-span-12 md:flex justify-between">
                <button className="w-80 text-white main-blue-bg mt-5 text-sm px-8 py-3 rounded hover:bg-blue-700 shadow-md">Сформировать личное дело</button>
                <button type="button" onClick={() => setIsRevisionModalOpen(true)} className="w-80 text-white bg-yellow-600 mt-5 text-sm px-8 py-3 rounded hover:bg-red-900 shadow-md">Отправить на доработку</button>
                <button type="button" onClick={() => setIsRejectModalOpen(true)} className="w-80 text-white bg-red-600 mt-5 text-sm px-8 py-3 rounded hover:bg-red-900 shadow-md">Отклонить</button>
              </div>
            </div>
          </div>
        </div>

        {isBrowseModalOpen ? (
          <div className="fixed top-0 left-0 w-full h-full outline-none z-20 overflow-x-hidden overflow-y-auto bg-black/50">
            <div className="modal-dialog modal-dialog-centered modal-lg relative w-auto pointer-events-none mt-12 max-w-5xl mx-auto">
              <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md"><h4>Просмотр файла</h4><button type="button" className="btn-close box-content w-4 h-4 p-1 text-black" onClick={() => setIsBrowseModalOpen(false)}>×</button></div>
                <div className="modal-body relative p-4">
                  <object data={toPublicHref(selectedFile)} type="application/pdf" width="100%" height="550"><a href={toPublicHref(selectedFile)} target="_blank" rel="noreferrer">Открыть файл</a></object>
                </div>
                <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                  <button type="button" className="inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md" onClick={() => setIsBrowseModalOpen(false)}>Закрыть</button>
                  <a download target="_blank" rel="noreferrer" className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md ml-1" href={toPublicHref(selectedFile)}>Скачать</a>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {isRevisionModalOpen ? (
          <div className="fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto z-50 bg-black/50">
            <div className="modal-dialog modal-lg modal-dialog-centered relative w-auto pointer-events-none mt-12 max-w-4xl mx-auto">
              <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                <div className="justify-center flex modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md"><h5 className="text-xl font-medium leading-normal text-gray-800 text-center">Укажите причину доработки</h5><button type="button" className="btn-close box-content w-4 h-4 p-1 text-black" onClick={() => setIsRevisionModalOpen(false)}>×</button></div>
                <div className="modal-body relative p-4"><textarea rows={10} placeholder="Укажите причину...." className="mt-2 w-full border-black border-2 border-r-2" value={revisionText} onChange={(event) => setRevisionText(event.target.value)} /></div>
                <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md"><button type="button" className="text-white bg-red-600 mt-5 text-sm px-8 py-3 rounded hover:bg-red-900 shadow-md mx-2" onClick={() => setIsRevisionModalOpen(false)}>Закрыть</button></div>
              </div>
            </div>
          </div>
        ) : null}

        {isRejectModalOpen ? (
          <div className="fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto z-50 bg-black/50">
            <div className="modal-dialog modal-lg modal-dialog-centered relative w-auto pointer-events-none mt-12 max-w-4xl mx-auto">
              <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                <div className="justify-center flex modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md"><h5 className="text-xl font-medium leading-normal text-gray-800 text-center">Выберите Причину отказа</h5><button type="button" className="btn-close box-content w-4 h-4 p-1 text-black" onClick={() => setIsRejectModalOpen(false)}>×</button></div>
                <div className="modal-body relative p-4">
                  <div className="form-check"><input value="Не правильно заполнена анкета" type="radio" name="reason" id="reason1" className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" onChange={(event) => setRejectReason(event.target.value)} /><label htmlFor="reason1" className="form-check-label inline-block text-gray-800">Не правильно заполнена анкета</label></div>
                  <div className="form-check"><input value="Не правильно указаны данные" type="radio" name="reason" id="reason2" className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" onChange={(event) => setRejectReason(event.target.value)} /><label htmlFor="reason2" className="form-check-label inline-block text-gray-800">Не правильно указаны данные</label></div>
                  <div className="form-check"><input value="Не правильно прикреплены документы" type="radio" name="reason" id="reason3" className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" onChange={(event) => setRejectReason(event.target.value)} /><label htmlFor="reason3" className="form-check-label inline-block text-gray-800">Не правильно прикреплены документы</label></div>
                  <div className="form-check"><input value="Другая причина" type="radio" name="reason" id="reason4" className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" onChange={(event) => setRejectReason(event.target.value)} /><label htmlFor="reason4" className="form-check-label inline-block text-gray-800">Другая причина</label></div>
                  <textarea rows={10} placeholder="Укажите причину...." className="mt-2 w-full border-black border-2 border-r-2" value={rejectReason} onChange={(event) => setRejectReason(event.target.value)} />
                </div>
                <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md"><button type="button" className="text-white bg-red-600 mt-5 text-sm px-8 py-3 rounded hover:bg-red-900 shadow-md mx-2" onClick={() => setIsRejectModalOpen(false)}>Закрыть</button></div>
              </div>
            </div>
          </div>
        ) : null}
      </ExecShell>
      <HomeExactSupportButton />
    </>
  );
}
