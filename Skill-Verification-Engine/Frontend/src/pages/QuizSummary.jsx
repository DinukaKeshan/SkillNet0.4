import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { claimBadge } from "../services/skillService";

const skillIcons = {
  java: "☕", react: "⚛️", python: "🐍", node: "🟩",
  typescript: "🔷", javascript: "🟨", default: "💡",
};
const getSkillIcon = (name = "") => {
  const lower = name.toLowerCase();
  return Object.entries(skillIcons).find(([k]) => lower.includes(k))?.[1] ?? skillIcons.default;
};

const OPTION_LABELS = ["A", "B", "C", "D"];

function getResult(percentage) {
  if (percentage === 100) return { message: "Perfect Score! True Expert.", emoji: "🌟", color: "#10b981", bg: "#ecfdf5", border: "#6ee7b7" };
  if (percentage >= 90)  return { message: "Outstanding! Near-perfect mastery.", emoji: "🚀", color: "#6366f1", bg: "#eef2ff", border: "#a5b4fc" };
  if (percentage >= 70)  return { message: "Verified! Keep building on this.", emoji: "✅", color: "#8b5cf6", bg: "#f5f3ff", border: "#c4b5fd" };
  if (percentage >= 50)  return { message: "Good effort! Keep practicing.", emoji: "💪", color: "#f59e0b", bg: "#fffbeb", border: "#fcd34d" };
  return { message: "Keep learning — you'll get there.", emoji: "🌱", color: "#f97316", bg: "#fff7ed", border: "#fdba74" };
}

export default function QuizSummary() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [claimError, setClaimError] = useState("");

  if (!state?.result || !state?.skill) {
    navigate("/");
    return null;
  }

  const { result, skill } = state;
  const { score, total, report } = result;
  const percentage = Math.round((score / total) * 100);
  const verified = percentage >= 70;
  const res = getResult(percentage);
  const icon = getSkillIcon(skill);

  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference * (1 - percentage / 100);

  const handleClaimBadge = async () => {
    setClaiming(true);
    setClaimError("");
    try {
      await claimBadge(skill, score, total, percentage);
      setClaimed(true);
      setTimeout(() => navigate("/verify-skill"), 2000);
    } catch (err) {
      setClaimError(err.response?.data?.message || "Failed to claim badge. Please try again.");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7ff] py-10 px-4 relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
        @keyframes slide-up { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pop-in { 0%{opacity:0;transform:scale(0.88)} 100%{opacity:1;transform:scale(1)} }
        @keyframes stroke-draw { from{stroke-dashoffset:${circumference}} to{stroke-dashoffset:${dashOffset}} }
        @keyframes count-up { from{opacity:0;transform:scale(0.7)} to{opacity:1;transform:scale(1)} }
        @keyframes badge-pop { 0%{opacity:0;transform:scale(0.5) rotate(-15deg)} 70%{transform:scale(1.1) rotate(3deg)} 100%{opacity:1;transform:scale(1) rotate(0deg)} }
        .anim-slide-up   { animation: slide-up 0.6s cubic-bezier(.16,1,.3,1) both; }
        .anim-slide-up-d1{ animation: slide-up 0.6s cubic-bezier(.16,1,.3,1) 0.1s both; }
        .anim-slide-up-d2{ animation: slide-up 0.6s cubic-bezier(.16,1,.3,1) 0.2s both; }
        .anim-slide-up-d3{ animation: slide-up 0.6s cubic-bezier(.16,1,.3,1) 0.3s both; }
        .anim-pop { animation: pop-in 0.5s cubic-bezier(.16,1,.3,1) 0.2s both; }
        .anim-badge { animation: badge-pop 0.7s cubic-bezier(.16,1,.3,1) 0.4s both; }
        .anim-count { animation: count-up 0.5s cubic-bezier(.16,1,.3,1) 0.3s both; }
        .animate-float  { animation: float 5s ease-in-out infinite; }
        .animate-float-d{ animation: float 5s ease-in-out 1.5s infinite; }
        .stroke-anim { animation: stroke-draw 1.2s cubic-bezier(.16,1,.3,1) 0.5s both; }
        .shimmer-text {
          background: linear-gradient(90deg,#6366f1 0%,#a78bfa 40%,#6366f1 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .claim-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          transition: all 0.3s ease;
        }
        .claim-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #059669, #047857);
          box-shadow: 0 8px 28px rgba(16,185,129,0.4);
          transform: translateY(-2px);
        }
        .claim-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
        .retry-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          transition: all 0.3s ease;
        }
        .retry-btn:hover {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          box-shadow: 0 8px 28px rgba(99,102,241,0.4);
          transform: translateY(-2px);
        }
        .report-card { transition: all 0.25s ease; border: 1.5px solid #f1f5f9; }
        .report-card:hover { border-color: rgba(99,102,241,0.2); box-shadow: 0 6px 24px rgba(99,102,241,0.07); transform: translateY(-2px); }
      `}</style>

      {/* BG blobs */}
      <div className="absolute top-[-8%] right-[-4%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-8%] left-[-4%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)" }} />
      <div className="absolute top-[10%] left-[4%] w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 opacity-50 animate-float pointer-events-none" />
      <div className="absolute bottom-[18%] right-[5%] w-6 h-6 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 opacity-40 animate-float-d pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto space-y-5">

        {/* ── Hero Result Card ─────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden anim-slide-up">
          {/* Top gradient bar */}
          <div className="h-1" style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)" }} />

          <div className="px-8 pt-8 pb-6">
            {/* Skill identity row */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: "linear-gradient(135deg,rgba(99,102,241,.12),rgba(139,92,246,.12))", border: "1px solid rgba(99,102,241,.18)" }}>
                  {icon}
                </div>
                <div>
                  <p className="font-body text-xs text-slate-400 font-medium">Assessment Complete</p>
                  <h1 className="font-display text-xl font-extrabold text-slate-900">
                    <span className="shimmer-text">{skill.toUpperCase()}</span> Quiz
                  </h1>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 rounded-full px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span className="font-body text-indigo-600 text-xs font-semibold">Completed</span>
              </span>
            </div>

            {/* Score ring + stats */}
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
              {/* SVG ring */}
              <div className="relative shrink-0 anim-pop">
                <svg width="140" height="140" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#e0e7ff" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="54" fill="none"
                    stroke="url(#ring-grad)" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    className="stroke-anim"
                    transform="rotate(-90 60 60)"
                  />
                  <defs>
                    <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center anim-count">
                  <span className="font-display text-3xl font-extrabold text-slate-900">{percentage}%</span>
                  <span className="font-body text-xs text-slate-400">{score}/{total}</span>
                </div>
              </div>

              {/* Stats + message */}
              <div className="flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl mb-3 font-body text-sm font-semibold"
                  style={{ background: res.bg, color: res.color, border: `1px solid ${res.border}` }}>
                  <span>{res.emoji}</span> {res.message}
                </div>

                <div className="grid grid-cols-3 gap-3 mt-3">
                  {[
                    { label: "Correct", value: score, color: "#10b981" },
                    { label: "Wrong",   value: total - score, color: "#f87171" },
                    { label: "Total",   value: total, color: "#6366f1" },
                  ].map((s) => (
                    <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                      <p className="font-display text-xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                      <p className="font-body text-[10px] text-slate-400 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Verified badge display (single state, no tiers) */}
            {verified && (
              <div className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-emerald-200 mb-2 anim-badge"
                style={{ background: "linear-gradient(135deg, #ecfdf5, white)" }}>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200 anim-badge">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <p className="font-body text-xs text-slate-400 font-medium mb-0.5">Verified</p>
                  <p className="font-display text-lg font-extrabold text-slate-900">
                    {skill.toUpperCase()} — Verified
                  </p>
                  <p className="font-body text-xs text-slate-400">Claim it to add to your profile</p>
                </div>
              </div>
            )}
          </div>

          {/* Action footer */}
          <div className="px-8 py-5 bg-slate-50 border-t border-slate-100">
            {claimed ? (
              <div className="flex items-center justify-center gap-3 py-2">
                <span className="text-xl">🎉</span>
                <p className="font-display font-bold text-emerald-600">Badge claimed! Redirecting...</p>
              </div>
            ) : verified ? (
              <div className="space-y-3">
                {claimError && (
                  <div className="flex items-center gap-2 text-red-500 text-sm font-body bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                    <span>⚠️</span> {claimError}
                  </div>
                )}
                <button onClick={handleClaimBadge} disabled={claiming}
                  className="claim-btn w-full font-display font-bold text-white py-3.5 rounded-xl text-sm flex items-center justify-center gap-2">
                  {claiming ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Claiming Badge...
                    </>
                  ) : <>✅ Claim Verified Badge · {skill.toUpperCase()}</>}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <span>💡</span>
                  <p className="font-body text-sm text-amber-700">
                    Score <strong>70% or higher</strong> to earn a Verified badge.
                    You scored <strong>{percentage}%</strong>.
                  </p>
                </div>
                <button onClick={() => navigate(`/quiz/${skill}`)}
                  className="retry-btn w-full font-display font-bold text-white py-3.5 rounded-xl text-sm">
                  🔄 Try Again
                </button>
              </div>
            )}

            <button onClick={() => navigate("/verify-skill")}
              className="w-full mt-3 font-body text-sm text-slate-400 hover:text-indigo-500 transition-colors duration-200 py-1.5">
              ← Back to Skills
            </button>
          </div>
        </div>

        {/* ── Report Card ──────────────────────────────────── */}
        {report?.length > 0 && (
          <div className="anim-slide-up-d2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-2xl font-extrabold text-slate-900">
                  Question <span className="shimmer-text">Review</span>
                </h2>
                <p className="font-body text-xs text-slate-400 mt-0.5">{report.length} questions answered</p>
              </div>
              <div className="flex gap-3 text-xs font-body font-semibold">
                <span className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-600 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> {score} correct
                </span>
                <span className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-500 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-red-400" /> {total - score} wrong
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {report.map((q, index) => {
                const isCorrect = q.userAnswer === q.correctAnswer;
                return (
                  <div key={index} className="report-card bg-white rounded-2xl overflow-hidden"
                    style={{ animationDelay: `${index * 0.05}s` }}>
                    {/* Question header */}
                    <div className="px-6 pt-5 pb-3 flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5
                        ${isCorrect ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500"}`}>
                        {isCorrect ? "✓" : "✗"}
                      </div>
                      <p className="font-display text-sm font-bold text-slate-800 leading-snug flex-1">{q.question}</p>
                    </div>

                    {/* Answer row */}
                    <div className="px-6 pb-5 flex flex-col sm:flex-row gap-3">
                      <div className={`flex-1 flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-body
                        ${isCorrect
                          ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                          : "bg-red-50 border border-red-200 text-red-600"}`}>
                        <span className="shrink-0 font-bold text-xs">{isCorrect ? "Your Answer" : "Your Answer"}</span>
                        <span className="flex-1 truncate">{q.userAnswer}</span>
                        <span>{isCorrect ? "✓" : "✗"}</span>
                      </div>

                      {!isCorrect && (
                        <div className="flex-1 flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-body bg-emerald-50 border border-emerald-200 text-emerald-700">
                          <span className="shrink-0 font-bold text-xs">Correct</span>
                          <span className="flex-1 truncate">{q.correctAnswer}</span>
                          <span>✓</span>
                        </div>
                      )}
                    </div>
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