import { IComment, ISubComment } from "@/types/post";
import { Avatar } from "../Avatar/Avatar";
import { useRouter } from "next/navigation";
import SubCommentInput from "./SubCommentInput";
import SubComment from "./SubComments";
import { useEffect, useRef, useState } from "react";
import { useLikeComment } from "@/hooks/usePost";
import { useAuthProvider } from "@/context/AuthContext";
import PostButton from "../Post/PostButton";
import { AiFillLike } from "react-icons/ai";
import { useAlert } from "@/hooks/useAlert";
import SettingsComment from "./SettingsComment";
import EditCommentInput from "./EditCommentInput";

interface Props {
  item: IComment;
  subCommentActive: string | null;
  toggleSubCommentActive: Function;
  callback: (item: ISubComment) => void;
  editCommentFunct: (item: IComment) => void;
  comments: Array<IComment>;
  setComments: Function;
  editCommentId: string | null;
  setEditCommentId: Function;
}

export default function Comment({
  item,
  subCommentActive,
  toggleSubCommentActive,
  callback,
  editCommentFunct,
  comments,
  setComments,
  editCommentId,
  setEditCommentId,
}: Props) {
  const { session } = useAuthProvider();
  const router = useRouter();
  const [showAlert] = useAlert();
  const inputRef = useRef<HTMLDivElement>(null);

  const [loading, load] = useLikeComment(item?._id ?? "", session?._id ?? "");
  const [active, setActive] = useState(false);
  const [userLikesAmount, setUserLikesAmount] = useState<number>(
    item?.user_likes?.length as number
  );
  const [editSubCommentId, setEditSubCommentId] = useState<string | null>(null);

  useEffect(() => {
    const findLike = item.user_likes?.find((like) => like === session?._id);
    setUserLikesAmount(item?.user_likes?.length ?? 0);
    setActive(!!findLike);
  }, [item.user_likes, session?._id]);

  const goToPerfil = (id: string) => {
    if (id === session?._id) {
      router.push(`/profile/posts`);
    } else {
      router.push(`/user/${id}`);
    }
  };

  const likeComment = async () => {
    if (!session?._id) {
      return showAlert("warning", "Debes iniciar sesión");
    }

    const { response, error } = await load();

    if (response?.data.ok) {
      const updatedComment = response.data.comment;
      setComments((prevComments: Array<IComment>) =>
        prevComments.map((comment) =>
          comment._id === item._id
            ? {
                ...comment,
                user_likes: updatedComment.user_likes,
              }
            : comment
        )
      );
    }
  };

  const setEditedSubComment = (editedSubComment: ISubComment) => {
    setComments((prevComments: Array<IComment>) =>
      prevComments.map((comment) =>
        comment._id === item._id
          ? {
              ...comment,
              subComments: comment?.subComments?.map((subComment) =>
                subComment._id === editedSubComment._id
                  ? editedSubComment
                  : subComment
              ),
            }
          : comment
      )
    );
  };

  return (
    <>
      <div key={item?._id} className="">
        {/* Alert */}
        {/* <ToastContainer /> */}

        <div className="flex flex-row gap-1">
          <div className="w-9">
            {typeof item?.user_id !== "string" && (
              <Avatar
                size={35}
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
          </div>

          <div className={`${editCommentId === item._id && "w-full"}`}>
            <div className="flex flex-row gap-1">
              {editCommentId === item._id ? (
                <EditCommentInput
                  className="w-full py-0 gap-0"
                  callback={(updatedComment) => {
                    editCommentFunct(updatedComment);
                    setEditCommentId(null); // Desactivar edición después de editar
                  }}
                  item={item}
                  cancel={() => {
                    setEditCommentId(null);
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
                  comments={comments ?? []}
                  setComments={setComments ?? Function}
                  setEditCommentId={setEditCommentId}
                  isEditing={editCommentId === item._id}
                  isSubComment={false}
                />
              )}
            </div>

            {session?._id && (
              <div className="flex pl-2 gap-2 mt-1 text-sm items-center">
                <span
                  onClick={likeComment}
                  className={`${active && "text-[#9b34b7]"} cursor-pointer`}
                >
                  Me gusta
                </span>
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    inputRef?.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                    toggleSubCommentActive(item?._id ?? "");
                  }}
                >
                  Comentar
                </span>

                {userLikesAmount > 0 && (
                  <PostButton
                    className={"h-5 w-5"}
                    classNameButton={"pb-1 cursor-auto"}
                    Icon={AiFillLike}
                    amount={userLikesAmount}
                    // callback={likeComment}
                    active={active}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="pl-10 mt-2 flex flex-col gap-1">
          {item?.subComments &&
            item.subComments.map((subComment: ISubComment, index) => (
              <SubComment
                key={index}
                item={subComment}
                callback={callback}
                comments={comments}
                setComments={setComments}
                editSubCommentId={editSubCommentId}
                setEditSubCommentId={setEditSubCommentId}
                editCommentFunct={setEditedSubComment}
              />
            ))}
        </div>

        <div ref={inputRef}>
          {subCommentActive === item?._id && (
            <SubCommentInput
              className="py-2"
              setSubCommentActive={() => {
                toggleSubCommentActive(item?._id ?? "");
              }}
              comment_id={item?._id ?? ""}
              callback={callback}
            />
          )}
        </div>
      </div>
    </>
  );
}
