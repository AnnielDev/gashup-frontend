"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// ICONS
import { FaBars } from "react-icons/fa6";
// COMPONENTS
import Options from "./Options";

// STYLES
import "@/styles/general/topbar.css";
export default function TopBar() {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [sidebar, setSidebar] = useState<boolean>(false);
  const pathName = usePathname();
  const sidebarRef = document.querySelector(".sidebar") as HTMLElement;

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (sidebar && windowWidth <= 768) {
      sidebarRef.style.display = "block";
      sidebarRef.style.position = "fixed";
      sidebarRef.style.width = "350";
    }
  }, [sidebar]);

  const showSidebar = () => {
    if (sidebar) {
      setSidebar(false);
      sidebarRef.style.display = "none";
      sidebarRef.style.position = "sticky";
    } else {
      setSidebar(true);
    }
  };

  return (
    <div className="topbar flex flex-row items-center justify-between w-full bg-[#fdfbfb]">
      {windowWidth <= 768 ? (
        <FaBars
          color="#2c3e76"
          size={30}
          className="cursor-pointer"
          onClick={showSidebar}
        />
      ) : (
        <Link href="/" className="app-name outline-none">
          <h1 className="font-extrabold text-3xl">GashUp</h1>
        </Link>
      )}

      {/* {pathName === "/" ? (
        <div className="input-container">
          <input
            type="text"
            className="rounded-full"
            style={{ backgroundColor: "#e6e4e4" }}
            placeholder="Buscar..."
          />
        </div>
      ) : (
        ""
      )} */}
      <Options />
    </div>
  );
}
