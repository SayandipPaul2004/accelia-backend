const mongoose = require("mongoose");

/* ── Sub-schemas ── */
const StatSchema = new mongoose.Schema({
  value: { type: String, required: true }, // e.g. "30+"
  label: { type: String, required: true }, // e.g. "Clinical Trials Completed"
  order: { type: Number, default: 0 },
});

const ValueSchema = new mongoose.Schema({
  icon: { type: String, default: "🔬" },
  title: { type: String, required: true },
  desc: { type: String, default: "" },
  order: { type: Number, default: 0 },
});

/* ── Main schema (singleton document) ── */
const AboutSchema = new mongoose.Schema(
  {
    /* Hero section */
    hero: {
      badge: { type: String, default: "About Accelia" },
      heading: { type: String, default: "Who We Are" },
      subheading: { type: String, default: "" },
    },

    /* Our Story section */
    story: {
      badge: { type: String, default: "Our Story" },
      heading: { type: String, default: "" },
      body1: { type: String, default: "" },
      body2: { type: String, default: "" },
      image: { type: String, default: null }, // base64 or URL
    },

    /* Stats strip */
    stats: { type: [StatSchema], default: [] },

    /* Mission & Vision */
    mission: { type: String, default: "" },
    vision: { type: String, default: "" },

    /* Core Values */
    values: { type: [ValueSchema], default: [] },
  },
  { timestamps: true },
);

module.exports = mongoose.model("About", AboutSchema);
