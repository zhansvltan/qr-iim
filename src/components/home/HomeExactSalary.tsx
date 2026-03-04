"use client";

import { useI18n } from "@/src/lib/i18n";

export function HomeExactSalary() {
  const { t } = useI18n();

  return (
    <section id="thanks" className="thanks">
      <div className="container">
        <h2 className="text-h2">{t("home.salary.title")}</h2>
        <div className="grid grid-cols-12 mt-1 md:mt-14 bg-white rounded-2xl shadow-lg">
          <div className="col-span-12 text-left md:col-span-8 py-4 px-4">
            <form className="thanks__form" noValidate>
              <div className="thanks__form__group">
                <select className="my-2 text-gray-400 px-4 py-3 bg-transparent rounded-none border-b-2 w-full border-black">
                  <option>{t("home.salary.position")}</option>
                  <option>{t("home.salary.position.1")}</option>
                  <option>{t("home.salary.position.2")}</option>
                  <option>{t("home.salary.position.3")}</option>
                </select>
              </div>
              <div className="thanks__form__group">
                <select className="my-2 text-gray-400 px-4 py-3 bg-transparent rounded-none border-b-2 w-full border-black">
                  <option>{t("home.salary.experience")}</option>
                  <option>{t("home.salary.experience.1")}</option>
                  <option>{t("home.salary.experience.2")}</option>
                  <option>{t("home.salary.experience.3")}</option>
                </select>
              </div>
              <div className="thanks__form__group">
                <select className="my-2 text-gray-400 px-4 py-3 bg-transparent rounded-none border-b-2 w-full border-black">
                  <option>{t("home.salary.rank")}</option>
                  <option>{t("home.salary.rank.1")}</option>
                  <option>{t("home.salary.rank.2")}</option>
                  <option>{t("home.salary.rank.3")}</option>
                </select>
              </div>
              <div className="thanks__form__group">
                <select className="my-2 text-gray-400 px-4 py-3 bg-transparent rounded-none border-b-2 w-full border-black">
                  <option>{t("home.salary.location")}</option>
                  <option>{t("home.salary.location.1")}</option>
                  <option>{t("home.salary.location.2")}</option>
                  <option>{t("home.salary.location.3")}</option>
                </select>
              </div>
              <button className="bg-gray-400 inline-block mt-5 px-8 py-3 rounded text-sm text-white" disabled>
                {t("home.salary.calculate")}
              </button>
            </form>
          </div>
          <div className="col-span-12 items-center md:col-span-4 rounded-e-2xl md:rounded-s-lg main-blue-bg-opacity py-4 px-6">
            <div>
              <p className="text-xl text-white">{t("home.salary.income")}</p>
              <p className="text-xl text-white">{t("home.salary.housing")}</p>
              <p className="text-xl text-white border-t border-white pt-3 mt-2">{t("home.salary.total")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
