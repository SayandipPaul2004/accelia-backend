const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} = require("../controllers/newsController");
router.get("/", getNews);
router.get("/:id", getNewsById);
router.post("/", auth, createNews);
router.put("/:id", auth, updateNews);
router.delete("/:id", auth, deleteNews);

module.exports = router;
