const mongoose = require("mongoose");
const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    role: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "On Leave", "Inactive"],
      default: "Active",
    },
    avatar: {
      type: String,
      default: null,
    },
    joined: {
      type: String,
      default: "",
    },
    projects: {
      type: Number,
      default: 0,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Team", teamSchema);
