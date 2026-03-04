import styles from "./home.module.css";

const vacancies = [
  { city: "Алматы", role: "Инспектор полиции", salary: "от 280 000 KZT" },
  { city: "Астана", role: "Оперативный сотрудник", salary: "от 320 000 KZT" },
  { city: "Шымкент", role: "Следователь", salary: "от 300 000 KZT" },
  { city: "Караганда", role: "Участковый инспектор", salary: "от 260 000 KZT" },
  { city: "Атырау", role: "Криминалист", salary: "от 330 000 KZT" },
  { city: "Костанай", role: "Патрульный полицейский", salary: "от 250 000 KZT" },
];

export function HomeVacancies() {
  return (
    <section id="vacancies" className={styles.vacanciesPre}>
      <div className={styles.container}>
        <div className={styles.vacanciesPreHeader}>
          <h2 className={styles.sectionTitle}>Предварительные вакансии</h2>
          <p className={styles.sectionText}>Подберите направление и город для дальнейшей подачи заявки.</p>
        </div>

        <div className={styles.vacanciesPreContent}>
          {vacancies.map((item) => (
            <article key={`${item.city}-${item.role}`} className={styles.vacanciesPreItem}>
              <p className={styles.vacanciesPreCity}>{item.city}</p>
              <h3 className={styles.vacanciesPreName}>{item.role}</h3>
              <p className={styles.vacanciesPreSalary}>{item.salary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
