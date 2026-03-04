"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HomeExactSupportButton } from "@/src/components/home/HomeExactSupportButton";
import {
  APPLICATION_STAGES,
  type ApplicationRecord,
  formatDate,
  formatDateTime,
  mapStoredApplication,
  MOCK_APPLICATIONS,
} from "@/src/lib/myApplicationsData";
import { HomeExactNavbar } from "../home/HomeExactNav";

const APPLICATIONS_STORAGE_KEY = "qyzmet_applications";

type MyApplicationDetailsPageProps = {
  id: string;
};

export function MyApplicationDetailsPage({ id }: MyApplicationDetailsPageProps) {
  const [storedApplications, setStoredApplications] = useState<ApplicationRecord[]>([]);

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
        const mapped = parsed.map(mapStoredApplication).filter((item): item is ApplicationRecord => item !== null);
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
    const current = APPLICATION_STAGES.findIndex((stage) => stage === application.stage);
    if (current >= 0) return current;
    const latestHistoryStage = application.history[application.history.length - 1]?.stage;
    if (!latestHistoryStage) return -1;
    return APPLICATION_STAGES.findIndex((stage) => stage === latestHistoryStage);
  }, [application]);

  if (!application) {
    return (
      <>
        <HomeExactNavbar />
        <main id="main" className="main">
          <div className="container mx-auto py-8">
            <h1 className="light-gray-1 text-2xl px-2">Заявка не найдена</h1>
            <Link href="/my-applications" className="inline-block mt-4 text-white bg-red-600 text-sm px-8 py-3 rounded hover:bg-red-900">
              Вернуться к списку заявок
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
        <section className="container mx-auto h-auto mt-2 py-2 text-left px-4">
          <h1 className="light-gray-1 text-2xl capitalize">Заявка № {Number(application.id).toLocaleString("ru-RU")}</h1>
          <div className="mt-2 text-sm text-gray-500">
            <span>{formatDate(application.createdAt)}</span>
            <span className="mx-2">|</span>
            <Link href="/my-applications" className="underline">
              Просмотр
            </Link>
          </div>

          <div className="grid grid-cols-8 gap-2 mt-6">
            {APPLICATION_STAGES.map((stage, index) => {
              const isPassed = currentStageIndex >= index;
              return (
                <div key={stage} className="text-center">
                  <div className={`h-2 rounded ${isPassed ? "bg-green-500" : "bg-gray-300"}`} />
                  <p className="text-xs md:text-sm mt-2 light-gray-1">{stage}</p>
                </div>
              );
            })}
          </div>

          <div className="grid shadow-lg my-5 w-full py-5 px-5 text-left rounded-2xl bg-white">
            <span className="sm:flex justify-between mb-2">
              <p className="montserrat text-2xl light-gray-1">{application.vacancyTitle}</p>
              <p className="montserrat text-lg light-gray-1">{formatDate(application.createdAt)}</p>
            </span>
            <span className="sm:flex justify-start mb-4">
              <p className="montserrat text-sm light-gray-1 mr-5">
                <b>Академия: {application.academy}</b>
              </p>
              <p className="montserrat text-sm light-gray-1 mr-5">
                <b>Специализация: {application.specialization}</b>
              </p>
            </span>
            <hr className="border-gray-600" />
            <p className="my-2 light-gray-1">
              Текущий этап: <b>{application.stage}</b>
            </p>
          </div>

          <div className="overflow-x-auto pb-8">
            <table className="min-w-full">
              <thead className="bg-gray-1">
                <tr>
                  <th scope="col" className="text-md md:text-lg font-medium text-black px-6 py-2 text-center">
                    Дата
                  </th>
                  <th scope="col" className="text-md md:text-lg font-medium text-black px-6 py-2 text-center">
                    Этап
                  </th>
                  <th scope="col" className="text-md md:text-lg font-medium text-black px-6 py-2 text-center">
                    Статус
                  </th>
                  <th scope="col" className="text-md md:text-lg font-medium text-black px-6 py-2 text-center">
                    Комментарий
                  </th>
                </tr>
              </thead>
              <tbody>
                {application.history.map((historyItem, index) => (
                  <tr key={`${historyItem.stage}-${historyItem.date}-${index}`} className="tr-box-shadow my-4 shadow-lg bg-white border-b">
                    <td className="text-sm md:text-md text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">
                      {formatDateTime(historyItem.date)}
                    </td>
                    <td className="text-sm md:text-md text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">
                      {historyItem.stage}
                    </td>
                    <td className="text-sm md:text-md text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">
                      {historyItem.status}
                    </td>
                    <td className="text-sm md:text-md text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">
                      {historyItem.comment}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <HomeExactSupportButton />
    </>
  );
}
