"use client";
import { useEffect, ReactNode } from "react";
import { usePathname, redirect, useRouter } from "next/navigation";
// SESSION
import { useAuthProvider } from "@/context/AuthContext";
// COMPONENTS
import { Avatar } from "@/components/Avatar/Avatar";
// STYLES
import "@/styles/pages/profile.css";
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathName = usePathname();
  const { session } = useAuthProvider();
  const router = useRouter();
  //
  const navigation = [
    { name: "Posts", route: "/profile/posts" },
    { name: "Siguiendo", route: "/profile/following" },
  ];
  useEffect(() => {
    if (!session) {
      redirect("/");
    }
  }, [session]);
  const goToRoute = (route: string) => {
    router.push(route);
  };
  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      {session?.banner ? (
        <div
          className="relative flex items-end w-full h-44 bg-cover bg-center pl-8 bg-no-repeat"
          style={{
            backgroundImage: session?.banner
              ? `url(${session?.banner})`
              : "none",
          }}
        >
          <div className="flex items-end gap-2 absolute bottom-[-40px]">
            <Avatar
              size={100}
              image={session?.img}
              session={null}
              name={session.name}
              styles={
                session?.img ? { borderWidth: 3, borderColor: "#2c3e50" } : {}
              }
            />
            <div className="flex flex-col relative top-6">
              <div>
                <span className="text-3xl drop-shadow-lg text-[#2c3e50] font-bold">
                  {session?.name}
                </span>
              </div>
              <div className="flex flex-row items-center gap-2">
                <span>
                  <span className="font-semibold">
                    {session?.followed ? session.followed.length : 0}
                  </span>
                  <span className="font-normal"> siguiendo</span>
                </span>
                <span>
                  <span className="font-semibold">
                    {session?.followers ? session.followers.length : 0}
                  </span>
                  <span className="font-normal">
                    {session?.followers && session?.followers.length > 1
                      ? " seguidores"
                      : " seguidor"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center w-full gap-2 mt-2">
          <Avatar
            size={90}
            name={session?.name}
            letterSize={45}
            image={session?.img}
            styles={
              session?.img ? { borderWidth: 3, borderColor: "#2c3e50" } : {}
            }
          />
          <div className="flex flex-col">
            <div>
              <span className="text-3xl drop-shadow-lg text-[#2c3e50] font-bold">
                {session?.name}
              </span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span>
                <span className="font-semibold">
                  {session?.followed ? session.followed.length : 0}

                </span>
                <span className="font-normal"> siguiendo</span>
              </span>
              <span>
                <span className="font-semibold">
                  {session?.followers ? session.followers.length : 0}
                </span>
                <span className="font-normal">
                  {session?.followers && session?.followers.length > 1
                    ? " seguidores"
                    : " seguidor"}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
      <div
        className="flex navigation-container items-center w-full gap-4 p-2"
        style={{ marginTop: session?.banner ? "65px" : 0 }}
      >
        {navigation.map((nav, index) => {
          return (
            <div
              key={index}
              onClick={() => goToRoute(nav.route)}
              className="text-md cursor-pointer font-semibold navigation-text rounded-full"
            >
              <span className="text-[#2c3e50]">{nav.name}</span>
              {nav.route === pathName ? (
                <div className="w-full rounded-full h-1  bg-[#9b26b6]" />
              ) : (
                ""
              )}
            </div>
          );
        })}
      </div>
      <div className="pt-2 flex-grow">{children}</div>
    </div>
  );
}
