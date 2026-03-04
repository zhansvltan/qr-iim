export type LocalUser = {
  iin: string;
  name: string;
  surname: string;
  patronymic: string;
  birthDay: string;
  gender: string;
  phone: string;
  email: string;
  password: string;
  agreed: boolean;
  createdAt: string;
};

export type LocalSession = {
  email: string;
  iin: string;
  name: string;
  surname: string;
};

const USERS_KEY = "qyzmet_users";
const SESSION_KEY = "qyzmet_session";
const AUTH_CHANGED_EVENT = "qyzmet_auth_changed";
let cachedSessionRaw: string | null | undefined;
let cachedSessionSnapshot: LocalSession | null = null;

function notifyAuthChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

function readUsers(): LocalUser[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users: LocalUser[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function registerLocalUser(user: Omit<LocalUser, "createdAt">): { ok: true } | { ok: false; message: string } {
  const users = readUsers();
  const normalizedEmail = normalizeEmail(user.email);

  const emailExists = users.some((item) => normalizeEmail(item.email) === normalizedEmail);
  if (emailExists) {
    return { ok: false, message: "Пользователь с таким email уже существует." };
  }

  const iinExists = users.some((item) => item.iin === user.iin);
  if (iinExists) {
    return { ok: false, message: "Пользователь с таким ИИН уже существует." };
  }

  users.push({
    ...user,
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
  });

  writeUsers(users);
  return { ok: true };
}

export function signInLocalUser(email: string, password: string): { ok: true } | { ok: false; message: string } {
  const users = readUsers();
  const normalizedEmail = normalizeEmail(email);

  const user = users.find((item) => normalizeEmail(item.email) === normalizedEmail && item.password === password);
  if (!user) {
    return { ok: false, message: "Неверный email или пароль." };
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        email: user.email,
        iin: user.iin,
        name: user.name,
        surname: user.surname,
      }),
    );
    notifyAuthChanged();
  }

  return { ok: true };
}

export function getCurrentLocalSession(): LocalSession | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(SESSION_KEY);
  if (raw === cachedSessionRaw) {
    return cachedSessionSnapshot;
  }

  cachedSessionRaw = raw;

  if (!raw) {
    cachedSessionSnapshot = null;
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<LocalSession>;
    if (!parsed.email || !parsed.name || !parsed.surname || !parsed.iin) {
      cachedSessionSnapshot = null;
      return null;
    }

    cachedSessionSnapshot = {
      email: parsed.email,
      iin: parsed.iin,
      name: parsed.name,
      surname: parsed.surname,
    };
    return cachedSessionSnapshot;
  } catch {
    cachedSessionSnapshot = null;
    return null;
  }
}

export function signOutLocalUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
  notifyAuthChanged();
}

export function subscribeToLocalAuthChanges(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const handleChange = () => onStoreChange();

  window.addEventListener("storage", handleChange);
  window.addEventListener(AUTH_CHANGED_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(AUTH_CHANGED_EVENT, handleChange);
  };
}
