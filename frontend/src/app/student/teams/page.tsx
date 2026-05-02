"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Box,
    Stack,
    AppBar,
    Toolbar,
    Tabs,
    Tab,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Grid,
    Divider,
    Alert,
    CircularProgress,
} from "@mui/material";
import {
    Search,
    Add,
    Groups,
    Star,
    PersonAdd,
    ArrowBack,
    Business,
} from "@mui/icons-material";
import UserMenu from "../../../components/UserMenu";
import { useRouter } from "next/navigation";

interface Team {
    t_id: number;
    t_name: string;
    t_skills_req: string[] | string; // Can be array from DB or comma-separated string from ML API
    current_members: any[];
    member_count: number;
    team_leader_id: number;
    leader_name: string;
    similarity_score?: number;
}

export default function TeamsPage() {
    const router = useRouter();
    const [tabIndex, setTabIndex] = useState(0);
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(false);

    // My Teams
    const [myTeams, setMyTeams] = useState<Team[]>([]);

    // Find Teams
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState<"name" | "skills">("name");
    const [searchResults, setSearchResults] = useState<Team[]>([]);
    const [recommendations, setRecommendations] = useState<Team[]>([]);
    const [recommendationsLoading, setRecommendationsLoading] = useState(false);

    // Create Team
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [newTeam, setNewTeam] = useState({
        teamName: "",
        memberCount: 5,
        skillsRequired: [] as string[],
    });
    const [newSkillInput, setNewSkillInput] = useState("");

    // Hiring Requests
    const [hiringRequests, setHiringRequests] = useState<any[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(false);

    useEffect(() => {
        checkAuth();
        fetchMyTeams();
        fetchRecommendations();
        fetchHiringRequests();
    }, []);

    // Fetch fresh recommendations every time user clicks Find Teams tab
    useEffect(() => {
        if (tabIndex === 1) {
            console.log("Find Teams tab clicked - fetching fresh recommendations");
            fetchRecommendations();
        }
    }, [tabIndex]);

    const checkAuth = () => {
        const token = localStorage.getItem("token");
        const name = localStorage.getItem("userName") || "Student";
        setUserName(name);
        if (!token) {
            router.push("/");
        }
    };

    const fetchMyTeams = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch("http://localhost:5000/api/getMyTeams", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (res.ok) {
                setMyTeams(data.teams || []);
            }
        } catch (err) {
            console.error("Error fetching my teams:", err);
        }
    };

    const fetchRecommendations = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setRecommendationsLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/getTeamRecommendations", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            console.log("Recommendations API Response:", data);
            if (res.ok) {
                const sorted = (data.recommendations || []).sort(
                    (a: Team, b: Team) => (b.similarity_score ?? 0) - (a.similarity_score ?? 0)
                );
                setRecommendations(sorted);
                console.log("Recommendations set (sorted):", sorted);
            } else {
                console.error("Recommendations API error:", data);
            }
        } catch (err) {
            console.error("Error fetching recommendations:", err);
        } finally {
            setRecommendationsLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:5000/api/searchTeams?query=${encodeURIComponent(
                    searchQuery
                )}&type=${searchType}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const data = await res.json();
            if (res.ok) {
                setSearchResults(data.teams || []);
            }
        } catch (err) {
            console.error("Error searching teams:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestJoin = async (teamId: number) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(
                `http://localhost:5000/api/requestJoinTeam/${teamId}`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const data = await res.json();
            if (res.ok) {
                alert("Join request sent successfully!");
            } else {
                alert(data.error || "Failed to send join request");
            }
        } catch (err) {
            console.error("Error requesting to join team:", err);
            alert("Error sending join request");
        }
    };

    const handleCreateTeam = async () => {
        if (!newTeam.teamName.trim()) {
            alert("Please enter a team name");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch("http://localhost:5000/api/createTeam", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    teamName: newTeam.teamName,
                    memberCount: newTeam.memberCount,
                    skillsRequired: newTeam.skillsRequired,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Team created successfully!");
                setOpenCreateDialog(false);
                setNewTeam({
                    teamName: "",
                    memberCount: 5,
                    skillsRequired: [],
                });
                fetchMyTeams();
                setTabIndex(0); // Switch to My Teams tab
            } else {
                alert(data.error || "Failed to create team");
            }
        } catch (err) {
            console.error("Error creating team:", err);
            alert("Error creating team");
        }
    };

    const handleAddSkillToNewTeam = () => {
        if (newSkillInput.trim() && !newTeam.skillsRequired.includes(newSkillInput.trim())) {
            setNewTeam({
                ...newTeam,
                skillsRequired: [...newTeam.skillsRequired, newSkillInput.trim()],
            });
            setNewSkillInput("");
        }
    };

    const handleRemoveSkillFromNewTeam = (skill: string) => {
        setNewTeam({
            ...newTeam,
            skillsRequired: newTeam.skillsRequired.filter((s) => s !== skill),
        });
    };

    const fetchHiringRequests = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setLoadingRequests(true);
        try {
            const res = await fetch("http://localhost:5000/api/teams/hiring-requests", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setHiringRequests(data.requests);
            }
        } catch (err) {
            console.error("Error fetching hiring requests:", err);
        } finally {
            setLoadingRequests(false);
        }
    };

    const handleAcceptRequest = async (requestId: number) => {
        if (!confirm("Accept this hiring request?")) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(`http://localhost:5000/api/teams/hiring-requests/${requestId}/accept`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                alert("Hiring request accepted! Project assigned to your team.");
                fetchHiringRequests();
                fetchMyTeams();
            } else {
                alert("Failed to accept request");
            }
        } catch (err) {
            console.error("Error accepting request:", err);
            alert("Error accepting request");
        }
    };

    const handleRejectRequest = async (requestId: number) => {
        if (!confirm("Reject this hiring request?")) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(`http://localhost:5000/api/teams/hiring-requests/${requestId}/reject`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                alert("Hiring request rejected");
                fetchHiringRequests();
            } else {
                alert("Failed to reject request");
            }
        } catch (err) {
            console.error("Error rejecting request:", err);
        }
    };

    const handleRemoveSkillFromNewTeamOriginal = (skill: string) => {
        setNewTeam({
            ...newTeam,
            skillsRequired: newTeam.skillsRequired.filter((s) => s !== skill),
        });
    };

    const handleLeaveTeam = async (teamId: number) => {
        if (!confirm("Are you sure you want to leave this team?")) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(`http://localhost:5000/api/leaveTeam/${teamId}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (res.ok) {
                alert("Left team successfully!");
                fetchMyTeams();
            } else {
                alert(data.error || "Failed to leave team");
            }
        } catch (err) {
            console.error("Error leaving team:", err);
            alert("Error leaving team");
        }
    };

    const renderTeamCard = (team: Team, showJoinButton: boolean = false) => {
        // Handle skills that can be either JSON array or comma-separated string
        let skillsArray: string[] = [];
        if (Array.isArray(team.t_skills_req)) {
            skillsArray = team.t_skills_req;
        } else if (typeof team.t_skills_req === 'string') {
            // Check if it's a JSON string or comma-separated
            try {
                skillsArray = JSON.parse(team.t_skills_req);
            } catch {
                // It's a comma-separated string (from ML API)
                skillsArray = team.t_skills_req.split(',').map(s => s.trim()).filter(s => s);
            }
        }

        const membersArray = Array.isArray(team.current_members)
            ? team.current_members
            : JSON.parse(team.current_members || "[]");

        return (
            <Card key={team.t_id} sx={{ height: "100%" }}>
                <CardContent>
                    <Stack spacing={2}>
                        {/* Team Header */}
                        <Box>
                            <Stack direction="row" justifyContent="space-between" alignItems="start">
                                <Typography variant="h6" fontWeight="bold">
                                    {team.t_name}
                                </Typography>
                                <Chip
                                    label={`${((team.similarity_score ?? 0) * 100).toFixed(0)}% Match`}
                                    size="small"
                                    color="success"
                                    icon={<Star />}
                                />
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                                Led by {team.leader_name}
                            </Typography>
                        </Box>

                        <Divider />

                        {/* Team Stats */}
                        <Stack direction="row" spacing={2}>
                            <Chip
                                icon={<Groups />}
                                label={`${membersArray.length}/${team.member_count} members`}
                                size="small"
                                variant="outlined"
                            />
                        </Stack>

                        {/* Required Skills */}
                        {skillsArray.length > 0 && (
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                                    Required Skills:
                                </Typography>
                                <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                                    {skillsArray.map((skill: string, idx: number) => (
                                        <Chip key={idx} label={skill} size="small" color="primary" variant="outlined" />
                                    ))}
                                </Stack>
                            </Box>
                        )}

                        {/* Action Buttons */}
                        <Stack direction="row" gap={1}>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => router.push(`/student/teams/${team.t_id}`)}
                            >
                                View Details
                            </Button>
                            {showJoinButton && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<PersonAdd />}
                                    onClick={() => handleRequestJoin(team.t_id)}
                                >
                                    Request Join
                                </Button>
                            )}
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        );
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
            {/* HEADER BAR */}
            <AppBar position="static" sx={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)" }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => router.push("/student")}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", ml: 2 }}>
                        Team Management
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={() => router.push("/student")}
                        sx={{ mr: 2, fontWeight: "bold" }}
                    >
                        Dashboard
                    </Button>
                    <UserMenu userName={userName} onProfileUpdate={() => { }} />
                </Toolbar>
            </AppBar>

            <Box p={4}>
                {/* TABS */}
                <Card sx={{ maxWidth: 1200, mx: "auto", mb: 3 }}>
                    <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} centered variant="fullWidth">
                        <Tab label="My Teams" icon={<Groups />} iconPosition="start" />
                        <Tab label="Find Teams" icon={<Search />} iconPosition="start" />
                        <Tab label="Create Team" icon={<Add />} iconPosition="start" />
                        <Tab
                            label={`Hiring Requests ${hiringRequests.length > 0 ? `(${hiringRequests.filter(r => r.status === 'pending').length})` : ''}`}
                            icon={<Business />}
                            iconPosition="start"
                        />
                    </Tabs>
                </Card>

                {/* TAB 1: MY TEAMS */}
                {tabIndex === 0 && (
                    <Box maxWidth={1200} mx="auto">
                        {myTeams.length > 0 ? (
                            <Grid container spacing={3}>
                                {myTeams.map((team) => (
                                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={team.t_id}>
                                        {renderTeamCard(team)}
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Card sx={{ p: 6, textAlign: "center" }}>
                                <Groups sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" mb={2}>
                                    You're not part of any teams yet
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    onClick={() => setTabIndex(2)}
                                >
                                    Create Your First Team
                                </Button>
                            </Card>
                        )}
                    </Box>
                )}

                {/* TAB 2: FIND TEAMS */}
                {tabIndex === 1 && (
                    <Box maxWidth={1200} mx="auto">
                        {/* Search Section */}
                        <Card sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" mb={2}>
                                Search Teams
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <InputLabel>Search By</InputLabel>
                                    <Select
                                        value={searchType}
                                        onChange={(e) => setSearchType(e.target.value as "name" | "skills")}
                                        label="Search By"
                                    >
                                        <MenuItem value="name">Team Name</MenuItem>
                                        <MenuItem value="skills">Skills</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    placeholder={
                                        searchType === "skills"
                                            ? "Enter skills (e.g., react, node, python)"
                                            : "Search by team name..."
                                    }
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    size="small"
                                    fullWidth
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") handleSearch();
                                    }}
                                />
                                <Button variant="contained" startIcon={<Search />} onClick={handleSearch}>
                                    Search
                                </Button>
                            </Stack>
                        </Card>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <Box mb={4}>
                                <Typography variant="h6" mb={2}>
                                    Search Results ({searchResults.length})
                                </Typography>
                                <Grid container spacing={3}>
                                    {searchResults.map((team) => (
                                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={team.t_id}>
                                            {renderTeamCard(team, true)}
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}

                        {/* ML Recommendations */}
                        <Box>
                            <Typography variant="h6" mb={2}>
                                AI Recommended Teams
                            </Typography>
                            {recommendationsLoading ? (
                                <Card sx={{ p: 6, textAlign: "center" }}>
                                    <CircularProgress />
                                    <Typography mt={2}>Loading recommendations...</Typography>
                                </Card>
                            ) : recommendations.length > 0 ? (
                                <>
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        These teams match your verified skills. Match percentage shown on each card.
                                    </Alert>
                                    <Grid container spacing={3}>
                                        {recommendations.map((team) => (
                                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={team.t_id}>
                                                {renderTeamCard(team, true)}
                                            </Grid>
                                        ))}
                                    </Grid>
                                </>
                            ) : (
                                <Card sx={{ p: 4, textAlign: "center" }}>
                                    <Typography color="text.secondary">
                                        No team recommendations available. Verify more skills to get personalized recommendations!
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        sx={{ mt: 2 }}
                                        onClick={() => router.push("/student")}
                                    >
                                        Go to Skills
                                    </Button>
                                </Card>
                            )}
                        </Box>
                    </Box>
                )}

                {/* TAB 3: CREATE TEAM */}
                {tabIndex === 2 && (
                    <Box maxWidth={800} mx="auto">
                        <Card sx={{ p: 4 }}>
                            <Typography variant="h5" mb={3}>
                                Create New Team
                            </Typography>
                            <Stack spacing={3}>
                                <TextField
                                    label="Team Name"
                                    value={newTeam.teamName}
                                    onChange={(e) => setNewTeam({ ...newTeam, teamName: e.target.value })}
                                    fullWidth
                                    placeholder="e.g., Full Stack Developers"
                                />

                                <TextField
                                    label="Maximum Members"
                                    type="number"
                                    value={newTeam.memberCount}
                                    onChange={(e) =>
                                        setNewTeam({ ...newTeam, memberCount: parseInt(e.target.value) || 5 })
                                    }
                                    fullWidth
                                    InputProps={{ inputProps: { min: 2, max: 20 } }}
                                />

                                <Box>
                                    <Typography variant="subtitle1" mb={1}>
                                        Required Skills
                                    </Typography>
                                    <Stack direction="row" spacing={2} mb={2}>
                                        <TextField
                                            placeholder="Add a required skill"
                                            value={newSkillInput}
                                            onChange={(e) => setNewSkillInput(e.target.value)}
                                            size="small"
                                            fullWidth
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") handleAddSkillToNewTeam();
                                            }}
                                        />
                                        <Button variant="outlined" startIcon={<Add />} onClick={handleAddSkillToNewTeam}>
                                            Add
                                        </Button>
                                    </Stack>
                                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                        {newTeam.skillsRequired.map((skill, idx) => (
                                            <Chip
                                                key={idx}
                                                label={skill}
                                                onDelete={() => handleRemoveSkillFromNewTeam(skill)}
                                                color="primary"
                                            />
                                        ))}
                                    </Stack>
                                </Box>

                                <Divider />

                                <Stack direction="row" gap={2} justifyContent="flex-end">
                                    <Button onClick={() => router.push("/student")}>Cancel</Button>
                                    <Button variant="contained" startIcon={<Add />} onClick={handleCreateTeam}>
                                        Create Team
                                    </Button>
                                </Stack>
                            </Stack>
                        </Card>
                    </Box>
                )}

                {/* TAB 4: HIRING REQUESTS */}
                {tabIndex === 3 && (
                    <Box maxWidth={1000} mx="auto">
                        <Typography variant="h5" mb={3} fontWeight="bold">
                            Hiring Requests
                        </Typography>

                        {loadingRequests ? (
                            <Card sx={{ p: 6, textAlign: "center" }}>
                                <CircularProgress />
                                <Typography mt={2}>Loading requests...</Typography>
                            </Card>
                        ) : hiringRequests.length === 0 ? (
                            <Card sx={{ p: 4, textAlign: "center" }}>
                                <Typography color="text.secondary">
                                    No hiring requests yet. Create teams and wait for SMEs to send project offers!
                                </Typography>
                            </Card>
                        ) : (
                            <Stack spacing={3}>
                                {hiringRequests.map((request) => (
                                    <Card key={request.hr_id} sx={{ p: 3 }}>
                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 12, md: 8 }}>
                                                <Stack spacing={2}>
                                                    <Box>
                                                        <Typography variant="h6" fontWeight="bold">
                                                            {request.p_name}
                                                        </Typography>
                                                        <Typography color="text.secondary" variant="body2">
                                                            From: {request.sme_name} ({request.sme_email})
                                                        </Typography>
                                                        <Chip
                                                            label={request.status.toUpperCase()}
                                                            size="small"
                                                            color={
                                                                request.status === 'accepted' ? 'success' :
                                                                    request.status === 'rejected' ? 'error' : 'warning'
                                                            }
                                                            sx={{ mt: 1 }}
                                                        />
                                                    </Box>

                                                    <Typography variant="body2">
                                                        {request.p_description}
                                                    </Typography>

                                                    <Box>
                                                        <Typography variant="body2">
                                                            <strong>Duration:</strong> {request.p_time_period}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            <strong>Value:</strong>{' '}
                                                            {request.p_value_type === 'fixed'
                                                                ? `$${request.p_value_amount?.toLocaleString()}`
                                                                : 'Discuss Later'}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            <strong>Contact:</strong> {request.sme_contact}
                                                        </Typography>
                                                    </Box>

                                                    <Box>
                                                        <Typography variant="body2" fontWeight="bold" mb={0.5}>
                                                            Required Skills:
                                                        </Typography>
                                                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                                            {(request.p_skills_req || []).map((skill: string, idx: number) => (
                                                                <Chip key={idx} label={skill} size="small" color="primary" sx={{ mb: 0.5 }} />
                                                            ))}
                                                        </Stack>
                                                    </Box>

                                                    {request.message && (
                                                        <Alert severity="info">
                                                            <Typography variant="body2" fontWeight="bold">Message from SME:</Typography>
                                                            <Typography variant="body2">{request.message}</Typography>
                                                        </Alert>
                                                    )}
                                                </Stack>
                                            </Grid>

                                            <Grid size={{ xs: 12, md: 4 }}>
                                                <Stack spacing={2} height="100%" justifyContent="center">
                                                    {request.status === 'pending' ? (
                                                        <>
                                                            <Button
                                                                variant="contained"
                                                                color="success"
                                                                fullWidth
                                                                onClick={() => handleAcceptRequest(request.hr_id)}
                                                            >
                                                                Accept Request
                                                            </Button>
                                                            <Button
                                                                variant="outlined"
                                                                color="error"
                                                                fullWidth
                                                                onClick={() => handleRejectRequest(request.hr_id)}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </>
                                                    ) : request.status === 'accepted' ? (
                                                        <Alert severity="success">
                                                            <Typography variant="body2">
                                                                This project is now assigned to your team!
                                                            </Typography>
                                                        </Alert>
                                                    ) : (
                                                        <Alert severity="error">
                                                            <Typography variant="body2">
                                                                Request was rejected
                                                            </Typography>
                                                        </Alert>
                                                    )}

                                                    <Typography variant="caption" color="text.secondary" textAlign="center">
                                                        Received: {new Date(request.created_at).toLocaleDateString()}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                ))}
                            </Stack>
                        )}
                    </Box>
                )}
            </Box>
        </main>
    );
}
