"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getCurrentLocalSession, signOutLocalUser, subscribeToLocalAuthChanges } from "@/src/lib/auth/localAuth";

export function UserAreaNav() {
  const session = useSyncExternalStore(subscribeToLocalAuthChanges, getCurrentLocalSession, () => null);

  return (
    <section className="main-blue-bg">
      <nav className="container mx-auto bg-transparent relative flex flex-wrap items-center justify-between py-4 text-gray-500 hover:text-gray-700 focus:text-gray-700 navbar navbar-expand-lg navbar-light border-t border-white">
        <div className="container-fluid w-full flex flex-wrap items-center justify-between px-6">
          <div id="navbarSupportedContent2" className="!visible mt-2 flex-grow basis-[100%] items-center lg:mt-0 lg:!flex lg:basis-auto">
            <ul className="navbar-nav md:flex pl-0 list-style-none mr-auto">
              <li className="nav-item mx-2 p-2">
                <Link className="nav-link text-white hover:main-color focus:text-blue-400 p-0" href="/vacancy-academy">
                  Вакансии
                </Link>
              </li>
              <li className="nav-item mx-2 p-2">
                <Link className="nav-link text-white hover:main-color focus:text-blue-400 p-0" href="/my-applications">
                  Мои заявки
                </Link>
              </li>
            </ul>
            <div className="flex items-center relative">
              {session ? (
                <ul className="navbar-nav flex flex-col pl-0 list-style-none mr-auto">
                  <li className="nav-item mx-2 p-2">
                    <Link className="nav-link text-white hover:main-color focus:text-blue-400 p-0" href="/profile">
                      {session.name} {session.surname}
                    </Link>
                    <button
                      type="button"
                      onClick={signOutLocalUser}
                      className="nav-link text-white hover:main-color focus:text-blue-400 p-0 cursor-pointer"
                    >
                      Выйти
                    </button>
                  </li>
                </ul>
              ) : (
                <ul className="navbar-nav flex flex-col pl-0 list-style-none mr-auto">
                  <li className="nav-item mx-2 p-2">
                    <Link className="nav-link text-white hover:main-color focus:text-blue-400 p-0" href="/sign-in">
                      Войти
                    </Link>
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
