export function HomeExactSalary() {
  return (
    <section id="thanks" className="thanks">
      <div className="container">
        <h2 className="text-h2">Лауазымдық жалақыңызды есептеңіз</h2>
        <div className="grid grid-cols-12 mt-1 md:mt-14 bg-white rounded-2xl shadow-lg">
          <div className="col-span-12 text-left md:col-span-8 py-4 px-4">
            <form className="thanks__form" noValidate>
              <div className="thanks__form__group">
                <select className="my-2 text-gray-400 px-4 py-3 bg-transparent rounded-none border-b-2 w-full border-black">
                  <option>Лауазымы</option>
                  <option>Әкімшілік полиция басқармасының инспекторы</option>
                  <option>Тергеу бөлімінің тергеушісі</option>
                  <option>Патрульдік полиция инспекторы</option>
                </select>
              </div>
              <div className="thanks__form__group">
                <select className="my-2 text-gray-400 px-4 py-3 bg-transparent rounded-none border-b-2 w-full border-black">
                  <option>Қызмет өтілі</option>
                  <option>Бір жылға дейін</option>
                  <option>1 жылдан 2 жылға дейін</option>
                  <option>20 жылдан астам</option>
                </select>
              </div>
              <div className="thanks__form__group">
                <select className="my-2 text-gray-400 px-4 py-3 bg-transparent rounded-none border-b-2 w-full border-black">
                  <option>Атағы</option>
                  <option>лейтенанты</option>
                  <option>капитаны</option>
                  <option>майоры</option>
                </select>
              </div>
              <div className="thanks__form__group">
                <select className="my-2 text-gray-400 px-4 py-3 bg-transparent rounded-none border-b-2 w-full border-black">
                  <option>Қызмет орнын таңдаңыз</option>
                  <option>Алматы</option>
                  <option>Астана</option>
                  <option>Шымкент</option>
                </select>
              </div>
              <button className="bg-gray-400 inline-block mt-5 px-8 py-3 rounded text-sm text-white" disabled>
                Есептеу
              </button>
            </form>
          </div>
          <div className="col-span-12 items-center md:col-span-4 rounded-e-2xl md:rounded-s-lg main-blue-bg-opacity py-4 px-6">
            <div>
              <p className="text-xl text-white">Сіздің болжамды табысыңыз</p>
              <p className="text-xl text-white">Сіздің болжамды тұрғын үй төлемдеріңіз</p>
              <p className="text-xl text-white border-t border-white pt-3 mt-2">Жалпы сома</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
