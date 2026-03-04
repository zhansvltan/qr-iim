"use client";

import { useI18n } from "@/src/lib/i18n";

function ArrowIcon() {
  return (
    <svg width="32" height="31" viewBox="0 0 32 31" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.07947 7.92058L23.7372 7.92058L23.7372 22.5783" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23.7371 7.92066L8.14551 23.5123" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HomeExactSteps() {
  const { t } = useI18n();
  const steps = [
    ["01", t("home.steps.1")],
    ["02", t("home.steps.2")],
    ["03", t("home.steps.3")],
    ["04", t("home.steps.4")],
    ["05", t("home.steps.5")],
    ["06", t("home.steps.6")],
  ] as const;

  return (
    <section id="vacancies__pre" className="vacancies__pre pad-48">
      <div className="container">
        <div className="vacancies__pre__header section__header">
          <h2 className="vacancies__pre__title text-h2">{t("home.steps.title")}</h2>
        </div>
        <div className="vacancies__pre__content">
          {steps.map(([n, text]) => (
            <a key={n} className="vacancies__pre__item" href="#">
              <h3 className="vacancies__pre__name">{n}</h3>
              <p className="vacancies__pre__salary">{text}</p>
              <span className="vacancies__pre__icon">
                <ArrowIcon />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
