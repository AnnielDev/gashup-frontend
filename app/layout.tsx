"use client";

import { useEffect, useState } from "react";
import "@/app/globals.css";
import "react-toastify/dist/ReactToastify.css";
// import type { Metadata } from "next";
// export const metadata: Metadata = {
//   title: "GashUp",
//   description: "Generated by create next app",
// };
// UTILS
import { usePathname } from "next/navigation";
// SESSION
import { AuthProvider } from "@/context/AuthContext";
// COMPONENTS
import TopBar from "@/components/General/TopBar";
import SideBar from "@/components/General/SideBar";
import RightBar from "@/components/General/RightBar";
import { Spinner } from "@/components/Spinner/Spinner";
import { ThemeProvider } from "@mui/material";
import theme from "@/utils/ColorsUI";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname();
  const [online, setOnline] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOnline(navigator.onLine);

      const handleOnline = () => {
        setOnline(true);
      };

      const handleOffline = () => {
        setOnline(false);
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);
  return (
    <html lang="en">
      <head>
        <title>GashUp</title>
        <meta name="description" content="Generated by create next app" />
      </head>
      <body className="container">
        <ThemeProvider theme={theme}>
          <AuthProvider>
            {!online ? (
              <Spinner
                loading={true}
                longMessage
                message="You are experiencing connection problems, please check your connection"
              />
            ) : (
              <>
                <TopBar />
                <div className="flex flex-row">
                  <SideBar />
                  <div
                    style={{
                      flex:
                        pathName !== "/" &&
                        pathName !== "/popular" &&
                        pathName !== "/communities"
                          ? pathName.startsWith("/user/") ||
                            pathName.startsWith("/profile/") ||
                            pathName === "/my-communities"
                            ? 7
                            : 10.1
                          : 7,
                    }}
                    className="px-2"
                  >
                    {children}
                  </div>
                  <RightBar />
                </div>
              </>
            )}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
