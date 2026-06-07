const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

module.exports = async (req, res, next) => {
  try {
    console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);
    console.log("Auth header:", req.headers.authorization);

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);

    if (!admin || !admin.isActive)
      return res.status(401).json({ message: "Admin invalid" });

    req.admin = admin;
    next();
  } catch (err) {
    console.log("Auth error:", err.message);
    res.status(401).json({ message: "Token invalid or expired" });
  }
};
