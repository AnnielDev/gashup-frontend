"use client";
import { IComment, ISubComment } from "@/types/post";
import { Avatar } from "../Avatar/Avatar";
import { useRouter } from "next/navigation";
import SubCommentInput from "./SubCommentInput";
import { useAuthProvider } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";
import SettingsComment from "./SettingsComment";
import { useAlert } from "@/hooks/useAlert";
import { useLikeSubComment } from "@/hooks/usePost";
import PostButton from "../Post/PostButton";
import { AiFillLike } from "react-icons/ai";
import EditCommentInput from "./EditCommentInput";

interface props {
  item: ISubComment;
  callback: (item: ISubComment) => void;
  editCommentFunct: (item: ISubComment) => void;
  comments?: Array<IComment>;
  setComments?: Function;
  editSubCommentId: string | null;
  setEditSubCommentId: Function;
}

export default function SubComment({
  item,
  callback,
  comments,
  setComments,
  editSubCommentId,
  setEditSubCommentId,
  editCommentFunct,
}: props) {
  const router = useRouter();
  const { session } = useAuthProvider();
  const [showAlert] = useAlert();
  const inputRef = useRef<HTMLDivElement>(null);
  const [subCommentActive, setSubCommentActive] = useState<string | null>(null);
  const [initialName, setInitialName] = useState<string>();
  const [userLikesAmount, setUserLikesAmount] = useState<number>(
    item?.user_likes?.length as number
  );
  const [active, setActive] = useState(false);

  const [loading, load] = useLikeSubComment(
    item?._id ?? "",
    session?._id ?? ""
  );

  useEffect(() => {
    const findLike = item.user_likes?.find((item) => item == session?._id);
    setUserLikesAmount(item?.user_likes?.length ?? 0);
    if (findLike) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [comments]);

  const toggleSubCommentActive = (commentId: string) => {
    setSubCommentActive((prev) => (prev === commentId ? null : commentId));
    if (typeof item?.user_id !== "string") {
      setInitialName(item?.user_id?.name);
    }
  };

  const goToPerfil = (id: string) => {
    if (id === session?._id) {
      router.push(`/profile/posts`);
    } else {
      router.push(`/user/${id}`);
    }
  };

  const likeComment = async () => {
    if (!session?._id) {
      return showAlert("warning", "Debes iniciar sessión");
    }

    const { response, error } = await load();

    if (response?.data.ok) {
      editCommentFunct({
        ...item,
        user_likes: response.data.comment.user_likes,
      });
    }
  };

  return (
    <>
      <div key={item?._id} className="">
        <div className="flex flex-row gap-1">
          {typeof item?.user_id !== "string" && (
            <Avatar
              size={30}
              image={item?.user_id?.img}
              onClick={() => {
                const id =
                  typeof item?.user_id !== "string" && item?.user_id?._id;
                if (typeof id === "string") {
                  goToPerfil(id);
                }
              }}
              pointer
            />
          )}
          <div className={`${editSubCommentId == item._id && "w-full"}`}>
            <div className="flex flex-row gap-1">
              {/* <div className="px-2 bg-gray-200 rounded-md">
                <div className="flex gap-1 py-1 items-center">
                  {typeof item?.user_id !== "string" && (
                    <span
                      className="font-bold text-sm cursor-pointer"
                      onClick={() => {
                        const id =
                          typeof item?.user_id !== "string" &&
                          item?.user_id?._id;
                        if (typeof id === "string") {
                          goToPerfil(id);
                        }
                      }}
                    >
                      {item?.user_id?.name}
                    </span>
                  )}
                  <span>{"•"}</span>
                  <span className="text-sm">{item?.commentDate}</span>
                </div>
                <div
                  className="pb-2"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </div> */}
              {editSubCommentId === item._id ? (
                <EditCommentInput
                  className="w-full py-0 gap-0"
                  callback={(updatedComment) => {
                    editCommentFunct(updatedComment);
                    setEditSubCommentId(null); // Desactivar edición después de editar
                  }}
                  isSubComment={true}
                  item={item as any}
                  cancel={() => {
                    setEditSubCommentId(null);
                  }}
                />
              ) : (
                <div className="px-2 bg-gray-200 rounded-md">
                  <div className="flex gap-1 py-1 items-center">
                    {typeof item?.user_id !== "string" && (
                      <span
                        className="font-bold text-sm cursor-pointer"
                        onClick={() => {
                          const id =
                            typeof item?.user_id !== "string" &&
                            item?.user_id?._id;
                          if (typeof id === "string") {
                            goToPerfil(id);
                          }
                        }}
                      >
                        {item?.user_id?.name}
                      </span>
                    )}
                    <span>{"•"}</span>
                    <span className="text-sm">{item?.commentDate}</span>
                  </div>
                  <div
                    className="pb-2"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </div>
              )}

              {session && (
                <SettingsComment
                  id={item._id ?? ""}
                  subComment={item}
                  isSubComment={true}
                  comments={comments ?? []}
                  setComments={setComments ?? Function}
                  setEditCommentId={setEditSubCommentId}
                  // isEditing={editCommentId === item._id}
                />
              )}
            </div>

            {session?._id && (
              <div className="flex pl-2 gap-2 mt-1 text-sm">
                <span
                  onClick={likeComment}
                  className={`${active && "text-[#9b34b7]"} cursor-pointer`}
                >
                  Me gusta
                </span>
                <span
                  className="cursor-pointer"
                  onClick={() => toggleSubCommentActive(item?._id ?? "")}
                >
                  Comentar
                </span>

                {userLikesAmount > 0 && (
                  <PostButton
                    className={"h-5 w-5"}
                    classNameButton={"pb-1 cursor-auto"}
                    Icon={AiFillLike}
                    amount={userLikesAmount}
                    // callback={likePost}
                    active={active}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div ref={inputRef} className="mt-3 pl-9">
          {subCommentActive === item?._id && (
            <div className="flex flex-row gap-1">
              {typeof item?.user_id !== "string" && (
                <Avatar
                  className="w-[10%]"
                  size={30}
                  image={item?.user_id?.img}
                  onClick={() => {
                    const id =
                      typeof item?.user_id !== "string" && item?.user_id?._id;
                    if (typeof id === "string") {
                      goToPerfil(id);
                    }
                  }}
                  pointer
                />
              )}
              <SubCommentInput
                className="w-[90%] p-0"
                setSubCommentActive={() => {
                  toggleSubCommentActive(item?._id ?? "");
                }}
                subCommentInitial={initialName}
                comment_id={item?.comment_id as string}
                callback={(updatedComment) => {
                  callback(updatedComment);
                  setSubCommentActive(null);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
