const Event = require("../models/Event");
const cloudinary = require("../config/cloudinary");

exports.getEvents = async (req, res) => {
  try {
    const isAdmin =
      req.query.admin === "true" ||
      (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer "));
    const filter = isAdmin ? {} : { isActive: true };
    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    let imageUrl = "";

    if (req.file) {
      imageUrl = req.file.path;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    const event = new Event({
      title: req.body.title,
      type: req.body.type || "Conference",
      date: req.body.date,
      time: req.body.time || "",
      location: req.body.location,
      description: req.body.description || "",
      imageUrl,
      registrationLink: req.body.registrationLink || "",
      isActive: req.body.isActive === "true",
    });

    await event.save();

    res.status(201).json(event);
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: err.message,
      body: req.body,
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = req.file.path; // Cloudinary URL
    }
    const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!event) return res.status(404).json({ message: "Not found" });
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
