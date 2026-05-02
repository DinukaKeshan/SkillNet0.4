import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { addSkill, getSkills } from "../services/skillService";

export default function VerifySkill() {
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState([]);
  const [verifiedSkills, setVerifiedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [addError, setAddError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = "http://localhost:3000";
      return;
    }
    // Read pending skill from sessionStorage (set by SkillNet cross-app navigation)
    const pendingSkill = sessionStorage.getItem("sve_pending_skill");
    if (pendingSkill) {
      setSkill(pendingSkill);
      sessionStorage.removeItem("sve_pending_skill");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await getSkills();
        setSkills(res.data.skills || []);
        setVerifiedSkills(res.data.verifiedSkills || []);
      } catch {
        console.error("Failed to load skills");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const handleAddSkill = async () => {
    if (!skill.trim()) return;
    setAddError("");
    setLoading(true);
    try {
      const res = await addSkill(skill.trim());
      setSkills(res.data.skills);
      setSkill("");
    } catch (err) {
      setAddError(err.response?.data?.message || "Failed to add skill");
    } finally {
      setLoading(false);
    }
  };

  const startVerification = (skillName) => navigate(`/quiz/${skillName}`);

  const getVerificationStatus = (skillName) =>
    verifiedSkills.find((vs) => vs.skill.toLowerCase() === skillName.toLowerCase());

  const badgeConfig = {
    Platinum: {
      gradient: "linear-gradient(135deg, #e2e8f0, #94a3b8)",
      text: "#1e293b",
      glow: "rgba(148,163,184,0.4)",
      emoji: "💎",
      ring: "#cbd5e1",
    },
    Gold: {
      gradient: "linear-gradient(135deg, #fbbf24, #f59e0b)",
      text: "#78350f",
      glow: "rgba(251,191,36,0.4)",
      emoji: "🥇",
      ring: "#fcd34d",
    },
    Silver: {
      gradient: "linear-gradient(135deg, #d1d5db, #9ca3af)",
      text: "#1f2937",
      glow: "rgba(209,213,219,0.4)",
      emoji: "🥈",
      ring: "#e5e7eb",
    },
    Bronze: {
      gradient: "linear-gradient(135deg, #fb923c, #ea580c)",
      text: "#7c2d12",
      glow: "rgba(251,146,60,0.4)",
      emoji: "🥉",
      ring: "#fdba74",
    },
  };

  const getBadge = (badge) => badgeConfig[badge] || { gradient: "#e2e8f0", text: "#374151", glow: "transparent", emoji: "🏅", ring: "#e2e8f0" };

  const skillIcons = { java: "☕", react: "⚛️", python: "🐍", node: "🟩", typescript: "🔷", javascript: "🟨", default: "💡" };
  const getSkillIcon = (name) => {
    const lower = name.toLowerCase();
    return Object.entries(skillIcons).find(([k]) => lower.includes(k))?.[1] ?? skillIcons.default;
  };

  return (
    <div className="min-h-screen bg-[#f8f7ff] px-4 py-12 relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
        @keyframes slide-up { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fade-in { from{opacity:0} to{opacity:1} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pop-in { 0%{opacity:0;transform:scale(0.9)} 100%{opacity:1;transform:scale(1)} }
        .anim-slide-up { animation: slide-up 0.6s cubic-bezier(.16,1,.3,1) both; }
        .anim-slide-up-d1 { animation: slide-up 0.6s cubic-bezier(.16,1,.3,1) 0.1s both; }
        .anim-slide-up-d2 { animation: slide-up 0.6s cubic-bezier(.16,1,.3,1) 0.2s both; }
        .anim-slide-up-d3 { animation: slide-up 0.6s cubic-bezier(.16,1,.3,1) 0.3s both; }
        .anim-pop-in { animation: pop-in 0.4s cubic-bezier(.16,1,.3,1) both; }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-float-d { animation: float 5s ease-in-out 1.5s infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, #6366f1 0%, #a78bfa 40%, #6366f1 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .input-skill {
          flex: 1;
          padding: 13px 18px;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          color: #334155;
          background: white;
          outline: none;
          transition: all 0.2s ease;
        }
        .input-skill:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.08);
        }
        .input-skill::placeholder { color: #94a3b8; }
        .add-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          padding: 13px 24px;
          border-radius: 14px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .add-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          box-shadow: 0 6px 24px rgba(99,102,241,0.4);
          transform: translateY(-1px);
        }
        .add-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .skill-card {
          background: white;
          border: 1.5px solid #f1f5f9;
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.25s ease;
          animation: pop-in 0.4s cubic-bezier(.16,1,.3,1) both;
        }
        .skill-card:hover {
          border-color: rgba(99,102,241,0.25);
          box-shadow: 0 6px 24px rgba(99,102,241,0.08);
          transform: translateY(-2px);
        }
        .verify-btn {
          padding: 8px 20px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          border: none;
          transition: all 0.25s ease;
        }
        .verify-btn.new {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
        }
        .verify-btn.new:hover {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          box-shadow: 0 4px 16px rgba(99,102,241,0.35);
          transform: translateY(-1px);
        }
        .verify-btn.reverify {
          background: #f0f9ff;
          color: #0284c7;
          border: 1.5px solid #bae6fd;
        }
        .verify-btn.reverify:hover {
          background: #e0f2fe;
          border-color: #7dd3fc;
          transform: translateY(-1px);
        }
        .progress-bar-fill {
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          transition: width 1.2s cubic-bezier(.16,1,.3,1);
        }
        .verified-card {
          background: white;
          border-radius: 18px;
          padding: 20px;
          border: 1.5px solid #f1f5f9;
          transition: all 0.3s ease;
          animation: pop-in 0.4s cubic-bezier(.16,1,.3,1) both;
        }
        .verified-card:hover {
          box-shadow: 0 12px 40px rgba(99,102,241,0.1);
          border-color: rgba(99,102,241,0.2);
          transform: translateY(-3px);
        }
      `}</style>

      {/* Background blobs */}
      <div className="absolute top-[-8%] right-[-4%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-8%] left-[-4%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)" }} />
      <div className="absolute top-[12%] left-[4%] w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 opacity-50 animate-float pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-6 h-6 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 opacity-40 animate-float-d pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">

        {/* Page Header */}
        <div className="mb-10 anim-slide-up">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="font-body text-indigo-600 text-sm font-medium">AI-Powered Assessment</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold text-slate-900 mb-2">
            Skill <span className="shimmer-text">Verification</span>
          </h1>
          <p className="font-body text-slate-500">
            Add a skill, take the AI assessment, and earn a verified badge.
          </p>
        </div>

        {/* Add Skill Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6 anim-slide-up-d1">
          <h2 className="font-display text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
              <span className="text-white">+</span>
            </span>
            Add a Skill
          </h2>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="e.g. React, Java, Python, Node.js..."
              className="input-skill"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
            />
            <button onClick={handleAddSkill} disabled={loading} className="add-btn">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Adding...
                </span>
              ) : "Add Skill"}
            </button>
          </div>

          {addError && (
            <div className="mt-3 flex items-center gap-2 text-red-500 text-sm font-body bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <span>⚠️</span> {addError}
            </div>
          )}
        </div>

        {/* Skills List */}
        <div className="anim-slide-up-d2">
          {fetchLoading ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
              <svg className="animate-spin w-8 h-8 mx-auto text-indigo-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <p className="font-body text-slate-400 mt-3 text-sm">Loading your skills...</p>
            </div>
          ) : skills.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-display text-lg font-bold text-slate-800 mb-5 flex items-center justify-between">
                <span>Your Skills</span>
                <span className="font-body text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                  {skills.length} added
                </span>
              </h2>
              <div className="space-y-3">
                {skills.map((s, i) => {
                  const verification = getVerificationStatus(s);
                  const isVerified = !!verification;
                  const badge = isVerified ? getBadge(verification.badge) : null;

                  return (
                    <div key={i} className="skill-card" style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Skill icon */}
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))", border: "1px solid rgba(99,102,241,0.15)" }}>
                          {getSkillIcon(s)}
                        </div>

                        <div className="min-w-0">
                          <span className="font-display text-base font-bold text-slate-800 block truncate">{s}</span>
                          {isVerified && (
                            <span className="font-body text-xs text-slate-400">
                              Verified · {new Date(verification.verifiedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {/* Badge pill */}
                        {isVerified && (
                          <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm ml-1"
                            style={{
                              background: badge.gradient,
                              color: badge.text,
                              boxShadow: `0 2px 10px ${badge.glow}`,
                              border: `1px solid ${badge.ring}`,
                            }}>
                            <span>{badge.emoji}</span>
                            <span>{verification.badge}</span>
                            <span className="opacity-70">{verification.percentage}%</span>
                          </div>
                        )}
                      </div>

                      {/* Score bar (if verified) */}
                      {isVerified && (
                        <div className="hidden sm:flex flex-col justify-center mx-4 w-24">
                          <div className="flex justify-between mb-1">
                            <span className="font-body text-[10px] text-slate-400">Score</span>
                            <span className="font-body text-[10px] font-semibold text-indigo-500">{verification.percentage}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="progress-bar-fill" style={{ width: `${verification.percentage}%` }} />
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => startVerification(s)}
                        className={`verify-btn shrink-0 ${isVerified ? "reverify" : "new"}`}
                      >
                        {isVerified ? "↺ Re-verify" : "Verify →"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl"
                style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))" }}>
                💡
              </div>
              <p className="font-display text-base font-bold text-slate-700 mb-1">No skills added yet</p>
              <p className="font-body text-sm text-slate-400">Type a skill above and press Add to get started.</p>
            </div>
          )}
        </div>

        {/* Verified Skills Grid */}
        {verifiedSkills.length > 0 && (
          <div className="mt-8 anim-slide-up-d3">
            {/* Section header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display text-2xl font-extrabold text-slate-900">
                  Verified <span className="shimmer-text">Achievements</span>
                </h2>
                <p className="font-body text-sm text-slate-400 mt-0.5">{verifiedSkills.length} skill{verifiedSkills.length > 1 ? "s" : ""} certified</p>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-2 rounded-full text-sm font-semibold font-body">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                All Verified
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {verifiedSkills.map((vs, i) => {
                const badge = getBadge(vs.badge);
                return (
                  <div key={i} className="verified-card" style={{ animationDelay: `${i * 0.07}s` }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))", border: "1px solid rgba(99,102,241,0.15)" }}>
                          {getSkillIcon(vs.skill)}
                        </div>
                        <div>
                          <h3 className="font-display text-base font-bold text-slate-800">{vs.skill}</h3>
                          <p className="font-body text-xs text-slate-400">
                            {new Date(vs.verifiedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                        style={{
                          background: badge.gradient,
                          color: badge.text,
                          boxShadow: `0 2px 12px ${badge.glow}`,
                          border: `1px solid ${badge.ring}`,
                        }}>
                        {badge.emoji} {vs.badge}
                      </div>
                    </div>

                    {/* Score row */}
                    <div className="mb-3">
                      <div className="flex justify-between mb-1.5">
                        <span className="font-body text-xs text-slate-400">
                          Score: <strong className="text-slate-700">{vs.score}/{vs.total}</strong>
                        </span>
                        <span className="font-body text-xs font-bold text-indigo-500">{vs.percentage}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="progress-bar-fill" style={{ width: `${vs.percentage}%` }} />
                      </div>
                    </div>

                    <button
                      onClick={() => startVerification(vs.skill)}
                      className="w-full py-2 text-xs font-semibold font-body text-indigo-500 border border-indigo-100 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors duration-200"
                    >
                      ↺ Re-verify Skill
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}