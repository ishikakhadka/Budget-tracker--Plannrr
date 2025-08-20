"use client";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Typography,
} from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios.instance";
import { IResponse } from "@/interface/response.interface";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { IError } from "@/interface/error.interface";

interface DeleteBudgetProps {
  id: string | number;
}

const DeleteBudget = (props: DeleteBudgetProps) => {
  const router = useRouter();
  const { isPending, mutate } = useMutation({
    mutationKey: ["delete-budget"],
    mutationFn: async () => {
      return await axiosInstance.delete(`/delete-budget/${props.id}`);
    },
    onSuccess: (res: IResponse) => {
      toast.success(res.data.message);
      router.push("/budget");
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
        minWidth: 200,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Would you rather like to?
      </Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        <React.Fragment>
          <Button
            onClick={handleClickOpen}
            fullWidth
            variant="contained"
            color="error"
            style={{ backgroundColor: "#6c2d2d", color: "#fff" }}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            {isPending && <LinearProgress color="error" />}

            <DialogTitle id="alert-dialog-title">
              Are you sure you want to delete your existing budget plan?
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Plan once deleted cannot be restored.This process is
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
                color="error"
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>

        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          sx={{ backgroundColor: "#2d5a6c", color: "#fff", padding: "8px" }}
          onClick={() => router.push(`/edit-budget/${props.id}`)}
        >
          Edit
        </Button>
      </Box>
    </Box>
  );
};

export default DeleteBudget;
