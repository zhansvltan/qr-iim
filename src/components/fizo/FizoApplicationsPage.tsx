"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HomeExactSupportButton } from "@/src/components/home/HomeExactSupportButton";
import { getFizoApplicationsClient, type FizoApplicationRecord } from "@/src/lib/fizoData";
import { FizoShell } from "./FizoShell";

export function FizoApplicationsPage() {
  const [applications, setApplications] = useState<FizoApplicationRecord[]>([]);

  useEffect(() => {
    const load = () => setApplications(getFizoApplicationsClient());
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  return (
    <>
      <FizoShell totalCount={applications.length || 0}>
        <div className="container mx-auto py-14">
          <div className="shadow-lg bg-white rounded h-full">
            <div className="overflow-x-auto">
              <table className="min-w-full rounded">
                <thead className="bg-white border-b light-blue-bg-2">
                  <tr className="rounded">
                    <th scope="col" className="montserrat-bold text-md md:text-lg text-black font-bold text-center px-6 py-4 text-left">Номер заявки</th>
                    <th scope="col" className="montserrat-bold text-md md:text-lg text-black font-bold text-center px-6 py-4 text-left">Этап заявки</th>
                    <th scope="col" className="montserrat-bold text-md md:text-lg text-black font-bold text-center px-6 py-4 text-left">Статус запроса</th>
                    <th scope="col" className="montserrat-bold text-md md:text-lg text-black font-bold text-center px-6 py-4 text-left">Статус Ответа</th>
                    <th scope="col" className="montserrat-bold text-md md:text-lg text-black font-bold text-center px-6 py-4 text-left">Дата подачи</th>
                    <th scope="col" className="montserrat-bold text-md md:text-lg text-black font-bold text-center px-6 py-4 text-left">Статус</th>
                    <th scope="col" className="montserrat-bold text-md md:text-lg text-black font-bold text-center px-6 py-4 text-left">Действие</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((item) => (
                    <tr key={item.id} className="even-table montserrat border-b text-center">
                      <td className="px-6 py-4">№{item.requestNumber}</td>
                      <td className="px-6 py-4">{item.stage}</td>
                      <td className="px-6 py-4"><p className="text-green-500">{item.requestStatus}</p></td>
                      <td className="px-6 py-4"><p className="text-indigo-600">{item.responseStatus}</p></td>
                      <td className="px-6 py-4">{item.submittedAt}</td>
                      <td className="px-6 py-4"><p className="text-indigo-600">{item.status}</p></td>
                      <td className="px-6 py-4"><Link href={`/fizo/applications/${item.id}`} className="underline cursor-pointer">Просмотр</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </FizoShell>
      <HomeExactSupportButton />
    </>
  );
}
