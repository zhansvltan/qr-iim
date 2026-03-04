"use client";

import { useI18n } from "@/src/lib/i18n";

export function HomeExactAdvantages() {
  const { t } = useI18n();
  const items = [
    t("home.advantages.1"),
    t("home.advantages.2"),
    t("home.advantages.3"),
    t("home.advantages.4"),
    t("home.advantages.5"),
    t("home.advantages.6"),
  ];

  return (
    <section id="artukshiligy__pre" className="artukshiligy__pre pad-48">
      <div className="container">
        <div className="vacancies__pre__header section__header">
          <h2 className="vacancies__pre__title text-h2">{t("home.advantages.title")}</h2>
        </div>
        <div className="wratter">
          <div className="artukshiligy__pre__content">
            {items.map((item) => (
              <div key={item} className="vacancies__pre__item">
                <h3 className="vacancies__pre__name">
                  <br />
                </h3>
                <p className="vacancies__pre__salary">{item}</p>
              </div>
            ))}
          </div>
          <div className="artukshiligy__pre__item__image__container">
            <img src="/art2.jpg" alt={t("home.advantages.imageAlt")} className="artukshulifd__pre__image rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
