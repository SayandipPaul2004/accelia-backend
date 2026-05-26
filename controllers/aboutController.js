const About = require("../models/About");

/* ─────────────────────────────────────────────────────────────
   HELPER — always return the single About document,
   creating it with defaults if it doesn't exist yet.
───────────────────────────────────────────────────────────── */
const getDoc = async () => {
  let doc = await About.findOne();
  if (!doc) doc = await About.create({});
  return doc;
};

/* ─────────────────────────────────────────────────────────────
   GET /api/about
   Returns the full About document (public + admin use)
───────────────────────────────────────────────────────────── */
exports.getAbout = async (req, res) => {
  try {
    const doc = await getDoc();
    res.json({ success: true, data: doc });
  } catch (err) {
    console.error("getAbout:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ─────────────────────────────────────────────────────────────
   PUT /api/about/hero
   Body: { badge, heading, subheading }
───────────────────────────────────────────────────────────── */
exports.updateHero = async (req, res) => {
  try {
    const { badge, heading, subheading } = req.body;
    const doc = await getDoc();

    if (badge !== undefined) doc.hero.badge = badge;
    if (heading !== undefined) doc.hero.heading = heading;
    if (subheading !== undefined) doc.hero.subheading = subheading;

    await doc.save();
    res.json({ success: true, data: doc.hero, message: "Hero updated" });
  } catch (err) {
    console.error("updateHero:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ─────────────────────────────────────────────────────────────
   PUT /api/about/story
   Body: { badge, heading, body1, body2, image }
   image: base64 string or a URL (pass null to clear)
───────────────────────────────────────────────────────────── */
exports.updateStory = async (req, res) => {
  try {
    const { badge, heading, body1, body2, image } = req.body;
    const doc = await getDoc();

    if (badge !== undefined) doc.story.badge = badge;
    if (heading !== undefined) doc.story.heading = heading;
    if (body1 !== undefined) doc.story.body1 = body1;
    if (body2 !== undefined) doc.story.body2 = body2;
    if (image !== undefined) doc.story.image = image; // null clears it

    await doc.save();
    res.json({ success: true, data: doc.story, message: "Story updated" });
  } catch (err) {
    console.error("updateStory:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ─────────────────────────────────────────────────────────────
   PUT /api/about/mission-vision
   Body: { mission, vision }
───────────────────────────────────────────────────────────── */
exports.updateMissionVision = async (req, res) => {
  try {
    const { mission, vision } = req.body;
    const doc = await getDoc();

    if (mission !== undefined) doc.mission = mission;
    if (vision !== undefined) doc.vision = vision;

    await doc.save();
    res.json({
      success: true,
      data: { mission: doc.mission, vision: doc.vision },
      message: "Mission & Vision updated",
    });
  } catch (err) {
    console.error("updateMissionVision:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ═══════════════════════════════════════
   STATS
═══════════════════════════════════════ */

/* GET /api/about/stats */
exports.getStats = async (req, res) => {
  try {
    const doc = await getDoc();
    res.json({ success: true, data: doc.stats });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* POST /api/about/stats
   Body: { value, label, order? } */
exports.addStat = async (req, res) => {
  try {
    const { value, label, order } = req.body;
    if (!value || !label)
      return res
        .status(400)
        .json({ success: false, message: "value and label are required" });

    const doc = await getDoc();
    doc.stats.push({ value, label, order: order ?? doc.stats.length });
    await doc.save();

    res.status(201).json({
      success: true,
      data: doc.stats[doc.stats.length - 1],
      message: "Stat added",
    });
  } catch (err) {
    console.error("addStat:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* PUT /api/about/stats/:statId
   Body: { value?, label?, order? } */
exports.updateStat = async (req, res) => {
  try {
    const doc = await getDoc();
    const stat = doc.stats.id(req.params.statId);
    if (!stat)
      return res
        .status(404)
        .json({ success: false, message: "Stat not found" });

    const { value, label, order } = req.body;
    if (value !== undefined) stat.value = value;
    if (label !== undefined) stat.label = label;
    if (order !== undefined) stat.order = order;

    await doc.save();
    res.json({ success: true, data: stat, message: "Stat updated" });
  } catch (err) {
    console.error("updateStat:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* DELETE /api/about/stats/:statId */
exports.deleteStat = async (req, res) => {
  try {
    const doc = await getDoc();
    const stat = doc.stats.id(req.params.statId);
    if (!stat)
      return res
        .status(404)
        .json({ success: false, message: "Stat not found" });

    stat.deleteOne();
    await doc.save();
    res.json({ success: true, message: "Stat deleted" });
  } catch (err) {
    console.error("deleteStat:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ═══════════════════════════════════════
   CORE VALUES
═══════════════════════════════════════ */

/* GET /api/about/values */
exports.getValues = async (req, res) => {
  try {
    const doc = await getDoc();
    res.json({ success: true, data: doc.values });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* POST /api/about/values
   Body: { icon, title, desc, order? } */
exports.addValue = async (req, res) => {
  try {
    const { icon, title, desc, order } = req.body;
    if (!title)
      return res
        .status(400)
        .json({ success: false, message: "title is required" });

    const doc = await getDoc();
    doc.values.push({
      icon: icon || "🔬",
      title,
      desc: desc || "",
      order: order ?? doc.values.length,
    });
    await doc.save();

    res.status(201).json({
      success: true,
      data: doc.values[doc.values.length - 1],
      message: "Value added",
    });
  } catch (err) {
    console.error("addValue:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* PUT /api/about/values/:valueId
   Body: { icon?, title?, desc?, order? } */
exports.updateValue = async (req, res) => {
  try {
    const doc = await getDoc();
    const value = doc.values.id(req.params.valueId);
    if (!value)
      return res
        .status(404)
        .json({ success: false, message: "Value not found" });

    const { icon, title, desc, order } = req.body;
    if (icon !== undefined) value.icon = icon;
    if (title !== undefined) value.title = title;
    if (desc !== undefined) value.desc = desc;
    if (order !== undefined) value.order = order;

    await doc.save();
    res.json({ success: true, data: value, message: "Value updated" });
  } catch (err) {
    console.error("updateValue:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* DELETE /api/about/values/:valueId */
exports.deleteValue = async (req, res) => {
  try {
    const doc = await getDoc();
    const value = doc.values.id(req.params.valueId);
    if (!value)
      return res
        .status(404)
        .json({ success: false, message: "Value not found" });

    value.deleteOne();
    await doc.save();
    res.json({ success: true, message: "Value deleted" });
  } catch (err) {
    console.error("deleteValue:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ─────────────────────────────────────────────────────────────
   PUT /api/about/full  (used by admin "Publish Changes" button)
   Sends the entire data object at once — mirrors INITIAL_DATA shape
───────────────────────────────────────────────────────────── */
exports.publishAll = async (req, res) => {
  try {
    const { hero, story, stats, mission, vision, values } = req.body;
    const doc = await getDoc();

    if (hero !== undefined) doc.hero = { ...doc.hero, ...hero };
    if (story !== undefined) doc.story = { ...doc.story, ...story };
    if (mission !== undefined) doc.mission = mission;
    if (vision !== undefined) doc.vision = vision;

    // Replace arrays entirely when provided
    if (Array.isArray(stats)) doc.stats = stats;
    if (Array.isArray(values)) doc.values = values;

    await doc.save();
    res.json({ success: true, data: doc, message: "All changes published" });
  } catch (err) {
    console.error("publishAll:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
