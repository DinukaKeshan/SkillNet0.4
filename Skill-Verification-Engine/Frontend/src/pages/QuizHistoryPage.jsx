import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getAllQuizHistory } from "../services/quizService";

export default function QuizHistoryPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;

    const fetch = async () => {
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

    fetch();
  }, [user]);

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

              return (
                <div key={quiz._id || i}
                  className="bg-white border border-slate-100 shadow-sm flex items-center justify-between px-5 py-4 hover:border-indigo-200 transition-all duration-200"
                  style={{ borderRadius: "var(--sn-card-radius)" }}>
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
