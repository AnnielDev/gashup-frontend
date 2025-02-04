"use client";
import { Avatar } from "@/components/Avatar/Avatar";
import { useAuthProvider } from "@/context/AuthContext";
import { useAlert } from "@/hooks/useAlert";
import {
  useDeleteCommunity,
  useJoinCommunity,
  useLeaveCommunity,
} from "@/hooks/useCommunity";
import { IUser } from "@/types/user";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { IoIosSettings } from "react-icons/io";
import { useRouter } from "next/navigation";
import { BsChatSquareFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { Spinner } from "../Spinner/Spinner";
import AlertDialog from "../ConfirmationDialog";

interface props {
  id: string;
  members?: IUser[] | undefined;
  owner?: IUser;
  setIsMember: Function;
  isMember: boolean;
}

export default function CommunityControls({
  id,
  members,
  owner,
  setIsMember,
  isMember,
}: props) {
  const { session } = useAuthProvider();
  const [showAlert] = useAlert();
  const router = useRouter();
  // const [joined, setJoined] = useState<boolean>(false);

  const [loadingJoin, loadJoin] = useJoinCommunity(id, {
    memberID: session?._id,
  });

  const [loadingLeave, loadLeave] = useLeaveCommunity(id, {
    userID: session?._id,
  });

  const [loadingDelete, loadDelete] = useDeleteCommunity(id, {
    ownerID: session?._id,
  });
  const [openConfimationModal, setOpenConfirmationModal] =
    useState<boolean>(false);

  useEffect(() => {
    if (members) {
      const findUser = members.find((item) => item._id === session?._id);
      if (findUser) {
        setIsMember(true);
      } else {
        setIsMember(false);
      }
    }
  }, [members, session?._id]);

  const joinCommunity = async () => {
    const { response, error } = await loadJoin();

    if (response?.data.ok) {
      setIsMember(true);
      return showAlert("success", response?.data.mensaje);
    } else {
      return showAlert("warning", response?.data.mensaje);
    }
  };

  const leaveCommunity = async () => {
    const { response, error } = await loadLeave();

    if (response?.data.ok) {
      setIsMember(false);
      return showAlert("success", response?.data.mensaje);
    } else {
      return showAlert("warning", response?.data.mensaje);
    }
  };

  const handleJoinLeave = () => {
    if (isMember) {
      leaveCommunity();
    } else {
      joinCommunity();
    }
  };

  const deleteCommunity = async () => {
    const { response, error } = await loadDelete();

    if (response?.data.ok) {
      router.push("/communities");
      return showAlert("success", response?.data.mensaje);
    } else {
      return showAlert("warning", response?.data.mensaje);
    }
  };

  const openLogInModal = () => {
    return showAlert("warning", "Debes iniciar sesión para unirte");
  };

  // Limitar a los primeros tres miembros
  const firstThreeMembers = members?.slice(0, 3);
  const remainingMembersCount = (members?.length || 0) - 3;

  return (
    <>
      <Spinner loading={loadingDelete} message="Eliminando la comunidad" />
      <AlertDialog
        setOpen={setOpenConfirmationModal}
        open={openConfimationModal}
        titleText={"Eliminar comunidad"}
        confirmationText={"Estas seguro de eliminar esta comunidad?"}
        cancelButtonText={"Cancelar"}
        confirmButtonText={"Confirmar"}
        callback={deleteCommunity}
      />
      <div className="flex w-full mt-14 justify-between px-3 pb-2 items-center">
        <div className="flex flex-row items-center gap-3 ">
          <span>{members?.length ? members?.length : 0} Miembros</span>

          <div className="flex flex-row gap-1">
            {firstThreeMembers?.map((item: IUser, index) => (
              <Avatar key={index} name={item.name} size={35} image={item.img} />
            ))}
            {remainingMembersCount > 0 && (
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-black">
                +{remainingMembersCount}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-3">
          {isMember || session?._id === owner?._id ? (
            <Button
              variant="contained"
              color={"primary"}
              className="flex flex-row gap-2"
              onClick={() => router.push(`/chats/${id}`)}
            >
              {"CHATS"}

              <BsChatSquareFill className="w-5 h-5 fill-white" />
            </Button>
          ) : (
            ""
          )}

          {owner?._id != session?._id ? (
            <Button
              variant="contained"
              color={`${isMember ? "primary" : "secondary"}`}
              onClick={handleJoinLeave}
            >
              {isMember ? "Miembro" : "Unirse"}
            </Button>
          ) : (
            <div className="flex flex-row gap-2">
              <IoIosSettings
                onClick={() => {
                  router.push(`/edit-community/${id}`);
                }}
                className="fill-gray-500 cursor-pointer h-9 w-9 hover:fill-gray-600 transition-all"
              />

              <MdDelete onClick={() => setOpenConfirmationModal(true)} className="fill-red-500 cursor-pointer h-9 w-9 hover:fill-gray-600 transition-all" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
