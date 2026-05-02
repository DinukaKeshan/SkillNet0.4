"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Chip,
  Box,
  Stack,
  AppBar,
  Toolbar,
  Alert,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Add, Groups, Work, CheckCircle, Cancel, AttachMoney, Business } from "@mui/icons-material";
import UserMenu from "../../components/UserMenu";
import { useRouter } from "next/navigation";

const PROJECT_INFO = [
  { icon: "🎯", title: "AI-Powered Matching", desc: "Our FastText AI models match your skills to the best-fit teams and projects automatically." },
  { icon: "✓", title: "Skill Verification", desc: "Get your skills verified by SMEs to boost credibility and improve your AI match scores." },
  { icon: "💼", title: "Direct Job Offers", desc: "Companies discover you based on your skills and send you job offers directly through the platform." },
];

export default function StudentDashboard() {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [verifiedSkills, setVerifiedSkills] = useState<string[]>([]);
  const [unverifiedSkills, setUnverifiedSkills] = useState<string[]>([]);
  const [companyOffers, setCompanyOffers] = useState<any[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(false);

  const [studentInfo, setStudentInfo] = useState({
    id: 0,
    name: "",
    username: "",
    role: "",
    department: "",
    academic_year: "",
  });

  const [teams] = useState([
    { id: 1, name: "Team Alpha", members: ["Alice", "Bob"] },
    { id: 2, name: "Team Beta", members: ["John", "Alex"] },
  ]);

  useEffect(() => {
    fetchStudentInfo();
    fetchStudentSkills();
    fetchCompanyOffers();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchStudentInfo = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/getStudentInfo", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setStudentInfo(data.user);
      } else {
        console.error("Error fetching student info:", data.error);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/editProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: studentInfo.name,
          department: studentInfo.department,
          academic_year: studentInfo.academic_year,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Profile updated successfully!");
        setOpenEdit(false);
        fetchStudentInfo();
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Error updating profile");
    }
  };

  const fetchStudentSkills = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/getStudentSkills", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setVerifiedSkills(Array.isArray(data.verified_skills) ? data.verified_skills : []);
        setUnverifiedSkills(Array.isArray(data.unverified_skills) ? data.unverified_skills : []);
      }
    } catch (err) {
      console.error("Error fetching skills:", err);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) {
      alert("Please enter a skill name");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/addSkill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ skill: newSkill.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setNewSkill("");
        fetchStudentSkills(); // Refresh skills list
      } else {
        alert(data.error || "Failed to add skill");
      }
    } catch (err) {
      console.error("Error adding skill:", err);
      alert("Error adding skill");
    }
  };

  const fetchCompanyOffers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoadingOffers(true);
    try {
      const res = await fetch("http://localhost:5000/api/student/hire-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCompanyOffers(data.requests || []);
      }
    } catch (err) {
      console.error("Error fetching company offers:", err);
    } finally {
      setLoadingOffers(false);
    }
  };

  const handleAcceptOffer = async (chrId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/student/hire-requests/${chrId}/accept`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Job offer accepted! The company will be notified.");
        fetchCompanyOffers();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to accept");
      }
    } catch (err) {
      alert("Error accepting offer");
    }
  };

  const handleRejectOffer = async (chrId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/student/hire-requests/${chrId}/reject`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Job offer rejected.");
        fetchCompanyOffers();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to reject");
      }
    } catch (err) {
      alert("Error rejecting offer");
    }
  };

  const jobTypeLabel = (t: string) => {
    if (t === "contract") return "Contract";
    if (t === "employment") return "Permanent";
    if (t === "intern") return "Internship";
    return t;
  };

  const handleVerifySkill = async (skill: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/verifySkill", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ skill }),
      });

      const data = await res.json();
      if (res.ok) {
        fetchStudentSkills(); // Refresh skills list
      } else {
        alert(data.error || "Failed to verify skill");
      }
    } catch (err) {
      console.error("Error verifying skill:", err);
      alert("Error verifying skill");
    }
  };

  const handleRemoveSkill = async (skill: string, type: "verified" | "unverified") => {
    if (!confirm(`Are you sure you want to remove "${skill}"?`)) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/removeSkill", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ skill, type }),
      });

      const data = await res.json();
      if (res.ok) {
        fetchStudentSkills(); // Refresh skills list
      } else {
        alert(data.error || "Failed to remove skill");
      }
    } catch (err) {
      console.error("Error removing skill:", err);
      alert("Error removing skill");
    }
  };

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <Typography variant="h5">Loading...</Typography>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* HEADER BAR — scroll-aware */}
      <AppBar
        position="sticky"
        elevation={scrolled ? 2 : 0}
        sx={{
          background: scrolled ? "linear-gradient(135deg,#6366f1,#06b6d4)" : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          transition: "all 0.4s ease",
          borderBottom: scrolled ? "none" : "1px solid #e2e8f0",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              color: scrolled ? "white" : "#6366f1",
              transition: "color 0.4s ease",
            }}
          >
            SkillNet{scrolled ? " - Student Dashboard" : ""}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, opacity: scrolled ? 1 : 0, transform: scrolled ? "translateX(0)" : "translateX(20px)", transition: "all 0.4s ease", pointerEvents: scrolled ? "auto" : "none" }}>
            <Button
              color="inherit"
              onClick={() => router.push("/student")}
              sx={{ fontWeight: "bold", color: "white" }}
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              onClick={() => router.push("/student/hiring-requests")}
              sx={{ fontWeight: "bold", color: "white" }}
            >
              Hiring Requests
            </Button>
          </Box>
          <UserMenu
            userName={studentInfo.name}
            onProfileUpdate={() => setOpenEdit(true)}
          />
        </Toolbar>
      </AppBar>

      <Box p={4}>
        {/* PROJECT INFO BANNER */}
        <Box maxWidth={900} mx="auto" mb={4}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            {PROJECT_INFO.map((info, idx) => (
              <Card
                key={idx}
                sx={{
                  flex: 1,
                  minHeight: 140,
                  p: 2.5,
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  background: "linear-gradient(135deg, #fafbff 0%, #f0f4ff 100%)",
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "translateY(-3px)", boxShadow: 4 },
                }}
              >
                <Typography fontSize={28} mb={1}>{info.icon}</Typography>
                <Typography variant="subtitle2" fontWeight={700} mb={0.5}>{info.title}</Typography>
                <Typography variant="body2" color="text.secondary" lineHeight={1.6}>{info.desc}</Typography>
              </Card>
            ))}
          </Stack>
        </Box>

        {/* PROFILE CARD */}
        <Card sx={{
          maxWidth: 900,
          mx: "auto",
          mb: 4,
          p: 3,
          borderRadius: 3,
          borderLeft: "5px solid #6366f1",
          "&:hover": { boxShadow: 4 },
          transition: "all 0.3s ease",
        }}>
          <CardContent>
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar src="" sx={{ width: 80, height: 80, bgcolor: "#6366f1" }}>
                {studentInfo.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {studentInfo.name}
                </Typography>
                <Typography color="text.secondary">{studentInfo.username}</Typography>
                <Typography variant="body2" mt={1}>
                  <strong>Department:</strong> {studentInfo.department || "N/A"} |{" "}
                  <strong>Year:</strong> {studentInfo.academic_year || "N/A"}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* TABS */}
        <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} centered sx={{ mb: 3 }}>
          <Tab label="Skills" />
          <Tab label="Teams" />
          <Tab label="Jobs" />
        </Tabs>

        {/* SKILLS TAB - Complete Implementation */}
        {tabIndex === 0 && (
          <Box>
            {/* Add Skill Section */}
            <Card sx={{ maxWidth: 900, mx: "auto", mb: 3, p: 3, borderRadius: 3, borderLeft: "5px solid #6366f1", minHeight: 100, "&:hover": { boxShadow: 4 }, transition: "all 0.3s ease" }}>
              <Typography variant="h6" mb={2}>
                Add New Skill
              </Typography>
              <Stack direction="row" gap={2}>
                <TextField
                  label="Skill Name"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="e.g., React, Python, Machine Learning"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleAddSkill();
                  }}
                />
                <Button variant="contained" startIcon={<Add />} onClick={handleAddSkill}>
                  Add
                </Button>
              </Stack>
            </Card>

            {/* Verified Skills */}
            <Card sx={{
              maxWidth: 900,
              mx: "auto",
              mb: 3,
              p: 3,
              borderRadius: 3,
              borderLeft: "5px solid",
              borderImage: "linear-gradient(to bottom, #10b981, #06b6d4) 1", // Gradient border
              minHeight: 100,
              "&:hover": { boxShadow: 4 },
              transition: "all 0.3s ease",
            }}>
              <Typography variant="h6" mb={2} sx={{ display: "flex", alignItems: "center" }}>
                ✓ Skills
                <Chip label={verifiedSkills.length} size="small" sx={{ ml: 2 }} color="success" />
              </Typography>
              {verifiedSkills.length > 0 ? (
                <Stack direction="row" gap={1.5} flexWrap="wrap">
                  {verifiedSkills.map((skill, idx) => (
                    <Chip
                      key={idx}
                      label={skill}
                      color="success"
                      onDelete={() => handleRemoveSkill(skill, "verified")}
                      sx={{ fontSize: "0.95rem", height: "32px" }}
                    />
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary" variant="body2">
                  No verified skills yet. Verify skills from the unverified list below.
                </Typography>
              )}
            </Card>

            {/* Unverified Skills */}
            <Card sx={{ maxWidth: 900, mx: "auto", mb: 3, p: 3, borderRadius: 3, borderLeft: "5px solid #f59e0b", minHeight: 100, "&:hover": { boxShadow: 4 }, transition: "all 0.3s ease" }}>
              <Typography variant="h6" mb={2} sx={{ display: "flex", alignItems: "center" }}>
                <Chip label={unverifiedSkills.length} size="small" sx={{ ml: 2 }} color="warning" />
              </Typography>
              {unverifiedSkills.length > 0 ? (
                <Stack direction="row" gap={1.5} flexWrap="wrap">
                  {unverifiedSkills.map((skill, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        border: "1px solid",
                        borderColor: "warning.main",
                        borderRadius: "16px",
                        px: 1.5,
                        py: 0.5,
                        gap: 1,
                        backgroundColor: "#fff8e1"
                      }}
                    >
                      <Typography sx={{ fontSize: "0.875rem", color: "text.primary" }}>
                        {skill}
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleVerifySkill(skill)}
                        sx={{
                          minWidth: "auto",
                          px: 1,
                          py: 0.25,
                          fontSize: "0.7rem",
                          height: "24px",
                          textTransform: "none"
                        }}
                      >
                        ✓
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          const token = localStorage.getItem("token");
                          window.open(
                            `http://localhost:5173/verify-skill?skill=${encodeURIComponent(skill)}&token=${encodeURIComponent(token || "")}`,
                            "_blank"
                          );
                        }}
                        sx={{
                          minWidth: "auto",
                          px: 1,
                          py: 0.25,
                          fontSize: "0.7rem",
                          height: "24px",
                          textTransform: "none"
                        }}
                      >
                        Quiz
                      </Button>
                      <Button
                        size="small"
                        variant="text"
                        color="error"
                        onClick={() => handleRemoveSkill(skill, "unverified")}
                        sx={{
                          minWidth: "auto",
                          px: 0.5,
                          py: 0.25,
                          fontSize: "0.75rem",
                          height: "24px"
                        }}
                      >
                        ✕
                      </Button>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary" variant="body2">
                  No unverified skills. Add new skills above.
                </Typography>
              )}
            </Card>

            {/* Skills Info */}
            <Card sx={{ maxWidth: 900, mx: "auto", p: 2, bgcolor: "#f0f9ff" }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Tip:</strong> Verify your skills to improve team recommendations and increase your visibility to employers.
              </Typography>
            </Card>
          </Box>
        )}

        {/* TEAMS TAB - Navigate to Teams Page */}
        {tabIndex === 1 && (
          <Box textAlign="center">
            <Card sx={{
              maxWidth: 600,
              mx: "auto",
              p: 6,
              borderRadius: 3,
              borderLeft: "5px solid #6366f1",
              minHeight: 280,
              "&:hover": { boxShadow: 4 },
              transition: "all 0.3s ease",
            }}>
              <Groups sx={{ fontSize: 100, color: "#6366f1", mb: 3 }} />
              <Typography variant="h5" fontWeight="bold" mb={2}>
                Team Management
              </Typography>
              <Typography color="text.secondary" mb={4}>
                Find teams, create your own, manage members, and get AI-powered recommendations based on your skills.
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<Groups />}
                onClick={() => router.push("/student/teams")}
                fullWidth
              >
                Go to Teams
              </Button>
            </Card>
          </Box>
        )}

        {/* JOBS - Company Hire Requests */}
        {tabIndex === 2 && (
          <Box maxWidth={900} mx="auto">
            <Typography variant="h5" fontWeight="bold" mb={3}>
              <Work sx={{ mr: 1, verticalAlign: "middle" }} />
              Job Offers from Companies
            </Typography>

            {loadingOffers ? (
              <Box textAlign="center" py={4}>
                <CircularProgress />
              </Box>
            ) : companyOffers.length === 0 ? (
              <Alert severity="info">
                No job offers received yet. Companies can find you based on your skills!
              </Alert>
            ) : (
              <Stack spacing={3}>
                {companyOffers.map((offer) => (
                  <Card key={offer.chr_id} sx={{
                    borderLeft: offer.status === "accepted" ? "5px solid #10b981" : offer.status === "rejected" ? "5px solid #ef4444" : "5px solid #f59e0b",
                    borderRadius: 3,
                    minHeight: 200,
                    "&:hover": { boxShadow: 6, transform: "translateY(-2px)" },
                    transition: "all 0.3s ease",
                  }}>
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="start">
                          <Box flex={1}>
                            <Typography variant="h6" fontWeight="bold">
                              {offer.role_name}
                            </Typography>
                            {offer.role_description && (
                              <Typography variant="body2" color="text.secondary" mt={0.5}>
                                {offer.role_description}
                              </Typography>
                            )}

                            <Stack direction="row" spacing={1} mt={2} mb={2} flexWrap="wrap">
                              <Chip
                                label={offer.status.toUpperCase()}
                                size="small"
                                color={offer.status === "accepted" ? "success" : offer.status === "rejected" ? "error" : "warning"}
                              />
                              <Chip label={jobTypeLabel(offer.job_type)} size="small" variant="outlined"
                                color={offer.job_type === "employment" ? "success" : offer.job_type === "contract" ? "warning" : "info"}
                              />
                              {offer.job_type === "contract" && offer.contract_period && (
                                <Chip label={offer.contract_period} size="small" variant="outlined" />
                              )}
                              <Chip
                                icon={<AttachMoney />}
                                label={offer.payment_type === "fixed" ? `$${offer.payment_amount?.toLocaleString()}` : "To discuss"}
                                size="small" variant="outlined"
                              />
                            </Stack>

                            {Array.isArray(offer.skills_required) && offer.skills_required.length > 0 && (
                              <Box mb={2}>
                                <Typography variant="body2" fontWeight="bold" mb={0.5}>Required Skills:</Typography>
                                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                  {offer.skills_required.map((s: string, i: number) => (
                                    <Chip key={i} label={s} size="small" color="primary" variant="outlined" />
                                  ))}
                                </Stack>
                              </Box>
                            )}

                            <Divider sx={{ my: 1.5 }} />

                            <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1 }}>
                              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <Business fontSize="small" color="primary" />
                                <Typography variant="body2" fontWeight="bold">{offer.company_name}</Typography>
                                {offer.industry && (
                                  <Chip label={offer.industry} size="small" variant="outlined" />
                                )}
                              </Stack>
                              <Typography variant="body2" color="text.secondary">📧 {offer.company_email}</Typography>
                              {offer.contact_info && (
                                <Typography variant="body2" color="text.secondary">📞 {offer.contact_info}</Typography>
                              )}
                              {offer.message && (
                                <Typography variant="body2" mt={1}>
                                  <strong>Message:</strong> {offer.message}
                                </Typography>
                              )}
                            </Box>

                            <Typography variant="caption" color="text.secondary" mt={1} display="block">
                              Received: {new Date(offer.created_at).toLocaleString()}
                            </Typography>
                          </Box>

                          {offer.status === "pending" && (
                            <Stack spacing={1} ml={2} minWidth={100}>
                              <Button
                                variant="contained"
                                color="success"
                                startIcon={<CheckCircle />}
                                onClick={() => handleAcceptOffer(offer.chr_id)}
                                size="small"
                              >
                                Accept
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                startIcon={<Cancel />}
                                onClick={() => handleRejectOffer(offer.chr_id)}
                                size="small"
                              >
                                Reject
                              </Button>
                            </Stack>
                          )}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>
        )}
      </Box>

      {/* EDIT PROFILE */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Name"
              fullWidth
              value={studentInfo.name}
              onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
            />
            <TextField
              label="Department"
              fullWidth
              value={studentInfo.department}
              onChange={(e) => setStudentInfo({ ...studentInfo, department: e.target.value })}
            />
            <TextField
              label="Academic Year"
              fullWidth
              value={studentInfo.academic_year}
              onChange={(e) => setStudentInfo({ ...studentInfo, academic_year: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateProfile}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}
