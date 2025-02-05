import { useState } from "react";
import {
  updateUser,
  getUserById,
  followUser,
  unfollowUser,
  getFollowedUsers,
} from "@/services/User";
import { useAuthProvider } from "@/context/AuthContext";
import { IResponse, IError } from "@/types/response";
import { IUser } from "@/types/user";

type UseUserType = [
  boolean,
  () => Promise<{
    response: IResponse | null;
    error: IError | null;
  }>
];

export const useUpdateUser = (id: string, body: IUser): UseUserType => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setSessionState } = useAuthProvider();
  const formData = new FormData();
  formData.append("code", body.code ?? "");
  formData.append("email", body.email);
  formData.append("name", body.name);
  formData.append("phone", body.phone);
  if (body.password) formData.append("password", body.password ?? "");
  if (body.img) {
    formData.append("img", body.img);
  } else {
    formData.append("img", '');
  }
  if (body.banner) {
    formData.append("banner", body.banner);
  }
  async function load(): Promise<{
    response: IResponse | null;
    error: IError | null;
  }> {
    try {
      setLoading(true);
      const data = await updateUser(id, formData);
      setSessionState(data.data.update);
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

export const useUserById = (id: string): UseUserType => {
  const [loading, setLoading] = useState<boolean>(false);

  async function load(): Promise<{
    response: IResponse | null;
    error: IError | null;
  }> {
    try {
      setLoading(true);
      const data = await getUserById(id);
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

type UseFollowUserType = [
  boolean,
  (body: { userToFollow: string }) => Promise<{
    response: IResponse | null;
    error: IError | null;
  }>
];

export const useFollowUser = (id: string): UseFollowUserType => {
  const [loading, setLoading] = useState<boolean>(false);

  async function load(body: { userToFollow: string }): Promise<{
    response: IResponse | null;
    error: IError | null;
  }> {
    try {
      setLoading(true);
      const data = await followUser(body, id);
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
type UseUnFollowUserType = [
  boolean,
  (body: { userToUnFollow: string }) => Promise<{
    response: IResponse | null;
    error: IError | null;
  }>
];

export const useUnFollowUser = (id: string): UseUnFollowUserType => {
  const [loading, setLoading] = useState<boolean>(false);

  async function load(body: { userToUnFollow: string }): Promise<{
    response: IResponse | null;
    error: IError | null;
  }> {
    try {
      setLoading(true);
      const data = await unfollowUser(body, id);
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

export const useGetFollowed = (id: string): UseUserType => {
  const [loading, setLoading] = useState<boolean>(false);

  async function load(): Promise<{
    response: IResponse | null;
    error: IError | null;
  }> {
    try {
      setLoading(true);
      const data = await getFollowedUsers(id);
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
