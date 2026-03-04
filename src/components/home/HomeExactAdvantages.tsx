const items = [
  "Тұрақты жалақы",
  "Әлеуметтік пакет",
  "Ерте зейнетке шығу",
  "Қызметтік тұрғын үй алу мүмкіндігі",
  "Мансаптық өсудің нақты жүйесі",
  "Магистратурада тегін оқу мүмкіндігі",
];

export function HomeExactAdvantages() {
  return (
    <section id="artukshiligy__pre" className="artukshiligy__pre pad-48">
      <div className="container">
        <div className="vacancies__pre__header section__header">
          <h2 className="vacancies__pre__title text-h2">Ішкі істер органдарында қызмет атқарудың артықшылықтары</h2>
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
            <img src="/art2.jpg" alt="Знак Казахстана" className="artukshulifd__pre__image rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
