const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  getSolutions,
  createSolution,
  updateSolution,
  deleteSolution,
} = require("../controllers/solutionController");

router.get("/", getSolutions);
router.post("/", auth, createSolution);
router.put("/:id", auth, updateSolution);
router.delete("/:id", auth, deleteSolution);

module.exports = router;
