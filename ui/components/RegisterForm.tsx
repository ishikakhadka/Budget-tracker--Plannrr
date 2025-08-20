"use client";

import { IError } from "@/interface/error.interface";
import { RegisterUserResponse } from "@/interface/register.interface";
import axiosInstance from "@/lib/axios.instance";

import registerUserSchema from "@/validation/registerUserSchema";

import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
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

// ✅ Move this interface outside for consistency
interface IRegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  dob: string;
  role: string;
  gender: string;
}

const RegisterForm = () => {
  const router = useRouter();

  const { isPending, mutate } = useMutation({
    mutationKey: ["register-user"],
    mutationFn: async (values: IRegisterForm) => {
      return await axiosInstance.post("/register", values);
    },
    onSuccess: (res: RegisterUserResponse) => {
      toast.success(res?.data.message || "Registered successfully");
      router.push("/");
    },
    onError: (error: IError) => {
      toast.error(error?.response?.data?.message || "Registration failed");
    },
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        address: "",
        dob: "",
        role: "",
        gender: "",
      }}
      validationSchema={registerUserSchema}
      onSubmit={(values: IRegisterForm) => {
        console.log(values)
        mutate(values);
      }}
    >
      {(formik) => (
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col justify-center items-center m-8 p-4 gap-3 shadow-2xl w-[450px] mx-auto"
          style={{ minHeight: "100vh" }}
        >
          <Typography variant="h5">Register</Typography>

          {/* First Name */}
          <FormControl fullWidth>
            <TextField
              label="First Name"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <FormHelperText error>{formik.errors.firstName}</FormHelperText>
            )}
          </FormControl>

          {/* Last Name */}
          <FormControl fullWidth>
            <TextField
              label="Last Name"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <FormHelperText error>{formik.errors.lastName}</FormHelperText>
            )}
          </FormControl>

          {/* Email */}
          <FormControl fullWidth>
            <TextField
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <FormHelperText error>{formik.errors.email}</FormHelperText>
            )}
          </FormControl>

          {/* Password */}
          <FormControl fullWidth>
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <FormHelperText error>{formik.errors.password}</FormHelperText>
            )}
          </FormControl>

          {/* DOB */}
          <FormControl fullWidth>
            <TextField
              label="DOB"
              name="dob"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formik.values.dob}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.dob && formik.errors.dob && (
              <FormHelperText error>{formik.errors.dob}</FormHelperText>
            )}
          </FormControl>

          {/* Address */}
          <FormControl fullWidth>
            <TextField
              label="Address"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.address && formik.errors.address && (
              <FormHelperText error>{formik.errors.address}</FormHelperText>
            )}
          </FormControl>

          {/* Gender */}
          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              label="Gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="others">Other</MenuItem>
            </Select>
            {formik.touched.gender && formik.errors.gender && (
              <FormHelperText error>{formik.errors.gender}</FormHelperText>
            )}
          </FormControl>

        

          {/* Buttons */}
          <Stack className="p-3 gap-2 w-full justify-center items-center">
            <Button
              fullWidth
              variant="contained"
              type="submit"
              style={{ backgroundColor: "#6c2d2d" }}
            >
              Register
            </Button>
            <Link href="/login" className="text-purple-800">
              Already a user? Login.
            </Link>
          </Stack>
        </form>
      )}
    </Formik>
  );
};

export default RegisterForm;
