"use client";
import { useEffect, useState } from "react";
// TYPES
import { IPost } from "@/types/post";
import { IDataResponse } from "@/types/response";
// SESSION
import { useAuthProvider } from "@/context/AuthContext";
// COMPONENTS
import { Avatar } from "@/components/Avatar/Avatar";
import Post from "@/components/Post/Post";
import { Button } from "@mui/material";
import { Spinner } from "@/components/Spinner/Spinner";
// HOOKS
import { useGetPostByUserId } from "@/hooks/usePost";
import { useFollowUser, useUnFollowUser } from "@/hooks/useUser";
import { useAlert } from "@/hooks/useAlert";
import { redirect } from "next/navigation";
export default function User({ params }: { params: { id: string } }) {
  const { session, handleFollowed } = useAuthProvider();
  const [post, setPosts] = useState<IPost[]>([]);
  const [showAlert] = useAlert();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [data, setData] = useState<IDataResponse | null>(null);
  const [, loadFollow] = useFollowUser(session?._id ?? "");
  const [, loadUnFollow] = useUnFollowUser(session?._id ?? "");
  const [loading, load] = useGetPostByUserId(params.id);
  async function loadUserProfile() {
    const { response } = await load();
    if (response) {
      setData(response.data);
      setPosts(response.data.posts);
    }
  }

  useEffect(() => {
    if (session && session._id === params.id) {
      redirect("/");
    }
  }, [session]);
  useEffect(() => {
    let isUserFollowed = false;
    if (session?.followed) isUserFollowed = session?.followed.includes(params.id);
    if (isUserFollowed) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
    loadUserProfile();
  }, [params.id]);

  const handleFollow = async () => {
    let findUser = false
    if (session?.followed) findUser = session?.followed.includes(params.id);
    if (session) {
      if (findUser) {
        await loadUnFollow({ userToUnFollow: params.id });
        setIsFollowing(false);
        handleFollowed(params.id, "unfollow");
        loadUserProfile();
      } else {
        await loadFollow({ userToFollow: params.id });
        setIsFollowing(true);
        handleFollowed(params.id, "follow");
        loadUserProfile();
      }
    } else {
      showAlert("warning", "Debes iniciar sesión");
    }
  };

  return (
    <>
      {data && data?.user?.banner ? (
        <>
          <div
            className="relative flex items-end w-full h-44 bg-cover bg-center pl-8 bg-no-repeat"
            style={{
              backgroundImage: data?.user?.banner
                ? `url(${data?.user?.banner})`
                : "none",
            }}
          >
            {params.id ? (
              <div className="flex items-end gap-2 absolute bottom-[-40px]">
                <Avatar
                  size={100}
                  image={data?.user?.img}
                  session={null}
                  styles={{ borderWidth: 3, borderColor: "#2c3e50" }}
                />
                <span className="text-3xl drop-shadow-lg text-[#2c3e50] font-bold">
                  {data?.user?.name}
                </span>
              </div>
            ) : (
              ""
            )}
          </div>
          <div
            className="flex justify-between items-end pb-2"
            style={{
              borderColor: "#999999",
              borderBottomWidth: 1,
              marginTop: 40,
            }}
          >
            <div className="flex flex-row items-center gap-2 max-md:mt-6">
              <span>
                <span className="font-semibold">
                  {data.user?.followed ? data.user.followed.length : 0}
                </span>
                <span className="font-normal"> siguiendo</span>
              </span>
              <span>
                <span className="font-semibold">
                  {data.user.followers ? data.user.followers.length : 0}
                </span>
                <span className="font-normal">
                  {data.user?.followers && data.user?.followers.length > 1
                    ? " seguidores"
                    : " seguidor"}
                </span>
              </span>
            </div>
            <Button
              onClick={handleFollow}
              variant="contained"
              style={{
                backgroundColor: isFollowing ? "#9b26b6" : "#afafaf",
              }}
            >
              <span className="text-sm">
                {isFollowing ? "Siguiendo" : "Seguir"}
              </span>
            </Button>
          </div>
        </>
      ) : (
        data && (
          <div
            className="flex flex-row items-end justify-between gap-2 w-full mt-2 pb-2"
            style={{
              borderColor: "#999999",
              borderBottomWidth: 1,
            }}
          >
            <div className="flex flex-row items-end gap-2">
              <Avatar
                size={80}
                letterSize={40}
                styles={{ borderWidth: 3, borderColor: "#2c3e50" }}
                name={data?.user?.name}
                image={data?.user?.img}
                session={null}
              />
              <div className="flex flex-col">
                <div>
                  <span className="text-3xl drop-shadow-lg text-[#2c3e50] font-bold">
                    {data?.user?.name}
                  </span>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <span>
                    <span className="font-semibold">
                      {data.user?.followed ? data.user.followed.length : 0}
                    </span>
                    <span className="font-normal"> siguiendo</span>
                  </span>
                  <span>
                    <span className="font-semibold">
                      {data.user?.followers ? data.user.followers.length : 0}
                    </span>
                    <span className="font-normal">
                      {data.user?.followers && data.user?.followers.length > 1
                        ? " seguidores"
                        : " seguidor"}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex mt-2">
              <Button
                variant="contained"
                onClick={handleFollow}
                className="w-full"
                style={{
                  backgroundColor: isFollowing ? "#9b26b6" : "#afafaf",
                }}
              >
                <span className="text-sm">
                  {isFollowing ? "Siguiendo" : "Seguir"}
                </span>
              </Button>
            </div>
          </div>
        )
      )}

      <div className="flex flex-col grow">
        {data?.posts &&
          data?.posts.map((item, index) => {
            return (
              <Post key={index} data={item} post={post} setPosts={setPosts} />
            );
          })}

        {data?.posts?.length === 0 && (
          <span className="font-semibold text-center w-full mt-2 text-xl text-[#2c3e50]">
            Este usuario no ha realizado publicación
          </span>
        )}
      </div>
      {/* Spinner */}
      <Spinner loading={!data ? loading : false} message="cargando" />
    </>
  );
}
