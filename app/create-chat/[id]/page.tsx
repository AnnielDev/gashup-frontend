"use client";

import { useCreateCommunityChat } from "@/hooks/useCommunity";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ICommunityChats } from "@/types/chats";
import { Spinner } from "@/components/Spinner/Spinner";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  TextField,
  Theme,
  useTheme,
} from "@mui/material";
import { useAuthProvider } from "@/context/AuthContext";
import { useAlert } from "@/hooks/useAlert";
import { useRouter, redirect } from "next/navigation";
import CreateCommunityDescription from "@/components/Community/CreateCommunityDescription";
import { MdPhotoLibrary } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Visibility } from "@mui/icons-material";
import { ImagePreview } from "@/components/SignUp/ImagePreview";
import { ToastContainer } from "react-toastify";
import AlertDialog from "@/components/ConfirmationDialog";
import { ref } from 'firebase/database';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function CreateCommunityChat({
  params,
}: {
  params: { id: string };
}) {
  const { session } = useAuthProvider();
  const [showAlert] = useAlert();
  const router = useRouter();

  const chat: ICommunityChats = {
    name: "",
    chatOwner_id: session?._id as string,
    img: "",
    community_id: params.id,
  };

  const [chatData, setChatData] = useState<ICommunityChats>(chat);
  const [modal, setModal] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [loadingCreate, loadCreate] = useCreateCommunityChat(chatData);
  const [openConfimationModal, setOpenConfirmationModal] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session === null) return; // Esperar a que session tenga un valor válido

    if (!session?._id) {
      router.back();
    }
  }, [session]);

  const clearData = () => {
    setChatData(chatData);
  };

  const onSubmit = async () => {
    // e.preventDefault();

    if (!chatData.img) {
      return showAlert("warning", "Debe agregar una imagen.");
    }

    const { response, error } = await loadCreate();
    if (error) {
      return showAlert(
        "error",
        error && error.response
          ? error.response.data.message
          : "El servidor puede estar experimentando problemas."
      );
    }

    if (response?.data.ok) {
      router.push(`/chats/${params.id}`);
      clearData();
      setOpenConfirmationModal(false);
      return showAlert("success", response?.data.mensaje);
    } else {
      return showAlert("warning", response?.data.mensaje);
    }
  };

  const theme = useTheme();

  function getStyles(
    name: string,
    selectedCategories: readonly string[],
    theme: Theme
  ) {
    return {
      fontWeight:
        selectedCategories.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(file.name);
        setChatData((prev) => ({ ...prev, img: file as File }));
      };
      reader.readAsDataURL(file);
    }
  };

  const onDeleteImage = () => {
    setImagePreview("");
    setChatData((prev) => ({ ...prev, img: "" }));
    if (fileInput.current) {
      fileInput.current.value = "";
    }
  };

  const onOpen = (type: number): void => {
    if (type) {
      setModal(true);
    }
  };
  const onClose = (): void => {
    setModal(false);
  };

  const onCancel = () => {
    router.push(`/chats/${params.id}`);
  };

  return (
    <>
      {session?._id && (
        <div className="w-full h-full flex flex-row ">
          {/* Alert */}
          <ToastContainer />
          <Spinner loading={loadingCreate} message="creando" />
          <ImagePreview
            modal={modal}
            onClose={onClose}
            image={modal ? chatData.img : ""}
          />

          <AlertDialog
            setOpen={setOpenConfirmationModal}
            open={openConfimationModal}
            titleText={"Crear chat"}
            confirmationText={"Estas seguro de crear este chat?"}
            cancelButtonText={"Cancelar"}
            confirmButtonText={"Confirmar"}
            callback={onSubmit}
          />
          <div className="w-full md:w-[70%] p-1">
            <div className="flex flex-row justify-between items-center mt-2 mb-5">
              <h1 className="font-bold text-3xl text-[#2c3e76]">Crear Chat</h1>
              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={onCancel}
                >
                  Cancelar
                </Button>
              </div>
            </div>
            <div className="bg-[#ece6f0] p-4 rounded-md">
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setOpenConfirmationModal(true);
                }}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      // name="firstName"
                      required
                      fullWidth
                      // id="firstName"
                      label="Nombre del chat"
                      autoFocus
                      value={chatData.name}
                      onChange={(e) =>
                        setChatData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </Grid>

                  {/* <Grid item xs={12}>
                    <TextField
                      id="outlined-multiline-static"
                      label="Descripción"
                      multiline
                      fullWidth
                      required
                      rows={4}
                      variant="outlined"
                      value={communityData.description}
                      onChange={(e) =>
                        setChatData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </Grid> */}
                  <Grid item xs={12} sm={6}>
                    <input
                      ref={fileInput}
                      id="file-input-image"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                    <FormControl fullWidth>
                      <TextField
                        id="image-upload"
                        label="Imagen"
                        disabled
                        fullWidth
                        placeholder="Imagen"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MdPhotoLibrary
                                className="cursor-pointer"
                                onClick={() =>
                                  fileInput.current?.click()
                                }
                              />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <RiDeleteBin6Fill
                                fontSize={20}
                                className="cursor-pointer mr-2"
                                style={{
                                  display: chatData.img ? "" : "none",
                                }}
                                onClick={onDeleteImage}
                              />
                              <Visibility
                                className="cursor-pointer"
                                onClick={() => onOpen(1)}
                              />
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        className="w-full"
                        value={imagePreview}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  color="customBlack"
                  sx={{ mt: 3, mb: 2 }}
                >
                  CREAR
                </Button>
              </Box>
            </div>
          </div>

          <div className="hidden md:flex flex-col gap-2 w-[30%] h-full border-l-1 border-black">
            <div className="flex flex-col gap-2 sticky top-12 h-full">
              <CreateCommunityDescription />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
