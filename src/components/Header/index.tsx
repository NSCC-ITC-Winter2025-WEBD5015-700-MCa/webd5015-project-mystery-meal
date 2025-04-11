"use client";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import menuData from "./menuData";

const Header = () => {
  const { data: session } = useSession();
  const pathUrl = usePathname();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => setNavbarOpen(!navbarOpen);

  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    setSticky(window.scrollY >= 80);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);

    const checkIfexist = menuData.find((item) => item.id === 99);
    if (session && !checkIfexist && session.user?.isAdmin) {
      menuData.push({
        id: 99,
        title: "Admin Dashboard",
        path: "/dashboard",
        newTab: false,
      });
    }

    return () => {
      window.removeEventListener("scroll", handleStickyNavbar);
    };
  }, [session]);

  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const { theme, setTheme } = useTheme();

  return (
    <header
      className={`ud-header left-0 top-0 z-40 flex w-full items-center ${sticky
          ? "fixed z-[999] border-b border-stroke bg-white/80 shadow-nav backdrop-blur-[5px] dark:border-dark-3/20 dark:bg-dark/10"
          : "absolute bg-transparent"
        }`}
    >
      <div className="container">
        <div className="relative -mx-4 flex items-center justify-between">
          {/* Logo */}
          <div className="w-60 max-w-full px-4">
            <Link
              href="/"
              className={`navbar-logo block w-full ${sticky ? "py-2" : "py-5"}`}
            >
              {pathUrl !== "/" ? (
                <>
                  <Image
                    src="/images/logo/logo.png"
                    alt="logo"
                    width={240}
                    height={30}
                    className="header-logo w-full dark:hidden"
                  />
                  <Image
                    src="/images/logo/logo.png"
                    alt="logo"
                    width={240}
                    height={30}
                    className="header-logo hidden w-full dark:block"
                  />
                </>
              ) : (
                <>
                  <Image
                    src="/images/logo/logo.png"
                    alt="logo"
                    width={140}
                    height={30}
                    className="header-logo w-full dark:hidden"
                  />
                  <Image
                    src="/images/logo/logo.png"
                    alt="logo"
                    width={140}
                    height={30}
                    className="header-logo hidden w-full dark:block"
                  />
                </>
              )}
            </Link>
          </div>

          {/* Nav & Buttons */}
          <div className="flex w-full items-center justify-between px-4">
            <div>
              {/* Mobile Toggle Button */}
              <button
                onClick={navbarToggleHandler}
                className="absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
              >
                <span
                  className={`my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${navbarOpen ? "rotate-45 top-[7px]" : ""
                    } ${sticky ? "bg-dark dark:bg-white" : "bg-white dark:bg-white"}`}
                />
                <span
                  className={`my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${navbarOpen ? "opacity-0" : ""
                    } ${sticky ? "bg-dark dark:bg-white" : "bg-white dark:bg-white"}`}
                />
                <span
                  className={`my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${navbarOpen ? "-rotate-45 top-[-8px]" : ""
                    } ${sticky ? "bg-dark dark:bg-white" : "bg-white dark:bg-white"}`}
                />
              </button>

              {/* Nav Menu */}
              <nav
                className={`navbar absolute right-0 z-30 w-[250px] rounded border border-body-color/50 bg-white px-6 py-4 duration-300 dark:border-body-color/20 dark:bg-dark-2 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 lg:dark:bg-transparent ${navbarOpen
                    ? "top-full visible opacity-100"
                    : "top-[120%] invisible opacity-0"
                  }`}
              >
                <ul className="block lg:ml-8 lg:flex lg:gap-x-8 xl:ml-14 xl:gap-x-12">
                  {menuData.map((menuItem, index) =>
                    menuItem.path ? (
                      <li key={index} className="group relative">
                        <Link
                          href={menuItem.path}
                          onClick={navbarToggleHandler}
                          className={`ud-menu-scroll flex py-2 text-base group-hover:text-primary lg:inline-flex lg:px-0 lg:py-6 ${sticky
                              ? "text-dark dark:text-white"
                              : "text-body-color lg:text-white dark:text-white"
                            } ${pathUrl === menuItem?.path ? "text-primary" : ""
                            }`}
                        >
                          {menuItem.title}
                        </Link>
                      </li>
                    ) : null
                  )}
                </ul>
              </nav>
            </div>

            {/* Right side (Theme toggle + Auth buttons) */}
            <div className="hidden items-center justify-end pr-16 sm:flex lg:pr-0">
              {/* Theme toggle */}

              <button
                aria-label="theme toggler"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex h-8 w-8 items-center justify-center text-body-color duration-300 dark:text-white"
              >
                <span>
                  <svg
                    viewBox="0 0 16 16"
                    className="hidden h-[22px] w-[22px] fill-current dark:block"
                  >
                    <path d="M4.50663 3.2267L3.30663 2.03337L2.36663 2.97337L3.55996 4.1667L4.50663 3.2267ZM2.66663 7.00003H0.666626V8.33337H2.66663V7.00003ZM8.66663 0.366699H7.33329V2.33337H8.66663V0.366699V0.366699ZM13.6333 2.97337L12.6933 2.03337L11.5 3.2267L12.44 4.1667L13.6333 2.97337ZM11.4933 12.1067L12.6866 13.3067L13.6266 12.3667L12.4266 11.1734L11.4933 12.1067ZM13.3333 7.00003V8.33337H15.3333V7.00003H13.3333ZM7.99996 3.6667C5.79329 3.6667 3.99996 5.46003 3.99996 7.6667C3.99996 9.87337 5.79329 11.6667 7.99996 11.6667C10.2066 11.6667 12 9.87337 12 7.6667C12 5.46003 10.2066 3.6667 7.99996 3.6667ZM7.33329 14.9667H8.66663V13H7.33329V14.9667ZM2.36663 12.36L3.30663 13.3L4.49996 12.1L3.55996 11.16L2.36663 12.36Z" />
                  </svg>

                  <svg
                    viewBox="0 0 23 23"
                    className={`h-[30px] w-[30px] fill-current text-dark dark:hidden ${!sticky && pathUrl === "/" && "text-white"
                      }`}
                  >
                    <g clipPath="url(#clip0_40_125)">
                      <path d="M16.6111 15.855C17.591 15.1394 18.3151 14.1979 18.7723 13.1623C16.4824 13.4065 14.1342 12.4631 12.6795 10.4711C11.2248 8.47905 11.0409 5.95516 11.9705 3.84818C10.8449 3.9685 9.72768 4.37162 8.74781 5.08719C5.7759 7.25747 5.12529 11.4308 7.29558 14.4028C9.46586 17.3747 13.6392 18.0253 16.6111 15.855Z" />
                    </g>
                  </svg>
                </span>
              </button>

              {/* Auth Buttons */}
              {session?.user ? (
                <>
                  <p
                    className={`px-4 py-3 text-base font-medium ${sticky || pathUrl !== "/"
                        ? "text-dark dark:text-white"
                        : "text-white"
                      }`}
                  >
                    {session.user.name}
                  </p>
                  <button
                    onClick={() => signOut()}
                    className={`rounded-lg px-6 py-3 text-base font-medium duration-300 ease-in-out ${sticky || pathUrl !== "/"
                        ? "bg-primary text-white hover:bg-primary/90 dark:bg-white/10 dark:hover:bg-white/20"
                        : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className={`px-7 py-3 text-base font-medium hover:opacity-70 ${sticky ? "text-dark dark:text-white" : "text-white"
                      }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className={`rounded-lg px-6 py-3 text-base font-medium duration-300 ease-in-out ${sticky
                        ? "bg-primary text-white hover:bg-primary/90 dark:bg-white/10 dark:hover:bg-white/20"
                        : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
