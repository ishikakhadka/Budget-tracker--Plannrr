"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "@/lib/axios.instance";
import { useMutation } from "@tanstack/react-query";
import { IError } from "@/interface/error.interface";
import { IResponse } from "@/interface/response.interface";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { IconButton, LinearProgress, Tooltip } from "@mui/material";
interface Props {
  transactionId: string;
}

const DeleteTransaction = (props: Props) => {
  const router = useRouter();
  const { isPending, mutate } = useMutation({
    mutationKey: ["delete-transaction"],
    mutationFn: async () => {
      return await axiosInstance.delete(
        `/delete/transaction/${props.transactionId}`
      );
    },
    onSuccess: (res: IResponse) => {
      toast.success(res.data.message);
      router.push("/home");
    },
    onError: (error: IError) => {
      toast.error(error.response.data.message);
    },
  });

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
    <Tooltip title="Delete Budget" arrow>
  <IconButton
    onClick={handleClickOpen}
    sx={{
      color: "#ff4d4f", // bright red
      backgroundColor: "transparent",
      border: "1px solid #ff4d4f", // subtle outline to match color
      "&:hover": {
        backgroundColor: "#ff4d4f20", // light hover effect
        transform: "scale(1.15)", // slight zoom on hover
      },
      transition: "all 0.2s ease",
    }}
  >
    <DeleteIcon />
  </IconButton>
</Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        {isPending && <LinearProgress color="error" />}

        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete this transaction?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Transaction once deleted cannot be restored.This process is
            <span className="font-semibold"> irreversible </span>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="success">
            No
          </Button>
          <Button
            onClick={() => {
              mutate();
              handleClose();
            }}
            autoFocus
            variant="contained"
            color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
export default DeleteTransaction;
