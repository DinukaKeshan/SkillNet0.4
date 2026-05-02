// controllers/skill.controller.js
import User from "../models/user.model.js";
import Quiz from "../models/quiz.model.js";

/**
 * Add skill to user profile
 * POST /api/skills
 */
export const addSkill = async (req, res) => {
  const { skill } = req.body;

  if (!skill) {
    return res.status(400).json({ message: "Skill is required" });
  }

  try {
    const user = await User.findById(req.user._id);

    // Prevent duplicates (case-insensitive) — handle both String and Object entries in skills[]
    const exists = user.skills.some(s => {
      const name = typeof s === "string" ? s : s?.skill_name ?? "";
      return name.toLowerCase() === skill.toLowerCase();
    });

    if (exists) {
      return res.status(400).json({ message: "Skill already added" });
    }

    user.skills.push(skill);
    await user.save();

    res.status(201).json({
      message: "Skill added successfully",
      skills: user.skills
    });
  } catch (error) {
    console.error("addSkill error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get user skills
 * GET /api/skills
 */
export const getSkills = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("skills verifiedSkills skillProfiles");
    res.json({
      skills: user.skills || [],
      verifiedSkills: user.verifiedSkills || [],
      skillProfiles: user.skillProfiles || [],
    });
  } catch (error) {
    console.error("getSkills error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Claim verification badge
 * POST /api/skills/claim-badge
 *
 * Threshold changed to 70% (was 80%).
 * Badge tier logic removed — badge is always "Verified".
 */
export const claimBadge = async (req, res) => {
  console.log("📥 Claim badge request received:", req.body);
  console.log("👤 User:", req.user?._id);

  const { skill, score, total, percentage } = req.body;

  if (!skill || percentage === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (percentage < 70) {
    return res.status(400).json({
      message: "Score must be 70% or higher to earn a Verified badge"
    });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Single badge type — "Verified"
    const badge = "Verified";
    console.log(`✅ Awarding Verified badge for ${skill}`);

    const verifiedSkill = {
      skill,
      badge,
      verifiedAt: new Date(),
      score,
      total,
      percentage,
    };

    const existingIndex = user.verifiedSkills.findIndex(
      vs => vs.skill?.toLowerCase() === skill.toLowerCase()
    );

    if (existingIndex !== -1) {
      user.verifiedSkills[existingIndex] = verifiedSkill;
    } else {
      user.verifiedSkills.push(verifiedSkill);
    }

    // Also update skillProfiles
    const profileIndex = user.skillProfiles?.findIndex(
      sp => sp.skill_name?.toLowerCase() === skill.toLowerCase()
    );
    if (profileIndex !== undefined && profileIndex !== -1) {
      user.skillProfiles[profileIndex].verified = true;
    } else if (user.skillProfiles) {
      user.skillProfiles.push({
        skill_name:        skill,
        verified:          true,
        last_quiz_score:   percentage,
        last_attempt_date: new Date(),
      });
    }

    await user.save();
    console.log("✅ Badge claimed successfully!");

    res.json({
      message: "Badge claimed successfully!",
      verifiedSkill: { skill, badge, score, total, percentage }
    });
  } catch (error) {
    console.error("❌ claimBadge error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

/**
 * Get student skills (rich data for dashboard)
 * GET /api/skills/student/:id/skills
 */
export const getStudentSkills = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("skillProfiles verifiedSkills skills");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Merge skillProfiles with legacy skills array for a unified response
    const profileMap = new Map(
      (user.skillProfiles || []).map(sp => [sp.skill_name?.toLowerCase(), sp])
    );

    // Ensure all plain-string skills have a profile entry too
    const legacySkills = (user.skills || []).map(s => {
      const name = typeof s === "string" ? s : s?.skill_name ?? "Unknown";
      return name;
    });

    for (const skillName of legacySkills) {
      if (!profileMap.has(skillName.toLowerCase())) {
        profileMap.set(skillName.toLowerCase(), { skill_name: skillName });
      }
    }

    return res.status(200).json({
      success: true,
      data: Array.from(profileMap.values()),
    });
  } catch (error) {
    console.error("getStudentSkills error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Get quiz history for a student + skill
 * GET /api/quiz/history/:studentId/:skill  (also accessible here for reuse)
 */
export const getQuizHistory = async (req, res) => {
  try {
    const { studentId, skill } = req.params;

    const attempts = await Quiz.find({ user: studentId, skill })
      .sort({ createdAt: -1 })
      .select("score_pct skill_level verified attempt_number time_taken_sec createdAt");

    return res.status(200).json({ success: true, data: attempts });
  } catch (error) {
    console.error("getQuizHistory error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Get roadmap for a student + skill
 * GET /api/roadmap/:studentId/:skill
 * Note: studentId param is kept for URL compat but we use req.user from protect middleware
 */
export const getRoadmap = async (req, res) => {
  try {
    const { skill } = req.params;
    // Use the authenticated user from protect middleware — more reliable than URL param
    const user = req.user;
    console.log(`📍 getRoadmap: userId=${user._id}, skill="${skill}"`);

    // Reload skillProfiles if not populated on req.user
    let profiles = user.skillProfiles;
    if (!profiles || profiles.length === 0) {
      const freshUser = await User.findById(user._id).select("skillProfiles");
      profiles = freshUser?.skillProfiles || [];
    }

    console.log(`📍 getRoadmap: user has ${profiles.length} skill profile(s):`,
      profiles.map(sp => sp.skill_name));

    const profile = profiles.find(
      sp => sp.skill_name?.toLowerCase() === skill.toLowerCase()
    );

    if (!profile || !profile.roadmap) {
      console.log(`📍 getRoadmap: no profile/roadmap found for skill "${skill}"`);
      return res.status(404).json({
        success: false,
        error: "No roadmap found for this skill — take a quiz first"
      });
    }

    // Convert Mongoose subdocument to plain object so Mixed fields serialize cleanly
    const profileData = profile.toObject ? profile.toObject() : profile;
    console.log(`📍 getRoadmap: returning profile for "${profileData.skill_name}", roadmap keys:`,
      Object.keys(profileData.roadmap || {}));

    return res.status(200).json({ success: true, data: profileData });
  } catch (error) {
    console.error("getRoadmap error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Sync-add skill from SkillNet dashboard (fire-and-forget).
 * POST /api/skills/sync-add
 * Idempotent — if skill already exists, no-op.
 */
export const syncAddSkill = async (req, res) => {
  const { skill } = req.body;
  if (!skill) {
    return res.status(400).json({ message: "Skill is required" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const exists = user.skills.some(s => {
      const name = typeof s === "string" ? s : s?.skill_name ?? "";
      return name.toLowerCase() === skill.toLowerCase();
    });

    if (!exists) {
      user.skills.push(skill);
      await user.save();
    }

    return res.status(200).json({ message: "Skill synced" });
  } catch (error) {
    console.error("syncAddSkill error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Sync-remove skill from SkillNet dashboard (fire-and-forget).
 * POST /api/skills/sync-remove
 * Removes from skills[], skillProfiles[], verifiedSkills[],
 * and deletes associated Quiz + QuizHistory documents.
 */
export const syncRemoveSkill = async (req, res) => {
  const { skill } = req.body;
  if (!skill) {
    return res.status(400).json({ message: "Skill is required" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove from skills[]
    user.skills = user.skills.filter(s => {
      const name = typeof s === "string" ? s : s?.skill_name ?? "";
      return name.toLowerCase() !== skill.toLowerCase();
    });

    // Remove from skillProfiles[]
    if (user.skillProfiles) {
      user.skillProfiles = user.skillProfiles.filter(
        sp => sp.skill_name?.toLowerCase() !== skill.toLowerCase()
      );
    }

    // Remove from verifiedSkills[]
    if (user.verifiedSkills) {
      user.verifiedSkills = user.verifiedSkills.filter(
        vs => vs.skill?.toLowerCase() !== skill.toLowerCase()
      );
    }

    await user.save();

    // Delete associated Quiz and QuizHistory documents
    const { default: QuizHistory } = await import("../models/quizHistory.model.js");
    await Quiz.deleteMany({ user: req.user._id, skill: { $regex: new RegExp(`^${skill}$`, "i") } });
    await QuizHistory.deleteMany({ user: req.user._id, skill: { $regex: new RegExp(`^${skill}$`, "i") } });

    return res.status(200).json({ message: "Skill removed and synced" });
  } catch (error) {
    console.error("syncRemoveSkill error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete a skill from the user's skills[] array in SVE.
 * DELETE /api/skills
 */
export const deleteSkill = async (req, res) => {
  const { skill } = req.body;
  if (!skill) {
    return res.status(400).json({ message: "Skill is required" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.skills = user.skills.filter(s => {
      const name = typeof s === "string" ? s : s?.skill_name ?? "";
      return name.toLowerCase() !== skill.toLowerCase();
    });

    await user.save();
    return res.status(200).json({ message: "Skill deleted", skills: user.skills });
  } catch (error) {
    console.error("deleteSkill error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};