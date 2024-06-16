import Image from "next/image";
import Modal from "@mui/material/Modal";
import { IoCloseOutline } from "react-icons/io5";

import "@/styles/signup/image-preview.css";

interface Props {
  modal: boolean;
  onClose: () => void;
  image: string | undefined;
}

export function ImagePreview({ modal, onClose, image }: Props) {
  return (
    <Modal
      open={modal}
      onClose={onClose}
      className="flex flex-col items-center justify-center"
    >
      <div
        className="flex flex-col w-2/6 max-md:w-11/12 outline-none items-center justify-center bg-white h-full p-4 rounded-md"
        style={{ height: "350px" }}
      >
        <div className="flex items-center justify-between w-full mb-2">
          <span className="font-semibold text-xl primary">Preview</span>
          <span onClick={onClose} className="cursor-pointer">
            <IoCloseOutline
              fontSize={25}
              onClick={onClose}
              className="icon cursor-pointer rounded-full"
            />
          </span>
        </div>

        <div className="flex flex-grow w-full items-center justify-center">
          {image ? (
            <Image
              src={image} 
              alt="Preview Image"
              className="w-full"
              width={250}
              height={250}
            />
          ) : (
            <span className="text-xl font-semibold">Select an image</span>
          )}
        </div>
      </div>
    </Modal>
  );
}
