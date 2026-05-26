require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await Admin.findOne({
    email: "admin@acceliaclinicalsolutions.com",
  });
  if (existing) {
    console.log("Admin already exists!");
    process.exit(0);
  }

  await Admin.create({
    name: "Suman Dutta",
    email: "admin@acceliaclinicalsolutions.com",
    password: "8786@Sdutta",
    role: "superadmin",
    isActive: true,
  });

  console.log("✅ Admin created successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
