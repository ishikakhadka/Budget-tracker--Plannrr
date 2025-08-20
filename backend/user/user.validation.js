import yup from "yup";
import dayjs from "dayjs";
export const loginCredentialSchema = yup.object({
  email: yup.string().email().required().trim().lowercase(),
  password: yup.string().required().trim(),
});

export const registerUserSchema = yup.object({
  email: yup.string().required().email().trim().lowercase().max(100),
  password: yup.string().required().trim().min(8).max(30),
  firstName: yup.string().required().trim().max(100),
  lastName: yup.string().required().trim().max(100),
  dob: yup.date().notRequired().max(dayjs()),
  gender: yup
    .string()
    .required()

    .trim()
    .lowercase()
    .oneOf(["male", "female", "others"]),
  
  address: yup.string().required().trim().lowercase(),
});
