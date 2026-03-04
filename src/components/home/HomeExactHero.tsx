"use client";

import { useI18n } from "@/src/lib/i18n";

export function HomeExactHero() {
  const { t } = useI18n();

  return (
    <section id="hero" className="hero">
      <div className="container">
        <div className="hero__items">
          <h1 className="hero__title">
            {t("home.hero.title")}
          </h1>
          <h2 className="hero__title_small">
            {t("home.hero.subtitle")}
          </h2>
          <a id="otinim" className="bg-white rounded-2xl text-blue-700 inline-block mt-5 text-sm px-8 py-3" href="/sign-up">
            {t("home.hero.apply")}
          </a>
        </div>
      </div>
    </section>
  );
}
