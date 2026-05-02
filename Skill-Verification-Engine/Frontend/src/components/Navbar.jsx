import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticated, user, logoutUser } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    logoutUser();
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Skills", path: "/skills" },
    { name: "Verify", path: "/verify-skill" },
    { name: "Quiz", path: "/quiz" },
    { name: "Profile", path: "/profile" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/92 backdrop-blur-xl shadow-sm border-b border-slate-200/50"
            : "bg-white/98 border-b border-slate-200/60"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[70px]">

            {/* Logo */}
            <Link
              to="/"
              className="text-[1.4rem] font-extrabold tracking-wide text-indigo-500 hover:text-indigo-600 transition-colors duration-300 shrink-0"
            >
              SkillEngine
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 py-2 text-[0.95rem] font-medium transition-colors duration-300 group rounded-md
                    ${isActive(link.path)
                      ? "text-indigo-500"
                      : "text-slate-600 hover:text-indigo-500"
                    }`}
                >
                  {link.name}
                  {/* Underline indicator */}
                  <span
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-indigo-500 rounded-full transition-all duration-300
                      ${isActive(link.path) ? "w-[60%]" : "w-0 group-hover:w-[60%]"}`}
                  />
                </Link>
              ))}
            </nav>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {authenticated ? (
                <>
                  <span className="text-sm font-semibold text-slate-600">
                    Hello, {user?.name || "User"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-1.5 text-sm font-medium border border-slate-300 text-slate-600 rounded-lg hover:border-indigo-400 hover:text-indigo-500 transition-all duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-indigo-500 transition-colors duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-semibold text-white rounded-[10px] transition-all duration-300"
                    style={{
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "linear-gradient(135deg, #4f46e5, #7c3aed)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "linear-gradient(135deg, #6366f1, #8b5cf6)")
                    }
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-md text-slate-600 hover:text-indigo-500 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/60 px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
                  ${isActive(link.path)
                    ? "bg-indigo-50 text-indigo-500"
                    : "text-slate-600 hover:bg-slate-50 hover:text-indigo-500"
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-slate-200/60 mt-2 pt-2 flex flex-col gap-2">
              {authenticated ? (
                <>
                  <span className="px-4 text-sm font-semibold text-slate-500">
                    👋 {user?.name || "User"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="mx-4 py-2 text-sm font-medium border border-slate-300 text-slate-600 rounded-lg hover:border-red-400 hover:text-red-500 transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-indigo-500 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="mx-4 py-2.5 text-center text-sm font-semibold text-white rounded-[10px]"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-16 md:h-[70px]" />
    </>
  );
}