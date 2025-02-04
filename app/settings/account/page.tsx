"use client";
import React, {
  useState,
  useEffect,
  ChangeEvent,

} from "react";

// MUI
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button } from "@mui/material";
//SESSION
import { useAuthProvider } from "@/context/AuthContext";

// COMPONENTS
import { ToastContainer } from "react-toastify";
import { Avatar } from "@/components/Avatar/Avatar";
import { Spinner } from "@/components/Spinner/Spinner";
import { ProfileAvatar } from "@/components/Settings/ProfileAvatar";
import { ValidatePassword } from "@/components/Settings/ValidatePassword";
// HOOKS
import { useUpdateUser, useUserById } from "@/hooks/useUser";
import { useAlert } from "@/hooks/useAlert";
// ICONS
import { FaRegUserCircle } from "react-icons/fa";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { MdOutlineMail } from "react-icons/md";
import { LuKeyRound } from "react-icons/lu";

// TYPES
import { IUser } from "@/types/user";

export default function Account() {
  const { session } = useAuthProvider();
  const [updateData, setUpdateData] = useState<IUser>({
    code: "USER",
    name: "",
    email: "",
    password: "",
    phone: "",
    img: null,
  });
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // HOOKS
  const [loading, load] = useUserById(session?._id ?? "");
  const [loadingUpdate, loadUpdate] = useUpdateUser(
    session?._id ?? "",
    updateData
  );
  const [showAlert] = useAlert();

  // FUNCTIONS
  const handleClickShowPassword = (): void => {
    setShowPassword((show) => !show);
  };
  const handleClickShowConfirmPassword = (): void => {
    setShowConfirmPassword((show) => !show);
  };

  const getUser = async () => {
    const { response, error } = await load();

    if (error) {
      showAlert("error", error.response.data.mensaje);
    } else if (response) {
      setUpdateData({
        ...updateData,
        img: response.data.user?.img,
        name: response.data.user?.name,
        email: response.data.user?.email,
        password: response.data.user?.password,
        phone: response.data.user?.phone,
        banner: response.data.user?.banner,
      });
      setConfirmPassword(response.data.user?.password);
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  const setPassword = (password: string) => {
    setUpdateData({ ...updateData, password: password });
    setConfirmPassword(password);
  };
  const handleSignUpInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const { value } = e.target;
    setUpdateData({ ...updateData, [name]: value });
  };
  const handleMouseDownPassword = (event: React.MouseEvent): void => {
    event.preventDefault();
  };

  const onSetImage = (image: string | Blob | null | undefined) => {
    setUpdateData({ ...updateData, img: image });
  };
  const onDeleteImage = () => {
    setUpdateData({ ...updateData, img: null });
  };
  const onUpdate = async () => {
    const keys: (keyof IUser)[] = ["name", "email", "password", "phone"];
    const isCompleted = keys.every((key) => updateData[key]);
    if (isCompleted) {
      if (updateData.password === confirmPassword) {
        const { response, error } = await loadUpdate();
        if (error) {
          showAlert(
            "error",
            error && error.response
              ? error.response.data.mensaje
              : "The server may be experiencing problems"
          );
        } else if (response) {
          showAlert("success", response.data.mensaje);
          setUpdateData({ ...updateData, img: response.data.update.img });
        }
      } else {
        showAlert("warning", "Different passwords");
      }
    } else {
      showAlert("warning", "You must fill out all fields");
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSetImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = (): void => {
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.click();
    }
  };
  return (
    <div className="flex flex-col">
      <input
        id="file-input"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
      <div>
        {updateData?.img ? (
          <ProfileAvatar
            photo={updateData?.img}
            onSetImage={onSetImage}
            onDeleteImage={onDeleteImage}
          />
        ) : (
          <Avatar
            size={208}
            session={session}
            letterSize={100}
            styles={{ margin: "16px auto" }}
            pointer
            onClick={triggerFileInput}
          />
        )}
      </div>
      {/* Form */}

      <div className="flex pb-4 gap-4 flex-wrap b w-full">
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
          className="w-[30%] max-md:w-full"
          value={updateData.name}
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
          className="w-[30%] max-md:w-full"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IoPhonePortraitOutline />
              </InputAdornment>
            ),
          }}
          value={updateData.phone}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleSignUpInputChange(e, "phone")
          }
        />

        {/* Email */}
        <TextField
          id="email-signup"
          label="Email"
          className="w-[30%] max-md:w-full"
          placeholder="mateo@gmail.com"
          required
          variant="outlined"
          value={updateData.email}
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
        />
        {/* Password */}
        <FormControl variant="outlined" className="w-[30%] max-md:w-full">
          <InputLabel required htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="password-signup"
            placeholder="mateo123"
            value={updateData.password}
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
        <FormControl variant="outlined" className="w-[30%] max-md:w-full">
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
      </div>
      <div className="w-full flex mb-2 justify-center">
        <Button
          onClick={onUpdate}
          variant="contained"
          style={{ backgroundColor: "#9b26b6" }}
          className="w-[35%] max-md:w-[100%] text-white p-2 rounded-md font-semibold"
        >
          Actualizar
        </Button>
      </div>

      {/* Modal */}
      <ValidatePassword
        setCurrentPassword={setPassword}
        currentPassword={updateData?.password}
      />
      {/* Alert */}
      <ToastContainer />
      {/* Spinner */}
      <Spinner
        loading={loading || loadingUpdate}
        message={loading ? "loading data" : loadingUpdate ? "actualizando" : ""}
      />
    </div>
  );
}
