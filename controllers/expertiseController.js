const Expertise = require("../models/Expertise");
const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ success: false, message: error.message });
};
exports.getAllExpertise = async (req, res) => {
  try {
    const expertise = await Expertise.find({ isActive: true })
      .select("-__v")
      .sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: expertise.length,
      data: expertise,
    });
  } catch (error) {
    handleError(res, error);
  }
};
exports.adminGetAll = async (req, res) => {
  try {
    const { search = "", isActive, page = 1, limit = 20 } = req.query;

    const parsedPage = Math.max(1, parseInt(page));
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (parsedPage - 1) * parsedLimit;

    const query = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (isActive !== undefined) query.isActive = isActive === "true";

    const [data, total] = await Promise.all([
      Expertise.find(query)
        .select("-__v")
        .sort({ order: 1 })
        .skip(skip)
        .limit(parsedLimit),
      Expertise.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / parsedLimit),
      currentPage: parsedPage,
      data,
    });
  } catch (error) {
    handleError(res, error);
  }
};
exports.adminGetById = async (req, res) => {
  try {
    const expertise = await Expertise.findById(req.params.id).select("-__v");
    if (!expertise)
      return res
        .status(404)
        .json({ success: false, message: "Expertise not found" });

    res.status(200).json({ success: true, data: expertise });
  } catch (error) {
    handleError(res, error);
  }
};
exports.create = async (req, res) => {
  try {
    const { title, desc, icon, order, isActive } = req.body;

    const expertise = await Expertise.create({
      title,
      desc,
      icon,
      order,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Created successfully",
      data: expertise,
    });
  } catch (error) {
    // Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    handleError(res, error);
  }
};
exports.update = async (req, res) => {
  try {
    const allowedFields = ["title", "desc", "icon", "order", "isActive"];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const expertise = await Expertise.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    ).select("-__v");

    if (!expertise)
      return res
        .status(404)
        .json({ success: false, message: "Expertise not found" });

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: expertise,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    handleError(res, error);
  }
};
exports.toggle = async (req, res) => {
  try {
    const expertise = await Expertise.findById(req.params.id);
    if (!expertise)
      return res
        .status(404)
        .json({ success: false, message: "Expertise not found" });

    expertise.isActive = !expertise.isActive;
    await expertise.save();

    res.status(200).json({
      success: true,
      message: `${expertise.isActive ? "Activated" : "Deactivated"} successfully`,
      data: { _id: expertise._id, isActive: expertise.isActive },
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.reorder = async (req, res) => {
  try {
    const { orders } = req.body;

    if (!Array.isArray(orders) || orders.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "orders array is required" });

    const bulkOps = orders.map(({ id, order }) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order } } },
    }));

    await Expertise.bulkWrite(bulkOps);

    res.status(200).json({ success: true, message: "Reordered successfully" });
  } catch (error) {
    handleError(res, error);
  }
};
exports.remove = async (req, res) => {
  try {
    const expertise = await Expertise.findByIdAndDelete(req.params.id);
    if (!expertise)
      return res
        .status(404)
        .json({ success: false, message: "Expertise not found" });

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};
