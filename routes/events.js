const express = require("express");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const router = express.Router();

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", auth, upload.single("image"), createEvent);
router.put("/:id", auth, upload.single("image"), updateEvent);
router.delete("/:id", auth, deleteEvent);

module.exports = router;
