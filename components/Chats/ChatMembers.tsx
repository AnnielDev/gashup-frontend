"use client";

import { Avatar } from "../Avatar/Avatar";
import { ICommunityChats } from "@/types/chats";
import { ChatMember } from "./ChatMember";
import { FaArrowLeftLong } from "react-icons/fa6";
interface Props {
  chat: ICommunityChats | null;
  clearChatMembers: () => void;
  goToProfileUser: (value: string) => void;
}
export function ChatMembers({
  chat,
  clearChatMembers,
  goToProfileUser,
}: Props) {
  const windowWidth = window.innerWidth;
  return (
    <div
      className="flex-grow w-[75%] pt-2 px-4"
      style={
        windowWidth <= 768 ? {} : { borderColor: "#999999", borderLeftWidth: 1 }
      }
    >
      {chat && (
        <>
          <div>
            <FaArrowLeftLong
              color="#2c3e50"
              onClick={clearChatMembers}
              fontSize={20}
              style={{ cursor: "pointer" }}
            />
          </div>
          <Avatar
            name={chat?.name}
            image={chat?.img}
            size={150}
            className="mx-auto"
          />
          <div className="flex flex-col items-center justify-center w-full">
            <span className="font-bold text-3xl text-[#2c3e50]">
              {chat?.name}
            </span>
            <span className=" text-[#2c3e50] text-md font-medium">
              {chat?.members_id?.length}
              {chat?.members_id && chat?.members_id?.length > 1
                ? " miembros"
                : " miembro"}
            </span>
          </div>
          <div
            className="flex flex-col w-full gap-2 overflow-auto"
            style={{ height: "calc(100vh - 298px)", overflowY: "auto" }}
          >
            {chat?.members_id?.map((member, index) => {
              if (typeof member === "string") {
                return null;
              }
              return (
                <ChatMember
                  key={index}
                  member={member}
                  onClick={goToProfileUser}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
