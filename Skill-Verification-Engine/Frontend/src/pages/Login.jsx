import { useState } from "react";
import { loginUser } from "../services/authService";
import { saveAuth } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import GoogleButton from "../components/GoogleButton";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      saveAuth(res.data.token, res.data.user);
      login(res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-[#f8f7ff] px-4 relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
        @keyframes slide-up { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        .animate-slide-up { animation: slide-up 0.7s cubic-bezier(.16,1,.3,1) forwards; }
        .animate-slide-up-d1 { animation: slide-up 0.7s cubic-bezier(.16,1,.3,1) 0.1s both; }
        .animate-slide-up-d2 { animation: slide-up 0.7s cubic-bezier(.16,1,.3,1) 0.2s both; }
        .animate-slide-up-d3 { animation: slide-up 0.7s cubic-bezier(.16,1,.3,1) 0.3s both; }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-float-d { animation: float 5s ease-in-out 1.5s infinite; }
        .animate-shake { animation: shake 0.4s ease; }
        .input-field {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          color: #334155;
          background: #fafafa;
          outline: none;
          transition: all 0.2s ease;
        }
        .input-field:focus {
          border-color: #6366f1;
          background: white;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.08);
        }
        .input-field::placeholder { color: #94a3b8; }
        .glow-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          transition: all 0.3s ease;
        }
        .glow-btn:hover {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          box-shadow: 0 8px 28px rgba(99,102,241,0.4);
          transform: translateY(-1px);
        }
        .glow-btn:active { transform: translateY(0); }
      `}</style>

      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)" }} />

      {/* Floating orbs */}
      <div className="absolute top-[12%] left-[6%] w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 opacity-60 animate-float shadow-lg shadow-indigo-200 pointer-events-none" />
      <div className="absolute bottom-[18%] right-[8%] w-7 h-7 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 opacity-50 animate-float-d shadow-md pointer-events-none" />

      {/* Card */}
      <div className="relative w-full max-w-md">
        {/* Top accent bar */}
        <div className="h-1 w-full rounded-t-2xl" style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)" }} />

        <div className="bg-white rounded-b-2xl rounded-tr-2xl shadow-xl shadow-indigo-100/60 border border-slate-100 px-8 py-10">

          {/* Header */}
          <div className="text-center mb-8 animate-slide-up">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-lg"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <span className="text-2xl">⚡</span>
            </div>
            <h1 className="font-display text-3xl font-extrabold text-slate-900">Welcome Back</h1>
            <p className="font-body text-slate-400 text-sm mt-1.5">Sign in to your SkillEngine account</p>
          </div>

          {/* Error */}
          {error && (
            <div className="animate-shake flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-5 font-body text-sm">
              <span className="mt-0.5 shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="animate-slide-up-d1">
              <label className="font-body text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base">✉️</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input-field pl-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="animate-slide-up-d2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-body text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="font-body text-xs text-indigo-500 hover:text-indigo-700 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="input-field pl-11 pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors text-sm font-body"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="animate-slide-up-d3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="glow-btn w-full py-3.5 rounded-xl font-display font-bold text-white text-base tracking-wide disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Signing in...
                  </span>
                ) : "Sign In →"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="font-body text-xs text-slate-400 font-medium">or continue with</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Google */}
          <GoogleButton />

          {/* Footer */}
          <p className="font-body text-sm text-center text-slate-400 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-500 font-semibold hover:text-indigo-700 transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}