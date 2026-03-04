export type VacancyItem = {
  id: string;
  title: string;
  academy: string;
  specialization: string;
  description: string;
  date: string;
  region: string;
  district: string;
};

export const VACANCIES: VacancyItem[] = [
  {
    id: "almaty-academy-ovd",
    title: "Поступление в Алматинскую академию МВД",
    academy: "Алматинская академия МВД",
    specialization: "Оперативно-розыскная деятельность ОВД",
    description: "Подготовка специалистов оперативно-розыскной деятельности.",
    date: "04.03.2026",
    region: "г. Алматы",
    district: "Алматинская академия МВД",
  },
  {
    id: "karaganda-academy-it",
    title: "Поступление в Карагандинскую академию МВД",
    academy: "Карагандинская академия МВД",
    specialization: "IT-криминалистика (цифровая криминалистика)",
    description: "Подготовка специалистов цифровой криминалистики.",
    date: "04.03.2026",
    region: "Карагандинская область",
    district: "Карагандинская академия МВД",
  },
  {
    id: "kostanay-academy-pretrial",
    title: "Поступление в Костанайскую академию МВД",
    academy: "Костанайская академия МВД",
    specialization: "Досудебное расследование в ОВД",
    description: "Подготовка специалистов досудебного расследования.",
    date: "04.03.2026",
    region: "Костанайская область",
    district: "Костанайская академия МВД",
  },
];

export function getVacancyById(id: string): VacancyItem | null {
  return VACANCIES.find((item) => item.id === id) ?? null;
}
