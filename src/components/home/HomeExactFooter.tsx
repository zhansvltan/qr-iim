import Link from "next/link";

export function HomeExactFooter() {
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
                    alt="Министерство Внутренних Дел Республики Казахстан"
                    className="footer__logo-image"
                  />
                </Link>
                <h4 className="footer__title">
                  Қазақстан Республикасының
                  <br />
                  Ішкі істер министрлігі
                </h4>
              </div>
            </div>
            <div className="footer__center footer__links">
              <ul className="footer__list">
                <li>
                  <a className="footer__link" href="#vacancies__pre">
                    Бос лауазымдар
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer__right footer__links">
              <ul className="footer__list">
                <li>
                  <a className="footer__link" href="/sign-in">
                    Менің өтініштерім
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer__bottom">
            <p className="footer__copyright">
              Copyright © 2024 | All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
