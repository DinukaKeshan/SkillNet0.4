import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken, getUser } from "../utils/auth";

const API_BASE = import.meta.env.VITE_SVE_API_URL || "http://localhost:5005/api";

const LEVEL_STYLES = {
  Beginner:     { bg: "bg-amber-100",  text: "text-amber-700",  border: "border-amber-300"  },
  Intermediate: { bg: "bg-blue-100",   text: "text-blue-700",   border: "border-blue-300"   },
  Advanced:     { bg: "bg-teal-100",   text: "text-teal-700",   border: "border-teal-300"   },
};

const SKILL_ICONS = {
  java: "☕", react: "⚛️", python: "🐍", node: "🟩",
  typescript: "🔷", javascript: "🟨", mongodb: "🍃",
  css: "🎨", git: "🔀", default: "💡",
};

function getSkillIcon(name = "") {
  const lower = name.toLowerCase();
  return Object.entries(SKILL_ICONS).find(([k]) => lower.includes(k))?.[1] ?? SKILL_ICONS.default;
}

function relativeDate(date) {
  if (!date) return "Never";
  const d = new Date(date);
  const diffMs = Date.now() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 1) return "Today";
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return d.toLocaleDateString();
}

export default function SkillDashboardPage() {
  const navigate = useNavigate();
  const user = getUser();

  const [skills, setSkills]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!user?._id) return;
    const fetchSkills = async () => {
      try {
        const token = getToken();
        const res = await axios.get(`${API_BASE}/skills/student/${user._id}/skills`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSkills(res.data.data || []);
      } catch (err) {
        setError("Failed to load skills. Please refresh.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }
        @keyframes slide-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .anim-up { animation: slide-up 0.5s cubic-bezier(.16,1,.3,1) both; }
        .skill-card { transition: all 0.25s ease; }
        .skill-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(99,102,241,0.1); }
        .shimmer-text {
          background: linear-gradient(90deg,#6366f1 0%,#a78bfa 40%,#6366f1 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 anim-up">
          <div>
            <p className="font-body text-sm text-slate-400">Welcome back, {user?.name?.split(" ")[0] ?? "Student"}</p>
            <h1 className="font-display text-3xl font-extrabold text-slate-900">
              My <span className="shimmer-text">Skills</span>
            </h1>
          </div>
          <button
            id="add-skill-btn"
            onClick={() => navigate("/verify-skill")}
            className="font-body text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg self-start sm:self-auto"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 16px rgba(99,102,241,0.3)" }}>
            + Add Skill
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <p className="font-body text-sm text-red-700">{error}</p>
            <button onClick={() => window.location.reload()}
              className="ml-auto font-body text-sm font-semibold text-red-600 border border-red-300 px-4 py-1.5 rounded-lg hover:bg-red-100 transition">
              Retry
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100" />
                  <div className="flex-1">
                    <div className="h-4 bg-slate-100 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                  </div>
                </div>
                <div className="h-3 bg-slate-100 rounded w-full mb-2" />
                <div className="h-3 bg-slate-100 rounded w-3/4 mb-5" />
                <div className="flex gap-2">
                  <div className="h-8 bg-slate-100 rounded-xl flex-1" />
                  <div className="h-8 bg-slate-100 rounded-xl flex-1" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && skills.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🎯</div>
            <h2 className="font-display text-xl font-extrabold text-slate-800 mb-2">No skills added yet</h2>
            <p className="font-body text-slate-400 text-sm mb-6">Add a skill and take a quiz to see your results here.</p>
            <button id="add-first-skill-btn" onClick={() => navigate("/verify-skill")}
              className="font-body font-semibold text-white px-6 py-2.5 rounded-xl text-sm"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              + Add Your First Skill
            </button>
          </div>
        )}

        {/* Skills grid */}
        {!loading && !error && skills.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skills.map((sp, idx) => {
              const skillName    = sp.skill_name || "Unknown";
              const verified     = sp.verified ?? false;
              const level        = sp.verified_level || "";
              const lastScore    = sp.last_quiz_score ?? null;
              const lastDate     = sp.last_attempt_date;
              const icon         = getSkillIcon(skillName);
              const ls           = LEVEL_STYLES[level] ?? null;

              return (
                <div key={idx} className="skill-card bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                  style={{ animationDelay: `${idx * 0.05}s` }}>
                  {/* Card top gradient accent */}
                  <div className="h-1" style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6)" }} />

                  <div className="p-5">
                    {/* Skill identity row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.10), rgba(139,92,246,0.10))", border: "1px solid rgba(99,102,241,0.15)" }}>
                          {icon}
                        </div>
                        <div>
                          <p className="font-display text-base font-extrabold text-slate-900">{skillName}</p>
                          {ls && (
                            <span className={`font-body text-xs font-semibold px-2 py-0.5 rounded-full border ${ls.bg} ${ls.text} ${ls.border}`}>
                              {level}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Verified chip */}
                      {verified ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full px-2.5 py-1 font-body text-xs font-semibold">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 text-slate-400 rounded-full px-2.5 py-1 font-body text-xs font-medium">
                          Unverified
                        </span>
                      )}
                    </div>

                    {/* Stats row */}
                    <div className="space-y-1 mb-4">
                      {lastScore !== null && (
                        <p className="font-body text-xs text-slate-500">
                          Last score: <span className="font-semibold text-slate-700">{lastScore}%</span>
                        </p>
                      )}
                      {lastDate && (
                        <p className="font-body text-xs text-slate-400">
                          Last attempt: {relativeDate(lastDate)}
                        </p>
                      )}
                      {!lastDate && (
                        <p className="font-body text-xs text-slate-300 italic">No quiz attempts yet</p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <button
                        id={`retake-${skillName.toLowerCase()}-btn`}
                        onClick={() => navigate(`/quiz/${skillName.toLowerCase()}`)}
                        className="flex-1 font-body text-xs font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 py-2 rounded-lg transition-all duration-150">
                        🔄 Retake
                      </button>
                      <button
                        id={`roadmap-${skillName.toLowerCase()}-btn`}
                        onClick={() => navigate(`/roadmap/${skillName.toLowerCase()}`)}
                        className="flex-1 font-body text-xs font-semibold text-violet-600 border border-violet-200 bg-violet-50 hover:bg-violet-100 py-2 rounded-lg transition-all duration-150">
                        📍 Roadmap
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
