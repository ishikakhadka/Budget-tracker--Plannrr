import mongoose from "mongoose";

//set schema/rule/structure
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true, //! removes space from beginning and end
    maxlength: 100,
    lowercase: true,
    unique: true, //! the table should not consist two users with same email
  },
  password: {
    type: String,
    required: true,
    trim: true, //! removes space from beginning and end
  },
  firstName: {
    type: String,
    required: true,
    trim: true, //! removes space from beginning and end
    maxlength: 100,
  },
  lastName: {
    type: String,
    required: true,
    trim: true, //! removes space from beginning and end
    maxlength: 100,
  },
  dob: {
    type: Date,
    max: Date.now(),
  },
  gender: {
    type: String,
    required: true,
    trim: true,
    enum: ["male", "female", "other"],
  },

  address: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
  },
});

//create table/model/collection
const UserTable = mongoose.model("User", userSchema);

export default UserTable;
