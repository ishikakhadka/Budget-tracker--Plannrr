import mongoose from "mongoose";
export const validateMongoIdFromReqParams = (req, res, next) => {
  //extract id from req.params
  const id = req.params.id;
  //check if mongo id is valid
  const isValid = mongoose.isValidObjectId(id);
  //if not valid throw error
  if (!isValid) {
    return res.status(400).send({ message: "Invalid ID" });
  }
  next();
};
