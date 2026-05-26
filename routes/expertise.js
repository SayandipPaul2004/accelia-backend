const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  getExpertise,
  getExpertiseById,
  createExpertise,
  updateExpertise,
  deleteExpertise,
} = require("../controllers/expertiseController");

// PUBLIC
router.get("/", getExpertise);
router.get("/:id", getExpertiseById);

// PROTECTED
router.post("/", auth, createExpertise);
router.patch("/:id", auth, updateExpertise);
router.delete("/:id", auth, deleteExpertise);

module.exports = router;
