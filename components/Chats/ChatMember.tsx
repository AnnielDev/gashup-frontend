import { IUser } from "@/types/user";
import { Avatar } from "../Avatar/Avatar";
import { FaArrowRightLong } from "react-icons/fa6";
interface Props {
  member: IUser;
  onClick: (value: string) => void;
}
export function ChatMember({ member, onClick }: Props) {


  return (
    <div
      className="flex flex-row items-center justify-between pb-2 mb-1 mr-1 cursor-pointer"
      onClick={() => onClick(member._id ?? "")}
      style={{ borderBottomWidth: 1, borderColor: "#999999" }}
    >

      <div className="flex flex-row items-center gap-2 ">
        <Avatar image={member?.img} size={40} name={member.name} />
        <div className="flex flex-col">
          <span className="text-md font-semibold text-[#2c3e50]">
            {member.name}
          </span>
          <span className="text-sm font-light">
            {member.followed ? member.followed[0] : 0} siguiendo {member.followers} seguidores
          </span>
        </div>
      </div>
      <FaArrowRightLong color="#2c3e50" />
    </div>
  );
}
