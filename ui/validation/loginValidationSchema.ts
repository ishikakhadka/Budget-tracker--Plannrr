
import * as yup from "yup";

export const LoginCredentials = yup.object({
  email: yup
    .string()
    .email("Must be a valid email.")
    .lowercase()
    .required("Email is required.")
    .max(100, "Email must be at max 100 characters.")
    .trim(),
  password: yup.string().required("Password is required.").trim(),
});
