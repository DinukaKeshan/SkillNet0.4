import { useState, useRef } from "react";
import { nextQuestion, submitQuiz } from "../services/quizService";
import { useNavigate } from "react-router-dom";

const TOTAL_QUESTIONS = 10;
const OPTION_LABELS   = ["A", "B", "C", "D"];

export default function Quiz({ quizId, question, setQuestion, currentQuestionIndex, skill }) {
  const [selected,             setSelected]             = useState(null);    // selected letter e.g. "A"
  const [revealed,             setRevealed]             = useState(false);
  const [isNextLoading,        setIsNextLoading]        = useState(false);
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(false);

  // Track all answers across questions: { questionIndex: letter }
  const answersRef  = useRef({});
  const startTimeRef = useRef(Date.now());
  const navigate     = useNavigate();

  const isLastQuestion = currentQuestionIndex + 1 === TOTAL_QUESTIONS;

  const handleSelect = (letter) => {
    if (revealed) return;
    setSelected(letter);
    setRevealed(true);
    answersRef.current[currentQuestionIndex] = letter;
  };

  // Returns option state for styling
  const getOptionState = (i) => {
    const letter = OPTION_LABELS[i];
    if (!revealed) return selected === letter ? "selected" : "idle";
    if (letter === question.correct_answer) return "correct";
    if (letter === selected)               return "wrong";
    return "dimmed";
  };

  const handleNext = async () => {
    if (selected === null) return;
    setIsNextButtonDisabled(true);
    setIsNextLoading(true);

    try {
      if (isLastQuestion) {
        // Build answers array from all collected answers
        const answersArray = Object.entries(answersRef.current).map(
          ([qIdx, sel]) => ({ questionIndex: Number(qIdx), selected: sel })
        );
        const timeTakenSec = Math.round((Date.now() - startTimeRef.current) / 1000);

        // Submit to the new batch submit endpoint
        const submitRes = await submitQuiz(quizId, answersArray, timeTakenSec);
        const resultData = submitRes.data;

        // Navigate to the new QuizResultPage
        navigate(`/quiz/result/${resultData.data?.quizId || quizId}`, {
          state: { result: resultData }
        });
        return;
      }

      // Not the last question — fetch the next pre-generated question
      const nextIdx = currentQuestionIndex + 1;
      const res = await nextQuestion(quizId, nextIdx);

      if (res.data?.data?.question) {
        setQuestion(res.data.data.question);
      }
      setSelected(null);
      setRevealed(false);

    } catch (err) {
      console.error("Error in handleNext:", err);
    } finally {
      setIsNextButtonDisabled(false);
      setIsNextLoading(false);
    }
  };

  const optionStyles = {
    idle: {
      wrapper: "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-sm",
      label:   "bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-500",
      text:    "text-slate-700",
      icon:    null,
    },
    selected: {
      wrapper: "border-indigo-400 bg-indigo-50 shadow-md shadow-indigo-100",
      label:   "bg-indigo-500 text-white",
      text:    "text-indigo-700 font-semibold",
      icon:    null,
    },
    correct: {
      wrapper: "border-emerald-400 bg-emerald-50 shadow-md shadow-emerald-100",
      label:   "bg-emerald-500 text-white",
      text:    "text-emerald-800 font-semibold",
      icon:    "✓",
    },
    wrong: {
      wrapper: "border-red-400 bg-red-50 shadow-md shadow-red-100",
      label:   "bg-red-500 text-white",
      text:    "text-red-800 font-semibold",
      icon:    "✗",
    },
    dimmed: {
      wrapper: "border-slate-100 bg-slate-50 opacity-45",
      label:   "bg-slate-200 text-slate-400",
      text:    "text-slate-400",
      icon:    null,
    },
  };

  // Determine correct option index for feedback (letter → index)
  const correctIndex = OPTION_LABELS.indexOf(question.correct_answer ?? "A");

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
        @keyframes pop-in { 0%{opacity:0;transform:scale(0.96) translateY(8px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes reveal { 0%{opacity:0;transform:translateX(-8px)} 100%{opacity:1;transform:translateX(0)} }
        @keyframes correct-flash { 0%{box-shadow:0 0 0 0 rgba(52,211,153,0.5)} 70%{box-shadow:0 0 0 12px rgba(52,211,153,0)} 100%{box-shadow:0 0 0 0 rgba(52,211,153,0)} }
        @keyframes wrong-flash   { 0%{box-shadow:0 0 0 0 rgba(248,113,113,0.5)} 70%{box-shadow:0 0 0 12px rgba(248,113,113,0)} 100%{box-shadow:0 0 0 0 rgba(248,113,113,0)} }
        .anim-pop      { animation: pop-in 0.4s cubic-bezier(.16,1,.3,1) both; }
        .anim-reveal   { animation: reveal 0.35s cubic-bezier(.16,1,.3,1) both; }
        .option-correct { animation: correct-flash 0.6s ease forwards; }
        .option-wrong   { animation: wrong-flash 0.6s ease forwards; }
        .option-btn { transition: all 0.2s ease; border-width: 1.5px; border-style: solid; border-radius: 14px; }
        .option-btn:not(:disabled):hover { transform: translateY(-1px); }
        .next-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          transition: all 0.3s ease;
        }
        .next-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          box-shadow: 0 8px 28px rgba(99,102,241,0.4);
          transform: translateY(-1px);
        }
        .next-btn:disabled { background: #e2e8f0; color: #94a3b8; cursor: not-allowed; transform: none; box-shadow: none; }
        .finish-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          transition: all 0.3s ease;
        }
        .finish-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #059669, #047857);
          box-shadow: 0 8px 28px rgba(16,185,129,0.4);
          transform: translateY(-1px);
        }
        .finish-btn:disabled { background: #e2e8f0; color: #94a3b8; cursor: not-allowed; }
      `}</style>

      {/* Question area */}
      <div className="px-8 pt-8 pb-6">
        {/* Q label + meta tags */}
        <div className="flex items-center gap-2 mb-2 anim-pop">
          <span className="font-body text-xs font-semibold text-indigo-400 uppercase tracking-widest">
            Question {currentQuestionIndex + 1}
          </span>
          <span className="flex-1 h-px bg-slate-100" />
          {question.difficulty && (
            <span className={`font-body text-[10px] font-semibold px-2 py-0.5 rounded-full border
              ${question.difficulty === "easy"   ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                question.difficulty === "medium" ? "bg-amber-50 text-amber-600 border-amber-200" :
                                                   "bg-red-50 text-red-500 border-red-200"}`}>
              {question.difficulty}
            </span>
          )}
          {question.topic && (
            <span className="font-body text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-500 border border-indigo-200">
              {question.topic}
            </span>
          )}
        </div>

        {/* Question text */}
        <h2 className="font-display text-xl font-extrabold text-slate-900 leading-snug mb-8 anim-pop">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {question.options.map((opt, i) => {
            const letter = OPTION_LABELS[i];
            const state  = getOptionState(i);
            const s      = optionStyles[state];
            return (
              <button
                key={i}
                onClick={() => handleSelect(letter)}
                disabled={revealed}
                className={`option-btn w-full text-left flex items-center gap-4 p-4 group
                  ${s.wrapper}
                  ${state === "correct" ? "option-correct" : ""}
                  ${state === "wrong"   ? "option-wrong"   : ""}
                  disabled:cursor-not-allowed`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-200 ${s.label}`}>
                  {s.icon ?? letter}
                </span>
                <span className={`font-body text-sm leading-relaxed flex-1 transition-all duration-200 ${s.text}`}>
                  {opt}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback banner */}
        {revealed && (
          <div className={`anim-reveal flex items-start gap-3 px-4 py-3 rounded-xl mb-6 text-sm font-body
            ${selected === question.correct_answer
              ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
              : "bg-red-50 border border-red-200 text-red-700"}`}>
            <span className="text-base mt-0.5 shrink-0">
              {selected === question.correct_answer ? "🎉" : "💡"}
            </span>
            <span>
              {selected === question.correct_answer
                ? "Correct! Well done."
                : <>Incorrect. The correct answer was: <strong className="font-semibold">{question.options[correctIndex]}</strong></>
              }
            </span>
          </div>
        )}
      </div>

      {/* Footer action bar */}
      <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
        <p className="font-body text-xs text-slate-400">
          {!revealed
            ? "Select an answer to continue"
            : isLastQuestion
            ? "Ready to see your results?"
            : "Great — move to the next question"}
        </p>

        {isLastQuestion ? (
          <button
            id="finish-quiz-btn"
            onClick={handleNext}
            disabled={isNextButtonDisabled || selected === null}
            className="finish-btn font-display font-bold text-white px-8 py-3 rounded-xl text-sm flex items-center gap-2">
            {isNextLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Submitting...
              </>
            ) : <>🏁 Finish Quiz</>}
          </button>
        ) : (
          <button
            id="next-question-btn"
            onClick={handleNext}
            disabled={isNextButtonDisabled || selected === null}
            className="next-btn font-display font-bold text-white px-8 py-3 rounded-xl text-sm flex items-center gap-2">
            {isNextLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Loading...
              </>
            ) : <>Next Question →</>}
          </button>
        )}
      </div>
    </div>
  );
}