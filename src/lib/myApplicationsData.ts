export type ApplicationHistoryItem = {
  date: string;
  stage: string;
  status: string;
  comment: string;
};

export type ApplicationRecord = {
  id: string;
  createdAt: string;
  stage: string;
  status: string;
  comment: string;
  vacancyTitle: string;
  academy: string;
  specialization: string;
  history: ApplicationHistoryItem[];
};

export type StoredApplicationLike = {
  id: string;
  createdAt: string;
  stage?: string;
  status?: string;
  comment?: string;
  vacancyTitle?: string;
  academy?: string;
  specialization?: string;
};

export const APPLICATION_STAGES = [
  "Документы отправлены",
  "Принято в работу",
  "Медобследование",
  "ФИЗО",
  "Зачисление в ВУЗ",
];

export const MOCK_APPLICATIONS: ApplicationRecord[] = [
  {
    id: "3558",
    createdAt: "2026-02-27T10:37:00.000Z",
    stage: "Медобследование",
    status: "В работе",
    comment: "Срок обработки заявки до 5 рабочих дней",
    vacancyTitle: "Поступление в Алматинскую академию МВД имени М.Есболаева",
    academy: "Алматинская академия МВД имени М.Есболаева",
    specialization: "Оперативно-розыскная деятельность ОВД",
    history: [
      {
        date: "2026-02-27T10:37:00.000Z",
        stage: "Документы отправлены",
        status: "Заявка принята",
        comment: "Этап пройден",
      },
      {
        date: "2026-02-27T10:38:00.000Z",
        stage: "Принято в работу",
        status: "Заявка принята",
        comment: "Этап пройден",
      },
      {
        date: "2026-02-27T10:38:00.000Z",
        stage: "Медобследование",
        status: "Документы отправлены на медобследование",
        comment: "Этап в работе",
      },
    ],
  },
];

export function mapStoredApplication(item: unknown): ApplicationRecord | null {
  if (!item || typeof item !== "object") return null;
  const value = item as Record<string, unknown>;
  if (typeof value.id !== "string" || typeof value.createdAt !== "string") return null;

  const stage = typeof value.stage === "string" ? value.stage : "Принято в работу";
  const status = typeof value.status === "string" ? value.status : "В работе";
  const comment = typeof value.comment === "string" ? value.comment : "Срок обработки заявки до 5 рабочих дней";
  const vacancyTitle = typeof value.vacancyTitle === "string" ? value.vacancyTitle : "Заявка на обучение в ВУЗ-ах МВД";
  const academy = typeof value.academy === "string" ? value.academy : "";
  const specialization = typeof value.specialization === "string" ? value.specialization : "";

  return {
    id: value.id,
    createdAt: value.createdAt,
    stage,
    status,
    comment,
    vacancyTitle,
    academy,
    specialization,
    history: [
      {
        date: value.createdAt,
        stage: "Документы отправлены",
        status: "Заявка принята",
        comment: "Этап пройден",
      },
      {
        date: value.createdAt,
        stage,
        status,
        comment,
      },
    ],
  };
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("ru-RU");
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return `${date.toLocaleDateString("ru-RU")} ${date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`;
}
