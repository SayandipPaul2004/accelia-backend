const express = require("express");
const router = express.Router();
const {
  getAbout,
  updateHero,
  updateStory,
  updateMissionVision,
  getStats,
  addStat,
  updateStat,
  deleteStat,
  getValues,
  addValue,
  updateValue,
  deleteValue,
  publishAll,
} = require("../controllers/aboutController");

// Middleware placeholder — swap in your real auth middleware
// e.g.  const protect = require("../middleware/authMiddleware");
const protect = (req, res, next) => next(); // TODO: replace with real auth

/* ── PUBLIC ── */
router.get("/", getAbout); // Full doc for frontend About page

/* ── ADMIN — section-level updates ── */
router.put("/hero", protect, updateHero);
router.put("/story", protect, updateStory);
router.put("/mission-vision", protect, updateMissionVision);

/* ── ADMIN — stats CRUD ── */
router.get("/stats", protect, getStats);
router.post("/stats", protect, addStat);
router.put("/stats/:statId", protect, updateStat);
router.delete("/stats/:statId", protect, deleteStat);

/* ── ADMIN — values CRUD ── */
router.get("/values", protect, getValues);
router.post("/values", protect, addValue);
router.put("/values/:valueId", protect, updateValue);
router.delete("/values/:valueId", protect, deleteValue);

/* ── ADMIN — publish everything at once (Publish Changes button) ── */
router.put("/full", protect, publishAll);

module.exports = router;
