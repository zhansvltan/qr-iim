"use client";

import { createContext, ReactNode, useContext, useSyncExternalStore } from "react";
import kkMessages from "@/messages/kk.json";
import ruMessages from "@/messages/ru.json";

export type Locale = "ru" | "kk";

type Messages = Record<string, string>;

const LOCALE_STORAGE_KEY = "qyzmet_locale";
const LOCALE_CHANGED_EVENT = "qyzmet_locale_changed";

const dictionaries: Record<Locale, Messages> = {
  ru: ruMessages as Messages,
  kk: kkMessages as Messages,
};

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore<Locale>(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => undefined;
      const handler = () => onStoreChange();
      window.addEventListener("storage", handler);
      window.addEventListener(LOCALE_CHANGED_EVENT, handler);
      return () => {
        window.removeEventListener("storage", handler);
        window.removeEventListener(LOCALE_CHANGED_EVENT, handler);
      };
    },
    () => {
      if (typeof window === "undefined") return "ru";
      return window.localStorage.getItem(LOCALE_STORAGE_KEY) === "kk" ? "kk" : "ru";
    },
    () => "ru",
  );

  const setLocale = (nextLocale: Locale) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
      window.dispatchEvent(new Event(LOCALE_CHANGED_EVENT));
    }
  };

  const t = (key: string): string => {
    const value = dictionaries[locale][key];
    return typeof value === "string" ? value : key;
  };

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return context;
}

export function getClientLocale(): Locale {
  if (typeof window === "undefined") return "ru";
  return window.localStorage.getItem(LOCALE_STORAGE_KEY) === "kk" ? "kk" : "ru";
}
