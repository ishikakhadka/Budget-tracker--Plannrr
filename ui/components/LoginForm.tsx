"use client";
import { ILoginResponse } from "@/interface/login.interface";
import axiosInstance from "@/lib/axios.instance";
import { LoginCredentials } from "@/validation/loginValidationSchema";
// import { IError } from "@/interface/error.interface";
// import { ILoginResponse } from "@/interface/login.interface";

import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

interface ILoginForm {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (values: ILoginForm) => {
      return await axiosInstance.post("/login", values);
    },
    onSuccess: (res: ILoginResponse) => {
      toast.success("Login successful.");

      const accessToken = res.data.accessToken;
      const firstName = res.data.userDetails?.firstName;
      const lastName = res.data.userDetails?.lastName;

      // Store first name safely
      window.localStorage.setItem("accessToken", accessToken);
      window.localStorage.setItem("firstName", firstName);
      window.localStorage.setItem("lastName", lastName);

      router.push("/home");
    },

    onError: () => {
      toast.error("Login failed!!");
    },
  });
  if (isPending) {
    return <CircularProgress />;
  }

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={LoginCredentials}
      onSubmit={(values: ILoginForm) => {
        mutate(values);
      }}
    >
      {(formik) => (
        <form
          onSubmit={formik.handleSubmit}
          className="bg-gray-800 text-white rounded-2xl p-10 shadow-2xl w-full max-w-[420px]  flex flex-col gap-6"
        >
          <Typography
            variant="h5"
            className="text-center text-gray-300 font-bold"
          >
            Login to Plannrr
          </Typography>

          <FormControl fullWidth>
            <TextField
              label="Email"
              {...formik.getFieldProps("email")}
              variant="outlined"
              fullWidth
              size="medium"
              InputLabelProps={{ style: { color: "#90caf9" } }}
              InputProps={{ style: { color: "#ffffff" } }}
            />
            {formik.touched.email && formik.errors.email && (
              <FormHelperText error>{formik.errors.email}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label="Password"
              type="password"
              {...formik.getFieldProps("password")}
              variant="outlined"
              fullWidth
              size="medium"
              InputLabelProps={{ style: { color: "#90caf9" } }}
              InputProps={{ style: { color: "#ffffff" } }}
            />
            {formik.touched.password && formik.errors.password && (
              <FormHelperText error>{formik.errors.password}</FormHelperText>
            )}
          </FormControl>

          <Stack spacing={2} className="w-full mt-4">
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isPending}
              sx={{
                bgcolor: "#1e40af",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: "12px",
                fontSize: "1rem",
                "&:hover": { bgcolor: "#1a3b99" },
              }}
            >
              Submit
            </Button>
            <Typography variant="body2" className="text-center text-gray-400">
              New here?{" "}
              <Link href="/register" className="text-blue-400 hover:underline">
                Create an account
              </Link>
            </Typography>
          </Stack>
        </form>
      )}
    </Formik>
  );
};

export default LoginForm;
