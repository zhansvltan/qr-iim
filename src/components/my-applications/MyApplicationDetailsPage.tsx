"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HomeExactSupportButton } from "@/src/components/home/HomeExactSupportButton";
import {
  APPLICATION_STAGES,
  type ApplicationRecord,
  formatDate,
  mapStoredApplication,
  MOCK_APPLICATIONS,
} from "@/src/lib/myApplicationsData";
import { HomeExactNavbar } from "../home/HomeExactNav";
import { useI18n } from "@/src/lib/i18n";

const APPLICATIONS_STORAGE_KEY = "qyzmet_applications";

type MyApplicationDetailsPageProps = {
  id: string;
};

function getStatusClass(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes("отклон")) return "text-red-500";
  if (normalized.includes("работе")) return "text-yellow-500";
  return "text-green-500";
}

export function MyApplicationDetailsPage({
  id,
}: MyApplicationDetailsPageProps) {
  const { t } = useI18n();
  const [storedApplications, setStoredApplications] = useState<
    ApplicationRecord[]
  >([]);
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [appealText, setAppealText] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    const load = () => {
      const raw = window.localStorage.getItem(APPLICATIONS_STORAGE_KEY);
      if (!raw) {
        setStoredApplications([]);
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
          setStoredApplications([]);
          return;
        }
        const mapped = parsed
          .map(mapStoredApplication)
          .filter((item): item is ApplicationRecord => item !== null);
        setStoredApplications(mapped);
      } catch {
        setStoredApplications([]);
      }
    };

    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  const application = useMemo(() => {
    const merged = [...storedApplications, ...MOCK_APPLICATIONS];
    return merged.find((item) => item.id === id) ?? null;
  }, [id, storedApplications]);

  const currentStageIndex = useMemo(() => {
    if (!application) return -1;
    const current = APPLICATION_STAGES.findIndex(
      (stage) => stage === application.stage,
    );
    if (current >= 0) return current;
    const latestHistoryStage =
      application.history[application.history.length - 1]?.stage;
    if (!latestHistoryStage) return -1;
    return APPLICATION_STAGES.findIndex(
      (stage) => stage === latestHistoryStage,
    );
  }, [application]);

  const stageDates = useMemo(() => {
    if (!application) return new Map<string, string>();
    const map = new Map<string, string>();
    for (const item of application.history) {
      if (!map.has(item.stage)) {
        map.set(item.stage, formatDate(item.date));
      }
    }
    return map;
  }, [application]);

  if (!application) {
    return (
      <>
        <HomeExactNavbar />
        <main id="main" className="main">
          <div className="container mx-auto py-8">
            <h1 className="light-gray-1 text-2xl px-2">{t("applications.notFound")}</h1>
            <Link
              href="/my-applications"
              className="inline-block mt-4 text-white bg-red-600 text-sm px-8 py-3 rounded hover:bg-red-900"
            >
              {t("applications.backToList")}
            </Link>
          </div>
        </main>
        <HomeExactSupportButton />
      </>
    );
  }

  const isRejected = application.status.toLowerCase().includes("отклон");

  const translateStatus = (value: string) => {
    if (value === "Заявка отклонена") return t("status.rejected");
    if (value === "В работе") return t("status.inProgress");
    if (value === "Заявка принята") return t("status.accepted");
    return value;
  };

  const translateStage = (value: string) => {
    if (value === "Документы отправлены") return t("stage.documentsSent");
    if (value === "Принято в работу") return t("stage.acceptedForWork");
    if (value === "Медобследование") return t("stage.medExam");
    if (value === "Полиграф") return t("stage.polygraph");
    if (value === "ФИЗО") return t("stage.physical");
    if (value === "Тестирование") return t("stage.testing");
    if (value === "Конкурсная комиссия") return t("stage.commission");
    if (value === "Учебное заведение" || value === "Зачисление в ВУЗ") return t("stage.academy");
    return value;
  };

  const translateComment = (value: string) => {
    if (value === "Срок обработки заявки до 5 рабочих дней") return t("comment.processing5days");
    if (value === "Этап пройден") return t("comment.stagePassed");
    if (value === "Не сдал ФИЗО") return t("comment.failedPhysical");
    return value;
  };

  const handleOpenAppealModal = () => {
    setAppealText("");
    setIsAppealModalOpen(true);
  };

  const handleSendAppeal = () => {
    if (!appealText.trim()) return;
    setIsAppealModalOpen(false);
    setShowSuccessToast(true);
    window.setTimeout(() => setShowSuccessToast(false), 2500);
  };

  const handleDownloadVvk = () => {
    const link = document.createElement("a");
    link.href = "/vvk.pdf";
    link.download = "vvk.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <HomeExactNavbar />
      <main id="main" className="main">
        <div className="container mx-auto h-auto pt-2 pb-2 text-center">
          <h1 className="montserrat-bolder font-bold light-gray-1 text-2xl capitalize px-2">
            {t("applications.request")} {Number(application.id).toLocaleString("ru-RU")}
          </h1>
          <hr className="w-20 h-0.5 mx-auto" />

          <section>
            <span className="inline-block py-4">
              <Link
                className="montserrat-bolder light-blue my-4 text-md px-2 underline"
                href={`/my-applications/${application.id}`}
              >
                {t("applications.view")}
              </Link>
            </span>

            <div className="grid grid-cols-12">
              <div className="col-span-12 my-4">
                <ul className="nav nav-wizard">
                  {APPLICATION_STAGES.map((stage, index) => {
                    const passed = index < currentStageIndex;
                    const current = index === currentStageIndex;
                    const stateClass =
                      passed || (current && !isRejected)
                        ? "my-arrow-success"
                        : current && isRejected
                          ? "my-arrow-fail"
                          : "my-arrow";
                    return (
                      <li
                        key={stage}
                        className={`md:w-1/5 ${stateClass} sm:w-1/2 w-11/12`}
                      >
                        <a>{translateStage(stage)}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="col-span-12 my-4 overflow-x-auto">
                <ul className="step flex md:flex-nowrap">
                  {APPLICATION_STAGES.map((stage, index) => {
                    const passed = index < currentStageIndex;
                    const current = index === currentStageIndex;
                    const date = stageDates.get(stage) ?? "";
                    const stateClass =
                      passed || (current && !isRejected)
                        ? "step-item-success"
                        : current && isRejected
                          ? "step-item-fail"
                          : "";
                    const visible = passed || current;
                    return (
                      <li
                        key={`step-${stage}`}
                        className={`${visible ? "" : "invisible "}step-item ${stateClass}`.trim()}
                      >
                        <a className="text-white">{date}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="col-span-12 rounded-sm my-5 comfortaa">
                <div className="text-right mt-4">
                  <button
                    type="button"
                    className="inline-block text-center w-64 text-white bg-emerald-600 mt-2 text-sm px-8 py-3 rounded hover:bg-emerald-700"
                    onClick={handleDownloadVvk}
                  >
                    {t("applications.downloadVvk")}
                  </button>
                </div>

                <div className="comforta overflow-x-auto">
                  <table className="min-w-full bg-gray-2">
                    <thead className="border-solid border-0 border-b border-black">
                      <tr className="text-center">
                        <th
                          scope="col"
                          className="text-md font-medium text-black px-6 py-4"
                        >
                          {t("applications.number")}
                        </th>
                        <th
                          scope="col"
                          className="text-md font-medium text-black px-6 py-4"
                        >
                          {t("applications.date")}
                        </th>
                        <th
                          scope="col"
                          className="text-md font-medium text-black px-6 py-4"
                        >
                          {t("applications.stage")}
                        </th>
                        <th
                          scope="col"
                          className="text-md font-medium text-black px-6 py-4"
                        >
                          {t("applications.status")}
                        </th>
                        <th
                          scope="col"
                          className="text-md font-medium text-black px-6 py-4"
                        >
                          {t("applications.comment")}
                        </th>
                        <th
                          scope="col"
                          className="text-md font-medium text-black px-6 py-4"
                        >
                          {t("applications.details")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {application.history.map((historyItem, index) => (
                        (() => {
                          const canAppeal =
                            historyItem.stage === "ФИЗО" &&
                            historyItem.status === "Заявка отклонена" &&
                            historyItem.comment === "Не сдал ФИЗО";
                          return (
                        <tr
                          key={`${historyItem.stage}-${historyItem.date}-${index}`}
                          className="comforta border-b transition duration-300 ease-in-out hover:bg-gray-2 text-center border-black"
                        >
                          <td className="text-md text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            <Link href={`/my-applications/${application.id}`}>
                              {t("applications.request")}{" "}
                              {Number(application.id).toLocaleString("ru-RU")}
                            </Link>
                          </td>
                          <td className="text-md text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {formatDate(historyItem.date)}
                          </td>
                          <td className="text-md text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {translateStage(historyItem.stage)}
                          </td>
                          <td className="text-md text-gray-900 font-light px-6 py-4">
                            <span
                              className={getStatusClass(historyItem.status)}
                            >
                              {translateStatus(historyItem.status)}
                            </span>
                          </td>
                          <td className="text-md text-gray-900 font-light px-6 py-4">
                            <span
                              className={
                                translateComment(historyItem.comment)
                                  .toLowerCase()
                                  .includes(t("comment.stagePassed").toLowerCase())
                                  ? "text-green-500"
                                  : ""
                              }
                            >
                              {translateComment(historyItem.comment)}
                            </span>
                            {canAppeal ? (
                              <div className="mt-3">
                                <button
                                  type="button"
                                  onClick={handleOpenAppealModal}
                                  className="inline-block text-xs text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                                >
                                  {t("applications.appeal")}
                                </button>
                              </div>
                            ) : null}
                          </td>
                          <td className="text-md text-gray-900 font-light px-6 py-4">
                            <Link
                              href={`/my-applications/${application.id}`}
                              className="font-bold underline cursor-pointer text-gray-700"
                            >
                              {t("applications.view")}
                            </Link>
                          </td>
                        </tr>
                          );
                        })()
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-span-12 text-right">
                <Link
                  href="/my-applications"
                  className="inline-block text-center w-52 text-white bg-red-600 mt-5 text-sm px-8 py-3 rounded hover:bg-red-900"
                >
                  {t("applications.back")}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      {isAppealModalOpen ? (
        <div className="fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto z-50 bg-black/50">
          <div className="modal-dialog modal-lg modal-dialog-centered relative w-auto pointer-events-none mt-12 max-w-3xl mx-auto">
            <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
              <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                <h5 className="text-xl font-medium leading-normal text-gray-800">
                  {t("applications.appealModalTitle")}
                </h5>
                <button
                  type="button"
                  aria-label="Close"
                  className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 hover:opacity-75"
                  onClick={() => setIsAppealModalOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body relative p-4">
                <label className="comforta cursor-pointer block mb-2 text-md md:text-lg">
                  {t("applications.appealMessageLabel")}
                </label>
                <textarea
                  rows={8}
                  className="block px-4 py-2 w-full rounded border-black border-solid border"
                  value={appealText}
                  onChange={(event) => setAppealText(event.target.value)}
                  placeholder={t("applications.appealPlaceholder")}
                />
              </div>
              <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                <button
                  type="button"
                  className="text-white main-blue-bg text-sm px-8 py-3 mr-3 rounded hover:bg-blue-700 shadow-md disabled:opacity-50"
                  onClick={handleSendAppeal}
                  disabled={!appealText.trim()}
                >
                  {t("applications.sendAppeal")}
                </button>
                <button
                  type="button"
                  className="text-white bg-red-600 text-sm px-8 py-3 rounded hover:bg-red-900 shadow-md"
                  onClick={() => setIsAppealModalOpen(false)}
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
          {t("applications.appealSuccess")}
        </div>
      ) : null}
      <HomeExactSupportButton />
    </>
  );
}
