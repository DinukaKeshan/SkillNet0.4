import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getSkills, deleteSkill } from "../services/skillService";

export default function SkillsPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [skills, setSkills] = useState([]);
  const [verifiedSkills, setVerifiedSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const res = await getSkills();
      const data = res.data;
      const allSkills = data.skills || [];
      const verified = data.verifiedSkills || [];
      setSkills(allSkills);
      setVerifiedSkills(verified);
    } catch (err) {
      console.error("Error fetching skills:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const verifiedNames = verifiedSkills.map(v =>
    (typeof v === "string" ? v : v?.skill || "").toLowerCase()
  );

  const verified = skills.filter(s => {
    const name = typeof s === "string" ? s : s?.skill_name || "";
    return verifiedNames.includes(name.toLowerCase());
  });

  const unverified = skills.filter(s => {
    const name = typeof s === "string" ? s : s?.skill_name || "";
    return !verifiedNames.includes(name.toLowerCase());
  });

  const getName = (s) => typeof s === "string" ? s : s?.skill_name || s?.skill || "Unknown";

  const handleDelete = async (skill) => {
    if (!confirm(`Remove "${getName(skill)}" from your skills?`)) return;
    try {
      await deleteSkill(getName(skill));
      fetchData();
    } catch (err) {
      console.error("Error deleting skill:", err);
    }
  };

  if (!user?._id) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--sn-bg)" }}>
        <p className="font-body text-slate-500">Please log in to view your skills.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--sn-bg)" }}>
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-body text-slate-400">Loading skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "var(--sn-bg)" }}>
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="font-display text-3xl font-extrabold text-slate-900 mb-2">
            My Skills
          </h1>
          <p className="font-body text-slate-500">
            Track your verified and pending skills
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Skills", value: skills.length, color: "var(--sn-primary)" },
            { label: "Verified", value: verified.length, color: "#10b981" },
            { label: "Pending", value: unverified.length, color: "#f59e0b" },
          ].map(stat => (
            <div key={stat.label} className="bg-white border border-slate-100 shadow-sm p-5 text-center"
              style={{ borderRadius: "var(--sn-card-radius)" }}>
              <p className="font-display text-2xl font-extrabold" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="font-body text-xs text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Verified Skills */}
        <div>
          <h2 className="font-display text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Verified Skills
          </h2>
          {verified.length === 0 ? (
            <div className="bg-white border border-slate-100 shadow-sm p-6 text-center"
              style={{ borderRadius: "var(--sn-card-radius)" }}>
              <p className="font-body text-slate-400 text-sm">No verified skills yet. Take a quiz to get verified!</p>
              <button onClick={() => navigate("/verify-skill")}
                className="mt-3 font-body text-sm font-semibold text-white px-5 py-2 rounded-lg"
                style={{ background: "var(--sn-gradient)" }}>
                Verify a Skill →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {verified.map((skill, i) => {
                const name = getName(skill);
                const vs = verifiedSkills.find(v =>
                  (typeof v === "string" ? v : v?.skill || "").toLowerCase() === name.toLowerCase()
                );
                const date = vs?.verifiedAt ? new Date(vs.verifiedAt).toLocaleDateString() : "";
                return (
                  <div key={i} className="bg-white border border-slate-100 shadow-sm flex items-center justify-between px-5 py-4 hover:border-emerald-200 transition-all duration-200"
                    style={{ borderRadius: "var(--sn-card-radius)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-sm font-bold">✓</div>
                      <div>
                        <p className="font-body text-sm font-semibold text-slate-800">{name}</p>
                        {date && <p className="font-body text-xs text-slate-400">Verified {date}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-body text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">Verified</span>
                      <button onClick={() => navigate(`/roadmap/${encodeURIComponent(name)}`)}
                        className="font-body text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors">
                        Roadmap →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Unverified Skills */}
        <div>
          <h2 className="font-display text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Not Yet Verified
          </h2>
          {unverified.length === 0 ? (
            <div className="bg-white border border-slate-100 shadow-sm p-6 text-center"
              style={{ borderRadius: "var(--sn-card-radius)" }}>
              <p className="font-body text-slate-400 text-sm">All your skills are verified! 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {unverified.map((skill, i) => {
                const name = getName(skill);
                return (
                  <div key={i} className="bg-white border border-slate-100 shadow-sm flex items-center justify-between px-5 py-4 hover:border-amber-200 transition-all duration-200"
                    style={{ borderRadius: "var(--sn-card-radius)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 text-sm font-bold">?</div>
                      <div>
                        <p className="font-body text-sm font-semibold text-slate-800">{name}</p>
                        <p className="font-body text-xs text-slate-400">Pending verification</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-body text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">Pending</span>
                      <button onClick={() => navigate(`/quiz/${encodeURIComponent(name)}`)}
                        className="font-body text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-all hover:opacity-90"
                        style={{ background: "var(--sn-primary)" }}>
                        Take Quiz
                      </button>
                      <button onClick={() => handleDelete(skill)}
                        className="font-body text-xs text-red-400 hover:text-red-600 font-medium transition-colors">
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
