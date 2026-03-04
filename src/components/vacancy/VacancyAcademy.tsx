"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { HomeExactSupportButton } from "@/src/components/home/HomeExactSupportButton";
import { HomeExactNavbar } from "../home/HomeExactNav";
import type { VacancyItem } from "@/src/lib/vacancyData";
import { VACANCIES } from "@/src/lib/vacancyData";

const ACADEMY_OPTIONS = [
  "Алматинская академия",
  "Актюбинский юридический институт",
  "Карагандинская академия",
  "Костанайская академия",
];

const SPECIALIZATION_OPTIONS = [
  "Оперативно-розыскная деятельность ОВД",
  "Досудебное расследование в ОВД",
  "Административно-правовая деятельность ОВД",
  "Оперативно-криминалистическая деятельность ОВД",
  "Уголовно-исполнительная деятельность ОВД",
  "Оперативно-розыскная деятельность по противодействию киберпреступности",
  "IT-криминалистическое обеспечение деятельности ОВД (цифровая криминалистика)",
];

function VacancyCard({ item }: { item: VacancyItem }) {
  return (
    <div
      className="grid shadow-lg my-5 w-full py-5 px-5 text-left rounded-2xl"
      style={{ backgroundColor: "#f5f5f7" }}
    >
      <div className="w-full cursor-pointer">
        <span className="sm:flex justify-between mb-4">
          <p className="montserrat text-2xl light-gray-1">{item.title}</p>
          <p className="montserrat text-lg light-gray-1">{item.date}</p>
        </span>
        <span className="sm:flex justify-start mb-4">
          <p className="montserrat text-sm light-gray-1 mr-5">
            <b>Академия: {item.academy}</b>
          </p>
          <p className="montserrat text-sm light-gray-1 mr-5">
            <b>Специализация: {item.specialization}</b>
          </p>
        </span>
        <hr className="border-gray-600" />
        <p className="my-2 light-gray-1">{item.description}</p>
      </div>
      <div className="flex justify-end">
        <a className="text-white main-blue-bg-opacity mx-3 text-sm px-8 py-2 rounded hover:bg-info cursor-pointer">
          Подробнее
        </a>
        <Link
          className="text-white bg-red-600 text-sm px-8 py-2 rounded hover:bg-red-900 cursor-pointer"
          href={`/application/${item.id}`}
        >
          Подать заявку
        </Link>
      </div>
    </div>
  );
}

export function VacancyAcademy() {
  const [selectedAcademy, setSelectedAcademy] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  const filteredVacancies = useMemo(() => {
    return VACANCIES.filter((item) => {
      const academyMatched = selectedAcademy
        ? item.academy.includes(selectedAcademy)
        : true;
      const specializationMatched = selectedSpecialization
        ? item.specialization === selectedSpecialization
        : true;
      return academyMatched && specializationMatched;
    });
  }, [selectedAcademy, selectedSpecialization]);

  return (
    <>
      <HomeExactNavbar />
      <main id="main" className="main">
        <div className="container pt-4 mx-auto h-auto text-left">
          <h1 className="light-gray-1 text-2xl px-2">
            Вакансии для поступления в ВУЗы МВД
          </h1>
          <p className="text-gray-600 text-sm px-2 mt-2">
            Всего вакансий: {filteredVacancies.length}
          </p>
        </div>
        <div className="container mx-auto h-auto text-center">
          <div className="grid grid-cols-12 gap-4 mt-4">
            <div className="col-span-12 sm:col-span-4 md:col-span-4">
              <div
                className="shadow rounded-2xl my-2 h-auto w-full p-3 text-left"
                style={{ backgroundColor: "#f5f5f7" }}
              >
                <div className="grid grid-cols-1 gap-4">
                  <div className="col-span-1">
                    <select
                      aria-label="Академия"
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                      value={selectedAcademy}
                      onChange={(event) =>
                        setSelectedAcademy(event.target.value)
                      }
                    >
                      <option value="">Академия</option>
                      {ACADEMY_OPTIONS.map((academy) => (
                        <option key={academy} value={academy}>
                          {academy}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <select
                      aria-label="Специализация"
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                      value={selectedSpecialization}
                      onChange={(event) =>
                        setSelectedSpecialization(event.target.value)
                      }
                    >
                      <option value="">Специализация</option>
                      {SPECIALIZATION_OPTIONS.map((specialization) => (
                        <option key={specialization} value={specialization}>
                          {specialization}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 sm:col-span-8 md:col-span-8">
              {filteredVacancies.length > 0 ? (
                filteredVacancies.map((item) => (
                  <VacancyCard key={item.title} item={item} />
                ))
              ) : (
                <div className="text-left py-8 px-2 light-gray-1">
                  По выбранным параметрам вакансий нет.
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="h-8" />
      </main>
      <HomeExactSupportButton />
    </>
  );
}
