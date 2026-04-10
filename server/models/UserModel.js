import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [
      function () {
        return !this.googleId;
      },
      "Password is required if Google ID is not provided",
    ],
  },
  googleId: { type: String },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  color: {
    type: Number,
    required: false,
  },
  profileSetup: {
    type: Boolean,
    default: false,
  },
});

// pre is a middleware to encrypt password
userSchema.pre("save", async function (next) {
  // Only hash the password if it's new or modified and exists.
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  const salt = await genSalt();
  this.password = await hash(this.password, salt);
  next();
});


const User = mongoose.model("Users", userSchema);

export default User;
