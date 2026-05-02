"use client";

import { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Stack,
  AppBar,
  Toolbar,
  Avatar,
  Chip,
  IconButton,
  Grid,
  Alert,
  MenuItem,
  Divider,
  CircularProgress,
  LinearProgress,
  Paper,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Work,
  Business,
  AttachMoney,
  Person,
  Send,
  School,
  Star,
  SmartToy,
  CheckCircle,
} from "@mui/icons-material";
import UserMenu from "../../components/UserMenu";
import { useRouter } from "next/navigation";

interface JobRole {
  jr_id: number;
  role_name: string;
  role_description: string;
  skills_required: string[];
  job_type: "contract" | "employment" | "intern";
  contract_period: string | null;
  payment_type: "fixed" | "discuss";
  payment_amount: number | null;
  created_at: string;
}

interface StudentRec {
  student_id: number;
  name: string;
  email: string;
  department: string;
  academic_year: string;
  verified_skills: string[];
  unverified_skills: string[];
  score: number;
}

const emptyJobForm = {
  role_name: "",
  role_description: "",
  skills_required: [] as string[],
  job_type: "employment" as "contract" | "employment" | "intern",
  contract_period: "",
  payment_type: "discuss" as "fixed" | "discuss",
  payment_amount: "",
};

export default function CompanyDashboard() {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  const [showAllRecs, setShowAllRecs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  // Profile state
  const [companyInfo, setCompanyInfo] = useState({
    id: 0,
    name: "",
    username: "",
    role: "",
    company_registration_no: "",
    company_type: "",
    industry: "",
  });
  const [profileForm, setProfileForm] = useState({
    name: "",
    company_registration_no: "",
    company_type: "",
    industry: "",
  });
  const [openEditProfile, setOpenEditProfile] = useState(false);

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Job roles state
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [openJobDialog, setOpenJobDialog] = useState(false);
  const [editingJob, setEditingJob] = useState<JobRole | null>(null);
  const [jobForm, setJobForm] = useState(emptyJobForm);
  const [skillInput, setSkillInput] = useState("");

  // Recommendations state
  const [selectedJob, setSelectedJob] = useState<JobRole | null>(null);
  const [recommendations, setRecommendations] = useState<StudentRec[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [openRecsPanel, setOpenRecsPanel] = useState(false);

  // Student detail / hire request
  const [selectedStudent, setSelectedStudent] = useState<StudentRec | null>(null);
  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [openHireDialog, setOpenHireDialog] = useState(false);
  const [hireForm, setHireForm] = useState({ message: "", contact_info: "" });
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());
  const [hireStatuses, setHireStatuses] = useState<Record<number, any>>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }
    fetchCompanyInfo();
    fetchJobRoles();
    fetchHireStatuses();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ─── API CALLS ──────────────────────────────────────────

  const fetchCompanyInfo = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/getCompanyInfo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCompanyInfo(data.user);
        setProfileForm({
          name: data.user.name || "",
          company_registration_no: data.user.company_registration_no || "",
          company_type: data.user.company_type || "",
          industry: data.user.industry || "",
        });
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobRoles = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/job-roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setJobRoles(data.roles || []);
    } catch (err) {
      console.error("Error fetching job roles:", err);
    }
  };

  const fetchHireStatuses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/job-roles/hire-statuses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setHireStatuses(data.hire_statuses || {});
      }
    } catch (err) {
      console.error("Error fetching hire statuses:", err);
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
        body: JSON.stringify(profileForm),
      });
      if (res.ok) {
        alert("Profile updated successfully!");
        setOpenEditProfile(false);
        fetchCompanyInfo();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      alert("Error updating profile");
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/changePassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      if (res.ok) {
        alert("Password changed successfully!");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const data = await res.json();
        alert(data.error || "Failed to change password");
      }
    } catch (err) {
      alert("Error changing password");
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This will delete all your job listings and cannot be undone.")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/deleteUser", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Account deleted successfully");
        localStorage.removeItem("token");
        router.push("/");
      } else {
        alert("Failed to delete account");
      }
    } catch (err) {
      alert("Error deleting account");
    }
  };

  const handleSaveJobRole = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!jobForm.role_name || !jobForm.job_type || !jobForm.payment_type) {
      alert("Please fill in role name, job type, and payment type");
      return;
    }

    const body = {
      role_name: jobForm.role_name,
      role_description: jobForm.role_description,
      skills_required: jobForm.skills_required,
      job_type: jobForm.job_type,
      contract_period: jobForm.job_type === "contract" ? jobForm.contract_period : null,
      payment_type: jobForm.payment_type,
      payment_amount: jobForm.payment_type === "fixed" ? Number(jobForm.payment_amount) || null : null,
    };

    try {
      const url = editingJob
        ? `http://localhost:5000/api/job-roles/${editingJob.jr_id}`
        : "http://localhost:5000/api/job-roles";
      const method = editingJob ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert(editingJob ? "Job role updated!" : "Job role created!");
        setOpenJobDialog(false);
        setEditingJob(null);
        setJobForm(emptyJobForm);
        fetchJobRoles();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save job role");
      }
    } catch (err) {
      alert("Error saving job role");
    }
  };

  const handleDeleteJobRole = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job role?")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/job-roles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchJobRoles();
      } else {
        alert("Failed to delete job role");
      }
    } catch (err) {
      alert("Error deleting job role");
    }
  };

  // Fetch AI recommendations for a job role
  const fetchRecommendations = async (job: JobRole) => {
    setSelectedJob(job);
    setOpenRecsPanel(true);
    setLoadingRecs(true);
    setRecommendations([]);

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/job-roles/${job.jr_id}/recommendations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setRecommendations(data.recommendations || []);
      } else {
        alert("Failed to fetch recommendations");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error fetching recommendations");
    } finally {
      setLoadingRecs(false);
    }
  };

  // Send hire request
  const handleSendHireRequest = async () => {
    if (!selectedJob || !selectedStudent) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/job-roles/${selectedJob.jr_id}/send-hire-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          student_id: selectedStudent.student_id,
          message: hireForm.message,
          contact_info: hireForm.contact_info,
        }),
      });

      if (res.ok) {
        alert("Hire request sent successfully!");
        setSentRequests(new Set([...sentRequests, `${selectedJob.jr_id}-${selectedStudent.student_id}`]));
        setOpenHireDialog(false);
        setHireForm({ message: "", contact_info: "" });
        fetchHireStatuses();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to send hire request");
      }
    } catch (err) {
      alert("Error sending hire request");
    }
  };

  const openCreateJob = () => {
    setEditingJob(null);
    setJobForm(emptyJobForm);
    setSkillInput("");
    setOpenJobDialog(true);
  };

  const openEditJob = (job: JobRole) => {
    setEditingJob(job);
    setJobForm({
      role_name: job.role_name,
      role_description: job.role_description || "",
      skills_required: Array.isArray(job.skills_required) ? job.skills_required : [],
      job_type: job.job_type,
      contract_period: job.contract_period || "",
      payment_type: job.payment_type,
      payment_amount: job.payment_amount?.toString() || "",
    });
    setSkillInput("");
    setOpenJobDialog(true);
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !jobForm.skills_required.includes(s)) {
      setJobForm({ ...jobForm, skills_required: [...jobForm.skills_required, s] });
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setJobForm({
      ...jobForm,
      skills_required: jobForm.skills_required.filter((s) => s !== skill),
    });
  };

  const jobTypeLabel = (t: string) => {
    if (t === "contract") return "Contract";
    if (t === "employment") return "Permanent Employment";
    if (t === "intern") return "Internship";
    return t;
  };

  const getScoreColor = (score: number) => {
    if (score >= 50) return "#10b981";
    if (score >= 25) return "#f59e0b";
    return "#ef4444";
  };

  // ─── RENDER ──────────────────────────────────────────

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* HEADER — scroll-aware */}
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
          <Box sx={{ display: "flex", alignItems: "center", mr: 2, opacity: scrolled ? 1 : 0, transition: "opacity 0.4s ease" }}>
            <Business sx={{ color: "white" }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              color: scrolled ? "white" : "#6366f1",
              transition: "color 0.4s ease",
            }}
          >
            SkillNet{scrolled ? " - Company Dashboard" : ""}
          </Typography>
          <UserMenu
            userName={companyInfo.name}
            onProfileUpdate={() => {
              setProfileForm({
                name: companyInfo.name,
                company_registration_no: companyInfo.company_registration_no,
                company_type: companyInfo.company_type,
                industry: companyInfo.industry,
              });
              setOpenEditProfile(true);
            }}
          />
        </Toolbar>
      </AppBar>

      <Box p={4}>
        {/* PROJECT INFO BANNER */}
        <Box maxWidth={1200} mx="auto" mb={4}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            {[
              { icon: "🎯", title: "AI Recruiter Engine", desc: "Post job roles and let our ML model rank students by how well their skills match your requirements." },
              { icon: "📊", title: "Skill-Based Matching", desc: "Our fuzzy matching engine recognizes skill variations like React, ReactJS, and React.js as equivalent." },
              { icon: "🤝", title: "End-to-End Hiring", desc: "Send offers to top candidates, track acceptance status, and manage your entire hiring pipeline." },
            ].map((info, idx) => (
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
          maxWidth: 1200,
          mx: "auto",
          mb: 4,
          p: 3,
          borderRadius: 3,
          borderLeft: "5px solid #6366f1",
          "&:hover": { boxShadow: 4 },
          transition: "all 0.3s ease",
        }}>
          <CardContent>
            <Stack direction="row" spacing={3} alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar sx={{ width: 80, height: 80, bgcolor: "#6366f1" }}>
                  {companyInfo.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {companyInfo.name}
                  </Typography>
                  <Typography color="text.secondary">{companyInfo.username}</Typography>
                  <Typography variant="body2" mt={1}>
                    <strong>Reg No:</strong> {companyInfo.company_registration_no || "N/A"} |{" "}
                    <strong>Type:</strong> {companyInfo.company_type || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Industry:</strong> {companyInfo.industry || "N/A"}
                  </Typography>
                  <Chip label="Company" size="small" color="primary" sx={{ mt: 1 }} />
                </Box>
              </Stack>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => {
                  setProfileForm({
                    name: companyInfo.name,
                    company_registration_no: companyInfo.company_registration_no,
                    company_type: companyInfo.company_type,
                    industry: companyInfo.industry,
                  });
                  setOpenEditProfile(true);
                }}
              >
                Edit Profile
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* TABS */}
        <Box maxWidth={1200} mx="auto">
          <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} sx={{ mb: 3 }}>
            <Tab icon={<Work />} iconPosition="start" label={`Job Roles (${jobRoles.length})`} />
          </Tabs>

          {/* ─── JOB ROLES TAB ─── */}
          {tabIndex === 0 && (
            <Stack direction="row" spacing={3}>
              {/* Left: Job roles list */}
              <Box flex={openRecsPanel ? 1 : 1}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h5" fontWeight="bold">
                    Job Roles
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={openCreateJob}
                    sx={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)" }}
                  >
                    Post New Role
                  </Button>
                </Stack>

                {jobRoles.length === 0 ? (
                  <Card sx={{ p: 4, textAlign: "center" }}>
                    <Typography color="text.secondary" mb={2}>
                      No job roles posted yet. Create your first job listing!
                    </Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={openCreateJob}>
                      Post Job Role
                    </Button>
                  </Card>
                ) : (
                  <Stack spacing={2}>
                    {jobRoles.map((job) => {
                      const isHired = !!hireStatuses[job.jr_id];
                      return (
                        <Card
                          key={job.jr_id}
                          sx={{
                            cursor: "pointer",
                            border: selectedJob?.jr_id === job.jr_id ? "2px solid #6366f1"
                              : isHired ? "2px solid #10b981" : "1px solid #e5e7eb",
                            borderLeft: isHired ? "5px solid #10b981" : "5px solid #6366f1",
                            "&:hover": { boxShadow: 6, transform: "translateY(-2px)" },
                            transition: "all 0.3s ease",
                            bgcolor: isHired ? "#f0fdf4" : "white",
                            borderRadius: 3,
                            minHeight: 180,
                          }}
                          onClick={() => {
                            setSelectedJob(job);
                            if (isHired) {
                              setOpenRecsPanel(true);
                              setRecommendations([]);
                              setLoadingRecs(false);
                            } else {
                              fetchRecommendations(job);
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Stack spacing={1.5}>
                              <Stack direction="row" justifyContent="space-between" alignItems="start">
                                <Box flex={1}>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="h6" fontWeight="bold">
                                      {job.role_name}
                                    </Typography>
                                    {isHired && (
                                      <Chip
                                        icon={<CheckCircle />}
                                        label="Hired"
                                        size="small"
                                        color="success"
                                        sx={{ fontWeight: "bold" }}
                                      />
                                    )}
                                  </Stack>
                                  <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                                    {job.role_description?.substring(0, 120)}
                                    {job.role_description && job.role_description.length > 120 ? "..." : ""}
                                  </Typography>
                                </Box>
                                <Stack direction="row" spacing={0.5}>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openEditJob(job);
                                    }}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteJobRole(job.jr_id);
                                    }}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Stack>
                              </Stack>

                              <Stack direction="row" spacing={1} flexWrap="wrap">
                                <Chip
                                  label={jobTypeLabel(job.job_type)}
                                  size="small"
                                  color={
                                    job.job_type === "employment"
                                      ? "success"
                                      : job.job_type === "contract"
                                        ? "warning"
                                        : "info"
                                  }
                                />
                                {job.job_type === "contract" && job.contract_period && (
                                  <Chip label={job.contract_period} size="small" variant="outlined" />
                                )}
                                <Chip
                                  icon={<AttachMoney />}
                                  label={
                                    job.payment_type === "fixed"
                                      ? `$${job.payment_amount?.toLocaleString()}`
                                      : "Discuss"
                                  }
                                  size="small"
                                  variant="outlined"
                                />
                              </Stack>

                              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                {(Array.isArray(job.skills_required) ? job.skills_required : [])
                                  .slice(0, 5)
                                  .map((skill, idx) => (
                                    <Chip key={idx} label={skill} size="small" variant="outlined" color="primary" />
                                  ))}
                                {Array.isArray(job.skills_required) && job.skills_required.length > 5 && (
                                  <Chip label={`+${job.skills_required.length - 5}`} size="small" />
                                )}
                              </Stack>

                              {isHired ? (
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <CheckCircle fontSize="small" color="success" />
                                  <Typography variant="caption" color="success.main" fontWeight="bold">
                                    {hireStatuses[job.jr_id].student_name} hired — Click for details
                                  </Typography>
                                </Stack>
                              ) : (
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <SmartToy fontSize="small" color="primary" />
                                  <Typography variant="caption" color="primary">
                                    Click to find matching students with AI
                                  </Typography>
                                </Stack>
                              )}
                            </Stack>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Stack>
                )}
              </Box>

              {/* Right: Panel */}
              {openRecsPanel && selectedJob && (
                <Box flex={1.2}>
                  <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {hireStatuses[selectedJob.jr_id] ? (
                          <CheckCircle color="success" />
                        ) : (
                          <SmartToy color="primary" />
                        )}
                        <Typography variant="h6" fontWeight="bold">
                          {hireStatuses[selectedJob.jr_id] ? "Hired Student" : "AI Recommendations"}
                        </Typography>
                      </Stack>
                      <Button size="small" onClick={() => setOpenRecsPanel(false)}>
                        Close
                      </Button>
                    </Stack>

                    <Alert severity={hireStatuses[selectedJob.jr_id] ? "success" : "info"} sx={{ mb: 2 }}>
                      <strong>{selectedJob.role_name}</strong> — Skills:{" "}
                      {(Array.isArray(selectedJob.skills_required) ? selectedJob.skills_required : []).join(", ")}
                    </Alert>

                    {/* ─── HIRED STATE ─── */}
                    {hireStatuses[selectedJob.jr_id] ? (
                      (() => {
                        const hired = hireStatuses[selectedJob.jr_id];
                        return (
                          <Card sx={{ border: "2px solid #10b981", bgcolor: "#f0fdf4" }}>
                            <CardContent>
                              <Stack spacing={2}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                  <Avatar sx={{ width: 60, height: 60, bgcolor: "#10b981", fontSize: "1.5rem" }}>
                                    {hired.student_name?.charAt(0).toUpperCase()}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="h5" fontWeight="bold">
                                      {hired.student_name}
                                    </Typography>
                                    <Typography color="text.secondary">
                                      {hired.student_email}
                                    </Typography>
                                    <Stack direction="row" spacing={1} mt={0.5}>
                                      <Chip label={`Dept: ${hired.student_department || "N/A"}`} size="small" variant="outlined" />
                                      <Chip label={`Year: ${hired.student_academic_year || "N/A"}`} size="small" variant="outlined" />
                                    </Stack>
                                  </Box>
                                </Stack>

                                <Divider />

                                <Box>
                                  <Chip icon={<CheckCircle />} label="POSITION FILLED" color="success" sx={{ fontWeight: "bold", mb: 2 }} />
                                  <Typography variant="body2" color="text.secondary">
                                    Hired on: {new Date(hired.hired_at).toLocaleDateString()}
                                  </Typography>
                                </Box>

                                {hired.verified_skills?.length > 0 && (
                                  <Box>
                                    <Typography variant="body2" fontWeight="bold" mb={1}>Verified Skills:</Typography>
                                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                      {hired.verified_skills.map((s: string, i: number) => (
                                        <Chip key={i} label={s} size="small" color="success" variant="outlined" />
                                      ))}
                                    </Stack>
                                  </Box>
                                )}

                                {hired.unverified_skills?.length > 0 && (
                                  <Box>
                                    <Typography variant="body2" fontWeight="bold" mb={1}>Other Skills:</Typography>
                                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                      {hired.unverified_skills.map((s: string, i: number) => (
                                        <Chip key={i} label={s} size="small" variant="outlined" />
                                      ))}
                                    </Stack>
                                  </Box>
                                )}
                              </Stack>
                            </CardContent>
                          </Card>
                        );
                      })()
                    ) : (
                      /* ─── RECOMMENDATIONS STATE ─── */
                      <>
                        {loadingRecs ? (
                          <Box textAlign="center" py={4}>
                            <CircularProgress />
                            <Typography variant="body2" mt={2} color="text.secondary">
                              Analyzing student profiles...
                            </Typography>
                          </Box>
                        ) : recommendations.length === 0 ? (
                          <Alert severity="warning">
                            No matching students found for this role.
                          </Alert>
                        ) : (() => {
                          const filtered = recommendations.filter(s => s.score >= 30);
                          const displayList = showAllRecs ? filtered : filtered.slice(0, 3);
                          const hiddenCount = filtered.length - 3;
                          return (
                            <Stack spacing={2}>
                              <Typography variant="body2" color="text.secondary">
                                {filtered.length} students with ≥30% match (of {recommendations.length} total)
                              </Typography>
                              {displayList.map((student, idx) => (
                                <Card
                                  key={student.student_id}
                                  sx={{
                                    border: "1px solid #e5e7eb",
                                    borderLeft: "4px solid " + getScoreColor(student.score),
                                    "&:hover": { boxShadow: 3 },
                                    cursor: "pointer",
                                    borderRadius: 2,
                                  }}
                                  onClick={() => {
                                    setSelectedStudent(student);
                                    setOpenStudentDialog(true);
                                  }}
                                >
                                  <CardContent sx={{ py: 2 }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                      <Avatar
                                        sx={{
                                          width: 48,
                                          height: 48,
                                          bgcolor: getScoreColor(student.score),
                                          fontSize: "1rem",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        #{idx + 1}
                                      </Avatar>
                                      <Box flex={1}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                          <Typography fontWeight="bold" fontSize="1.05rem">{student.name}</Typography>
                                          <Stack direction="row" spacing={1} alignItems="center">
                                            <Star sx={{ color: getScoreColor(student.score), fontSize: 20 }} />
                                            <Typography fontWeight="bold" fontSize="1.1rem" color={getScoreColor(student.score)}>
                                              {student.score}%
                                            </Typography>
                                          </Stack>
                                        </Stack>
                                        <Typography variant="caption" color="text.secondary">
                                          {student.department || "N/A"} • {student.email}
                                        </Typography>
                                        <LinearProgress
                                          variant="determinate"
                                          value={Math.min(student.score, 100)}
                                          sx={{
                                            mt: 1,
                                            height: 8,
                                            borderRadius: 4,
                                            bgcolor: "#f3f4f6",
                                            "& .MuiLinearProgress-bar": {
                                              bgcolor: getScoreColor(student.score),
                                              borderRadius: 4,
                                            },
                                          }}
                                        />
                                        <Stack direction="row" spacing={0.5} flexWrap="wrap" mt={1}>
                                          {student.verified_skills.slice(0, 4).map((s, i) => (
                                            <Chip key={i} label={s} size="small" color="success" variant="outlined" sx={{ fontSize: "0.7rem" }} />
                                          ))}
                                          {student.unverified_skills.slice(0, 2).map((s, i) => (
                                            <Chip key={`u${i}`} label={s} size="small" variant="outlined" sx={{ fontSize: "0.7rem" }} />
                                          ))}
                                        </Stack>
                                      </Box>
                                      {sentRequests.has(`${selectedJob.jr_id}-${student.student_id}`) ? (
                                        <Chip label="Sent" size="small" color="success" />
                                      ) : (
                                        <IconButton
                                          color="primary"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedStudent(student);
                                            setHireForm({ message: "", contact_info: "" });
                                            setOpenHireDialog(true);
                                          }}
                                        >
                                          <Send />
                                        </IconButton>
                                      )}
                                    </Stack>
                                  </CardContent>
                                </Card>
                              ))}
                              {!showAllRecs && hiddenCount > 0 && (
                                <Button
                                  variant="outlined"
                                  onClick={() => setShowAllRecs(true)}
                                  sx={{ alignSelf: "center", borderRadius: 3 }}
                                >
                                  See More ({hiddenCount} more students)
                                </Button>
                              )}
                              {showAllRecs && hiddenCount > 0 && (
                                <Button
                                  variant="text"
                                  onClick={() => setShowAllRecs(false)}
                                  sx={{ alignSelf: "center" }}
                                >
                                  Show Less
                                </Button>
                              )}
                            </Stack>
                          );
                        })()}
                      </>
                    )}
                  </Paper>
                </Box>
              )}
            </Stack>
          )}


        </Box>
      </Box>

      {/* ─── EDIT PROFILE DIALOG ─── */}
      <Dialog open={openEditProfile} onClose={() => setOpenEditProfile(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Company Profile</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Company Name"
              fullWidth
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
            />
            <TextField
              label="Registration Number"
              fullWidth
              value={profileForm.company_registration_no}
              onChange={(e) => setProfileForm({ ...profileForm, company_registration_no: e.target.value })}
            />
            <TextField
              select
              label="Company Type"
              fullWidth
              value={profileForm.company_type}
              onChange={(e) => setProfileForm({ ...profileForm, company_type: e.target.value })}
              SelectProps={{ native: true }}
            >
              <option value="">Select Company Type</option>
              <option value="Pvt.Ltd">Private Limited (Pvt. Ltd.)</option>
              <option value="LLP">Limited Liability Partnership (LLP)</option>
              <option value="Sole Proprietorship">Sole Proprietorship</option>
              <option value="Partnership">Partnership</option>
            </TextField>
            <TextField
              label="Industry"
              fullWidth
              value={profileForm.industry}
              onChange={(e) => setProfileForm({ ...profileForm, industry: e.target.value })}
            />
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
              Change Password
            </Typography>
            <TextField
              label="Current Password"
              type="password"
              fullWidth
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            />
            <Button variant="outlined" onClick={handleChangePassword} sx={{ alignSelf: "flex-start" }}>
              Change Password
            </Button>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" fontWeight="bold" color="error">
              Danger Zone
            </Typography>
            <Button variant="outlined" color="error" size="small" startIcon={<Delete />} onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditProfile(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateProfile}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── CREATE / EDIT JOB ROLE DIALOG ─── */}
      <Dialog open={openJobDialog} onClose={() => setOpenJobDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingJob ? "Edit Job Role" : "Post New Job Role"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Role Name *"
              fullWidth
              value={jobForm.role_name}
              onChange={(e) => setJobForm({ ...jobForm, role_name: e.target.value })}
              placeholder="e.g. Senior React Developer"
            />
            <TextField
              label="Role Description"
              fullWidth
              multiline
              rows={3}
              value={jobForm.role_description}
              onChange={(e) => setJobForm({ ...jobForm, role_description: e.target.value })}
              placeholder="Describe the role responsibilities..."
            />

            <Box>
              <Typography variant="body2" fontWeight="bold" mb={1}>
                Skills Required
              </Typography>
              <Stack direction="row" spacing={1} mb={1}>
                <TextField
                  size="small"
                  fullWidth
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Type a skill and press Enter"
                />
                <Button variant="outlined" onClick={addSkill} size="small">
                  Add
                </Button>
              </Stack>
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                {jobForm.skills_required.map((skill, idx) => (
                  <Chip key={idx} label={skill} size="small" onDelete={() => removeSkill(skill)} color="primary" />
                ))}
              </Stack>
            </Box>

            <Divider />

            <TextField
              select
              label="Job Type *"
              fullWidth
              value={jobForm.job_type}
              onChange={(e) =>
                setJobForm({ ...jobForm, job_type: e.target.value as "contract" | "employment" | "intern" })
              }
            >
              <MenuItem value="employment">Permanent Employment</MenuItem>
              <MenuItem value="contract">Contract</MenuItem>
              <MenuItem value="intern">Internship</MenuItem>
            </TextField>

            {jobForm.job_type === "contract" && (
              <TextField
                label="Contract Period"
                fullWidth
                value={jobForm.contract_period}
                onChange={(e) => setJobForm({ ...jobForm, contract_period: e.target.value })}
                placeholder="e.g. 6 months, 1 year"
              />
            )}

            <Divider />

            <TextField
              select
              label="Payment Type *"
              fullWidth
              value={jobForm.payment_type}
              onChange={(e) =>
                setJobForm({ ...jobForm, payment_type: e.target.value as "fixed" | "discuss" })
              }
            >
              <MenuItem value="fixed">Fixed Amount</MenuItem>
              <MenuItem value="discuss">Can Discuss</MenuItem>
            </TextField>

            {jobForm.payment_type === "fixed" && (
              <TextField
                label="Payment Amount ($)"
                fullWidth
                type="number"
                value={jobForm.payment_amount}
                onChange={(e) => setJobForm({ ...jobForm, payment_amount: e.target.value })}
                placeholder="e.g. 5000"
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenJobDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveJobRole}>
            {editingJob ? "Update" : "Post Role"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── STUDENT DETAIL DIALOG ─── */}
      <Dialog open={openStudentDialog} onClose={() => setOpenStudentDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: "#6366f1" }}>
              <Person />
            </Avatar>
            <Box>
              <Typography variant="h6">{selectedStudent?.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedStudent?.email}
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <Stack spacing={2} mt={1}>
              <Stack direction="row" spacing={2}>
                <Chip icon={<School />} label={selectedStudent.department || "N/A"} />
                <Chip label={`Year: ${selectedStudent.academic_year || "N/A"}`} variant="outlined" />
                <Chip
                  icon={<Star />}
                  label={`Match: ${selectedStudent.score}%`}
                  sx={{ bgcolor: getScoreColor(selectedStudent.score), color: "white" }}
                />
              </Stack>

              <Box>
                <Typography variant="body2" fontWeight="bold" mb={1}>
                  Verified Skills:
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {selectedStudent.verified_skills.map((skill, idx) => (
                    <Chip key={idx} label={skill} size="small" color="success" />
                  ))}
                  {selectedStudent.verified_skills.length === 0 && (
                    <Typography variant="body2" color="text.secondary">None</Typography>
                  )}
                </Stack>
              </Box>

              <Box>
                <Typography variant="body2" fontWeight="bold" mb={1}>
                  Unverified Skills:
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {selectedStudent.unverified_skills.map((skill, idx) => (
                    <Chip key={idx} label={skill} size="small" variant="outlined" />
                  ))}
                  {selectedStudent.unverified_skills.length === 0 && (
                    <Typography variant="body2" color="text.secondary">None</Typography>
                  )}
                </Stack>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStudentDialog(false)}>Close</Button>
          {selectedJob && selectedStudent && !sentRequests.has(`${selectedJob.jr_id}-${selectedStudent.student_id}`) && (
            <Button
              variant="contained"
              startIcon={<Send />}
              onClick={() => {
                setOpenStudentDialog(false);
                setHireForm({ message: "", contact_info: "" });
                setOpenHireDialog(true);
              }}
            >
              Send Hire Request
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* ─── SEND HIRE REQUEST DIALOG ─── */}
      <Dialog open={openHireDialog} onClose={() => setOpenHireDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Send Hire Request</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Alert severity="info">
              Sending hire request to <strong>{selectedStudent?.name}</strong> for the role of{" "}
              <strong>{selectedJob?.role_name}</strong>
            </Alert>
            <TextField
              label="Message to Student *"
              fullWidth
              multiline
              rows={4}
              value={hireForm.message}
              onChange={(e) => setHireForm({ ...hireForm, message: e.target.value })}
              placeholder="Write a personalized message to the student about this opportunity..."
            />
            <TextField
              label="Contact Information *"
              fullWidth
              value={hireForm.contact_info}
              onChange={(e) => setHireForm({ ...hireForm, contact_info: e.target.value })}
              placeholder="e.g. hr@company.com, +94 77 123 4567"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHireDialog(false)}>Cancel</Button>
          <Button variant="contained" startIcon={<Send />} onClick={handleSendHireRequest}>
            Send Request
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}
