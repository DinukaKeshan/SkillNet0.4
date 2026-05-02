import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getRoadmap } from "../services/skillService";

// ── Constants ─────────────────────────────────────────────────────────────────
const LEVEL_STYLES = {
  Beginner:     { bg: "bg-amber-100",  text: "text-amber-700",  border: "border-amber-300",  dot: "bg-amber-500",  bar: "bg-amber-400"  },
  Intermediate: { bg: "bg-blue-100",   text: "text-blue-700",   border: "border-blue-300",   dot: "bg-blue-500",   bar: "bg-blue-500"   },
  Advanced:     { bg: "bg-teal-100",   text: "text-teal-700",   border: "border-teal-300",   dot: "bg-teal-500",   bar: "bg-teal-500"   },
};

const INDUSTRY_STANDARDS = {
  react:       "Advanced",
  javascript:  "Advanced",
  typescript:  "Advanced",
  "node.js":   "Advanced",
  node:        "Advanced",
  python:      "Intermediate",
  mongodb:     "Intermediate",
  css:         "Intermediate",
  git:         "Intermediate",
};

const LEVEL_ORDER = { Beginner: 0, Intermediate: 1, Advanced: 2 };

function getIndustryStandard(skill) {
  return INDUSTRY_STANDARDS[skill?.toLowerCase()] || "Intermediate";
}

function getLevelGap(userLevel, industryLevel) {
  const u = LEVEL_ORDER[userLevel] ?? 1;
  const i = LEVEL_ORDER[industryLevel] ?? 1;
  const diff = i - u;
  if (diff <= 0) return { label: "On track ✓", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" };
  return { label: `${diff} level${diff > 1 ? "s" : ""} to go`, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" };
}

// ── Valid skill levels ─────────────────────────────────────────────────────────
const VALID_LEVELS = ["Beginner", "Intermediate", "Advanced"];

// ── Fallback roadmap generator (used when backend has no saved roadmap yet) ────
function buildFallbackRoadmap(skill, level) {
  const s = skill?.toLowerCase() || "this skill";
  const plans = {
    Beginner: {
      focus_areas: [
        `Understand the core fundamentals of ${s}`,
        `Set up your development environment for ${s}`,
        `Follow beginner tutorials and build 2–3 small projects`,
        `Learn debugging techniques and common error patterns`,
        `Join a community or forum to ask questions and share progress`,
      ],
      projects: [
        `Build a simple "Hello World" ${s} app`,
        `Create a personal portfolio page using ${s}`,
        `Reproduce a beginner tutorial project from scratch`,
      ],
      resources: [
        { title: `Official ${s} documentation`, url: `https://www.google.com/search?q=${encodeURIComponent(s + " official documentation")}`, type: "docs" },
        { title: `${s} crash course on YouTube`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(s + " beginner tutorial")}`, type: "video" },
        { title: `${s} beginner course on freeCodeCamp`, url: `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(s)}`, type: "course" },
      ],
      estimated_weeks: 4,
    },
    Intermediate: {
      focus_areas: [
        `Deep-dive into intermediate ${s} patterns and best practices`,
        `Understand the internals — how ${s} works under the hood`,
        `Build a full project using ${s} from planning to deployment`,
        `Write tests and learn CI/CD basics for ${s} projects`,
        `Read production codebases and contribute to open source`,
      ],
      projects: [
        `Build a full-stack app with ${s} as the primary technology`,
        `Implement a REST API or UI component library in ${s}`,
        `Contribute a bug fix or feature to an open-source ${s} repo`,
      ],
      resources: [
        { title: `${s} intermediate guide`, url: `https://www.google.com/search?q=${encodeURIComponent(s + " intermediate guide")}`, type: "docs" },
        { title: `${s} advanced patterns on YouTube`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(s + " intermediate advanced")}`, type: "video" },
        { title: `Udemy ${s} intermediate course`, url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(s)}`, type: "course" },
      ],
      estimated_weeks: 8,
    },
    Advanced: {
      focus_areas: [
        `Master advanced ${s} architecture and design patterns`,
        `Optimise performance, scalability, and maintainability`,
        `Lead or architect a production ${s} system`,
        `Mentor others and write technical content about ${s}`,
        `Stay current with the latest ${s} ecosystem updates`,
      ],
      projects: [
        `Design and build a production-grade ${s} system`,
        `Write a technical blog post or tutorial on an advanced ${s} topic`,
        `Speak at a meetup or record a video course about ${s}`,
      ],
      resources: [
        { title: `${s} advanced architecture articles`, url: `https://www.google.com/search?q=${encodeURIComponent(s + " advanced architecture")}`, type: "docs" },
        { title: `${s} conference talks`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(s + " conference talk")}`, type: "video" },
        { title: `${s} design patterns deep dive`, url: `https://www.google.com/search?q=${encodeURIComponent(s + " design patterns")}`, type: "course" },
      ],
      estimated_weeks: 12,
    },
  };
  return plans[level] ?? plans.Beginner;
}

export default function RoadmapPage() {
  const { skill }    = useParams();
  const navigate     = useNavigate();
  const location     = useLocation();
  const { user }     = useContext(AuthContext);

  // Seed level from router state (passed by QuizResultPage) so we have it immediately
  const stateLevel   = location.state?.skill_level;

  // Separate state variables for clarity and correct loading control
  const [isLoading,   setIsLoading]   = useState(true);
  const [error,       setError]       = useState(null);   // null | "no_roadmap" | "fetch_error"
  const [roadmapData, setRoadmapData] = useState(null);   // { focus_areas, projects, resources, estimated_weeks }
  const [skillLevel,  setSkillLevel]  = useState(stateLevel || "Beginner");
  const [skillName,   setSkillName]   = useState(skill);

  // ── Debug: log render state ────────────────────────────────────────────────
  console.log("RoadmapPage render state:", { isLoading, roadmapData, skillLevel, skillName, error, userId: user?._id, stateLevel });

  useEffect(() => {
    // Wait for auth context to hydrate — do not fetch until user._id is available
    if (!user || !user._id) return;

    let cancelled = false;

    const fetchRoadmap = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log(`🗺️ RoadmapPage: fetching roadmap for userId=${user._id}, skill="${skill}"`);

        const response = await getRoadmap(user._id, skill);

        // Full response log for debugging
        console.log("🗺️ RoadmapPage: raw response.data:", response.data);
        console.log("🗺️ RoadmapPage: response.data.data:", response.data.data);

        if (cancelled) return;

        // API shape: { success: true, data: { skill_name, verified_level, roadmap: { focus_areas, projects, resources, estimated_weeks } } }
        const profile = response.data.data;     // skill profile object
        const roadmap = profile?.roadmap ?? null; // actual roadmap content

        console.log("🗺️ RoadmapPage: profile:", profile);
        console.log("🗺️ RoadmapPage: roadmap:", roadmap);

        // Normalise skill level — fall back to Beginner if empty or invalid
        const rawLevel = profile?.verified_level;
        const level    = (rawLevel && VALID_LEVELS.includes(rawLevel)) ? rawLevel : "Beginner";

        setSkillName(profile?.skill_name || skill);
        setSkillLevel(level);
        // If the backend returned no roadmap object, generate a client-side one
        // so the page is never blank even if the roadmap wasn't persisted yet
        setRoadmapData(roadmap && roadmap.focus_areas ? roadmap : buildFallbackRoadmap(skill, level));

      } catch (err) {
        if (cancelled) return;
        console.error("🗺️ RoadmapPage: fetch error:", err.response?.data || err.message);
        if (err.response?.status === 404) {
          // No saved roadmap yet — if we have a level from quiz result state,
          // show a placeholder roadmap rather than a dead-end empty screen
          if (stateLevel && VALID_LEVELS.includes(stateLevel)) {
            setSkillLevel(stateLevel);
            setRoadmapData(buildFallbackRoadmap(skill, stateLevel));
          } else {
            setError("no_roadmap");
          }
        } else {
          setError("fetch_error");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchRoadmap();
    return () => { cancelled = true; };
  }, [user, skill]);   // re-runs as soon as auth context hydrates with user

  // ── Still waiting for auth context to hydrate ─────────────────────────────
  if (!user || !user._id) return <LoadingSkeleton />;

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) return <LoadingSkeleton />;

  // ── Error: no roadmap for this skill ──────────────────────────────────────
  if (error === "no_roadmap") {
    return (
      <EmptyState
        message="No roadmap found for this skill — take a quiz first."
        cta="Take a Quiz"
        onCta={() => navigate(`/quiz/${skill}`)}
      />
    );
  }

  // ── Error: fetch failed ────────────────────────────────────────────────────
  if (error === "fetch_error") {
    return (
      <EmptyState
        message="Could not load roadmap. Please try again."
        cta="Retry"
        onCta={() => window.location.reload()}
      />
    );
  }

  // ── Empty: roadmap data missing focus_areas ────────────────────────────────
  if (!roadmapData || !roadmapData.focus_areas) {
    return (
      <EmptyState
        message="Roadmap data is incomplete — please retake the quiz."
        cta="Retake Quiz"
        onCta={() => navigate(`/quiz/${skill}`)}
      />
    );
  }

  // ── Computed values ────────────────────────────────────────────────────────
  const focus_areas     = roadmapData?.focus_areas     ?? [];
  const projects        = roadmapData?.projects        ?? [];
  const resources       = roadmapData?.resources       ?? [];
  const estimated_weeks = roadmapData?.estimated_weeks ?? 4;

  const industryLevel = getIndustryStandard(skillName);
  const gap           = getLevelGap(skillLevel, industryLevel);
  const levelStyle    = LEVEL_STYLES[skillLevel] ?? LEVEL_STYLES.Beginner;
  const levelIdx      = LEVEL_ORDER[skillLevel]      ?? 0;
  const industryIdx   = LEVEL_ORDER[industryLevel]  ?? 2;

  // Group resources by type
  const resourceGroups = resources.reduce((acc, r) => {
    const type = r.type || "docs";
    if (!acc[type]) acc[type] = [];
    acc[type].push(r);
    return acc;
  }, {});

  const typeLabels = { docs: "📄 Documentation", course: "🎓 Courses", video: "🎬 Videos" };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }
        @keyframes slide-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .anim-up  { animation: slide-up 0.5s cubic-bezier(.16,1,.3,1) both; }
        .anim-up-d1 { animation: slide-up 0.5s cubic-bezier(.16,1,.3,1) 0.08s both; }
        .anim-up-d2 { animation: slide-up 0.5s cubic-bezier(.16,1,.3,1) 0.16s both; }
        .anim-up-d3 { animation: slide-up 0.5s cubic-bezier(.16,1,.3,1) 0.24s both; }
        .anim-up-d4 { animation: slide-up 0.5s cubic-bezier(.16,1,.3,1) 0.32s both; }
        .shimmer-text {
          background: linear-gradient(90deg,#6366f1 0%,#a78bfa 40%,#6366f1 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      <div className="max-w-3xl mx-auto space-y-6">

        {/* ── 1. Header ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-7 py-6 anim-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-body text-xs text-slate-400 font-medium uppercase tracking-widest mb-1">Learning Roadmap</p>
              <h1 className="font-display text-3xl font-extrabold text-slate-900">
                <span className="shimmer-text">{skillName}</span>
              </h1>
              <span className={`inline-block mt-2 font-display text-sm font-bold px-3 py-1 rounded-lg border ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}`}>
                {skillLevel}
              </span>
            </div>
            <button
              id="retake-quiz-btn"
              onClick={() => navigate(`/quiz/${skill}`)}
              className="font-body text-sm font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-4 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap self-start sm:self-auto">
              🔄 Retake Quiz
            </button>
          </div>
        </div>

        {/* ── 2. Skill Gap ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 anim-up-d1">
          <h2 className="font-display text-lg font-extrabold text-slate-900 mb-4">Skill Gap Analysis</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Your Level",        value: skillLevel,    style: `${levelStyle.bg} ${levelStyle.text} border ${levelStyle.border}` },
              { label: "Industry Standard", value: industryLevel, style: `${(LEVEL_STYLES[industryLevel] ?? LEVEL_STYLES.Intermediate).bg} ${(LEVEL_STYLES[industryLevel] ?? LEVEL_STYLES.Intermediate).text} border ${(LEVEL_STYLES[industryLevel] ?? LEVEL_STYLES.Intermediate).border}` },
              { label: "Gap",               value: gap.label,     style: `${gap.bg} ${gap.color} border` },
            ].map(col => (
              <div key={col.label} className={`rounded-xl p-4 text-center ${col.style}`}>
                <p className="font-body text-[10px] font-medium uppercase tracking-widest mb-2 opacity-70">{col.label}</p>
                <p className="font-display text-base font-extrabold">{col.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. Focus Areas ───────────────────────────────────────── */}
        {(focus_areas ?? []).length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 anim-up-d2">
            <h2 className="font-display text-lg font-extrabold text-slate-900 mb-5">Focus Areas</h2>
            <ol className="relative border-l-2 border-indigo-100 pl-6 space-y-5">
              {(focus_areas ?? []).map((area, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[2.125rem] w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-display text-sm font-bold shadow-sm shadow-indigo-200">
                    {i + 1}
                  </span>
                  <p className="font-body text-slate-700 font-medium leading-relaxed">{area}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* ── 4. Projects ──────────────────────────────────────────── */}
        {(projects ?? []).length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 anim-up-d2">
            <h2 className="font-display text-lg font-extrabold text-slate-900 mb-4">Suggested Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(projects ?? []).map((proj, i) => (
                <div key={i} className="border border-slate-100 rounded-xl p-4 flex items-center justify-between gap-3 hover:border-indigo-200 hover:bg-indigo-50/40 transition-all duration-200">
                  <span className="font-body text-slate-700 font-medium text-sm">{proj}</span>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(proj + " project tutorial")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="font-body text-xs font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition whitespace-nowrap">
                    Start →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 5. Resources ─────────────────────────────────────────── */}
        {(resources ?? []).length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 anim-up-d3">
            <h2 className="font-display text-lg font-extrabold text-slate-900 mb-5">Learning Resources</h2>
            <div className="space-y-5">
              {Object.entries(resourceGroups).map(([type, items]) => (
                <div key={type}>
                  <p className="font-body text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    {typeLabels[type] || type}
                  </p>
                  <ul className="space-y-2">
                    {(items ?? []).map((r, i) => (
                      <li key={i}>
                        <a href={r.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm font-body text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-150">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                          {r.title}
                          <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 6. Progress Meter ────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 anim-up-d3">
          <h2 className="font-display text-lg font-extrabold text-slate-900 mb-4">Your Level vs Industry Standard</h2>
          {/* Segmented bar */}
          <div className="relative h-4 rounded-full overflow-hidden flex mb-3">
            {["Beginner", "Intermediate", "Advanced"].map((lvl, i) => {
              const ls = LEVEL_STYLES[lvl];
              const isFilled = i <= levelIdx;
              return (
                <div key={lvl}
                  className={`flex-1 ${isFilled ? ls.bar : "bg-slate-200"} ${i === 0 ? "rounded-l-full" : ""} ${i === 2 ? "rounded-r-full" : ""}`}
                  style={{ marginRight: i < 2 ? 2 : 0 }}
                />
              );
            })}
          </div>
          {/* Labels below */}
          <div className="flex justify-between">
            {["Beginner", "Intermediate", "Advanced"].map((lvl, i) => (
              <div key={lvl} className="flex flex-col items-center text-center">
                <span className={`font-body text-xs font-semibold ${i <= levelIdx ? "text-slate-700" : "text-slate-300"}`}>{lvl}</span>
                {i === industryIdx && (
                  <span className="font-body text-[9px] text-slate-400 mt-0.5">Industry standard ↑</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── 7. Estimated Time ────────────────────────────────────── */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex items-center gap-4 anim-up-d4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white text-lg shrink-0">⏱</div>
          <div>
            <p className="font-body text-xs text-indigo-400 font-medium">Estimated time to next level</p>
            <p className="font-display text-xl font-extrabold text-indigo-900">~{estimated_weeks} weeks</p>
          </div>
        </div>

      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-5">
        {[120, 140, 220, 180, 160, 80, 60].map((h, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse" style={{ height: h }} />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ message, cta, onCta }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-10 text-center max-w-md w-full">
        <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">🗺️</div>
        <h2 className="font-display text-xl font-extrabold text-slate-800 mb-2">No Roadmap Yet</h2>
        <p className="font-body text-slate-500 text-sm mb-6">{message}</p>
        <button onClick={onCta}
          className="font-body font-semibold px-6 py-2.5 rounded-xl text-white text-sm"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
          {cta}
        </button>
      </div>
    </div>
  );
}
