const mongoose = require("mongoose");

const ExpertiseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    desc: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    icon: {
      type: String,
      default: "🔬",
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
      min: [0, "Order cannot be negative"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for sorting by order efficiently
ExpertiseSchema.index({ order: 1 });

// Return only active expertise sorted by order
ExpertiseSchema.statics.getActive = function () {
  return this.find({ isActive: true }).sort({ order: 1 });
};

module.exports = mongoose.model("Expertise", ExpertiseSchema);
