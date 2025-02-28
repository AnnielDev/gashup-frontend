import { useState, ChangeEvent, MouseEvent } from "react";

// MUI
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// TYPES
import { IUser } from "@/types/user";

// HOOKS
import { useSingUp } from "@/hooks/useAuth";
import { useAlert } from "@/hooks/useAlert";
// ICONS
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { MdOutlineMail, MdPhotoLibrary } from "react-icons/md";
import { LuKeyRound } from "react-icons/lu";
import { RiDeleteBin6Fill } from "react-icons/ri";

// COMPONENTS
import { ImagePreview } from "../SignUp/ImagePreview";
import { ToastContainer } from "react-toastify";
import { Spinner } from "../Spinner/Spinner";
// STYLES
import "@/styles/general/auth.css";

interface Props {
  setAuthState: () => void;
}

export default function SignUp({ setAuthState }: Props) {
  // VARIABLES
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [signUpData, setSignUpData] = useState<IUser>({
    code: process.env.NEXT_PUBLIC_USER_CODE ?? "",
    name: "",
    email: "",
    password: "",
    phone: "",
    img: "",
  });
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  // HOOKS
  const [showAlert] = useAlert();
  const [loading, load] = useSingUp(signUpData);
  // FUNCTIONS
  const handleClickShowPassword = (): void => {
    setShowPassword((show) => !show);
  };
  const handleClickShowConfirmPassword = (): void => {
    setShowConfirmPassword((show) => !show);
  };
  const handleSignUpInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const { value } = e.target;
    setSignUpData({ ...signUpData, [name]: value });
  };
  const handleMouseDownPassword = (
    event: MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();
  };
  const onOpen = (): void => {
    setModal(true);
  };
  const onClose = (): void => {
    setModal(false);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(file.name);
        setSignUpData({ ...signUpData, img: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const onDeleteImage = () => {
    setImagePreview("");
    setSignUpData({ ...signUpData, img: "" });
    const fileInput = document?.getElementById(
      "file-input"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const triggerFileInput = () => {
    const fileInput = document?.getElementById("file-input");
    if (fileInput) {
      fileInput.click();
    }
  };

  const onSubmit = async () => {
    const keys: (keyof IUser)[] = ["name", "email", "password", "phone"];
    const isReady = keys.every((key) => signUpData[key]);

    if (isReady) {
      if (signUpData.password === confirmPassword) {
        let { response, error } = await load();
        if (error) {
          showAlert(
            "error",
            error && error.response
              ? error.response.data.mensaje
              : "The server may be experiencing problems"
          );
        } else if (response) {
          let fileInput = document?.getElementById(
            "file-input"
          ) as HTMLInputElement;
          showAlert("success", response.data.mensaje);
          setSignUpData({
            code: "USER",
            name: "",
            email: "",
            password: "",
            phone: "",
            img: "",
          });
          setConfirmPassword("");
          setImagePreview("");
          fileInput.value = "";
        }
      } else {
        showAlert("warning", "Different passwords");
      }
    } else {
      showAlert(
        "warning",
        "You must complete all fields with the * character."
      );
    }
  };
  return (
    <div className="flex flex-col h-full">
      {/* Close Button */}
      <div className="flex px-4 pt-4">
        <FaArrowLeftLong
          fontSize={25}
          onClick={setAuthState}
          className="hover:bg-[#9b26b6] hover:text-white p-1 cursor-pointer rounded-full"
        />
      </div>
      {/* Content */}
      <div className="flex flex-col flex-grow justify-evenly px-8 max-md:px-6">
        {/* Head */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-3xl text-[#9b26b6]">Sign Up</h2>
        </div>
        {/* Form */}
        <div className="flex flex-col">
          <input
            id="file-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          {/* Photo */}
          <FormControl className="gap-2">
            <TextField
              id="image-upload"
              label="Photo"
              disabled
              placeholder="mateo-photo.jpg"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdPhotoLibrary
                      className="cursor-pointer"
                      onClick={triggerFileInput}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <RiDeleteBin6Fill
                      fontSize={20}
                      className="cursor-pointer mr-2"
                      style={{ display: signUpData.img ? "" : "none" }}
                      onClick={onDeleteImage}
                    />
                    <Visibility className="cursor-pointer" onClick={onOpen} />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              className="w-full"
              value={imagePreview}
            />
            {/* Username */}
            <TextField
              id="username-signup"
              label="Username"
              inputProps={{ maxLength: 30 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaRegUserCircle />
                  </InputAdornment>
                ),
              }}
              required
              placeholder="mateo"
              variant="outlined"
              className="w-full"
              value={signUpData.name}
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                handleSignUpInputChange(e, "name")
              }
            />
            {/* Phone */}
            <TextField
              id="phone-signup"
              label="Phone"
              placeholder="829-394-3414"
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IoPhonePortraitOutline />
                  </InputAdornment>
                ),
              }}
              className="w-full"
              value={signUpData.phone}
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                handleSignUpInputChange(e, "phone")
              }
            />

            {/* Email */}
            <TextField
              id="email-signup"
              label="Email"
              placeholder="mateo@gmail.com"
              required
              variant="outlined"
              value={signUpData.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdOutlineMail />
                  </InputAdornment>
                ),
              }}
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                handleSignUpInputChange(e, "email")
              }
              className="w-full"
            />
            {/* Password */}
            <FormControl variant="outlined" className="w-full">
              <InputLabel required htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="password-signup"
                placeholder="mateo123"
                value={signUpData.password}
                onInput={(e: ChangeEvent<HTMLInputElement>) =>
                  handleSignUpInputChange(e, "password")
                }
                startAdornment={
                  <InputAdornment position="start">
                    <LuKeyRound />
                  </InputAdornment>
                }
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password*"
              />
            </FormControl>
            {/* Confirm Password */}
            <FormControl variant="outlined" className="w-full">
              <InputLabel required htmlFor="outlined-adornment-password">
                Confirm Password
              </InputLabel>
              <OutlinedInput
                id="confirm-password-signup"
                placeholder="mateo123"
                value={confirmPassword}
                onInput={(e: ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
                type={showConfirmPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm Password*"
              />
            </FormControl>
          </FormControl>
        </div>
        {/* Button */}
        <div className="mt-4">
          <button
            onClick={onSubmit}
            className="w-full text-white p-2 rounded-sm btn-auth font-semibold"
          >
            Sign Up
          </button>
        </div>
      </div>
      {/* Image Preview */}
      <ImagePreview modal={modal} onClose={onClose} image={signUpData.img} />
      {/* Alert */}
      <ToastContainer />
      {/* Spinner */}
      <Spinner loading={loading} message="processing" />
    </div>
  );
}
