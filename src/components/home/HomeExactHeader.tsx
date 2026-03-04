export function HomeExactHeader() {
  return (
    <>
      <header id="header_head" style={{ background: "url('/ornament.png')" }}>
        <div className="container">
          <div className="header__items__head">
            <div className="header__buttons" />
            <div className="header__buttons">
              <a className="header__button button__language active"> Қаз </a>
              <span>|</span>
              <a className="header__button button__language"> Рус </a>
            </div>
          </div>
        </div>
      </header>

      <header id="header" className="header">
        <video autoPlay muted loop id="myVideo" className="background-video">
          <source src="/bg-video.mp4" type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="logo-text text-center my-auto">
            <p>МІНДЕТ</p>
            <p style={{ paddingLeft: "30%" }}>ЕРЛІК</p>
            <p style={{ paddingLeft: "60%" }}>АБЫРОЙ</p>
          </div>
          <div className="center_logo mx-auto" />
          <div className="right-text my-auto">
            <div>
              <div className="text-center">QYZMET-POLICE.KZ</div>
              <div className="text-center text-2xl mt-4">Осы жылы қабылданды: 4876</div>
            </div>
          </div>
        </div>
      </header>

      <section className="main-blue-bg-opacity">
        <nav className="container mx-auto bg-transparent relative flex flex-wrap items-center justify-between py-4 text-gray-500 hover:text-gray-700 focus:text-gray-700 navbar navbar-expand-lg navbar-light border-white">
          <div className="container-fluid w-full flex flex-wrap items-center justify-between px-6">
            <div id="navbarSupportedContent2" className="!visible mt-2 flex-grow basis-[100%] items-center lg:mt-0 lg:!flex lg:basis-auto">
              <ul className="navbar-nav md:flex pl-0 list-style-none mr-auto">
                <li className="nav-item p-2">
                  <a className="nav-link text-white hover:main-color focus:text-blue-400 p-0" href="#">
                    Абитуриентам в ВУЗы
                  </a>
                </li>
                <li className="nav-item p-2">
                  <a className="nav-link text-white hover:main-color focus:text-blue-400 p-0" href="#vacancies__pre">
                    Бос лауазымдар
                  </a>
                </li>
                <li className="nav-item p-2">
                  <a className="nav-link text-white hover:main-color focus:text-blue-400 p-0" href="#">
                    Менің өтініштерім
                  </a>
                </li>
              </ul>
              <div className="flex items-center relative">
                <ul className="navbar-nav flex flex-col pl-0 list-style-none mr-auto">
                  <li className="nav-item p-2">
                    <a className="nav-link text-white hover:main-color focus:text-blue-400 p-0" href="/sign-in">
                      Кіру
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </section>
    </>
  );
}
