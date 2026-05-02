import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // The token comes from SkillNet and contains { id (MySQL int), role, name }.
    // SVE uses MongoDB, so we need to find-or-create a local user document
    // keyed by the SkillNet ID to keep all downstream controllers working.
    const skillnetId = decoded.id;
    const skillnetName = decoded.name || "SkillNet User";

    // Use a synthetic email derived from the SkillNet ID to guarantee uniqueness
    const syntheticEmail = `skillnet_${skillnetId}@bridge.local`;

    let user = await User.findOne({ email: syntheticEmail });

    if (!user) {
      // Auto-provision a local SVE user for this SkillNet student
      user = await User.create({
        name: skillnetName,
        email: syntheticEmail,
        provider: "local",
        skills: [],
        skillProfiles: [],
        verifiedSkills: [],
      });
      console.log(`🔗 Auto-created SVE user for SkillNet ID ${skillnetId}: ${user._id}`);
    }

    req.user = user; // full Mongoose document — req.user._id works everywhere
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};
