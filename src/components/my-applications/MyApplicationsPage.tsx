"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { HomeExactSupportButton } from "@/src/components/home/HomeExactSupportButton";
import { type ApplicationRecord, formatDate, mapStoredApplication, MOCK_APPLICATIONS } from "@/src/lib/myApplicationsData";
import { HomeExactNavbar } from "../home/HomeExactNav";
import { useI18n } from "@/src/lib/i18n";

const APPLICATIONS_STORAGE_KEY = "qyzmet_applications";

export function MyApplicationsPage() {
  const { t } = useI18n();
  const router = useRouter();
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

  const applications = useMemo(() => {
    const merged = [...storedApplications, ...MOCK_APPLICATIONS];
    const ids = new Set<string>();
    return merged.filter((item) => {
      if (ids.has(item.id)) return false;
      ids.add(item.id);
      return true;
    });
  }, [storedApplications]);

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
    return value;
  };

  return (
    <>
      <HomeExactNavbar/>
      <main id="main" className="main">
        <div className="container mx-auto h-auto mt-2 py-2 text-center">
          <h1 className="light-gray-1 text-2xl capitalize px-2">{t("applications.title")}</h1>
          <hr className="w-20 h-0.5 mx-auto" />
          <div className="col-span-12 px-4 py-2 mt-2">
            <div className="overflow-x-auto">
              <table className="min-w-full" style={{ borderCollapse: "separate", borderSpacing: "0 1em" }}>
                <thead className="bg-gray-1">
                  <tr>
                    <th scope="col" className="text-md md:text-lg font-medium text-black px-6 py-2 text-center">
                      {t("applications.number")}
                    </th>
                    <th scope="col" className="text-md md:text-lg font-medium text-black px-6 py-2 text-center">
                      {t("applications.date")}
                    </th>
                    <th scope="col" className="text-md md:text-lg font-medium text-black px-6 py-2 text-center">
                      {t("applications.stage")}
                    </th>
                    <th scope="col" className="text-md md:text-lg font-medium text-black px-6 py-2 text-center">
                      {t("applications.status")}
                    </th>
                    <th scope="col" className="text-md md:text-lg font-medium text-black px-6 py-2 text-center">
                      {t("applications.comment")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((item) => (
                    <tr
                      key={item.id}
                      className="cursor-pointer comforta tr-box-shadow my-4 shadow-lg bg-white border-b transition duration-300 ease-in-out hover:bg-gray-2"
                      onClick={() => router.push(`/my-applications/${item.id}`)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          router.push(`/my-applications/${item.id}`);
                        }
                      }}
                      role="link"
                      tabIndex={0}
                    >
                      <td className="text-sm md:text-md text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        <Link href={`/my-applications/${item.id}`}>
                          {t("applications.request")} {Number(item.id).toLocaleString("ru-RU")}
                        </Link>
                      </td>
                      <td className="text-sm md:text-md text-gray-900 font-light px-6 py-4 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                      <td className="text-sm md:text-md text-gray-900 font-light px-6 py-4 whitespace-nowrap">{translateStage(item.stage)}</td>
                      <td className="text-sm md:text-md text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">
                        <span className={item.status === "Заявка отклонена" ? "text-red-500" : "text-yellow-500"}>{translateStatus(item.status)}</span>
                      </td>
                      <td className="text-sm md:text-md text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">{translateComment(item.comment)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <HomeExactSupportButton />
    </>
  );
}
