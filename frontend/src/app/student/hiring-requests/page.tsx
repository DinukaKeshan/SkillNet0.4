"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Chip,
    Alert,
    CircularProgress,
    AppBar,
    Toolbar,
    Tab,
    Tabs,
    Divider,
} from "@mui/material";
import { CheckCircle, Cancel, Business, PendingActions, Work, ArrowBack } from "@mui/icons-material";

interface HiringRequest {
    hr_id: number;
    project_id: number;
    team_id: number;
    sme_id: number;
    message: string;
    sme_email: string;
    sme_contact: string;
    status: "pending" | "accepted" | "rejected";
    created_at: string;
    responded_at: string | null;
    p_name: string;
    p_description: string;
    p_time_period: string;
    p_skills_req: string[];
    p_value_type: "fixed" | "discuss";
    p_value_amount: number | null;
    sme_name: string;
}

interface CompanyHireRequest {
    chr_id: number;
    job_role_id: number;
    company_id: number;
    student_id: number;
    message: string;
    contact_info: string;
    status: "pending" | "accepted" | "rejected";
    created_at: string;
    role_name: string;
    role_description: string;
    skills_required: string[];
    job_type: "contract" | "employment" | "intern";
    contract_period: string | null;
    payment_type: "fixed" | "discuss";
    payment_amount: number | null;
    company_name: string;
    company_email: string;
    industry: string;
}

export default function HiringRequestsPage() {
    const router = useRouter();
    const [requests, setRequests] = useState<HiringRequest[]>([]);
    const [companyRequests, setCompanyRequests] = useState<CompanyHireRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [section, setSection] = useState<"team" | "company">("company");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/");
            return;
        }
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        await Promise.all([fetchTeamRequests(), fetchCompanyRequests()]);
        setLoading(false);
    };

    const fetchTeamRequests = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/teams/hiring-requests", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setRequests(data.requests || []);
            }
        } catch (err) {
            console.error("Error fetching team hiring requests:", err);
        }
    };

    const fetchCompanyRequests = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/student/hire-requests", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setCompanyRequests(data.requests || []);
            }
        } catch (err) {
            console.error("Error fetching company hire requests:", err);
        }
    };

    const handleTeamAccept = async (requestId: number) => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await fetch(`http://localhost:5000/api/teams/hiring-requests/${requestId}/accept`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                alert("Team hiring request accepted!");
                fetchTeamRequests();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to accept request");
            }
        } catch (err) {
            alert("Error accepting request");
        }
    };

    const handleTeamReject = async (requestId: number) => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await fetch(`http://localhost:5000/api/teams/hiring-requests/${requestId}/reject`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                alert("Team hiring request rejected");
                fetchTeamRequests();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to reject request");
            }
        } catch (err) {
            alert("Error rejecting request");
        }
    };

    const handleCompanyAccept = async (requestId: number) => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await fetch(`http://localhost:5000/api/student/hire-requests/${requestId}/accept`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                alert("Job offer accepted! The company will be notified.");
                fetchCompanyRequests();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to accept");
            }
        } catch (err) {
            alert("Error accepting job offer");
        }
    };

    const handleCompanyReject = async (requestId: number) => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await fetch(`http://localhost:5000/api/student/hire-requests/${requestId}/reject`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                alert("Job offer rejected");
                fetchCompanyRequests();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to reject");
            }
        } catch (err) {
            alert("Error rejecting job offer");
        }
    };

    const jobTypeLabel = (t: string) => {
        if (t === "contract") return "Contract";
        if (t === "employment") return "Permanent Employment";
        if (t === "intern") return "Internship";
        return t;
    };

    // Filter requests by status tab
    const filterByStatus = <T extends { status: string }>(items: T[]) => {
        const statuses = ["pending", "accepted", "rejected"];
        return items.filter((r) => r.status === statuses[activeTab]);
    };

    const pendingTeam = requests.filter((r) => r.status === "pending").length;
    const pendingCompany = companyRequests.filter((r) => r.status === "pending").length;

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
            {/* HEADER */}
            <AppBar position="static" sx={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}>
                <Toolbar>
                    <Business sx={{ mr: 2 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
                        Hiring Requests
                    </Typography>
                    <Button color="inherit" startIcon={<ArrowBack />} onClick={() => router.push("/student")}>
                        Back to Dashboard
                    </Button>
                </Toolbar>
            </AppBar>

            <Box p={4} maxWidth={1200} mx="auto">
                {/* Toggle between sections */}
                <Stack direction="row" spacing={2} mb={3}>
                    <Button
                        variant={section === "company" ? "contained" : "outlined"}
                        startIcon={<Work />}
                        onClick={() => { setSection("company"); setActiveTab(0); }}
                        sx={section === "company" ? { background: "linear-gradient(135deg,#6366f1,#06b6d4)" } : {}}
                    >
                        Company Job Offers ({companyRequests.length})
                        {pendingCompany > 0 && (
                            <Chip label={pendingCompany} size="small" color="error" sx={{ ml: 1 }} />
                        )}
                    </Button>
                    <Button
                        variant={section === "team" ? "contained" : "outlined"}
                        startIcon={<Business />}
                        onClick={() => { setSection("team"); setActiveTab(0); }}
                        sx={section === "team" ? { background: "linear-gradient(135deg,#2563eb,#7c3aed)" } : {}}
                    >
                        SME Team Requests ({requests.length})
                        {pendingTeam > 0 && (
                            <Chip label={pendingTeam} size="small" color="error" sx={{ ml: 1 }} />
                        )}
                    </Button>
                </Stack>

                {/* Status tabs */}
                <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                    <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
                        <Tab
                            label={`Pending (${section === "company"
                                ? companyRequests.filter((r) => r.status === "pending").length
                                : requests.filter((r) => r.status === "pending").length
                                })`}
                            icon={<PendingActions />}
                            iconPosition="start"
                        />
                        <Tab
                            label={`Accepted (${section === "company"
                                ? companyRequests.filter((r) => r.status === "accepted").length
                                : requests.filter((r) => r.status === "accepted").length
                                })`}
                            icon={<CheckCircle />}
                            iconPosition="start"
                        />
                        <Tab
                            label={`Rejected (${section === "company"
                                ? companyRequests.filter((r) => r.status === "rejected").length
                                : requests.filter((r) => r.status === "rejected").length
                                })`}
                            icon={<Cancel />}
                            iconPosition="start"
                        />
                    </Tabs>
                </Box>

                {/* ─── COMPANY JOB OFFERS ─── */}
                {section === "company" && (
                    <>
                        {filterByStatus(companyRequests).length === 0 ? (
                            <Alert severity="info">
                                No {activeTab === 0 ? "pending" : activeTab === 1 ? "accepted" : "rejected"} job offers from companies
                            </Alert>
                        ) : (
                            <Stack spacing={3}>
                                {filterByStatus(companyRequests).map((req) => (
                                    <Card key={req.chr_id} sx={{ "&:hover": { boxShadow: 4 } }}>
                                        <CardContent>
                                            <Stack spacing={2}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="start">
                                                    <Box flex={1}>
                                                        <Typography variant="h5" fontWeight="bold" mb={0.5}>
                                                            {req.role_name}
                                                        </Typography>
                                                        <Typography variant="body1" color="text.secondary" mb={2}>
                                                            {req.role_description}
                                                        </Typography>

                                                        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                                                            <Chip
                                                                label={`Status: ${req.status.toUpperCase()}`}
                                                                color={
                                                                    req.status === "accepted" ? "success" : req.status === "rejected" ? "error" : "warning"
                                                                }
                                                                size="small"
                                                            />
                                                            <Chip
                                                                label={jobTypeLabel(req.job_type)}
                                                                size="small"
                                                                color={
                                                                    req.job_type === "employment" ? "success" : req.job_type === "contract" ? "warning" : "info"
                                                                }
                                                                variant="outlined"
                                                            />
                                                            {req.job_type === "contract" && req.contract_period && (
                                                                <Chip label={`Duration: ${req.contract_period}`} size="small" variant="outlined" />
                                                            )}
                                                            <Chip
                                                                label={
                                                                    req.payment_type === "fixed"
                                                                        ? `Salary: $${req.payment_amount?.toLocaleString()}`
                                                                        : "Salary: To be discussed"
                                                                }
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        </Stack>

                                                        <Box mb={2}>
                                                            <Typography variant="body2" fontWeight="bold" mb={0.5}>
                                                                Required Skills:
                                                            </Typography>
                                                            <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                                                {(Array.isArray(req.skills_required) ? req.skills_required : []).map((skill, idx) => (
                                                                    <Chip key={idx} label={skill} size="small" color="primary" variant="outlined" />
                                                                ))}
                                                            </Stack>
                                                        </Box>

                                                        <Divider sx={{ my: 2 }} />

                                                        <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1, mb: 2 }}>
                                                            <Typography variant="body2" fontWeight="bold" mb={1}>
                                                                From: {req.company_name}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                📧 {req.company_email}
                                                            </Typography>
                                                            {req.industry && (
                                                                <Typography variant="body2" color="text.secondary">
                                                                    🏢 Industry: {req.industry}
                                                                </Typography>
                                                            )}
                                                            {req.contact_info && (
                                                                <Typography variant="body2" color="text.secondary" mt={1}>
                                                                    📞 Contact: {req.contact_info}
                                                                </Typography>
                                                            )}
                                                            {req.message && (
                                                                <Typography variant="body2" mt={2}>
                                                                    <strong>Message:</strong> {req.message}
                                                                </Typography>
                                                            )}
                                                        </Box>

                                                        <Typography variant="caption" color="text.secondary">
                                                            Received: {new Date(req.created_at).toLocaleString()}
                                                        </Typography>
                                                    </Box>

                                                    {req.status === "pending" && (
                                                        <Stack spacing={1} ml={2}>
                                                            <Button
                                                                variant="contained"
                                                                color="success"
                                                                startIcon={<CheckCircle />}
                                                                onClick={() => handleCompanyAccept(req.chr_id)}
                                                            >
                                                                Accept
                                                            </Button>
                                                            <Button
                                                                variant="outlined"
                                                                color="error"
                                                                startIcon={<Cancel />}
                                                                onClick={() => handleCompanyReject(req.chr_id)}
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
                    </>
                )}

                {/* ─── TEAM HIRING REQUESTS ─── */}
                {section === "team" && (
                    <>
                        {filterByStatus(requests).length === 0 ? (
                            <Alert severity="info">
                                No {activeTab === 0 ? "pending" : activeTab === 1 ? "accepted" : "rejected"} team hiring requests
                            </Alert>
                        ) : (
                            <Stack spacing={3}>
                                {filterByStatus(requests).map((req) => (
                                    <Card key={req.hr_id} sx={{ "&:hover": { boxShadow: 4 } }}>
                                        <CardContent>
                                            <Stack spacing={2}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="start">
                                                    <Box flex={1}>
                                                        <Typography variant="h5" fontWeight="bold" mb={1}>
                                                            {req.p_name}
                                                        </Typography>
                                                        <Typography variant="body1" color="text.secondary" mb={2}>
                                                            {req.p_description}
                                                        </Typography>

                                                        <Stack direction="row" spacing={2} mb={2}>
                                                            <Chip
                                                                label={`Status: ${req.status.toUpperCase()}`}
                                                                color={
                                                                    req.status === "accepted" ? "success" : req.status === "rejected" ? "error" : "warning"
                                                                }
                                                                size="small"
                                                            />
                                                            <Chip label={`Duration: ${req.p_time_period}`} size="small" variant="outlined" />
                                                            <Chip
                                                                label={
                                                                    req.p_value_type === "fixed"
                                                                        ? `Value: $${req.p_value_amount?.toLocaleString()}`
                                                                        : "Value: Discuss"
                                                                }
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        </Stack>

                                                        <Box mb={2}>
                                                            <Typography variant="body2" fontWeight="bold" mb={0.5}>
                                                                Required Skills:
                                                            </Typography>
                                                            <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                                                {(Array.isArray(req.p_skills_req) ? req.p_skills_req : []).map((skill, idx) => (
                                                                    <Chip key={idx} label={skill} size="small" color="primary" variant="outlined" />
                                                                ))}
                                                            </Stack>
                                                        </Box>

                                                        <Box sx={{ bgcolor: "grey.100", p: 2, borderRadius: 1, mb: 2 }}>
                                                            <Typography variant="body2" fontWeight="bold" mb={1}>
                                                                From: {req.sme_name}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary" mb={1}>
                                                                📧 {req.sme_email}
                                                            </Typography>
                                                            {req.sme_contact && (
                                                                <Typography variant="body2" color="text.secondary" mb={1}>
                                                                    📞 {req.sme_contact}
                                                                </Typography>
                                                            )}
                                                            <Typography variant="body2" mt={2}>
                                                                <strong>Message:</strong> {req.message}
                                                            </Typography>
                                                        </Box>

                                                        <Typography variant="caption" color="text.secondary">
                                                            Received: {new Date(req.created_at).toLocaleString()}
                                                        </Typography>
                                                        {req.responded_at && (
                                                            <Typography variant="caption" color="text.secondary" display="block">
                                                                Responded: {new Date(req.responded_at).toLocaleString()}
                                                            </Typography>
                                                        )}
                                                    </Box>

                                                    {req.status === "pending" && (
                                                        <Stack spacing={1} ml={2}>
                                                            <Button
                                                                variant="contained"
                                                                color="success"
                                                                startIcon={<CheckCircle />}
                                                                onClick={() => handleTeamAccept(req.hr_id)}
                                                            >
                                                                Accept
                                                            </Button>
                                                            <Button
                                                                variant="outlined"
                                                                color="error"
                                                                startIcon={<Cancel />}
                                                                onClick={() => handleTeamReject(req.hr_id)}
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
                    </>
                )}
            </Box>
        </Box>
    );
}
