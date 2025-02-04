"use client";
import { useState, useEffect } from "react";
// TYPES
import { IPost } from "@/types/post";
import { IDataResponse } from "@/types/response";
// COMPONENTS
import Post from "@/components/Post/Post";
import { Spinner } from "@/components/Spinner/Spinner";
// HOOKS
import { useGetPostByUserId } from "@/hooks/usePost";
// SESSION
import { useAuthProvider } from "@/context/AuthContext";
export default function Posts() {
  const { session } = useAuthProvider();
  const [loading, load] = useGetPostByUserId(session?._id ?? "");
  const [post, setPosts] = useState<IPost[]>([]);
  const [data, setData] = useState<IDataResponse | null>(null);

  async function loadUserProfile() {
    const { response, error } = await load();
    if (response) {
      setData(response.data);
      setPosts(response.data.posts);
    }
  }
  useEffect(() => {
    loadUserProfile();
  }, []);

  return (
    <>
      <div>
        {data?.posts &&
          data?.posts.map((item, index) => {
            return (
              <Post key={index} data={item} post={post} setPosts={setPosts} />
            );
          })}
      </div>
      {data?.posts?.length === 0 && (
        <h3 className="font-semibold text-center w-full mt-2 text-xl text-[#2c3e50]">
          No ha realizado publicación
        </h3>
      )}
      {/* Spinner */}
      <Spinner loading={loading} message="cargando" />
    </>
  );
}
