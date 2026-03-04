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
  region?: string;
  user?: {
    fullName: string;
    iin: string;
    phone: string;
    email: string;
  };
  form?: {
    education: string;
    isServedContractInNGRK: string;
    isServedInPolice: string;
    isChildOfKilledOfficer: string;
    hasEntOver100: string;
    hasAltynBelgi: string;
    relatives: Array<{
      fullName: string;
      status: string;
      birthYear: string;
      iin: string;
    }>;
    diplomaFileName: string;
    testCertificateFileName: string;
  };
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
    createdAt: "2026-03-05T10:37:00.000Z",
    stage: "ФИЗО",
    status: "В работе",
    comment: "Срок обработки заявки до 5 рабочих дней",
    vacancyTitle: "Поступление в Алматинскую академию МВД имени М.Есболаева",
    academy: "Алматинская академия МВД имени М.Есболаева",
    specialization: "Оперативно-розыскная деятельность ОВД",
    region: "г. Алматы",
    user: {
      fullName: "тест тест тест",
      iin: "55555555555",
      phone: "87777777777",
      email: "erasyltores@gmail.com",
    },
    form: {
      education: "Общее среднее (11 классов)",
      isServedContractInNGRK: "Нет",
      isServedInPolice: "Нет",
      isChildOfKilledOfficer: "Нет",
      hasEntOver100: "Нет",
      hasAltynBelgi: "Нет",
      relatives: [
        {
          fullName: "тест тест тест",
          status: "Сестра",
          birthYear: "12.12.2012",
          iin: "121212121212",
        },
      ],
      diplomaFileName: "edu.pdf",
      testCertificateFileName: "ent.pdf",
    },
    history: [
      {
        date: "2026-03-05T10:37:00.000Z",
        stage: "Документы отправлены",
        status: "Заявка принята",
        comment: "Этап пройден",
      },
      {
        date: "2026-03-05T10:38:00.000Z",
        stage: "Принято в работу",
        status: "Заявка принята",
        comment: "Этап пройден",
      },
      {
        date: "2026-03-05T11:20:00.000Z",
        stage: "Медобследование",
        status: "Заявка принята",
        comment: "Этап пройден",
      },
      {
        date: "2026-03-05T12:10:00.000Z",
        stage: "ФИЗО",
        status: "В работе",
        comment: "Срок обработки заявки до 5 рабочих дней",
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
