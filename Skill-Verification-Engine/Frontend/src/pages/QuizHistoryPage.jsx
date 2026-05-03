import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getAllQuizHistory, getQuizAttemptDetail } from "../services/quizService";

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function QuizHistoryPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Detail panel state
  const [expandedId, setExpandedId] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  useEffect(() => {
    if (!user?._id) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await getAllQuizHistory();
        setQuizzes(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching quiz history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user]);

  const handleToggleDetail = async (quizId) => {
    // Collapse if already open
    if (expandedId === quizId) {
      setExpandedId(null);
      setDetailData(null);
      setDetailError(null);
      return;
    }

    setExpandedId(quizId);
    setDetailData(null);
    setDetailError(null);
    setDetailLoading(true);

    try {
      const res = await getQuizAttemptDetail(quizId);
      setDetailData(res.data?.data || null);
    } catch (err) {
      console.error("Error fetching quiz detail:", err);
      setDetailError("Failed to load quiz details. Please try again.");
    } finally {
      setDetailLoading(false);
    }
  };

  const totalQuizzes = quizzes.length;
  const passedQuizzes = quizzes.filter(q => q.verified).length;
  const passRate = totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 0;
  const uniqueVerifiedSkills = [...new Set(quizzes.filter(q => q.verified).map(q => q.skill?.toLowerCase()))].length;

  if (!user?._id) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--sn-bg)" }}>
        <p className="font-body text-slate-500">Please log in to view quiz history.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--sn-bg)" }}>
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-body text-slate-400">Loading quiz history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "var(--sn-bg)" }}>
      <style>{`
        @keyframes slide-down { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 2000px; } }
        .detail-enter { animation: slide-down 0.35s cubic-bezier(.16,1,.3,1) forwards; overflow: hidden; }
      `}</style>

      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="font-display text-3xl font-extrabold text-slate-900 mb-2">
            Quiz History
          </h1>
          <p className="font-body text-slate-500">
            Your complete assessment history
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Quizzes", value: totalQuizzes, color: "var(--sn-primary)" },
            { label: "Pass Rate", value: `${passRate}%`, color: "#10b981" },
            { label: "Skills Verified", value: uniqueVerifiedSkills, color: "var(--sn-accent)" },
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

        {/* Quiz List */}
        {quizzes.length === 0 ? (
          <div className="bg-white border border-slate-100 shadow-sm p-10 text-center"
            style={{ borderRadius: "var(--sn-card-radius)" }}>
            <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">📝</div>
            <h2 className="font-display text-xl font-extrabold text-slate-800 mb-2">No Quizzes Yet</h2>
            <p className="font-body text-sm text-slate-400 mb-5">Take your first quiz to see your history here.</p>
            <button onClick={() => navigate("/verify-skill")}
              className="font-body text-sm font-semibold text-white px-6 py-2.5 rounded-lg transition-all hover:opacity-90"
              style={{ background: "var(--sn-gradient)" }}>
              Start a Quiz →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {quizzes.map((quiz, i) => {
              const date = new Date(quiz.createdAt).toLocaleDateString("en-US", {
                year: "numeric", month: "short", day: "numeric",
              });
              const time = quiz.time_taken_sec
                ? `${Math.floor(quiz.time_taken_sec / 60)}m ${quiz.time_taken_sec % 60}s`
                : "";
              const isExpanded = expandedId === quiz._id;

              return (
                <div key={quiz._id || i}>
                  {/* Quiz Row */}
                  <div
                    className={`bg-white border shadow-sm flex items-center justify-between px-5 py-4 cursor-pointer transition-all duration-200 ${
                      isExpanded ? "border-indigo-300 shadow-md" : "border-slate-100 hover:border-indigo-200"
                    }`}
                    style={{ borderRadius: isExpanded ? "var(--sn-card-radius) var(--sn-card-radius) 0 0" : "var(--sn-card-radius)" }}
                    onClick={() => handleToggleDetail(quiz._id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                        quiz.verified
                          ? "bg-emerald-50 border border-emerald-200 text-emerald-600"
                          : "bg-red-50 border border-red-200 text-red-500"
                      }`}>
                        {quiz.verified ? "✓" : "✗"}
                      </div>
                      <div>
                        <p className="font-body text-sm font-semibold text-slate-800">
                          {quiz.skill}
                          {quiz.attempt_number > 1 && (
                            <span className="text-xs text-slate-400 font-normal ml-2">
                              Attempt #{quiz.attempt_number}
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="font-body text-xs text-slate-400">{date}</span>
                          {time && <span className="font-body text-xs text-slate-400">⏱ {time}</span>}
                          {quiz.skill_level && (
                            <span className="font-body text-xs text-indigo-400">📊 {quiz.skill_level}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className={`font-display text-lg font-extrabold ${quiz.verified ? "text-emerald-600" : "text-red-500"}`}>
                          {quiz.score_pct}%
                        </p>
                        <p className="font-body text-[10px] text-slate-400">
                          {quiz.score}/{quiz.questions?.length || 10}
                        </p>
                      </div>
                      <span className={`font-body text-xs font-semibold px-2.5 py-1 rounded-full ${
                        quiz.verified
                          ? "text-emerald-600 bg-emerald-50 border border-emerald-200"
                          : "text-red-500 bg-red-50 border border-red-200"
                      }`}>
                        {quiz.verified ? "Passed" : "Failed"}
                      </span>
                      {/* Expand indicator */}
                      <span className={`text-slate-400 text-xs transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                        ▼
                      </span>
                    </div>
                  </div>

                  {/* Detail Panel (accordion) */}
                  {isExpanded && (
                    <div className="detail-enter bg-white border border-t-0 border-indigo-300 shadow-md px-5 py-5"
                      style={{ borderRadius: "0 0 var(--sn-card-radius) var(--sn-card-radius)" }}>

                      {/* Loading state */}
                      {detailLoading && (
                        <div className="flex items-center justify-center py-8">
                          <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-3" />
                          <span className="font-body text-sm text-slate-400">Loading questions...</span>
                        </div>
                      )}

                      {/* Error state */}
                      {detailError && (
                        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl font-body text-sm">
                          <span>⚠️</span>
                          <span>{detailError}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleToggleDetail(quiz._id); setTimeout(() => handleToggleDetail(quiz._id), 100); }}
                            className="ml-auto text-red-500 font-semibold hover:text-red-700 text-xs"
                          >
                            Retry
                          </button>
                        </div>
                      )}

                      {/* Detail data */}
                      {detailData && !detailLoading && (
                        <div className="space-y-4">
                          {/* Detail header */}
                          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
                            <div>
                              <h3 className="font-display text-lg font-extrabold text-slate-900">
                                {detailData.skill}
                              </h3>
                              <p className="font-body text-xs text-slate-400 mt-0.5">
                                {new Date(detailData.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className={`font-display text-xl font-extrabold ${detailData.verified ? "text-emerald-600" : "text-red-500"}`}>
                                  {detailData.score}/{detailData.total}
                                </p>
                                <p className="font-body text-[10px] text-slate-400">{detailData.score_pct}%</p>
                              </div>
                              <span className={`font-body text-xs font-bold px-3 py-1.5 rounded-full ${
                                detailData.verified
                                  ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                                  : "text-red-600 bg-red-50 border border-red-200"
                              }`}>
                                {detailData.verified ? "✓ Passed" : "✗ Failed"}
                              </span>
                            </div>
                          </div>

                          {/* Questions list */}
                          <div className="space-y-3">
                            {detailData.questions.map((q) => (
                              <div key={q.index}
                                className={`border rounded-xl p-4 transition-all ${
                                  q.is_correct
                                    ? "border-emerald-200 bg-emerald-50/30"
                                    : "border-red-200 bg-red-50/30"
                                }`}>
                                {/* Question header */}
                                <div className="flex items-start gap-3 mb-3">
                                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                                    q.is_correct
                                      ? "bg-emerald-100 text-emerald-600 border border-emerald-200"
                                      : "bg-red-100 text-red-500 border border-red-200"
                                  }`}>
                                    {q.is_correct ? "✓" : "✗"}
                                  </span>
                                  <div className="flex-1">
                                    <p className="font-body text-sm font-semibold text-slate-800 leading-relaxed">
                                      <span className="text-slate-400 font-normal mr-1.5">Q{q.index + 1}.</span>
                                      {q.question}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      {q.difficulty && (
                                        <span className={`font-body text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                          q.difficulty === "easy"   ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                                          q.difficulty === "medium" ? "bg-amber-50 text-amber-600 border-amber-200" :
                                                                      "bg-red-50 text-red-500 border-red-200"
                                        }`}>
                                          {q.difficulty}
                                        </span>
                                      )}
                                      {q.topic && (
                                        <span className="font-body text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-500 border border-indigo-200">
                                          {q.topic}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Options */}
                                <div className="grid grid-cols-1 gap-1.5 ml-10">
                                  {q.options.map((opt, oi) => {
                                    const letter = OPTION_LABELS[oi];
                                    const isCorrectOpt = letter === q.correct_answer;
                                    const isSelectedOpt = letter === q.selected_answer;
                                    const isWrongSelection = isSelectedOpt && !isCorrectOpt;

                                    let optClass = "border-slate-100 bg-white text-slate-600";
                                    if (isCorrectOpt) optClass = "border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold";
                                    if (isWrongSelection) optClass = "border-red-300 bg-red-50 text-red-700 font-semibold";

                                    return (
                                      <div key={oi}
                                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs font-body ${optClass}`}>
                                        <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                          isCorrectOpt ? "bg-emerald-500 text-white" :
                                          isWrongSelection ? "bg-red-500 text-white" :
                                          "bg-slate-100 text-slate-400"
                                        }`}>
                                          {isCorrectOpt ? "✓" : isWrongSelection ? "✗" : letter}
                                        </span>
                                        <span className="flex-1">{opt}</span>
                                        {isCorrectOpt && (
                                          <span className="text-emerald-500 text-[10px] font-bold ml-auto">Correct</span>
                                        )}
                                        {isWrongSelection && (
                                          <span className="text-red-500 text-[10px] font-bold ml-auto">Your answer</span>
                                        )}
                                        {isSelectedOpt && isCorrectOpt && (
                                          <span className="text-emerald-500 text-[10px] font-bold ml-auto">Your answer ✓</span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
