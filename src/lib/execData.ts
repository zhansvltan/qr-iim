import { MOCK_APPLICATIONS, type ApplicationRecord } from "@/src/lib/myApplicationsData";

const APPLICATIONS_STORAGE_KEY = "qyzmet_applications";

type StoredApplication = {
  id?: string;
  createdAt?: string;
  vacancyTitle?: string;
  academy?: string;
  specialization?: string;
  region?: string;
  district?: string;
  user?: {
    iin?: string | number;
    name?: string;
    surname?: string;
    patronymic?: string;
    phone?: string;
    email?: string;
  };
  form?: {
    education?: string;
    diplomaFileName?: string;
    testCertificateFileName?: string;
    parentsConsentFileName?: string;
    relatives?: Array<{
      fullName?: string;
      status?: string;
      birthYear?: string;
      iin?: string;
    }>;
  };
};

export type ExecRelative = {
  fullName: string;
  status: string;
  birthYear: string;
  iin: string;
};

export type ExecApplicationRecord = {
  id: string;
  requestNumber: string;
  candidateName: string;
  iin: string;
  stage: string;
  requestStatus: string;
  responseStatus: string;
  submittedAt: string;
  status: string;
  vacancyTitle: string;
  academy: string;
  specialization: string;
  region: string;
  district: string;
  phone: string;
  email: string;
  education: string;
  diplomaFileName: string;
  testCertificateFileName: string;
  parentsConsentFileName: string;
  consentAccepted: boolean;
  relatives: ExecRelative[];
};

function toSlashDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function buildName(user: StoredApplication["user"]): string {
  const fullName = [user?.surname, user?.name, user?.patronymic].filter(Boolean).join(" ").trim();
  return fullName || "Тест Тест Тест";
}

function normalizeRelatives(relatives?: NonNullable<StoredApplication["form"]>["relatives"]): ExecRelative[] {
  if (!Array.isArray(relatives)) return [];
  return relatives.map((item) => ({
    fullName: item.fullName ?? "",
    status: item.status ?? "",
    birthYear: item.birthYear ?? "",
    iin: item.iin ?? "",
  }));
}

function fromStored(item: StoredApplication): ExecApplicationRecord | null {
  if (!item.id || !item.createdAt) return null;

  return {
    id: item.id,
    requestNumber: item.id,
    candidateName: buildName(item.user),
    iin: String(item.user?.iin ?? ""),
    stage: "Принято в работу",
    requestStatus: "Запрос отправлен",
    responseStatus: "В работе",
    submittedAt: toSlashDate(item.createdAt),
    status: "Требуется подтверждение",
    vacancyTitle: item.vacancyTitle ?? "",
    academy: item.academy ?? "",
    specialization: item.specialization ?? "",
    region: item.region ?? "",
    district: item.district ?? "",
    phone: item.user?.phone ?? "",
    email: item.user?.email ?? "",
    education: item.form?.education ?? "",
    diplomaFileName: item.form?.diplomaFileName ?? "edu.pdf",
    testCertificateFileName: item.form?.testCertificateFileName ?? "ent.pdf",
    parentsConsentFileName: item.form?.parentsConsentFileName ?? "parents.pdf",
    consentAccepted: true,
    relatives: normalizeRelatives(item.form?.relatives),
  };
}

function fromMock(item: ApplicationRecord): ExecApplicationRecord {
  return {
    id: item.id,
    requestNumber: item.id,
    candidateName: item.user?.fullName || "Тест Тест Тест",
    iin: item.user?.iin ?? "",
    stage: "Принято в работу",
    requestStatus: "Запрос отправлен",
    responseStatus: "В работе",
    submittedAt: toSlashDate(item.createdAt),
    status: "Требуется подтверждение",
    vacancyTitle: item.vacancyTitle,
    academy: item.academy,
    specialization: item.specialization,
    region: item.region ?? "",
    district: "",
    phone: item.user?.phone ?? "",
    email: item.user?.email ?? "",
    education: item.form?.education ?? "",
    diplomaFileName: item.form?.diplomaFileName ?? "edu.pdf",
    testCertificateFileName: item.form?.testCertificateFileName ?? "ent.pdf",
    parentsConsentFileName: item.form?.parentsConsentFileName ?? "parents.pdf",
    consentAccepted: true,
    relatives: (item.form?.relatives ?? []).map((relative) => ({
      fullName: relative.fullName,
      status: relative.status,
      birthYear: relative.birthYear,
      iin: relative.iin,
    })),
  };
}

function parseStorage(raw: string | null): ExecApplicationRecord[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => fromStored(item as StoredApplication)).filter((item): item is ExecApplicationRecord => item !== null);
  } catch {
    return [];
  }
}

export function getExecApplicationsClient(): ExecApplicationRecord[] {
  if (typeof window === "undefined") {
    return MOCK_APPLICATIONS.map(fromMock);
  }

  const fromStorage = parseStorage(window.localStorage.getItem(APPLICATIONS_STORAGE_KEY));
  const fromMocks = MOCK_APPLICATIONS.map(fromMock);
  const merged = [...fromStorage, ...fromMocks];
  const used = new Set<string>();

  return merged.filter((item) => {
    if (used.has(item.id)) return false;
    used.add(item.id);
    return true;
  });
}

export function getExecApplicationByIdClient(id: string): ExecApplicationRecord | null {
  return getExecApplicationsClient().find((item) => item.id === id) ?? null;
}
