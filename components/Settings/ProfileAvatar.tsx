"use client";

import { useState, useEffect, ChangeEvent, MouseEvent } from "react";

// ICONS
import { FaRegTrashAlt } from "react-icons/fa";

// STYLES
import "@/styles/settings/account.css";

interface Props {
  photo?: string | Blob | null | undefined;
  onSetImage: (image: string | Blob | null | undefined) => void;
  onDeleteImage: () => void;
}

export function ProfileAvatar({ photo, onSetImage, onDeleteImage }: Props) {
  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        onSetImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = (e: MouseEvent) => {
    e.stopPropagation();
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.click();
    }
  };

  useEffect(() => {
    if (photo) {
      if (typeof photo === "string") {
        setImage(photo);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result as string);
        };
        reader.readAsDataURL(photo);
      }
    }
  }, [photo]);

  return (
    <div
      className="w-52 h-52 cursor-pointer avatar mx-auto my-4 bg-[#d3d3d3] border-4 border-[#2c3e50] rounded-full bg-cover bg-center relative"
      onClick={triggerFileInput}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="avatar-icon__container rounded-full">
        <FaRegTrashAlt
          size={40}
          color="#fff"
          className="absolute"
          style={{ top: "40%", left: "40%" }}
          onClick={(e) => {
            e.stopPropagation();
            onDeleteImage();
          }}
        />
      </div>
      <input
        id="file-input"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
    </div>
  );
}
