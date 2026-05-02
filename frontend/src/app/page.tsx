"use client";

import { useState } from "react";
import { Typography, Container, Button, Box, Stack } from "@mui/material";
import {
  Groups,
  Psychology,
  WorkspacePremium,
  TrendingUp,
  School,
  Business,
  Rocket,
  AutoAwesome,
  ArrowForward,
  CheckCircleOutline,
  PersonSearch,
  Assignment,
  Handshake,
} from "@mui/icons-material";
import LoginModal from "@/components/LoginModal";
import SignupModal from "@/components/SignupModal";

export default function Home() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);

  const features = [
    {
      icon: <Psychology sx={{ fontSize: 40 }} />,
      title: "AI Team Matching",
      desc: "Our FastText-powered AI analyzes your skills and recommends the best-fit teams using semantic similarity — even for skills the model hasn't seen before.",
      color: "#6366f1",
    },
    {
      icon: <Assignment sx={{ fontSize: 40 }} />,
      title: "Smart Project Matching",
      desc: "SMEs post projects and our ML engine instantly finds teams whose skills align with the project's requirements using deep skill embeddings.",
      color: "#8b5cf6",
    },
    {
      icon: <WorkspacePremium sx={{ fontSize: 40 }} />,
      title: "Skill Verification",
      desc: "Students add skills and get them verified by SMEs. Verified skills carry more weight in AI recommendations, improving match quality.",
      color: "#06b6d4",
    },
    {
      icon: <PersonSearch sx={{ fontSize: 40 }} />,
      title: "AI Recruiter Engine",
      desc: "Companies post job roles and our ML model ranks students by how well their verified and unverified skills match — powered by a trained regression model.",
      color: "#ec4899",
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: "Role-Based Dashboards",
      desc: "Tailored dashboards for Students, SMEs, Companies, and Admins — each with specialized tools, analytics, and management capabilities.",
      color: "#10b981",
    },
    {
      icon: <Handshake sx={{ fontSize: 40 }} />,
      title: "End-to-End Hiring",
      desc: "Complete hiring workflow — from skill-based matching to sending offers, accepting/rejecting, and tracking hire status in real time.",
      color: "#f59e0b",
    },
  ];

  const steps = [
    {
      step: "01",
      icon: <School sx={{ fontSize: 36 }} />,
      title: "Create Your Profile",
      desc: "Sign up as a Student, SME, or Company. Add your skills, create teams, or post job roles.",
    },
    {
      step: "02",
      icon: <AutoAwesome sx={{ fontSize: 36 }} />,
      title: "Add & Verify Skills",
      desc: "Students add their tech skills. SMEs verify them to boost credibility and improve AI match accuracy.",
    },
    {
      step: "03",
      icon: <Groups sx={{ fontSize: 36 }} />,
      title: "Get AI-Matched",
      desc: "Our FastText ML models analyze skill vectors and match students to teams and projects using semantic similarity.",
    },
    {
      step: "04",
      icon: <Rocket sx={{ fontSize: 36 }} />,
      title: "Collaborate & Get Hired",
      desc: "Join recommended teams, work on matched projects, and receive job offers from companies — all within the platform.",
    },
  ];

  const stats = [
    { value: "500+", label: "Skills Tracked", icon: <AutoAwesome /> },
    { value: "3", label: "AI Models", icon: <Psychology /> },
    { value: "4", label: "User Roles", icon: <Groups /> },
    { value: "100%", label: "Open Source", icon: <Rocket /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative flex items-center justify-center text-center py-36 px-4 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 opacity-90" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute -bottom-20 left-1/3 w-[450px] h-[450px] bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: "2s" }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          <Box sx={{ mb: 3 }}>
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-white/10 text-indigo-300 border border-indigo-400/30 backdrop-blur-sm">
              Powered by Custom-Trained AI Models
            </span>
          </Box>

          <Typography variant="h1" sx={{ color: "white", mb: 3, fontWeight: 800, fontSize: { xs: "2.5rem", md: "3.5rem" }, lineHeight: 1.2 }}>
            Connect.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
              Collaborate.
            </span>{" "}
            Create.
          </Typography>

          <Typography variant="h6" sx={{ color: "#cbd5e1", mb: 5, maxWidth: 640, mx: "auto", lineHeight: 1.8, fontWeight: 400 }}>
            The AI-powered platform connecting Students, Subject Matter Experts, and Companies.
            Build skills, join teams, match with projects, and land your dream job — intelligently.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => setOpenSignup(true)}
              endIcon={<ArrowForward />}
              sx={{
                px: 5, py: 1.5, fontSize: "1.1rem", fontWeight: 700,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                "&:hover": { background: "linear-gradient(135deg, #4f46e5, #7c3aed)", transform: "translateY(-2px)" },
                transition: "all 0.3s",
                borderRadius: "12px",
              }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}
              sx={{
                px: 5, py: 1.5, fontSize: "1.1rem",
                borderColor: "rgba(255,255,255,0.3)", color: "white",
                "&:hover": { borderColor: "white", backgroundColor: "rgba(255,255,255,0.08)" },
                borderRadius: "12px",
              }}
            >
              Learn More
            </Button>
          </Stack>

          <Typography variant="body2" sx={{ color: "#94a3b8", mt: 4 }}>
            Trusted by students and companies across multiple universities
          </Typography>
        </div>
      </section>

      {/* ===== WHAT WE OFFER ===== */}
      <section id="features" className="py-24 bg-white">
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Typography variant="overline" sx={{ color: "#6366f1", fontWeight: 700, letterSpacing: 2, mb: 1, display: "block" }}>
              WHAT WE OFFER
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#0f172a", mb: 2 }}>
              Everything You Need to Succeed
            </Typography>
            <Typography variant="h6" sx={{ color: "#64748b", maxWidth: 600, mx: "auto", fontWeight: 400 }}>
              A complete ecosystem for skill development, team collaboration, and intelligent career matching.
            </Typography>
          </Box>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 4,
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#fafbfe",
                  transition: "all 0.3s ease",
                  cursor: "default",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1)",
                    borderColor: feature.color,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64, height: 64, borderRadius: "14px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    backgroundColor: `${feature.color}15`,
                    color: feature.color, mb: 3,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: "#0f172a" }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.7 }}>
                  {feature.desc}
                </Typography>
              </Box>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== WHY SKILLNET / FOR WHO ===== */}
      <section id="about" className="py-24 bg-gradient-to-br from-slate-50 to-indigo-50">
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Typography variant="overline" sx={{ color: "#8b5cf6", fontWeight: 700, letterSpacing: 2, mb: 1, display: "block" }}>
              WHY SKILLNET
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#0f172a", mb: 2 }}>
              Built for Everyone in the Ecosystem
            </Typography>
          </Box>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <School sx={{ fontSize: 48 }} />,
                title: "For Students",
                items: [
                  "Showcase verified & unverified skills",
                  "Get AI-recommended teams that match your expertise",
                  "Receive job offers directly from companies",
                  "Accept or reject offers with one click",
                ],
                gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              },
              {
                icon: <Rocket sx={{ fontSize: 48 }} />,
                title: "For SMEs",
                items: [
                  "Create and manage professional teams",
                  "Post projects and find matching teams via AI",
                  "Verify student skills for quality assurance",
                  "Review and manage hiring requests",
                ],
                gradient: "linear-gradient(135deg, #06b6d4, #0ea5e9)",
              },
              {
                icon: <Business sx={{ fontSize: 48 }} />,
                title: "For Companies",
                items: [
                  "Post job roles with required skills",
                  "AI ranks students by skill match scores",
                  "Send hire requests to top candidates",
                  "Track hiring status in real time",
                ],
                gradient: "linear-gradient(135deg, #ec4899, #f43f5e)",
              },
            ].map((card, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 5, borderRadius: "20px", backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)" },
                }}
              >
                <Box
                  sx={{
                    width: 80, height: 80, borderRadius: "20px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: card.gradient, color: "white", mb: 3,
                  }}
                >
                  {card.icon}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>{card.title}</Typography>
                <Stack spacing={1.5}>
                  {card.items.map((item, i) => (
                    <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                      <CheckCircleOutline sx={{ fontSize: 20, color: "#10b981", mt: 0.2 }} />
                      <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>{item}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 bg-white">
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Typography variant="overline" sx={{ color: "#06b6d4", fontWeight: 700, letterSpacing: 2, mb: 1, display: "block" }}>
              HOW IT WORKS
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#0f172a", mb: 2 }}>
              Get Started in 4 Simple Steps
            </Typography>
          </Box>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <Box key={idx} textAlign="center" sx={{ position: "relative" }}>
                <Typography
                  sx={{
                    fontSize: "4rem", fontWeight: 900, color: "#e2e8f0",
                    position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                    userSelect: "none", lineHeight: 1,
                  }}
                >
                  {s.step}
                </Typography>
                <Box
                  sx={{
                    width: 72, height: 72, borderRadius: "50%", mx: "auto", mb: 3, mt: 4,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white",
                    position: "relative", zIndex: 1,
                  }}
                >
                  {s.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{s.title}</Typography>
                <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.7 }}>{s.desc}</Typography>
              </Box>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <Container maxWidth="lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <Box key={idx} textAlign="center" sx={{ color: "white" }}>
                <Box sx={{ mb: 1, opacity: 0.8 }}>{stat.icon}</Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>{stat.value}</Typography>
                <Typography variant="body1" sx={{ opacity: 0.85, fontWeight: 500 }}>{stat.label}</Typography>
              </Box>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== POWERED BY AI ===== */}
      <section className="py-24 bg-slate-50">
        <Container maxWidth="lg">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Box>
              <Typography variant="overline" sx={{ color: "#6366f1", fontWeight: 700, letterSpacing: 2, mb: 1, display: "block" }}>
                POWERED BY AI
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: "#0f172a", mb: 3 }}>
                Custom-Trained FastText Models
              </Typography>
              <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.8, mb: 3 }}>
                SkillNet uses <strong>FastText word embeddings trained from scratch</strong> on a custom-generated
                corpus of 12,000+ tech skill sentences. The models understand semantic relationships between
                technologies — for example, that &quot;Django&quot; is related to &quot;Python&quot; and that
                &quot;React&quot; is similar to &quot;Angular&quot;.
              </Typography>
              <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.8, mb: 3 }}>
                Unlike traditional keyword matching, our models use <strong>character-level n-gram embeddings</strong>,
                which means they can handle <strong>any new skill keyword</strong> — even ones never seen during
                training — without needing to retrain the model.
              </Typography>
              <Stack spacing={1.5}>
                {[
                  "Team Recommender — Matches students to teams (Port 5002)",
                  "Project Matcher — Matches projects to teams (Port 5003)",
                  "Recruiter Engine — Ranks students for jobs (Port 5004)",
                ].map((item, i) => (
                  <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                    <AutoAwesome sx={{ fontSize: 18, color: "#6366f1" }} />
                    <Typography variant="body2" sx={{ color: "#334155", fontWeight: 500 }}>{item}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>

            <Box
              sx={{
                p: 4, borderRadius: "20px",
                background: "linear-gradient(135deg, #1e1b4b, #312e81)",
                color: "#e0e7ff",
                fontFamily: "monospace",
                fontSize: "0.85rem",
                lineHeight: 2,
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
              }}
            >
              <Typography sx={{ color: "#818cf8", fontFamily: "inherit", fontSize: "inherit", mb: 1 }}>
                # FastText Similarity Example
              </Typography>
              <Typography sx={{ fontFamily: "inherit", fontSize: "inherit" }}>
                &gt; similarity(&quot;react&quot;, &quot;reactjs&quot;) = <span style={{ color: "#34d399" }}>0.603</span>
              </Typography>
              <Typography sx={{ fontFamily: "inherit", fontSize: "inherit" }}>
                &gt; similarity(&quot;mysql&quot;, &quot;mongodb&quot;) = <span style={{ color: "#34d399" }}>0.467</span>
              </Typography>
              <Typography sx={{ fontFamily: "inherit", fontSize: "inherit" }}>
                &gt; similarity(&quot;flutter&quot;, &quot;reactnative&quot;) = <span style={{ color: "#34d399" }}>0.433</span>
              </Typography>
              <Typography sx={{ fontFamily: "inherit", fontSize: "inherit" }}>
                &gt; similarity(&quot;docker&quot;, &quot;dockerize&quot;) = <span style={{ color: "#34d399" }}>0.913</span>
              </Typography>
              <Typography sx={{ fontFamily: "inherit", fontSize: "inherit", mt: 1, color: "#818cf8" }}>
                # Handles unseen words via subword decomposition
              </Typography>
            </Box>
          </div>
        </Container>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-transparent to-purple-900/50" />
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            Ready to Join the Network?
          </Typography>
          <Typography variant="h6" sx={{ color: "#94a3b8", mb: 5, fontWeight: 400 }}>
            Join students and companies already building the future with AI-powered skill matching.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => setOpenSignup(true)}
              endIcon={<ArrowForward />}
              sx={{
                px: 5, py: 1.5, fontSize: "1.1rem", fontWeight: 700,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                "&:hover": { background: "linear-gradient(135deg, #4f46e5, #7c3aed)" },
                borderRadius: "12px",
              }}
            >
              Create Free Account
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => setOpenLogin(true)}
              sx={{
                px: 5, py: 1.5, fontSize: "1.1rem",
                borderColor: "rgba(255,255,255,0.3)", color: "white",
                "&:hover": { borderColor: "white", backgroundColor: "rgba(255,255,255,0.05)" },
                borderRadius: "12px",
              }}
            >
              Sign In
            </Button>
          </Stack>
        </Container>
      </section>

      <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
      <SignupModal
        open={openSignup}
        onClose={() => setOpenSignup(false)}
        onSwitchToSignIn={() => {
          setOpenSignup(false);
          setOpenLogin(true);
        }}
      />
    </div>
  );
}
