"use client";

import { useSyncExternalStore } from "react";
import { getCurrentLocalSession, signOutLocalUser, subscribeToLocalAuthChanges } from "@/src/lib/auth/localAuth";
import Link from "next/link";

export function HomeExactNavbar() {
  const session = useSyncExternalStore(subscribeToLocalAuthChanges, getCurrentLocalSession, () => null);

  const handleSignOut = () => {
    signOutLocalUser();
  };

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
                <Link
                  className="nav-link text-white hover:main-color focus:text-blue-400 p-0"
                  href="/vacancy-academy"
                >
                  Абитуриентам в ВУЗы
                </Link>
              </li>
              {/* <li className="nav-item p-2">
                <a
                  className="nav-link text-white hover:main-color focus:text-blue-400 p-0"
                  href="#vacancies__pre"
                >
                  Бос лауазымдар
                </a>
              </li> */}
              <li className="nav-item p-2">
                <Link
                  className="nav-link text-white hover:main-color focus:text-blue-400 p-0"
                  href="/my-applications"
                >
                  Менің өтініштерім
                </Link>
              </li>
            </ul>
            <div className="flex items-center relative">
              {session ? (
                <ul className="navbar-nav flex flex-col pl-0 list-style-none mr-auto">
                  <li className="nav-item p-2 text-white">
                    {session.name} {session.surname}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="nav-link text-white hover:main-color focus:text-blue-400 p-0 ml-4 inline"
                    >
                      Выйти
                    </button>
                  </li>
                </ul>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </nav>
    </section>
  );
}
