const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    name: String,
    profilePic: String,
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "user", enum: ["admin", "user"]}
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
