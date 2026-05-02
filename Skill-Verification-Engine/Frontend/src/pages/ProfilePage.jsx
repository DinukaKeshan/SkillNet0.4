import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getSkills } from "../services/skillService";
import { getAllQuizHistory } from "../services/quizService";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [skills, setSkills] = useState([]);
  const [verifiedSkills, setVerifiedSkills] = useState([]);
  const [quizCount, setQuizCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [skillRes, quizRes] = await Promise.all([
          getSkills(),
          getAllQuizHistory(),
        ]);
        setSkills(skillRes.data?.skills || []);
        setVerifiedSkills(skillRes.data?.verifiedSkills || []);
        setQuizCount((quizRes.data?.data || []).length);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user]);

  const verifiedNames = verifiedSkills.map(v =>
    (typeof v === "string" ? v : v?.skill || "").toLowerCase()
  );
  const verifiedCount = skills.filter(s => {
    const name = typeof s === "string" ? s : s?.skill_name || "";
    return verifiedNames.includes(name.toLowerCase());
  }).length;
  const pendingCount = skills.length - verifiedCount;

  const getName = (s) => typeof s === "string" ? s : s?.skill_name || s?.skill || "Unknown";
  const isVerified = (s) => verifiedNames.includes(getName(s).toLowerCase());

  if (!user?._id) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--sn-bg)" }}>
        <p className="font-body text-slate-500">Please log in to view your profile.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--sn-bg)" }}>
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-body text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "var(--sn-bg)" }}>
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Profile Card */}
        <div className="bg-white border border-slate-100 shadow-sm overflow-hidden"
          style={{ borderRadius: "var(--sn-card-radius)" }}>
          {/* Gradient Banner */}
          <div className="h-24" style={{ background: "var(--sn-gradient)" }} />
          <div className="px-7 pb-6 -mt-10">
            <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-3xl mb-4"
              style={{ background: "linear-gradient(135deg, #e0e7ff, #ede9fe)" }}>
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <h1 className="font-display text-2xl font-extrabold text-slate-900 mb-1">
              {user.name || "SkillNet User"}
            </h1>
            <p className="font-body text-sm text-slate-400">
              {user.email || ""}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Skills", value: skills.length, color: "var(--sn-primary)" },
            { label: "Verified", value: verifiedCount, color: "#10b981" },
            { label: "Pending", value: pendingCount, color: "#f59e0b" },
            { label: "Quizzes", value: quizCount, color: "var(--sn-accent)" },
          ].map(stat => (
            <div key={stat.label} className="bg-white border border-slate-100 shadow-sm p-4 text-center"
              style={{ borderRadius: "var(--sn-card-radius)" }}>
              <p className="font-display text-xl font-extrabold" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="font-body text-[11px] text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Skill List */}
        <div className="bg-white border border-slate-100 shadow-sm p-6"
          style={{ borderRadius: "var(--sn-card-radius)" }}>
          <h2 className="font-display text-lg font-extrabold text-slate-900 mb-5">
            All Skills
          </h2>
          {skills.length === 0 ? (
            <p className="font-body text-sm text-slate-400 text-center py-4">
              No skills added yet. Start by adding skills from the SkillNet dashboard.
            </p>
          ) : (
            <div className="space-y-2">
              {skills.map((skill, i) => {
                const name = getName(skill);
                const ver = isVerified(skill);
                return (
                  <div key={i} className="flex items-center justify-between py-3 px-4 border border-slate-50 hover:border-slate-100 transition-all duration-200"
                    style={{ borderRadius: "8px" }}>
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${ver ? "bg-emerald-500" : "bg-amber-400"}`} />
                      <span className="font-body text-sm font-medium text-slate-700">{name}</span>
                    </div>
                    <span className={`font-body text-xs font-semibold px-2.5 py-1 rounded-full ${
                      ver
                        ? "text-emerald-600 bg-emerald-50 border border-emerald-200"
                        : "text-amber-600 bg-amber-50 border border-amber-200"
                    }`}>
                      {ver ? "Verified ✓" : "Pending"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Achievement Badges */}
        {verifiedSkills.length > 0 && (
          <div className="bg-white border border-slate-100 shadow-sm p-6"
            style={{ borderRadius: "var(--sn-card-radius)" }}>
            <h2 className="font-display text-lg font-extrabold text-slate-900 mb-5">
              Achievement Badges
            </h2>
            <div className="flex flex-wrap gap-3">
              {verifiedSkills.map((vs, i) => {
                const name = typeof vs === "string" ? vs : vs?.skill || "Skill";
                const badge = typeof vs === "object" ? vs?.badge || "Verified" : "Verified";
                return (
                  <div key={i} className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-full">
                    <span className="text-sm">🏅</span>
                    <span className="font-body text-sm font-semibold text-indigo-700">{name}</span>
                    <span className="font-body text-[10px] text-indigo-400">{badge}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Back to SkillNet */}
        <div className="text-center">
          <a href="http://localhost:3000/student"
            className="inline-flex items-center gap-2 font-body text-sm font-semibold text-white px-6 py-3 rounded-xl transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: "var(--sn-gradient)", boxShadow: "0 4px 18px rgba(99,102,241,0.25)" }}>
            ← Back to SkillNet Dashboard
          </a>
        </div>

      </div>
    </div>
  );
}
