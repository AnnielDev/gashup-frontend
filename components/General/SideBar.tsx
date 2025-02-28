"use client";
import Link from "next/link";
import { useState, useEffect, ReactElement, cloneElement } from "react";
import { usePathname, useRouter } from "next/navigation";
// ICONS
import { BiSolidHome } from "react-icons/bi";
import { IoMdTrendingUp } from "react-icons/io";
import { FaRegFaceSmile } from "react-icons/fa6";
import { BsChatLeftText } from "react-icons/bs";
import { IoBookmarkOutline } from "react-icons/io5";
// HOOKS
import { useAuthProvider } from "@/context/AuthContext";
import { useAlert } from "@/hooks/useAlert";
// STYLES
import "@/styles/general/sidebar.css";

export interface Sidebar {
  icon: ReactElement;
  name: string;
  link: string;
}

export default function SideBar() {
  const pathName = usePathname();
  const router = useRouter();
  const windowWidth = window.innerWidth;
  const { session } = useAuthProvider();
  const [showAlert] = useAlert();
  const sidebarRef = document.querySelector(".sidebar") as HTMLElement;
  const [links, setLinks] = useState<Sidebar[]>([
    {
      icon: <BiSolidHome fontSize={20} className="icon" />,
      name: "Home",
      link: "/",
    },
    {
      icon: <IoMdTrendingUp fontSize={20} className="icon" />,
      name: "Popular",
      link: "/popular",
    },
    {
      icon: <FaRegFaceSmile fontSize={20} className="icon" />,
      name: "Comunidades",
      link: "/communities",
    },
    {
      icon: <BsChatLeftText fontSize={25} className="icon" />,
      name: "Chats",
      link: "/chats",
    },
    {
      icon: <IoBookmarkOutline fontSize={25} className="icon" />,
      name: "Mis Comunidades",
      link: "/my-communities",
    },
  ]);
  useEffect(() => {
    setLinks((prevLinks) =>
      prevLinks.map((link) => ({
        ...link,
        icon: cloneElement(link.icon as ReactElement, {
          color: link.link === pathName ? "#fff" : "",
        }),
      }))
    );
  }, [pathName]);
  const goToRoute = (route: string) => {
    if (windowWidth >= 768) {
      if (!session && (route === "/my-communities" || route === "/chats")) {
        showAlert("warning", "Debes iniciar sesión");
        return;
      }
      router.push(route);
    } else {
      if (!session && (route === "/my-communities" || route === "/chats")) {
        showAlert("warning", "Debes iniciar sesión");
        return;
      }
      sidebarRef.style.display = "none";
      router.push(route);
    }
  };

  const goToHome = () => {
    router.push("/");
    sidebarRef.style.display = "none";
  };
  return (
    <div
      style={{ flex: 2, zIndex: 10 }}
      className="hidden sm:flex flex-col p-2 gap-4 sidebar bg-[#fdfbfb] sticky"
    >
      {windowWidth <= 768 && (
        <Link href="/" onClick={goToHome} className="app-name outline-none">
          <h1 className="font-extrabold text-3xl">GashUp</h1>
        </Link>
      )}
      {links.map((item, index) => {
        return (
          <div
            key={index}
            onClick={() => goToRoute(item.link)}
            style={{
              backgroundColor: item.link === pathName ? "#9b26b6" : "",
            }}
            className="link flex cursor-pointer max-md:mt-2 items-center pt-2 pb-2 pl-4 max-md:pr-4 rounded-lg "
          >
            {item.icon}
            <span
              className="ml-3 name font-medium"
              style={{
                color: item.link === pathName ? "#fff" : "",
              }}
            >
              {item.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
