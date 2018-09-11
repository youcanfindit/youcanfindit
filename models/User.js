//User model file

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//User schema
const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    name: String,
    profilePic: String,
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "user", enum: ["admin", "user"]},
    status: {type: String, default: 'pending', enum: ['confirmed', 'pending']},
    confirmationCode: {type: String, unique: true}
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
