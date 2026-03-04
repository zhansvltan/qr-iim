import Image from "next/image";
import Link from "next/link";
import styles from "./home.module.css";

export function HomeFooter() {
  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContainer}>
          <div className={styles.footerTop}>
            <div className={styles.footerLeftTop}>
              <Image
                src="/logo.png"
                alt="Министерство Внутренних Дел Республики Казахстан"
                width={65}
                height={65}
                className={styles.footerLogoImage}
              />
              <h4 className={styles.footerTitle}>
                Қазақстан Республикасының
                <br />
                Ішкі істер министрлігі
              </h4>
            </div>

            <Link href="#vacancies" className={styles.footerLink}>
              Бос лауазымдар
            </Link>
            <Link href="/sign-in" className={styles.footerLink}>
              Менің өтініштерім
            </Link>
          </div>

          <div className={styles.footerBottom}>
            <p className={styles.footerCopyright}>Copyright © 2026 | All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
