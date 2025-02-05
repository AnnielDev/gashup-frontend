import { Avatar } from "../Avatar/Avatar";
import { FaUserGroup } from "react-icons/fa6";
import { BsFillPersonFill } from "react-icons/bs";
interface Props {
  image: string;
  name: string;
  members: number;
  isSelected: boolean;
  onClick: () => void;
}
export function CommunityItem(props: Props) {
  return (
    <div
      onClick={props.onClick}
      className="flex items-center gap-2 justify-between rounded-md hover:bg-[#e5e7eb] cursor-pointer p-2 mr-1"
      style={{ backgroundColor: props.isSelected ? "#e5e7eb" : "" }}
    >
      <div className="flex flex-row items-center gap-4">
        <Avatar name={props.name} image={props.image} size={40} pointer />
        <div>
          <div>
            <span className="font-semibold text-md text-[#2c3e50]">
              {props.name}
            </span>
          </div>
          <div>
            <span className="flex items-center gap-2">
              {props.members > 1 ? (
                <FaUserGroup size={14} color="#2c3e50" />
              ) : (
                <BsFillPersonFill size={14} color="#2c3e50" />
              )}
              <span className="font-medium text-sm text-[#2c3e50]">
                {props.members} {props.members > 1 ? "miembros" : "miembro"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
