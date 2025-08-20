import express from "express";
import {
  loginCredentialSchema,
  registerUserSchema,
} from "./user.validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserTable from "./user.model.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

router.post(
  "/register",
  async (req, res, next) => {
    try {
      const validatedData = await registerUserSchema.validate(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      console.log(error);
      return res.status(400).send({ error: error.message });
    }
  },
  async (req, res, next) => {
    const newUser = req.body;
    const user = await UserTable.findOne({ email: newUser.email });
    if (user) {
      return res.status(400).send("User already exists");
    }
    const plainPassword = newUser.password;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    newUser.password = hashedPassword;

    await UserTable.create(newUser);

    return res.status(200).send({ message: "User Registered successfully..." });
  }
);

router.post(
  "/login",
  async (req, res, next) => {
    try {
      const validateData = await loginCredentialSchema.validate(req.body);
      req.body = validateData;
      console.log(req.body);
      next();
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res, next) => {
    const loginCredentials = req.body;

    const user = await UserTable.findOne({ email: loginCredentials.email });
    if (!user) {
      return res.status(404).send({ message: "Invalid Credentials" });
    }

    const plainPassword = loginCredentials.password;
    const hashedPassword = user.password;
    const isPassword = await bcrypt.compare(plainPassword, hashedPassword);
    if (!isPassword) {
      return res.status(400).send({ message: "Invalid Credentials" });
    }
    const payload = { email: user.email };

    const secretKey = process.env.secretKey;
    const token = jwt.sign({ email: user.email }, secretKey, {
      expiresIn: "7d",
    });

    user.password = undefined; // Remove password from user object
    return res.status(200).send({
      message: "Login successful",
      accessToken: token,
      userDetails: user,
    });
  }
);
export { router as userController };
