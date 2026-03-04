"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOutLocalUser } from "@/src/lib/auth/localAuth";

type VvkShellProps = {
  children: ReactNode;
  medCount: number;
};

export function VvkShell({ children, medCount }: VvkShellProps) {
  const router = useRouter();

  return (
    <>
      <section className="main-blue-bg-opacity">
        <nav className="container mx-auto bg-transparent relative flex flex-wrap items-center justify-between py-4 text-gray-500 hover:text-gray-700 focus:text-gray-700 navbar navbar-expand-lg navbar-light">
          <div className="container-fluid w-full flex flex-wrap items-center justify-between px-6">
            <div className="!visible mt-2 flex-grow basis-[100%] items-center lg:mt-0 lg:!flex lg:basis-auto">
              <ul className="navbar-nav md:flex pl-0 list-style-none mr-auto">
                <li className="nav-item mx-2">
                  <Link className="comforta nav-link text-white hover:main-color focus:text-blue-900 p-0 text-sm" href="/vvk/applications">
                    Медкомиссия
                    <span className="inline-block py-1 px-1.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-red-600 text-white rounded ml-2">
                      {medCount}
                    </span>
                  </Link>
                </li>
                <li className="nav-item mx-2">
                  <a className="comforta nav-link text-white hover:main-color focus:text-blue-900 p-0 text-sm" href="#">
                    Психотест
                    <span className="inline-block py-1 px-1.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-red-600 text-white rounded ml-2">
                      0
                    </span>
                  </a>
                </li>
                <li className="nav-item mx-2">
                  <a className="comforta nav-link text-white hover:main-color focus:text-blue-900 p-0 text-sm" href="#">
                    Согласование
                  </a>
                </li>
                <li className="nav-item mx-2">
                  <a className="comforta nav-link text-white hover:main-color focus:text-blue-900 p-0 text-sm" href="#">
                    Отклоненные
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </section>

      <section className="lg:flex">
        <div className="w-60 shadow-md bg-white px-1 mr-2 min-h-screen flex absolute lg:sticky min-h-full">
          <ul className="fixed my-8">
            <li className="relative my-2">
              <Link
                href="/vvk/applications"
                className="flex items-center py-4 px-6 h-12 overflow-hidden light-blue text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
              >
                Заявки
              </Link>
            </li>
            <li className="relative my-2">
              <a
                href="#"
                className="flex items-center py-4 px-6 h-12 overflow-hidden light-blue text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
              >
                Справочная информация
              </a>
            </li>
            <li className="relative my-2">
              <button
                type="button"
                className="flex items-center py-4 px-6 h-12 overflow-hidden light-blue text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
                onClick={() => {
                  signOutLocalUser();
                  router.push("/");
                }}
              >
                Выход
              </button>
            </li>
          </ul>
        </div>

        <div className="flex-1 md:px-8 overflow-x-scroll min-h-screen">{children}</div>
      </section>
    </>
  );
}
