import jwt from "jsonwebtoken";
import UserTable from "../user/user.model.js";
import dotenv from "dotenv";
dotenv.config();

export const isUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and starts with Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1]; // Extract token

  const secretKey = process.env.secretKey;

    // Verify token
    const decoded = jwt.verify(token, secretKey);

    // Find user from the database
    const user = await UserTable.findOne({ email: decoded.email });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Attach user data and ID to the request object
    req.user = user;
    req.loggedInUserId = user._id;

    next(); // Proceed to next middleware or route
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
