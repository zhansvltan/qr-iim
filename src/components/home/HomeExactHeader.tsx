"use client";
import Link from "next/link";
import { useI18n } from "@/src/lib/i18n";

export function HomeExactHeader() {
  const { locale, setLocale, t } = useI18n();

  return (
    <>
      <header id="header_head" style={{ background: "url('/ornament.png')" }}>
        <div className="container">
          <div className="header__items__head">
            <div className="header__buttons" />
            <div className="header__buttons">
              <button
                type="button"
                className={`header__button button__language ${locale === "kk" ? "active" : ""}`}
                onClick={() => setLocale("kk")}
              >
                {t("lang.kk")}
              </button>
              <span>|</span>
              <button
                type="button"
                className={`header__button button__language ${locale === "ru" ? "active" : ""}`}
                onClick={() => setLocale("ru")}
              >
                {t("lang.ru")}
              </button>
            </div>
          </div>
        </div>
      </header>

      <header
        id="header"
        className="header"
        style={{
          position: "relative",
          overflow: "hidden",
          height: "200px",
          backgroundColor: "transparent",
        }}
      >
        <video
          autoPlay
          muted
          loop
          id="myVideo"
          className="background-video"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        >
          <source src="/bg-video.mp4" type="video/mp4" />
          {t("header.videoUnsupported")}
        </video>
        <div
          className="grid grid-cols-3 gap-4 w-full"
          style={{ position: "relative", zIndex: 1 }}
        >
          <div className="logo-text text-center my-auto">
            <p>МІНДЕТ</p>
            <p style={{ paddingLeft: "30%" }}>ЕРЛІК</p>
            <p style={{ paddingLeft: "60%" }}>АБЫРОЙ</p>
          </div>
          <Link href="/">
            <div className="center_logo mx-auto" />
          </Link>
          <div className="right-text my-auto">
            <div>
              <div className="text-center">QYZMET-POLICE.KZ</div>
              <div className="text-center text-2xl mt-4">
                {t("header.acceptedThisYear")}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
