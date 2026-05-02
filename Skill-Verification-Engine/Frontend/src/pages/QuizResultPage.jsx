import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";

const API_BASE = import.meta.env.VITE_SVE_API_URL || "http://localhost:5005/api";

const LEVEL_STYLES = {
  Beginner:     { bg: "bg-amber-100",  text: "text-amber-700",  border: "border-amber-300",  bar: "bg-amber-400" },
  Intermediate: { bg: "bg-blue-100",   text: "text-blue-700",   border: "border-blue-300",   bar: "bg-blue-500" },
  Advanced:     { bg: "bg-teal-100",   text: "text-teal-700",   border: "border-teal-300",   bar: "bg-teal-500" },
  Unknown:      { bg: "bg-slate-100",  text: "text-slate-600",  border: "border-slate-300",  bar: "bg-slate-400" },
};

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function QuizResultPage() {
  const { attemptId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [result, setResult] = useState(state?.result?.data ?? state?.result ?? null);
  const [loading, setLoading] = useState(!result);
  const [error, setError] = useState(null);

  // Fallback fetch if navigated directly by URL (no router state)
  useEffect(() => {
    if (result) return;
    const fetchResult = async () => {
      try {
        const token = getToken();
        const res = await axios.get(`${API_BASE}/quiz/${attemptId}/result`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResult(res.data.data);
      } catch (err) {
        setError("Could not load result. Please retake the quiz.");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [attemptId, result]);

  if (loading) return <LoadingSkeleton />;
  if (error || !result) return <ErrorState message={error} navigate={navigate} />;

  const {
    skill = "",
    scorePercent = 0,
    score = 0,
    total = 10,
    verified = false,
    skill_level = "Unknown",
    confidence = 0,
    probabilities = {},
    topicBreakdown = [],
    timeTakenSec = 0,
  } = result;

  const levelStyle = LEVEL_STYLES[skill_level] ?? LEVEL_STYLES.Unknown;
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference * (1 - scorePercent / 100);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }
        @keyframes slide-up  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pop-in    { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
        @keyframes stroke-draw { from{stroke-dashoffset:${circumference}} to{stroke-dashoffset:${dashOffset}} }
        @keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .anim-up  { animation: slide-up 0.55s cubic-bezier(.16,1,.3,1) both; }
        .anim-up-d1 { animation: slide-up 0.55s cubic-bezier(.16,1,.3,1) 0.1s both; }
        .anim-up-d2 { animation: slide-up 0.55s cubic-bezier(.16,1,.3,1) 0.2s both; }
        .anim-up-d3 { animation: slide-up 0.55s cubic-bezier(.16,1,.3,1) 0.3s both; }
        .anim-pop { animation: pop-in 0.5s cubic-bezier(.16,1,.3,1) 0.15s both; }
        .stroke-anim { animation: stroke-draw 1.2s cubic-bezier(.16,1,.3,1) 0.4s both; }
        .shimmer-text {
          background: linear-gradient(90deg,#6366f1 0%,#a78bfa 40%,#6366f1 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* BG blob */}
      <div className="absolute top-[-6%] right-[-4%] w-[460px] h-[460px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-2xl mx-auto space-y-5">

        {/* ── 1. Score Summary Card ────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden anim-up">
          <div className="h-1" style={{ background: "linear-gradient(90deg,#6366f1,#8b5cf6,#a78bfa)" }} />
          <div className="px-7 pt-7 pb-6">
            {/* Header row */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-body text-xs text-slate-400 font-medium">Assessment Complete</p>
                <h1 className="font-display text-xl font-extrabold text-slate-900">
                  <span className="shimmer-text">{skill.toUpperCase()}</span> Quiz
                </h1>
              </div>
              {/* Pass / fail badge */}
              {verified ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full px-3 py-1.5 font-body text-sm font-semibold">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 rounded-full px-3 py-1.5 font-body text-sm font-semibold">
                  ✕ Not Verified
                </span>
              )}
            </div>

            {/* Score ring + stats */}
            <div className="flex flex-col sm:flex-row items-center gap-8">
              {/* SVG Ring */}
              <div className="relative shrink-0 anim-pop">
                <svg width="130" height="130" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#e0e7ff" strokeWidth="10" />
                  <circle cx="60" cy="60" r="52" fill="none"
                    stroke="url(#ring-grad)" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={circumference}
                    className="stroke-anim" transform="rotate(-90 60 60)" />
                  <defs>
                    <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-3xl font-extrabold text-slate-900">{scorePercent}%</span>
                  <span className="font-body text-xs text-slate-400">{score}/{total}</span>
                </div>
              </div>

              {/* Stat pills */}
              <div className="flex-1 w-full">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Total Qs",  value: total,              color: "text-indigo-600" },
                    { label: "Correct",   value: score,              color: "text-emerald-600" },
                    { label: "Time",      value: formatTime(timeTakenSec), color: "text-violet-600" },
                  ].map(s => (
                    <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                      <p className={`font-display text-lg font-extrabold ${s.color}`}>{s.value}</p>
                      <p className="font-body text-[10px] text-slate-400 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Threshold note */}
                <p className="font-body text-xs text-slate-400 mt-3 text-center sm:text-left">
                  {verified
                    ? "🎉 You passed the 70% threshold — skill verified!"
                    : `Score 70% or higher to earn verification (you scored ${scorePercent}%).`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. Skill Level Prediction Card ──────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 anim-up-d1">
          <p className="font-body text-xs text-slate-400 font-medium mb-3 uppercase tracking-widest">Skill Level Prediction</p>

          {/* Level badge */}
          <div className="flex items-center gap-3 mb-5">
            <span className={`font-display text-2xl font-extrabold px-4 py-1.5 rounded-xl border ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}`}>
              {skill_level}
            </span>
          </div>

          {/* Confidence bar */}
          <div className="mb-4">
            <div className="flex justify-between mb-1.5">
              <span className="font-body text-xs text-slate-500">Confidence</span>
              <span className="font-body text-xs font-semibold text-slate-700">{Math.round(confidence * 100)}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${levelStyle.bar}`}
                style={{ width: `${Math.round(confidence * 100)}%` }} />
            </div>
          </div>

          {/* Probability pills */}
          {Object.keys(probabilities).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {["Beginner", "Intermediate", "Advanced"].map(lvl => {
                const pct = Math.round((probabilities[lvl] ?? 0) * 100);
                const ls = LEVEL_STYLES[lvl];
                return (
                  <span key={lvl} className={`font-body text-xs font-semibold px-3 py-1 rounded-full border ${ls.bg} ${ls.text} ${ls.border}`}>
                    {lvl}: {pct}%
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* ── 3. Verified Badge (only if score ≥ 70%) ──────────────── */}
        {verified && (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4 anim-up-d2">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-md shadow-emerald-200">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p className="font-body text-xs text-emerald-600 font-medium">Badge Earned</p>
              <p className="font-display text-lg font-extrabold text-emerald-800">{skill.toUpperCase()} — Verified</p>
              <p className="font-body text-xs text-emerald-600 mt-0.5">Your skill has been verified. View it on your dashboard.</p>
            </div>
          </div>
        )}

        {/* ── 4. Topic Breakdown ───────────────────────────────────── */}
        {topicBreakdown.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 anim-up-d3">
            <h2 className="font-display text-lg font-extrabold text-slate-900 mb-5">
              Performance by <span className="shimmer-text">Topic</span>
            </h2>
            <div className="space-y-4">
              {topicBreakdown.map(({ topic, correct, total: t }) => {
                const pct = t > 0 ? Math.round((correct / t) * 100) : 0;
                const barColor = pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-400" : "bg-red-400";
                return (
                  <div key={topic}>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-body text-sm text-slate-700 font-medium">{topic}</span>
                      <span className="font-body text-sm text-slate-500 font-semibold">{correct}/{t}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${barColor} transition-all duration-500`}
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 5. CTA Row ───────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 anim-up-d3">
          <button id="view-roadmap-btn"
            onClick={() => navigate(`/roadmap/${encodeURIComponent(skill)}`, {
              state: { skill_level, skill, scorePercent, verified }
            })}
            className="flex-1 font-display font-bold text-white py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 18px rgba(99,102,241,0.3)" }}>
            📍 View Learning Roadmap
          </button>
          <button id="back-dashboard-btn"
            onClick={() => navigate("/dashboard/skills")}
            className="flex-1 font-body font-semibold text-slate-600 py-3.5 rounded-xl text-sm border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">
            ← Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-5">
        {[220, 160, 80, 180].map((h, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse" style={{ height: h }} />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message, navigate }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-red-100 shadow-xl p-10 text-center max-w-md w-full">
        <div className="w-14 h-14 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">⚠️</div>
        <h2 className="font-display text-xl font-extrabold text-slate-800 mb-2">Result Expired</h2>
        <p className="font-body text-slate-500 text-sm mb-6">{message || "This result is no longer available. Please retake the quiz."}</p>
        <button onClick={() => navigate("/dashboard/skills")}
          className="font-body font-semibold px-6 py-2.5 rounded-xl text-white text-sm"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
