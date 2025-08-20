import  dayjs  from "dayjs";

import * as yup from "yup";

export const registerUserSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email address")
    .trim()
    .lowercase()
    .max(100, "Email must be at most 100 characters long"),

  password: yup
    .string()
    .required("Password is required")
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .max(30, "Password must be at most 30 characters long"),

  firstName: yup
    .string()
    .required("First name is required")
    .trim()
    .max(100, "First name must be at most 100 characters long"),

  lastName: yup
    .string()
    .required("Last name is required")
    .trim()
    .max(100, "Last name must be at most 100 characters long"),

  dob: yup
    .date()
    .notRequired()
    .max(dayjs(), "Date of birth cannot be in the future"),

  gender: yup
    .string()
    .required("Gender is required")
    .trim()
    .lowercase()
    .oneOf(
      ["male", "female", "others"],
      "Gender must be 'male', 'female', or 'others'"
    ),

});

export default registerUserSchema;
