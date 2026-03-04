"use client";

import Link from "next/link";
import { useI18n } from "@/src/lib/i18n";

export function HomeExactFooter() {
  const { t } = useI18n();

  return (
    <footer id="footer" className="footer">
      <div className="container">
        <div className="footer__container">
          <div className="footer__top">
            <div className="footer__left">
              <div className="footer__left--top">
                <Link href='/'>
                  <img
                    src="/logo.png"
                    alt={t("footer.ministryAlt")}
                    className="footer__logo-image"
                  />
                </Link>
                <h4 className="footer__title">{t("footer.ministryTitle")}</h4>
              </div>
            </div>
            <div className="footer__center footer__links">
              <ul className="footer__list">
                <li>
                  <a className="footer__link" href="#vacancies__pre">
                    {t("footer.vacancies")}
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer__right footer__links">
              <ul className="footer__list">
                <li>
                  <a className="footer__link" href="/sign-in">
                    {t("footer.myApplications")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer__bottom">
            <p className="footer__copyright">
              {t("footer.copyright")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
