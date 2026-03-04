import styles from "./home.module.css";

const benefits = [
  "Цифровая анкета без бумажных справок",
  "Прозрачный статус проверки документов",
  "Подача с любого устройства 24/7",
  "Безопасное хранение персональных данных",
];

export function HomeBenefits() {
  return (
    <section className={styles.benefits}>
      <div className={styles.container}>
        <div className={styles.vacanciesPreHeader}>
          <h2 className={styles.sectionTitle}>Артықшылықтары</h2>
          <p className={styles.sectionText}>Платформа оформлена в стиле исходного дизайна qyzmet-police.</p>
        </div>

        <div className={styles.benefitsContent}>
          {benefits.map((item) => (
            <article key={item} className={styles.benefitItem}>
              {item}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
