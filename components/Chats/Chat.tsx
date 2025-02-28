"use client";

import { useState, useRef, useEffect } from "react";
import moment from "moment";
// ICONS
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { IoSend } from "react-icons/io5";
// COMPONENTS
import { Avatar } from "../Avatar/Avatar";
import { Message } from "./Message";
import AlertDialog from "@/components/ConfirmationDialog";
// TYPES
import { ICommunityChats, IChat } from "@/types/chats";
// HOOKS
import { usePostMessage, useDeleteMessage } from "@/hooks/useChats";
import { useAlert } from "@/hooks/useAlert";

interface Props {
  currentChat: ICommunityChats | null;
  messages: IChat[] | null;
  userID: string;
  clearCurrentChat: () => void;
  onSetShowMembers: () => void;
}

interface MessageGroupedByDate {
  date: string;
  messages: IChat[];
}

export function Chat({
  currentChat,
  messages,
  userID,
  clearCurrentChat,
  onSetShowMembers,
}: Props) {
  const [message, setMessage] = useState<string>("");
  const [showAlert] = useAlert();
  const [loadingDelete, loadDelete] = useDeleteMessage();
  const [modal, setModal] = useState<boolean>(false);
  const [messageId, setMessageId] = useState<string>("");
  const [loading, load] = usePostMessage(
    { message, userID },
    currentChat?.community_id ?? "",
    currentChat?._id ?? ""
  );
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const windowWidth = window.innerWidth;
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSetMessage = (message: string) => {
    setMessage(message);
  };
  const onDeleteMessage = async () => {
    try {
      await loadDelete(
        currentChat?.community_id ?? "",
        currentChat?._id ?? "",
        messageId
      );
    } catch (error) {
      console.error(error);
    } finally {
      showAlert("success", "Mensaje eliminado");
      setModal(false);
    }
  };
  const sendMessage = async () => {
    if (message) {
      const { response, error } = await load();
      if (error) {
        showAlert("error", error.response.data.mensaje);
      } else {
        setMessage("");
      }
    } else {
      showAlert("warning", "Debes escribir un mensaje");
    }
  };

  const onPressEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const groupedMessages = messages?.reduce<MessageGroupedByDate[]>(
    (acc, message) => {
      const date = moment(message.publicationDate).format("YYYY-MM-DD");
      const existingGroup = acc.find((group) => group.date === date);
      if (existingGroup) {
        existingGroup.messages.push(message);
      } else {
        acc.push({ date, messages: [message] });
      }
      return acc;
    },
    [] as MessageGroupedByDate[]
  );
  const onDelete = (message: IChat) => {
    if (message.userID === userID) {
      setModal(!modal);
      setMessageId(message.id);
    }
  };
  return currentChat ? (
    <div
      className="flex flex-col w-[75%] max-md:w-[100%]  messages-container"
      style={
        windowWidth <= 768
          ? { display: "flex" }
          : { borderColor: "#999999", borderLeftWidth: 1 }
      }
    >
      <AlertDialog
        setOpen={setModal}
        open={modal}
        titleText={"Eliminar mensaje"}
        confirmationText={"Estas seguro de eliminar este mensaje?"}
        cancelButtonText={"Cancelar"}
        confirmButtonText={"Confirmar"}
        callback={onDeleteMessage}
      />
      {/* Community Name */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          borderColor: "#999999",
          borderBottomWidth: 1,
        }}
      >
        <div className="flex flex-row items-center gap-3">
          {windowWidth <= 768 && (
            <div>
              <MdOutlineKeyboardBackspace
                onClick={clearCurrentChat}
                color="#2c3e50"
                size={20}
                style={{ cursor: "pointer" }}
              />
            </div>
          )}
          <Avatar
            size={50}
            name={currentChat?.name ?? ""}
            image={currentChat?.img ? currentChat.img : ""}
            onClick={onSetShowMembers}
            pointer
          />
          <span className="font-bold text-xl text-[#2c3e50]">
            {currentChat?.name}
          </span>
        </div>
      </div>
      {/* Chats */}
      <div className="flex-grow px-4 messages">
        {groupedMessages?.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h3 className="font-semibold text-center my-4 text-md text-[#2c3e50]">
              <span className="bg-[#e5e7eb] p-1 rounded-md">
                {moment(group.date).format("DD/MM/YYYY")}
              </span>
            </h3>
            {group.messages.map((msg, index) => (
              <Message
                key={index}
                message={msg}
                userID={userID}
                onDelete={onDelete}
              />
            ))}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      {/* Input */}

      <div className="px-4 mb-2">
        <div className="relative">
          <input
            placeholder="Ingrese su mensaje"
            className="bg-transparent py-2 pl-4 w-full rounded-md outline-none"
            style={{ borderColor: "#999999", borderWidth: 1 }}
            onInput={(e) => onSetMessage((e.target as HTMLInputElement).value)}
            onKeyUp={onPressEnterKey}
            value={message}
          />
          <IoSend
            onClick={sendMessage}
            className="absolute right-2 top-3 cursor-pointer"
            color="#9b26b6"
          />
        </div>
      </div>
    </div>
  ) : (
    <div
      className="flex flex-grow items-center justify-center w-[75%] messages-container"
      style={{ borderColor: "#999999", borderLeftWidth: 1 }}
    >
      <span className="font-semibold text-3xl text-[#2c3e50]">
        Selecciona un chat
      </span>
    </div>
  );
}
