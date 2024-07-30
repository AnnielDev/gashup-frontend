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
import { ToastContainer } from "react-toastify";
import { IUser } from "@/types/user";
import SettingsComment from "./SettingsComment";

interface props {
  item: IComment;
  subCommentActive: string | null;
  toggleSubCommentActive: Function;
  callback: (item: ISubComment) => void;
  comments: Array<IComment>;
  setComments: Function;
}

export default function Comment({
  item,
  subCommentActive,
  toggleSubCommentActive,
  callback,
  comments,
  setComments,
}: props) {
  const { session } = useAuthProvider();
  const router = useRouter();
  const [showAlert] = useAlert();
  const inputRef = useRef<HTMLDivElement>(null);

  const [loading, load] = useLikeComment(item?._id ?? "", session?._id ?? "");
  const [active, setActive] = useState(false);
  const [userLikesAmount, setUserLikesAmount] = useState<number>(
    item?.user_likes?.length as number
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

  const goToPerfil = (id: string) => {
    if (id === session?._id) {
      router.push(`/profile/posts`);
    } else {
      router.push(`/user/${id}`);
    }
  };

  const likePost = async () => {
    if (!session?._id) {
      return showAlert("warning", "Debes iniciar sessión");
    }

    const { response, error } = await load();

    if (response?.data.ok) {
      if (response.data.data) {
        setUserLikesAmount(userLikesAmount + 1);
        setActive(true);
      } else {
        setUserLikesAmount(userLikesAmount - 1);
        setActive(false);
      }
    }
  };

  return (
    <>
      <div key={item?._id} className="">
        {/* Alert */}
        <ToastContainer />

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

          <div>
            <div className="flex flex-row gap-1">
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
              <SettingsComment
                id={item._id ?? ""}
                comments={comments ?? []}
                setComments={setComments ?? Function}
              />
            </div>

            {session?._id && (
              <div className="flex pl-2 gap-2 mt-1 text-sm items-center">
                <span
                  onClick={likePost}
                  className={`${active && "text-[#9b34b7]"} cursor-pointer`}
                >
                  Me gusta
                </span>
                <span
                  className="cursor-pointer"
                  onClick={() => {
inputRef?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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
                    // callback={likePost}
                    active={active}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="pl-10 mt-2 flex flex-col gap-3">
          {item?.subComments &&
            item.subComments.map((item: ISubComment, index) => (
              <SubComment item={item} />
            ))}
        </div>

        <div ref={inputRef}>
          {subCommentActive === item?._id && (
            <SubCommentInput
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
