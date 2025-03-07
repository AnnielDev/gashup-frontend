import { useState, useEffect } from "react";
import { IResponse, IError } from "@/types/response";
import {
  getCommunityChats,
  postMessage,
  joinChat,
  leaveChat,
  getChatById,
  deleteMessage,
  getChatMembers,
} from "@/services/Chats";
import { getChat } from "@/utils/chat";

import { database } from "@/utils/config";
import { ref, onValue } from "firebase/database";
// TYPES
import { IChat, IPostMessage } from "@/types/chats";

type UseChatsType = [
  boolean,
  () => Promise<{
    response: IResponse | null;
    error: IError | null;
  }>
];

export const useGetCommunityChats = (id: string): UseChatsType => {
  const [loading, setLoading] = useState<boolean>(false);

  async function load(): Promise<{
    response: IResponse | null;
    error: IError | null;
  }> {
    try {
      setLoading(true);
      const data = await getCommunityChats(id);
      return { response: data, error: null };
    } catch (error: any) {
      return { response: null, error: error };
    } finally {
      setLoading(false);
    }
  }

  return [
    //states
    loading,
    //methods
    load,
  ];
};

export const useGetChatMembers = (id: string): UseChatsType => {
  const [loadingMembers, setLoadingMembers] = useState<boolean>(false);

  async function loadMembers(): Promise<{
    response: IResponse | null;
    error: IError | null;
  }> {
    try {
      setLoadingMembers(true);
      const data = await getChatMembers(id);
      return { response: data, error: null };
    } catch (error: any) {
      return { response: null, error: error };
    } finally {
      setLoadingMembers(false);
    }
  }

  return [
    //states
    loadingMembers,
    //methods
    loadMembers,
  ];
};

export const useGetChats = (
  communityId: string,
  chatId: string
): [messages: IChat[] | null, () => void, boolean] => {
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<IChat[] | null>(null);

  useEffect(() => {
    if (!communityId || !chatId) return;

    const dbRef = ref(database, `${communityId}/${chatId}`);

    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const newMessages: IChat[] = Object.keys(data).map((key) => ({
          id: key,
          userID: data[key].userID,
          username: data[key].username,
          img: data[key].img,
          message: data[key].message,
          publicationDate: data[key].publicationDate,
        }));
        setMessages(newMessages);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [communityId, chatId]);

  async function load() {
    setLoading(true);
    try {
      const data = await getChat(communityId, chatId);
      setMessages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return [messages, load, loading];
};

export const usePostMessage = (
  body: IPostMessage,
  communityId: string,
  chatId: string
): UseChatsType => {
  const [loading, setLoading] = useState<boolean>(false);

  async function load(): Promise<{
    response: IResponse | null;
    error: IError | null;
  }> {
    try {
      setLoading(true);
      const data = await postMessage(body, communityId, chatId);

      return { response: data, error: null };
    } catch (error: any) {
      return { response: null, error: error };
    } finally {
      setLoading(false);
    }
  }
  return [
    //states
    loading,
    //methods
    load,
  ];
};
// body
// {
//   "chatID": "",
//   "userID": ""
// }
export const useJoinChat = (body: any, communityId: string): UseChatsType => {
  const [loading, setLoading] = useState<boolean>(false);

  async function load(): Promise<{
    response: IResponse | null;
    error: IError | null;
  }> {
    try {
      setLoading(true);
      const data = await joinChat(body, communityId);
      return { response: data, error: null };
    } catch (error: any) {
      return { response: null, error: error };
    } finally {
      setLoading(false);
    }
  }
  return [
    //states
    loading,
    //methods
    load,
  ];
};

// body
// {
//   "userID": ""
// }
export const useLeaveChat = (body: any, chatId: string): UseChatsType => {
  const [loading, setLoading] = useState<boolean>(false);

  async function load(): Promise<{
    response: IResponse | null;
    error: IError | null;
  }> {
    try {
      setLoading(true);
      const data = await leaveChat(body, chatId);
      return { response: data, error: null };
    } catch (error: any) {
      return { response: null, error: error };
    } finally {
      setLoading(false);
    }
  }
  return [
    //states
    loading,
    //methods
    load,
  ];
};

export const useGetChatById = (id: string): UseChatsType => {
  const [loading, setLoading] = useState<boolean>(false);

  async function load(): Promise<{
    response: IResponse | null;
    error: IError | null;
  }> {
    try {
      setLoading(true);
      const data = await getChatById(id);
      return { response: data, error: null };
    } catch (error: any) {
      return { response: null, error: error };
    } finally {
      setLoading(false);
    }
  }
  return [
    //states
    loading,
    //methods
    load,
  ];
};

type UseDeleteMessageType = [
  boolean,
  (
    communityID: string,
    chatID: string,
    messageID: string
  ) => Promise<{
    response: IResponse | null;
    error: IError | null;
  }>
];
export const useDeleteMessage = (): UseDeleteMessageType => {
  const [loading, setLoading] = useState<boolean>(false);

  async function load(
    communityID: string,
    chatID: string,
    messageID: string
  ): Promise<{
    response: IResponse | null;
    error: IError | null;
  }> {
    try {
      setLoading(true);
      const data = await deleteMessage(communityID, chatID, messageID);
      return { response: data, error: null };
    } catch (error: any) {
      return { response: null, error: error };
    } finally {
      setLoading(false);
    }
  }
  return [
    //states
    loading,
    //methods
    load,
  ];
};
