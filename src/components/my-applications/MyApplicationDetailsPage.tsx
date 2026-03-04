"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HomeExactSupportButton } from "@/src/components/home/HomeExactSupportButton";
import {
  APPLICATION_STAGES,
  type ApplicationRecord,
  formatDateTime,
  mapStoredApplication,
  MOCK_APPLICATIONS,
} from "@/src/lib/myApplicationsData";
import { UserAreaNav } from "./UserAreaNav";

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

  const stageDates = useMemo(() => {
    if (!application) return new Map<string, string>();
    const map = new Map<string, string>();
    for (const item of application.history) {
      if (!map.has(item.stage)) {
        map.set(item.stage, formatDateTime(item.date));
      }
    }
    return map;
  }, [application]);

  if (!application) {
    return (
      <>
        <UserAreaNav />
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

  const isRejected = application.status.toLowerCase().includes("отклон");

  return (
    <>
      <UserAreaNav />
      <main id="main" className="main">
        <div className="container mx-auto h-auto pt-2 pb-2 text-center">
          <h1 className="montserrat-bolder font-bold light-gray-1 text-2xl capitalize px-2">
            Заявка № {Number(application.id).toLocaleString("ru-RU")}
          </h1>
          <hr className="w-20 h-0.5 mx-auto" />

          <section>
            <span className="inline-block py-4">
              <Link className="montserrat-bolder light-blue my-4 text-md px-2 underline" href={`/my-applications/${application.id}`}>
                Просмотр
              </Link>
            </span>

            <div className="grid grid-cols-12">
              <div className="col-span-12 my-4">
                <ul className="nav nav-wizard">
                  {APPLICATION_STAGES.map((stage, index) => {
                    const passed = index < currentStageIndex;
                    const current = index === currentStageIndex;
                    const stateClass = passed || (current && !isRejected) ? "my-arrow-success" : current && isRejected ? "my-arrow-fail" : "my-arrow";
                    return (
                      <li key={stage} className={`md:w-1/5 ${stateClass} sm:w-1/2 w-11/12`}>
                        <a>{stage}</a>
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
                    const stateClass = passed || (current && !isRejected) ? "step-item-success" : current && isRejected ? "step-item-fail" : "";
                    const visible = passed || current;
                    return (
                      <li key={`step-${stage}`} className={`${visible ? "" : "invisible "}step-item ${stateClass}`.trim()}>
                        <a className="text-white">{date}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="col-span-12 rounded-sm my-5 comfortaa">
                <div className="text-right mt-4">
                  <button type="button" className="inline-block text-center w-64 text-white bg-emerald-600 mt-2 text-sm px-8 py-3 rounded hover:bg-emerald-700">
                    Скачать направление на ВВК
                  </button>
                </div>

                <div className="comforta overflow-x-auto">
                  <table className="min-w-full bg-gray-2">
                    <thead className="border-solid border-0 border-b border-black">
                      <tr className="text-center">
                        <th scope="col" className="text-md font-medium text-black px-6 py-4">Номер заявки</th>
                        <th scope="col" className="text-md font-medium text-black px-6 py-4">Дата</th>
                        <th scope="col" className="text-md font-medium text-black px-6 py-4">Этап</th>
                        <th scope="col" className="text-md font-medium text-black px-6 py-4">Статус</th>
                        <th scope="col" className="text-md font-medium text-black px-6 py-4">Комментарий</th>
                        <th scope="col" className="text-md font-medium text-black px-6 py-4">Детали</th>
                      </tr>
                    </thead>
                    <tbody>
                      {application.history.map((historyItem, index) => (
                        <tr key={`${historyItem.stage}-${historyItem.date}-${index}`} className="comforta border-b transition duration-300 ease-in-out hover:bg-gray-2 text-center border-black">
                          <td className="text-md text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            <Link href={`/my-applications/${application.id}`}>Заявка № {Number(application.id).toLocaleString("ru-RU")}</Link>
                          </td>
                          <td className="text-md text-gray-900 font-light px-6 py-4 whitespace-nowrap">{formatDateTime(historyItem.date)}</td>
                          <td className="text-md text-gray-900 font-light px-6 py-4 whitespace-nowrap">{historyItem.stage}</td>
                          <td className="text-md text-gray-900 font-light px-6 py-4">
                            <span className={getStatusClass(historyItem.status)}>{historyItem.status}</span>
                          </td>
                          <td className="text-md text-gray-900 font-light px-6 py-4">
                            <span className={historyItem.comment.toLowerCase().includes("пройден") ? "text-green-500" : ""}>{historyItem.comment}</span>
                          </td>
                          <td className="text-md text-gray-900 font-light px-6 py-4">
                            <Link href={`/my-applications/${application.id}`} className="font-bold underline cursor-pointer text-gray-700">
                              Просмотр
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-span-12 text-right">
                <Link href="/my-applications" className="inline-block text-center w-52 text-white bg-red-600 mt-5 text-sm px-8 py-3 rounded hover:bg-red-900">
                  Назад
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <HomeExactSupportButton />
    </>
  );
}
