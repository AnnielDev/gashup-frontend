"use client";
import { useAuthProvider } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useGetCommentsByPost, useGetPostById } from "@/hooks/usePost";
import { IPost, ISubComment } from "@/types/post";
import Post from "@/components/Post/Post";
import CommentInput from "@/components/Comments/CommentInput";
import { IComment } from "@/types/post";
import { useRouter } from "next/navigation";
import Comment from "@/components/Comments/Comment";
import { Spinner } from "@/components/Spinner/Spinner";
import CommunityDescription from "@/components/Community/CommunityDescription";
import { IUser } from "@/types/user";
import { ICommunity } from "@/types/community";
import { ToastContainer } from "react-toastify";
export default function PostPage({ params }: { params: { id: string } }) {
  const { session } = useAuthProvider();
  const [post, setPost] = useState<IPost | null>(null);
  const [comments, setComments] = useState<Array<IComment>>([]);
  const [subComments, setSubComments] = useState<Array<ISubComment>>([]);
  const [loading, load] = useGetPostById(params.id);
  const [loadingComments, loadComments] = useGetCommentsByPost(params.id);
  const [subCommentActive, setSubCommentActive] = useState<string | null>(null);
  const [community, setCommunity] = useState<ICommunity>();
  const [editCommentId, setEditCommentId] = useState<string | null>(null);

  const getPost = async () => {
    const { response, error } = await load();
    if (response?.data.ok) {
      setPost(response.data.data);
      setCommunity(response.data.data.community);
    } else {
      setPost(null);
    }
  };

  const getCommentsByPost = async () => {
    const { response, error } = await loadComments();
    if (response?.data.ok) {
      setComments(response.data.data);
    } else {
      setComments([]);
    }
  };

  const addNewComment = (item: IComment) => {
    setComments((prev) => [item, ...prev]);
  };

  const addNewSubComment = (item: ISubComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === item.comment_id
          ? {
              ...comment,
              subComments: comment.subComments
                ? [...comment.subComments, item]
                : [item],
            }
          : comment
      )
    );
    setSubCommentActive(null);
  };

  const setEditedComment = (editedComment: IComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === editedComment._id ? editedComment : comment
      )
    );
  };

  useEffect(() => {
    getPost();
    getCommentsByPost();
    window.scrollTo(0, 0);
  }, []);

  const toggleSubCommentActive = (commentId: string) => {
    setSubCommentActive((prev) => (prev === commentId ? null : commentId));
  };

  return (
    <div className="w-full flex flex-row gap-2 min-h-screen">
      <Spinner loading={loading} message="cargando" />
      <div className="w-full md:w-[70%]">
        {post ? <Post commentsAmount={comments.length} data={post} /> : null}

        {session && (
          <CommentInput post_id={params.id} callback={addNewComment} />
        )}

        <div className="flex flex-col gap-3 mt-3">
          {comments.length > 0 ? (
            comments.map((item, index) => (
              <Comment
                key={index}
                item={item}
                comments={comments}
                setComments={setComments}
                subCommentActive={subCommentActive}
                toggleSubCommentActive={toggleSubCommentActive}
                callback={addNewSubComment}
                editCommentId={editCommentId}
                setEditCommentId={setEditCommentId}
                editCommentFunct={setEditedComment}
              />
            ))
          ) : (
            <p>No hay comentarios</p>
          )}
        </div>
      </div>
      <div className="hidden md:flex flex-col gap-2 w-[30%] border-l-1 border-black">
        <div className="flex flex-col gap-2 sticky top-12 overflow-y-scroll">
          <CommunityDescription
            name={community?.name}
            description={community?.description}
            owner={community?.owner_id as IUser}
            admins={community?.admins_id as IUser[]}
            members={community?.members_id as IUser[]}
            rank={community?.rank ?? 0}
          />
        </div>
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
}
