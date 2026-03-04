import { mapStoredApplication, MOCK_APPLICATIONS, type ApplicationRecord } from "@/src/lib/myApplicationsData";

const APPLICATIONS_STORAGE_KEY = "qyzmet_applications";

type StoredApplication = {
  id?: string;
  createdAt?: string;
  stage?: string;
  status?: string;
  vacancyTitle?: string;
  region?: string;
  user?: {
    iin?: string | number;
    name?: string;
    surname?: string;
    patronymic?: string;
    phone?: string;
    email?: string;
  };
  academy?: string;
  specialization?: string;
  form?: {
    education?: string;
    diplomaFileName?: string;
    testCertificateFileName?: string;
    parentsConsentFileName?: string;
  };
};

export type VvkApplicationRecord = {
  id: string;
  requestNumber: string;
  candidateName: string;
  iin: string;
  stage: string;
  requestStatus: string;
  responseStatus: string;
  submittedAt: string;
  status: string;
  academy: string;
  specialization: string;
  vacancyTitle: string;
  region: string;
  phone: string;
  email: string;
  education: string;
  diplomaFileName: string;
  testCertificateFileName: string;
  parentsConsentFileName: string;
};

function toSlashDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function toCandidateName(user: StoredApplication["user"]): string {
  const fullName = [user?.surname, user?.name, user?.patronymic].filter(Boolean).join(" ").trim();
  if (fullName) return fullName;
  return "Тест Тест Тест";
}

function toVvkRecordFromStored(item: StoredApplication): VvkApplicationRecord | null {
  if (!item.id || !item.createdAt) return null;

  return {
    id: item.id,
    requestNumber: item.id,
    candidateName: toCandidateName(item.user),
    iin: String(item.user?.iin ?? ""),
    stage: "Прохождение медобследования",
    requestStatus: "Запрос отправлен",
    responseStatus: "Ожидание ответа",
    submittedAt: toSlashDate(item.createdAt),
    status: "Требуется проверка",
    academy: item.academy ?? "",
    specialization: item.specialization ?? "",
    vacancyTitle: item.vacancyTitle ?? "",
    region: item.region ?? "",
    phone: item.user?.phone ?? "",
    email: item.user?.email ?? "",
    education: item.form?.education ?? "",
    diplomaFileName: item.form?.diplomaFileName ?? "edu.pdf",
    testCertificateFileName: item.form?.testCertificateFileName ?? "ent.pdf",
    parentsConsentFileName: item.form?.parentsConsentFileName ?? "",
  };
}

function toVvkRecordFromApplication(item: ApplicationRecord): VvkApplicationRecord {
  return {
    id: item.id,
    requestNumber: item.id,
    candidateName: item.user?.fullName || "Тест Тест Тест",
    iin: item.user?.iin ?? "",
    stage: "Прохождение медобследования",
    requestStatus: "Запрос отправлен",
    responseStatus: "Ожидание ответа",
    submittedAt: toSlashDate(item.createdAt),
    status: "Требуется проверка",
    academy: item.academy,
    specialization: item.specialization,
    vacancyTitle: item.vacancyTitle,
    region: item.region ?? "",
    phone: item.user?.phone ?? "",
    email: item.user?.email ?? "",
    education: item.form?.education ?? "",
    diplomaFileName: item.form?.diplomaFileName ?? "edu.pdf",
    testCertificateFileName: item.form?.testCertificateFileName ?? "ent.pdf",
    parentsConsentFileName: "",
  };
}

function mapStorageArray(raw: string | null): VvkApplicationRecord[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => toVvkRecordFromStored(item as StoredApplication))
      .filter((item): item is VvkApplicationRecord => item !== null);
  } catch {
    return [];
  }
}

export function getVvkApplicationsClient(): VvkApplicationRecord[] {
  if (typeof window === "undefined") {
    return MOCK_APPLICATIONS.map(toVvkRecordFromApplication);
  }

  const fromStorage = mapStorageArray(window.localStorage.getItem(APPLICATIONS_STORAGE_KEY));

  const fallbackFromMock = MOCK_APPLICATIONS.map(toVvkRecordFromApplication);

  const fallbackFromStoredMapper = mapStorageArray(
    JSON.stringify(MOCK_APPLICATIONS.map((item) => mapStoredApplication(item)).filter(Boolean)),
  );

  const merged = [...fromStorage, ...fallbackFromMock, ...fallbackFromStoredMapper];
  const used = new Set<string>();

  return merged.filter((item) => {
    if (used.has(item.id)) return false;
    used.add(item.id);
    return true;
  });
}

export function getVvkApplicationByIdClient(id: string): VvkApplicationRecord | null {
  const items = getVvkApplicationsClient();
  return items.find((item) => item.id === id) ?? null;
}
