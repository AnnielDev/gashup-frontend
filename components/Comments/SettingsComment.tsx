"use client";
import * as React from "react";
import Popover from "@mui/material/Popover";
import { SlOptionsVertical } from "react-icons/sl";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useDeleteComment, useDeleteSubComment } from "@/hooks/usePost";
import AlertDialog from "../ConfirmationDialog";
import { ToastContainer } from "react-toastify";
import { useAlert } from "@/hooks/useAlert";
import { IComment, ISubComment } from "@/types/post";
import { Spinner } from "../Spinner/Spinner";

interface props {
  id: string;
  comments: Array<IComment>;
  setComments: Function;
  setEditCommentId?: Function; // Cambiado para usar identificador de comentario
  isEditing?: boolean; // Agregado para manejar el estado de edición
  isSubComment?: boolean;
  subComment?: ISubComment
}

export default function SettingsComment({
  id,
  comments,
  setComments,
  setEditCommentId,
  isEditing,
  isSubComment,
  subComment,
}: props) {
  const [showAlert] = useAlert();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [loading, load] = useDeleteComment(id);
  const [loadingDeleteSub, loadDeleteSub] = useDeleteSubComment(id);
  const [openConfirmationModal, setOpenConfirmationModal] =
    React.useState(false);

  const deleteComment = async () => {
    const { response, error } = await load();
    if (response?.data.ok && comments && setComments) {
      const filteredComments = comments?.filter(
        (item: IComment) => item._id !== id
      );

      if (response?.data.ok) {
        setOpenConfirmationModal(false);
        setComments(filteredComments);
        showAlert("success", response?.data.mensaje);
      } else {
        setOpenConfirmationModal(false);
        showAlert("warning", response?.data.mensaje);
      }
    }
  };

  const deleteSubComment = async () => {
    const { response, error } = await loadDeleteSub();

    // const filteredComments = subComments?.filter(
    //   (item: ISubComment) => item._id !== id
    // );

    if (response?.data.ok) {
      // setComments?.((prevComments: IComment[]) =>
      //   prevComments.map((comment) =>
      //     comment._id === id
      //       ? {
      //           ...comment,
      //           subComments: comment.subComments?.filter(
      //             (subComment) => subComment._id !== id
      //           ),
      //         }
      //       : comment
      //   )
      // );
      setComments((prevComments: IComment[]) =>
        prevComments.map((comment) => {
          if (comment._id === subComment?.comment_id) {
            return {
              ...comment,
              subComments: comment.subComments?.filter(
                (subComment: ISubComment) => subComment._id !== id
              ),
            };
          }
          return comment;
        })
      );
      setOpenConfirmationModal(false);
      // showAlert("success", response?.data.mensaje);
    } else {
      setOpenConfirmationModal(false);
      showAlert("warning", response?.data.mensaje);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openConfirmation = () => {
    setOpenConfirmationModal(true);
  };

  const toggleEdit = () => {
    if (isEditing) {
      setEditCommentId?.(null); // Cancelar edición
    } else {
      setEditCommentId?.(id); // Activar edición
    }
    handleClose(); // Cerrar el menú desplegable
  };

  const open = Boolean(anchorEl);
  const idPop = open ? "simple-popover" : undefined;

  return (
    <div>
      <Spinner loading={loading} message="Borrando comentario" />
      <Spinner loading={loadingDeleteSub} message="Borrando comentario" />
      <AlertDialog
        setOpen={setOpenConfirmationModal}
        open={openConfirmationModal}
        titleText={"Borrar comentario"}
        confirmationText={"¿Estás seguro de eliminar este comentario?"}
        cancelButtonText={"Cancelar"}
        confirmButtonText={"Confirmar"}
        callback={() => {
          !isSubComment ? deleteComment() : deleteSubComment();
        }}
      />
      <button onClick={handleClick}>
        <SlOptionsVertical className="w-5 h-5 pt-1 fill-black cursor-pointer" />
      </button>
      <Popover
        id={idPop}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <List>
          <ListItem button onClick={toggleEdit}>
            <ListItemText
              primary={isEditing ? "Cancelar edición" : "Editar comentario"}
            />
          </ListItem>
          <ListItem button onClick={openConfirmation}>
            <ListItemText primary="Borrar comentario" />
          </ListItem>
        </List>
      </Popover>
    </div>
  );
}
