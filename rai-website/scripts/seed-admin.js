/**
 * Seed Admin User Script
 * Run ONCE to create the admin account in MongoDB.
 *
 * Usage:
 *   1. Make sure your .env.local has MONGODB_URI configured.
 *   2. Run: node --env-file=.env.local scripts/seed-admin.js
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not set. Create .env.local first.");
    process.exit(1);
}

// Admin credentials — change before running!
const ADMIN_EMAIL = "rai@jnnce.ac.in";
const ADMIN_PASSWORD = "rai#@123";
const ADMIN_NAME = "RAI Admin";

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
}, { timestamps: true });

async function main() {
    console.log("🔗 Connecting to MongoDB…");
    await mongoose.connect(MONGODB_URI, { dbName: "rai_website" });

    const User = mongoose.models.User || mongoose.model("User", UserSchema);

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
        console.log(`⚠️  Admin user already exists: ${ADMIN_EMAIL}`);
        await mongoose.disconnect();
        return;
    }

    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await User.create({ email: ADMIN_EMAIL, password: hashed, name: ADMIN_NAME });

    console.log(`✅ Admin user created successfully!`);
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   (Change the password after first login)`);

    await mongoose.disconnect();
}

main().catch(err => {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
});
