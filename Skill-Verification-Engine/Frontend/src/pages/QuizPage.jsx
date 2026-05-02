import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { startQuiz } from "../services/quizService";
import Quiz from "../components/Quiz";
import { isAuthenticated } from "../utils/auth";

const MAX_QUESTIONS = 10;

const skillIcons = {
  java: "☕", react: "⚛️", python: "🐍", node: "🟩",
  typescript: "🔷", javascript: "🟨", default: "💡",
};
const getSkillIcon = (name = "") => {
  const lower = name.toLowerCase();
  return Object.entries(skillIcons).find(([k]) => lower.includes(k))?.[1] ?? skillIcons.default;
};

export default function QuizPage() {
  const { skill } = useParams();
  const navigate = useNavigate();

  const [quizId, setQuizId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [questionCount, setQuestionCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: `/quiz/${skill}` } });
      return;
    }
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initQuiz = async () => {
      try {
        setLoading(true);
        const res = await startQuiz(skill);
        // New API returns { success: true, data: { quizId, question, questionIndex, totalQuestions } }
        const payload = res.data?.data ?? res.data;
        setQuizId(payload.quizId);
        setQuestion(payload.question);
        setQuestionCount(1);
      } catch (err) {
        setError("Failed to start quiz. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initQuiz();
  }, [skill, navigate]);

  const handleQuestionUpdate = (newQuestion) => {
    setQuestion(newQuestion);
    setQuestionCount((prev) => prev + 1);
  };

  const progressPercent = ((questionCount - 1) / MAX_QUESTIONS) * 100;
  const icon = getSkillIcon(skill);

  /* ── Loading ─────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7ff] flex items-center justify-center relative overflow-hidden">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
          .font-display{font-family:'Syne',sans-serif}
          .font-body{font-family:'DM Sans',sans-serif}
          @keyframes spin-ring{to{transform:rotate(360deg)}}
          @keyframes pulse-blob{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.15);opacity:.9}}
          .spin-ring{animation:spin-ring 1.1s linear infinite}
          .pulse-blob{animation:pulse-blob 2s ease-in-out infinite}
        `}</style>
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)" }} />
        <div className="text-center z-10">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <svg className="spin-ring w-20 h-20 text-indigo-500" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="35" stroke="#e0e7ff" strokeWidth="6" />
              <path d="M40 5 A35 35 0 0 1 75 40" stroke="url(#lg)" strokeWidth="6" strokeLinecap="round"/>
              <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1"/>
                  <stop offset="100%" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-2xl pulse-blob">{icon}</div>
          </div>
          <p className="font-display text-2xl font-extrabold text-slate-800">Generating Quiz</p>
          <p className="font-body text-slate-400 mt-1">Preparing your <span className="text-indigo-500 font-semibold">{skill.toUpperCase()}</span> assessment...</p>
        </div>
      </div>
    );
  }

  /* ── Error ───────────────────────────────────────────────── */
  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f7ff] flex items-center justify-center px-4">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
          .font-display{font-family:'Syne',sans-serif}
          .font-body{font-family:'DM Sans',sans-serif}
        `}</style>
        <div className="bg-white rounded-2xl border border-red-100 shadow-xl p-10 text-center max-w-md w-full">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-2xl mx-auto mb-4">⚠️</div>
          <h2 className="font-display text-xl font-extrabold text-slate-800 mb-2">Quiz Failed to Load</h2>
          <p className="font-body text-slate-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => { initializedRef.current = false; window.location.reload(); }}
            className="font-body font-semibold px-6 py-2.5 rounded-xl text-white text-sm transition-all duration-300 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* ── Quiz ────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#f8f7ff] py-10 px-4 relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display{font-family:'Syne',sans-serif}
        .font-body{font-family:'DM Sans',sans-serif}
        @keyframes slide-up{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        .anim-slide-up{animation:slide-up 0.6s cubic-bezier(.16,1,.3,1) both}
        .anim-slide-up-d1{animation:slide-up 0.6s cubic-bezier(.16,1,.3,1) 0.1s both}
        .shimmer-text{
          background:linear-gradient(90deg,#6366f1 0%,#a78bfa 40%,#6366f1 100%);
          background-size:200% auto;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:shimmer 3s linear infinite;
        }
        .animate-float{animation:float 5s ease-in-out infinite}
        .animate-float-d{animation:float 5s ease-in-out 1.5s infinite}
        .progress-track{
          height:8px;
          background:#e0e7ff;
          border-radius:99px;
          overflow:hidden;
        }
        .progress-fill{
          height:100%;
          border-radius:99px;
          background:linear-gradient(90deg,#6366f1,#8b5cf6);
          transition:width 0.6s cubic-bezier(.16,1,.3,1);
        }
      `}</style>

      {/* Background blobs */}
      <div className="absolute top-[-8%] right-[-4%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-8%] left-[-4%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)" }} />
      <div className="absolute top-[10%] left-[4%] w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 opacity-50 animate-float pointer-events-none" />
      <div className="absolute bottom-[18%] right-[5%] w-6 h-6 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 opacity-40 animate-float-d pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto">

        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-7 py-6 mb-6 anim-slide-up">
          <div className="flex items-center justify-between mb-5">
            {/* Skill identity */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))", border: "1px solid rgba(99,102,241,0.18)" }}>
                {icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 rounded-full px-2.5 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="font-body text-indigo-600 text-xs font-medium">Live Assessment</span>
                  </span>
                </div>
                <h1 className="font-display text-xl font-extrabold text-slate-900">
                  <span className="shimmer-text">{skill.toUpperCase()}</span>
                  <span className="text-slate-900"> Quiz</span>
                </h1>
              </div>
            </div>

            {/* Question counter badge */}
            <div className="text-right shrink-0">
              <div className="font-display text-3xl font-extrabold text-slate-900 leading-none">
                {questionCount}
                <span className="font-body text-base font-normal text-slate-400">/{MAX_QUESTIONS}</span>
              </div>
              <p className="font-body text-xs text-slate-400 mt-0.5">question</p>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-body text-xs text-slate-400">Progress</span>
              <span className="font-body text-xs font-semibold text-indigo-500">{Math.round(progressPercent)}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>

            {/* Step dots */}
            <div className="flex justify-between mt-3">
              {Array.from({ length: MAX_QUESTIONS }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i < questionCount - 1
                      ? "bg-indigo-500 scale-110"
                      : i === questionCount - 1
                      ? "bg-indigo-400 ring-2 ring-indigo-200 scale-125"
                      : "bg-slate-200"
                  }`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quiz Component wrapper */}
        <div className="anim-slide-up-d1">
          <Quiz
            quizId={quizId}
            question={question}
            setQuestion={handleQuestionUpdate}
            currentQuestionIndex={questionCount - 1}
            skill={skill}
          />
        </div>

        {/* Footer hint */}
        <p className="font-body text-center text-xs text-slate-400 mt-6">
          🤖 Questions are AI-generated based on real-world <span className="text-indigo-400 font-medium">{skill}</span> knowledge
        </p>
      </div>
    </div>
  );
}