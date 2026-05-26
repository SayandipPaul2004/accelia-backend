const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    experience: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    coverLetter: { type: String, trim: true },
    cv: {
      url: { type: String },
      public_id: { type: String },
      originalName: { type: String },
    },
    status: {
      type: String,
      enum: ["new", "reviewing", "shortlisted", "rejected"],
      default: "new",
    },
    note: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Application", applicationSchema);
