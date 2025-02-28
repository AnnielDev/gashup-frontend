"use client";

import { useState, useEffect, useMemo } from "react";
import { redirect, useRouter } from "next/navigation";
// SESSION
import { useAuthProvider } from "@/context/AuthContext";
// HOOKS
import {
  useGetCommunityChats,
  useGetChats,
  useGetChatMembers,
} from "@/hooks/useChats";
// TYPES
import { IDataResponse } from "@/types/response";
import { ICommunityChats } from "@/types/chats";
// COMPONENTS
import { CommunityChats } from "@/components/Chats/CommunityChats";
import { Chat } from "@/components/Chats/Chat";
import { ToastContainer } from "react-toastify";
import { Spinner } from "@/components/Spinner/Spinner";
import { ChatMembers } from "@/components/Chats/ChatMembers";
// STYLES
import "@/styles/chats/chats.css";

export default function Chats() {
  const { session } = useAuthProvider();
  const router = useRouter();
  const [members, setMembers] = useState<ICommunityChats | null>(null);
  const [data, setData] = useState<IDataResponse | null>(null);
  const [search, setSearch] = useState<string>("");
  const [showMembers, setShowMembers] = useState<boolean>(false);
  const windowWidth = window.innerWidth;
  const chatsRef = document.querySelector(
    ".chats-container"
  ) as HTMLElement | null;
  const chatRef = document.querySelector(
    ".messages-container"
  ) as HTMLElement | null;

  const [selectedChat, setSelectedChat] = useState<ICommunityChats | null>(
    null
  );
  const [loading, load] = useGetCommunityChats(session?._id ?? "");
  const [, loadMembers] = useGetChatMembers(selectedChat?._id ?? "");
  const [messages, loadMessages, loadingMessages] = useGetChats(
    selectedChat?.community_id ?? "",
    selectedChat?._id ?? ""
  );

  async function getCommunityChats() {
    const { response } = await load();
    if (response) {
      setData(response.data);
    }
  }
  async function getChatMembers() {
    const { response } = await loadMembers();
    if (response) {
      setMembers(response.data.data);
    }
  }
  function goToProfileUser(id: string) {
    if (id === session?._id) {
      router.push(`/profile/posts`);
    } else {
      router.push(`/user/${id}`);
    }
  }
  const onSetSearch = (value: string) => {
    setSearch(value);
  };
  const clearSelectedChat = () => {
    setSelectedChat(null);
    if (chatRef) chatRef.style.display = "none";
    if (chatsRef) chatsRef.style.display = "block";
  };
  const setChat = (selectedChat: ICommunityChats) => {
    if (windowWidth >= 768) {
      setSelectedChat(selectedChat);
    } else {
      setSelectedChat(selectedChat);
      if (chatRef) chatRef.style.display = "flex";
      if (chatsRef) chatsRef.style.display = "none";
    }
  };

  const onSetShowMembers = () => {
    setShowMembers(!showMembers);
  };
  const clearChatMembers = () => {
    setMembers(null);
    setShowMembers(false);
  };
  const filterChats = useMemo(() => {
    if (search) {
      return data?.data.filter((item: ICommunityChats) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      return data?.data;
    }
  }, [search, data?.data]);

  useEffect(() => {
    if (showMembers) {
      getChatMembers();
    }
  }, [showMembers]);

  useEffect(() => {
    if (!session) {
      setData(null);
      setSelectedChat(null);
      redirect("/");
    } else {
      getCommunityChats();
    }
  }, [session]);

  useEffect(() => {
    if (selectedChat) {
      if (members) clearChatMembers();
      loadMessages();
    }
  }, [selectedChat]);

  return (
    <div className="flex flex-row" style={{ height: "calc(100vh - 60px)" }}>
      <CommunityChats
        onSetSearch={onSetSearch}
        communityChats={filterChats}
        setChat={setChat}
        search={search}
        selectedChat={selectedChat}
      />
      {showMembers ? (
        <ChatMembers
          chat={members}
          clearChatMembers={clearChatMembers}
          goToProfileUser={goToProfileUser}
        />
      ) : (
        <Chat
          currentChat={selectedChat}
          messages={messages}
          userID={session?._id ?? ""}
          clearCurrentChat={clearSelectedChat}
          onSetShowMembers={onSetShowMembers}
        />
      )}
      {/* Spinner */}
      <Spinner loading={loadingMessages || loading} message="cargando" />
      {/* Alert */}
      <ToastContainer />
    </div>
  );
}
