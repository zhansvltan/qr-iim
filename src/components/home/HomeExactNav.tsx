export function HomeExactNavbar() {
  return (
    <section className="main-blue-bg-opacity">
      <nav className="container mx-auto bg-transparent relative flex flex-wrap items-center justify-between py-4 text-gray-500 hover:text-gray-700 focus:text-gray-700 navbar navbar-expand-lg navbar-light border-white">
        <div className="container-fluid w-full flex flex-wrap items-center justify-between px-6">
          <div
            id="navbarSupportedContent2"
            className="!visible mt-2 flex-grow basis-[100%] items-center lg:mt-0 lg:!flex lg:basis-auto"
          >
            <ul className="navbar-nav md:flex pl-0 list-style-none mr-auto">
              <li className="nav-item p-2">
                <a
                  className="nav-link text-white hover:main-color focus:text-blue-400 p-0"
                  href="#"
                >
                  Абитуриентам в ВУЗы
                </a>
              </li>
              <li className="nav-item p-2">
                <a
                  className="nav-link text-white hover:main-color focus:text-blue-400 p-0"
                  href="#vacancies__pre"
                >
                  Бос лауазымдар
                </a>
              </li>
              <li className="nav-item p-2">
                <a
                  className="nav-link text-white hover:main-color focus:text-blue-400 p-0"
                  href="#"
                >
                  Менің өтініштерім
                </a>
              </li>
            </ul>
            <div className="flex items-center relative">
              <ul className="navbar-nav flex flex-col pl-0 list-style-none mr-auto">
                <li className="nav-item p-2">
                  <a
                    className="nav-link text-white hover:main-color focus:text-blue-400 p-0"
                    href="/sign-in"
                  >
                    Кіру
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </section>
  );
}
