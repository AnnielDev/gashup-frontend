"use client";

import {
  useCreateCommunity,
  useGetCategories,
  useGetCommunities,
} from "@/hooks/useCommunity";
import { ChangeEvent, useEffect, useState } from "react";
import { ICommunity } from "@/types/community";
import { Spinner } from "@/components/Spinner/Spinner";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Theme,
  useTheme,
} from "@mui/material";
import { useAuthProvider } from "@/context/AuthContext";
import { useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { useAlert } from "@/hooks/useAlert";
import { useRouter } from "next/navigation";
import CreateCommunityDescription from "@/components/Community/CreateCommunityDescription";
import Link from "next/link";
import { ICategory } from "@/types/Categories";
import { MdPhotoLibrary } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Visibility } from "@mui/icons-material";
import { FaRegUserCircle } from "react-icons/fa";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { ImagePreview } from "@/components/SignUp/ImagePreview";
import { ToastContainer } from "react-toastify";
import AlertDialog from "@/components/ConfirmationDialog";

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

export default function CreateCommunity() {
  const { session } = useAuthProvider();
  const [showAlert] = useAlert();
  const router = useRouter();

  const community: ICommunity = {
    name: "",
    description: "",
    owner_id: session?._id as string,
    img: "",
    banner: "",
    // admins_id: [],
    communityCategory_id: [],
  };

  const [loading, load] = useGetCommunities();
  const [loadingCategories, loadCategories] = useGetCategories();
  const [communityData, setCommunityData] = useState<ICommunity>(community);
  const [categories, setCategories] = useState<Array<ICategory>>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [modalBanner, setModalBanner] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");

  const [loadingCreate, loadCreate] = useCreateCommunity(communityData);
  const [openConfimationModal, setOpenConfirmationModal] = useState(false);

  useEffect(() => {
    if (!session?._id) {
      router.back();
    }

    getCategories();
  }, []);

  const getCategories = async () => {
    const { response, error } = await loadCategories();
    if (response?.data.ok) {
      setCategories(response.data.data);
    }
  };

  const clearData = () => {
    setCommunityData(community);
  };

  const onSubmit = async () => {
    setOpenConfirmationModal(false);
    // e.preventDefault();

    if (!communityData.img) {
      return showAlert("warning", "Debe agregar una imagen.");
    }

    if (!communityData.banner) {
      return showAlert("warning", "Debe agregar un banner.");
    }

    if (communityData.communityCategory_id.length === 0) {
      return showAlert("warning", "Debe seleccionar al menos una categoría.");
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
      router.push(`/communities/${response.data.data._id}`);
      clearData();
      return showAlert("success", response?.data.mensaje);
    } else {
      return showAlert("warning", response?.data.mensaje);
    }
  };

  const theme = useTheme();

  const handleChange = (
    event: SelectChangeEvent<typeof selectedCategories>
  ) => {
    const {
      target: { value },
    } = event;
    const selectedValues = typeof value === "string" ? value.split(",") : value;
    setSelectedCategories(selectedValues);

    const selectedCategoryIds = categories
      .filter((category) => selectedValues.includes(category.name))
      .map((category) => category._id as string);

    setCommunityData((prev) => ({
      ...prev,
      communityCategory_id: selectedCategoryIds,
    }));
  };

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
        setCommunityData((prev) => ({ ...prev, img: file as File }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(file.name);
        setCommunityData((prev) => ({ ...prev, banner: file as File }));
      };
      reader.readAsDataURL(file);
    }
  };

  const onDeleteImage = () => {
    setImagePreview("");
    setCommunityData((prev) => ({ ...prev, img: "" }));
    const fileInput = document.getElementById(
      "file-input-image"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onDeleteBanner = () => {
    setBannerPreview("");
    setCommunityData((prev) => ({ ...prev, banner: "" }));
    const fileInput = document.getElementById(
      "file-input-banner"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onOpen = (type: number): void => {
    if (type) {
      setModal(true);
    } else {
      setModalBanner(true);
    }
  };
  const onClose = (): void => {
    setModal(false);
    setModalBanner(false);
  };

  const triggerFileInput = (type: string) => {
    const fileInput = document.getElementById(type);
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <>
      {session?._id && (
        <div className="w-full h-full flex flex-row">
          {/* Alert */}
          <ToastContainer />
          <Spinner loading={loading} message="Cargando..." />
          <Spinner loading={loadingCreate} message="Creando comunidad..." />
          <ImagePreview
            modal={modal || modalBanner}
            onClose={onClose}
            image={modal ? communityData.img : communityData.banner}
          />

          <AlertDialog
            setOpen={setOpenConfirmationModal}
            open={openConfimationModal}
            titleText={"Crear comunidad"}
            confirmationText={"Estas seguro de crear esta comunidad?"}
            cancelButtonText={"Cancelar"}
            confirmButtonText={"Confirmar"}
            callback={onSubmit}
          />
          <div className="w-full md:w-[70%] p-1">
            <div className="flex flex-row justify-between items-center mt-2 mb-5">
              <h1 className="font-bold text-xl md:text-3xl text-[#2c3e76]">
                Crear comunidad
              </h1>
              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  href={`/create-community`}
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
                sx={{ mt: 1 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      // name="firstName"
                      required
                      fullWidth
                      // id="firstName"
                      label="Nombre de la comunidad"
                      autoFocus
                      value={communityData.name}
                      onChange={(e) =>
                        setCommunityData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="categories-select-label">
                        Categorias
                      </InputLabel>
                      <Select
                        id="categories-select"
                        multiple
                        fullWidth
                        label="Categorias"
                        value={selectedCategories}
                        onChange={handleChange}
                        input={
                          <OutlinedInput
                            id="select-multiple-chip"
                            label="Categorias"
                          />
                        }
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                      >
                        {categories.map((category) => (
                          <MenuItem
                            key={category._id}
                            value={category.name}
                            style={getStyles(
                              category.name,
                              selectedCategories,
                              theme
                            )}
                          >
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
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
                        setCommunityData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <input
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
                                  triggerFileInput("file-input-image")
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
                                  display: communityData.img ? "" : "none",
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
                  <Grid item xs={12}>
                    <input
                      id="file-input-banner"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleBannerChange}
                    />
                    <FormControl fullWidth>
                      <TextField
                        id="banner-upload"
                        label="Banner"
                        disabled
                        fullWidth
                        placeholder="Banner"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MdPhotoLibrary
                                className="cursor-pointer"
                                onClick={() =>
                                  triggerFileInput("file-input-banner")
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
                                  display: communityData.banner ? "" : "none",
                                }}
                                onClick={onDeleteBanner}
                              />
                              <Visibility
                                className="cursor-pointer"
                                onClick={() => onOpen(0)}
                              />
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        className="w-full"
                        value={bannerPreview}
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
