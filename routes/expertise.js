const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  getAllExpertise,
  adminGetById,
  create,
  update,
  toggle,
  reorder,
  remove,
} = require("../controllers/expertiseController");

// PUBLIC
router.get("/", getAllExpertise);
router.get("/:id", adminGetById);

// PROTECTED
router.post("/", auth, create);
router.patch("/reorder", auth, reorder); // ⚠️ must be before /:id
router.patch("/:id/toggle", auth, toggle);
router.patch("/:id", auth, update);
router.delete("/:id", auth, remove);

module.exports = router;
