import Image from "next/image";
import Link from "next/link";
import styles from "./home.module.css";

export function HomeHeader() {
  return (
    <header className={styles.header}>
      <div className={`${styles.container} ${styles.headerItemsHead}`}>
        <Link href="/" className={styles.headerLogo}>
          <Image src="/logo.png" alt="Academy logo" width={86} height={86} className={styles.logoImg} />
          <p className={styles.logoText}>
            Сервис по приему в Академию
            <br />
            внутренних дел
          </p>
        </Link>

        <nav className={styles.headerButtons}>
          <Link href="/sign-in" className={`${styles.headerButton} ${styles.headerButtonSecondary}`}>
            Sign in
          </Link>
          <Link href="/sign-up" className={`${styles.headerButton} ${styles.headerButtonPrimary}`}>
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}
