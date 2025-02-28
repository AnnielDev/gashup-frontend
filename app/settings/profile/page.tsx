"use client";
import { useState, ChangeEvent, MouseEvent as ReactMouseEvent } from "react";
import { ProfileItem } from "@/components/Settings/ProfileItem";
import { BannerPreview } from "@/components/Settings/BannerPreview";
import { ToastContainer } from "react-toastify";
export default function Profile() {
  const options = [
    {
      name: "Banner",
      description: "Aquí puedes agregar el banner de tu perfil.",
      showIcon: true,
    },
  ];
  const [image, setImage] = useState<File | null>(null);
  const [modal, setModal] = useState<boolean>(false);
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = (e: ReactMouseEvent) => {
    e.stopPropagation();
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.click();
    }
  };

  const onOpenModan = (e: ReactMouseEvent) => {
    e.stopPropagation();
    setModal(true);
  };
  const onCloseModal = () => {
    setModal(false);
  };
  return (
    <>
      <input
        id="file-input"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
      {options.map((item, index) => {
        return (
          <ProfileItem
            onClick={triggerFileInput}
            key={index}
            name={item.name}
            description={item.description}
            showIcon={item.showIcon}
            onClickIcon={onOpenModan}
          />
        );
      })}
      <BannerPreview image={image} modal={modal} onClose={onCloseModal} />
      {/* Alert */}
      <ToastContainer />
    </>
  );
}
