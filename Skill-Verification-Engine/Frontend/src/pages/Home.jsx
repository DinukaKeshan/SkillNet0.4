import { Link } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const loggedIn = isAuthenticated();
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsVisible) return;
    const animate = (setter, target, duration) => {
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        setter(Math.floor(current));
        if (current >= target) clearInterval(timer);
      }, 16);
    };
    animate(setCount1, 12400, 1800);
    animate(setCount2, 98, 1500);
    animate(setCount3, 340, 1600);
  }, [statsVisible]);

  return (
    <div className="w-full font-sans overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.6);opacity:0} }
        @keyframes slide-up { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fade-in { from{opacity:0} to{opacity:1} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-float-delay { animation: float 5s ease-in-out 1.5s infinite; }
        .animate-slide-up { animation: slide-up 0.8s cubic-bezier(.16,1,.3,1) forwards; }
        .animate-slide-up-delay { animation: slide-up 0.8s cubic-bezier(.16,1,.3,1) 0.2s both; }
        .animate-slide-up-delay2 { animation: slide-up 0.8s cubic-bezier(.16,1,.3,1) 0.4s both; }
        .animate-slide-up-delay3 { animation: slide-up 0.8s cubic-bezier(.16,1,.3,1) 0.6s both; }
        .animate-fade-in { animation: fade-in 1s ease forwards; }
        .shimmer-text {
          background: linear-gradient(90deg, #6366f1 0%, #a78bfa 40%, #6366f1 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .spin-slow { animation: spin-slow 20s linear infinite; }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(99,102,241,0.15); }
        .badge-hover { transition: all 0.3s ease; }
        .badge-hover:hover { transform: scale(1.06); box-shadow: 0 8px 30px rgba(99,102,241,0.25); }
        .glow-btn { position: relative; overflow: hidden; }
        .glow-btn::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .glow-btn:hover::before { opacity: 1; }
        .pulse-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid rgba(99,102,241,0.4);
          animation: pulse-ring 2s ease-out infinite;
        }
      `}</style>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#f8f7ff]">
        {/* Background mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)" }} />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)" }} />
          {/* Grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6366f1" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating orbs */}
        <div className="absolute top-[15%] left-[8%] w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 opacity-70 animate-float shadow-lg shadow-indigo-200" />
        <div className="absolute top-[60%] right-[6%] w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 opacity-60 animate-float-delay shadow-md shadow-violet-200" />
        <div className="absolute bottom-[20%] left-[15%] w-8 h-8 rounded-full bg-indigo-300 opacity-50 animate-float" style={{ animationDelay: "0.8s" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-indigo-600 text-sm font-medium font-body">AI-Powered Skill Verification</span>
            </div>

            <h1 className="font-display text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6 animate-slide-up">
              Prove What You<br />
              <span className="shimmer-text">Know. Earn</span><br />
              What You Deserve.
            </h1>

            <p className="font-body text-slate-500 text-lg leading-relaxed mb-8 animate-slide-up-delay max-w-md">
              Validate your technical skills with AI-driven assessments. Earn industry-recognized badges that employers trust.
            </p>

            <div className="flex flex-wrap gap-4 animate-slide-up-delay2">
              {loggedIn ? (
                <Link to="/verify-skill" className="glow-btn font-body font-semibold px-8 py-3.5 rounded-xl text-white text-base transition-all duration-300 hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 24px rgba(99,102,241,0.35)" }}>
                  Verify a Skill →
                </Link>
              ) : (
                <>
                  <Link to="/register" className="glow-btn font-body font-semibold px-8 py-3.5 rounded-xl text-white text-base transition-all duration-300 hover:scale-105"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 24px rgba(99,102,241,0.35)" }}>
                    Get Started Free →
                  </Link>
                  <Link to="/login" className="font-body font-medium px-8 py-3.5 rounded-xl text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-500 transition-all duration-300 bg-white">
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Trust row */}
            <div className="flex items-center gap-6 mt-8 animate-slide-up-delay3">
              <div className="flex -space-x-2">
                {["#6366f1","#8b5cf6","#a78bfa","#c4b5fd"].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-bold"
                    style={{ background: c }}>
                    {["JD","SK","MR","AL"][i]}
                  </div>
                ))}
              </div>
              <p className="font-body text-sm text-slate-500">
                <span className="font-semibold text-slate-700">12,400+</span> professionals verified
              </p>
            </div>
          </div>

          {/* Right — Visual Card */}
          <div className="hidden md:flex justify-center items-center relative">
            <div className="relative">
              {/* pulse rings */}
              <div className="pulse-ring w-72 h-72 top-[calc(50%-9rem)] left-[calc(50%-9rem)]" style={{ animationDelay: "0s" }} />
              <div className="pulse-ring w-72 h-72 top-[calc(50%-9rem)] left-[calc(50%-9rem)]" style={{ animationDelay: "0.8s" }} />

              {/* Main card */}
              <div className="relative z-10 bg-white rounded-3xl p-8 w-72 shadow-2xl shadow-indigo-100 border border-indigo-50">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                    ⚡
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Verified ✓</span>
                </div>
                <h3 className="font-display text-xl font-bold text-slate-800 mb-1">React Expert</h3>
                <p className="font-body text-sm text-slate-400 mb-5">Score: 94 / 100</p>

                {/* Progress bars */}
                {[
                  { label: "Hooks & State", val: 96 },
                  { label: "Performance", val: 88 },
                  { label: "Architecture", val: 91 },
                ].map((s) => (
                  <div key={s.label} className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="font-body text-xs text-slate-500">{s.label}</span>
                      <span className="font-body text-xs font-semibold text-indigo-500">{s.val}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${s.val}%`, background: "linear-gradient(90deg, #6366f1, #8b5cf6)" }} />
                    </div>
                  </div>
                ))}

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <span className="text-lg">🏅</span>
                  <span className="font-body text-xs text-slate-500">Badge issued · March 2025</span>
                </div>
              </div>

              {/* Floating mini cards */}
              <div className="absolute -top-4 -right-10 bg-white rounded-2xl px-4 py-2.5 shadow-lg border border-slate-100 animate-float">
                <p className="font-body text-xs text-slate-400">Accuracy</p>
                <p className="font-display text-lg font-bold text-indigo-500">98%</p>
              </div>
              <div className="absolute -bottom-4 -left-10 bg-white rounded-2xl px-4 py-2.5 shadow-lg border border-slate-100 animate-float-delay">
                <p className="font-body text-xs text-slate-400">Questions</p>
                <p className="font-display text-lg font-bold text-violet-500">10 AI</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ──────────────────────────────────────────── */}
      <section ref={statsRef} className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {[
            { val: count1.toLocaleString() + "+", label: "Skills Verified" },
            { val: count2 + "%", label: "Accuracy Rate" },
            { val: count3 + "+", label: "Skill Categories" },
          ].map((s, i) => (
            <div key={i}>
              <p className="font-display text-4xl font-extrabold shimmer-text mb-1">{s.val}</p>
              <p className="font-body text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────────── */}
      <section className="py-24 bg-[#f8f7ff]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="font-body text-sm font-semibold text-indigo-500 uppercase tracking-widest">Process</span>
            <h2 className="font-display text-4xl font-extrabold text-slate-900 mt-2">How Verification Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "01", icon: "🎯", title: "Choose a Skill", desc: "Select from 340+ technical skills — Java, React, Python, DevOps and more." },
              { num: "02", icon: "🤖", title: "AI Assessment", desc: "Answer 10 adaptive questions generated by AI from real-world scenarios." },
              { num: "03", icon: "🏅", title: "Earn Your Badge", desc: "Pass the assessment and receive a verifiable, shareable digital badge." },
            ].map((step) => (
              <div key={step.num} className="card-hover relative bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                <span className="font-display text-7xl font-extrabold text-slate-50 absolute top-4 right-6 select-none leading-none">{step.num}</span>
                <div className="relative z-10">
                  <div className="text-3xl mb-4">{step.icon}</div>
                  <h3 className="font-display text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
                  <p className="font-body text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl opacity-0 transition-opacity duration-300"
                  style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6)" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "0"} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="font-body text-sm font-semibold text-indigo-500 uppercase tracking-widest">Capabilities</span>
            <h2 className="font-display text-4xl font-extrabold text-slate-900 mt-2">Platform Capabilities</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🧠", title: "AI-Powered Questions", desc: "Assessments generated using LLaMA models and real technical knowledge bases.", color: "#6366f1" },
              { icon: "🔐", title: "Secure & Verified", desc: "JWT authentication and cryptographically protected assessments.", color: "#8b5cf6" },
              { icon: "🏅", title: "Skill Badges", desc: "Shareable digital badges to showcase your verified expertise to employers.", color: "#a78bfa" },
              { icon: "📈", title: "Adaptive Difficulty", desc: "Questions scale intelligently based on real skill complexity and domain depth.", color: "#6366f1" },
              { icon: "📚", title: "RAG Knowledge Base", desc: "Assessments built from curated skill documentation and industry standards.", color: "#8b5cf6" },
              { icon: "⚙️", title: "Developer-Friendly", desc: "Built with MERN stack — scalable, fast, and production-ready.", color: "#a78bfa" },
            ].map((f) => (
              <div key={f.title} className="card-hover group bg-white rounded-2xl p-7 border border-slate-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${f.color}22, ${f.color}11)`, border: `1px solid ${f.color}33` }}>
                  {f.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="font-body text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BADGES ───────────────────────────────────────────── */}
      <section className="py-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #f0f0ff 0%, #f8f7ff 50%, #faf5ff 100%)" }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="font-body text-sm font-semibold text-indigo-500 uppercase tracking-widest">Recognition</span>
          <h2 className="font-display text-4xl font-extrabold text-slate-900 mt-2 mb-4">Trusted Skill Badges</h2>
          <p className="font-body text-slate-500 mb-12 max-w-xl mx-auto">
            Every badge represents a verified assessment backed by AI evaluation and real technical benchmarks.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: "Java Certified", color: "#6366f1" },
              { label: "React Verified", color: "#8b5cf6" },
              { label: "Node.js Expert", color: "#7c3aed" },
              { label: "Python Pro", color: "#6366f1" },
              { label: "DevOps Ready", color: "#8b5cf6" },
              { label: "TypeScript Dev", color: "#a78bfa" },
            ].map((b) => (
              <div key={b.label} className="badge-hover flex items-center gap-2.5 bg-white px-6 py-3 rounded-full border shadow-sm cursor-default"
                style={{ borderColor: `${b.color}33` }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: b.color }} />
                <span className="font-body text-sm font-semibold text-slate-700">{b.label}</span>
                <span className="text-base">🏅</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }} />
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="white"/></pattern></defs><rect width="100%" height="100%" fill="url(#dots)"/></svg>
        </div>
        <div className="absolute top-[-80px] right-[-80px] w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, white, transparent)" }} />

        <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
          <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
            Start Verifying Your<br />Skills Today
          </h2>
          <p className="font-body text-indigo-200 text-lg mb-10">
            Prove your expertise. Build credibility. Stand out in a competitive market.
          </p>
          {loggedIn ? (
            <Link to="/verify-skill" className="glow-btn inline-block font-body font-semibold px-10 py-4 rounded-xl bg-white text-indigo-600 text-base transition-all duration-300 hover:scale-105 shadow-2xl">
              Verify a Skill →
            </Link>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="glow-btn font-body font-semibold px-10 py-4 rounded-xl bg-white text-indigo-600 text-base transition-all duration-300 hover:scale-105 shadow-2xl">
                Get Started Free →
              </Link>
              <Link to="/login" className="font-body font-medium px-10 py-4 rounded-xl border-2 border-white/30 text-white text-base transition-all duration-300 hover:bg-white/10 hover:border-white/60">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}