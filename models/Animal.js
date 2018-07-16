const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const animalSchema = new Schema(
  {
    especie: { type: String, required: true },
    breed: { type: String, required: true },
    name: {type: String, required: true},
    color: String,
    gender: String,
    chip: String,
    description: String,
    profilePic: String,
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Animal = mongoose.model("Animal", animalSchema);
module.exports = Animal;
