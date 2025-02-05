// TYPES
import { IUser } from "@/types/user";
// COMPONENTS
import { Avatar } from "../Avatar/Avatar";
import { Button } from "@mui/material";
interface Props {
  followed: IUser;
  onClick: (value: string) => void;
}
export function Card({ followed, onClick }: Props) {
  return (
    <div
      className="p-2"
      style={{ borderWidth: 2, borderRadius: 10, borderColor: "#9b26b6" }}
    >
      <div className="flex flex-row items-center gap-2">
        <Avatar size={50} image={followed.img} name={followed.name} />
        <div className="flex flex-col">
          <span className="font-semibold text-[#2c3e50] text-lg">
            {followed.name}
          </span>
          <div className="flex flex-row items-center gap-1">
            <div>
              <span className="font-semibold">{followed.followed ? followed.followed.length : 0}</span>
              <span className="font-normal"> siguiendo</span>
            </div>
            <div className="flex flex-row items-center gap-1">
              <span className="font-semibold">
                {followed?.followers ? followed.followers.length : 0}
              </span>
              <span className="font-normal">
                {followed?.followers && followed?.followers.length > 1
                  ? " seguidores"
                  : " seguidor"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <Button
          style={{
            backgroundColor: "#9b26b6",
            width: "100%",
            color: "#fff",
          }}
          onClick={() => onClick(followed._id ?? "")}
        >
          Ver perfil
        </Button>
      </div>
    </div>
  );
}
