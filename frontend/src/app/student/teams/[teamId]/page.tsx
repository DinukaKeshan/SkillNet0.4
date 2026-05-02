"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
    IconButton,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
} from "@mui/material";
import {
    ArrowBack,
    Edit,
    Delete,
    PersonRemove,
    Check,
    Close,
    ExitToApp,
    Groups,
    Person,
} from "@mui/icons-material";
import UserMenu from "../../../../components/UserMenu";

interface TeamMember {
    id: number;
    name: string;
    role: string;
}

interface JoinRequest {
    id: number;
    student_id: number;
    student_name: string;
    student_email: string;
    created_at: string;
}

interface TeamDetails {
    t_id: number;
    t_name: string;
    t_skills_req: string[];
    current_members: TeamMember[];
    member_count: number;
    team_leader_id: number;
    leader_name: string;
    created_at: string;
}

export default function TeamDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const teamId = params.teamId as string;

    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState(0);
    const [team, setTeam] = useState<TeamDetails | null>(null);
    const [isLeader, setIsLeader] = useState(false);
    const [pendingRequests, setPendingRequests] = useState<JoinRequest[]>([]);

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editForm, setEditForm] = useState({
        teamName: "",
        memberCount: 5,
    });

    useEffect(() => {
        checkAuth();
        fetchTeamDetails();
    }, [teamId]);

    const checkAuth = () => {
        const token = localStorage.getItem("token");
        const name = localStorage.getItem("userName") || "Student";
        const id = parseInt(localStorage.getItem("userId") || "0");
        setUserName(name);
        setUserId(id);
        if (!token) {
            router.push("/");
        }
    };

    const fetchTeamDetails = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/getTeamDetails/${teamId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (res.ok) {
                setTeam(data.team);
                setIsLeader(data.isLeader);
                setPendingRequests(data.pendingRequests || []);
                setEditForm({
                    teamName: data.team.t_name,
                    memberCount: data.team.member_count,
                });
            } else {
                alert("Failed to load team details");
                router.push("/student/teams");
            }
        } catch (err) {
            console.error("Error fetching team details:", err);
            alert("Error loading team");
            router.push("/student/teams");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTeam = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(`http://localhost:5000/api/updateTeam/${teamId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editForm),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Team updated successfully!");
                setOpenEditDialog(false);
                fetchTeamDetails();
            } else {
                alert(data.error || "Failed to update team");
            }
        } catch (err) {
            console.error("Error updating team:", err);
            alert("Error updating team");
        }
    };

    const handleDeleteTeam = async () => {
        if (!confirm(`Are you sure you want to delete "${team?.t_name}"? This action cannot be undone.`)) {
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(`http://localhost:5000/api/deleteTeam/${teamId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (res.ok) {
                alert("Team deleted successfully!");
                router.push("/student/teams");
            } else {
                alert(data.error || "Failed to delete team");
            }
        } catch (err) {
            console.error("Error deleting team:", err);
            alert("Error deleting team");
        }
    };

    const handleRemoveMember = async (memberId: number) => {
        if (!confirm("Are you sure you want to remove this member?")) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(
                `http://localhost:5000/api/removeMember/${teamId}/${memberId}`,
                {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const data = await res.json();
            if (res.ok) {
                alert("Member removed successfully!");
                fetchTeamDetails();
            } else {
                alert(data.error || "Failed to remove member");
            }
        } catch (err) {
            console.error("Error removing member:", err);
            alert("Error removing member");
        }
    };

    const handleApproveRequest = async (requestId: number) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(`http://localhost:5000/api/approveRequest/${requestId}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (res.ok) {
                alert("Request approved!");
                fetchTeamDetails();
            } else {
                alert(data.error || "Failed to approve request");
            }
        } catch (err) {
            console.error("Error approving request:", err);
            alert("Error approving request");
        }
    };

    const handleRejectRequest = async (requestId: number) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch(`http://localhost:5000/api/rejectRequest/${requestId}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (res.ok) {
                alert("Request rejected");
                fetchTeamDetails();
            } else {
                alert(data.error || "Failed to reject request");
            }
        } catch (err) {
            console.error("Error rejecting request:", err);
            alert("Error rejecting request");
        }
    };

    const handleLeaveTeam = async () => {
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
                router.push("/student/teams");
            } else {
                alert(data.error || "Failed to leave team");
            }
        } catch (err) {
            console.error("Error leaving team:", err);
            alert("Error leaving team");
        }
    };

    if (loading || !team) {
        return (
            <main className="flex justify-center items-center min-h-screen">
                <CircularProgress />
            </main>
        );
    }

    const skillsArray = Array.isArray(team.t_skills_req)
        ? team.t_skills_req
        : JSON.parse(team.t_skills_req || "[]");
    const membersArray = Array.isArray(team.current_members)
        ? team.current_members
        : JSON.parse(team.current_members || "[]");

    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
            {/* HEADER BAR */}
            <AppBar position="static" sx={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)" }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => router.push("/student/teams")}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", ml: 2 }}>
                        {team.t_name}
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

            <Box p={4} maxWidth={1000} mx="auto">
                {/* TEAM INFO CARD */}
                <Card sx={{ mb: 3, p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="start" mb={2}>
                        <Box>
                            <Typography variant="h4" fontWeight="bold">
                                {team.t_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mt={1}>
                                Led by {team.leader_name}
                            </Typography>
                        </Box>
                        <Chip
                            icon={<Groups />}
                            label={`${membersArray.length}/${team.member_count} members`}
                            color="primary"
                        />
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    {/* Required Skills */}
                    <Box mb={2}>
                        <Typography variant="subtitle1" mb={1}>
                            Required Skills:
                        </Typography>
                        {skillsArray.length > 0 ? (
                            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                {skillsArray.map((skill: string, idx: number) => (
                                    <Chip key={idx} label={skill} color="primary" variant="outlined" />
                                ))}
                            </Stack>
                        ) : (
                            <Typography color="text.secondary">No specific skills required</Typography>
                        )}
                    </Box>

                    {/* Leader Actions */}
                    {isLeader && (
                        <Stack direction="row" gap={2} mt={3}>
                            <Button
                                variant="outlined"
                                startIcon={<Edit />}
                                onClick={() => setOpenEditDialog(true)}
                            >
                                Edit Team
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<Delete />}
                                onClick={handleDeleteTeam}
                            >
                                Delete Team
                            </Button>
                        </Stack>
                    )}

                    {/* Member Action: Leave Team */}
                    {!isLeader && (
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<ExitToApp />}
                            onClick={handleLeaveTeam}
                            sx={{ mt: 2 }}
                        >
                            Leave Team
                        </Button>
                    )}
                </Card>

                {/* TEAM MEMBERS */}
                <Card sx={{ mb: 3, p: 3 }}>
                    <Typography variant="h6" mb={2}>
                        Team Members ({membersArray.length})
                    </Typography>
                    <List>
                        {membersArray.map((member: TeamMember, idx: number) => (
                            <ListItem
                                key={idx}
                                secondaryAction={
                                    isLeader && member.role !== "leader" && (
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleRemoveMember(member.id)}
                                            color="error"
                                        >
                                            <PersonRemove />
                                        </IconButton>
                                    )
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: member.role === "leader" ? "#6366f1" : "#06b6d4" }}>
                                        <Person />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={member.name}
                                    secondary={member.role === "leader" ? "Team Leader" : "Member"}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Card>

                {/* PENDING JOIN REQUESTS (Leader Only) */}
                {isLeader && pendingRequests.length > 0 && (
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h6" mb={2}>
                            Pending Join Requests ({pendingRequests.length})
                        </Typography>
                        <List>
                            {pendingRequests.map((request) => (
                                <ListItem
                                    key={request.id}
                                    sx={{ border: "1px solid #e0e0e0", borderRadius: 1, mb: 1 }}
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <Person />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={request.student_name}
                                        secondary={request.student_email}
                                    />
                                    <Stack direction="row" gap={1}>
                                        <IconButton
                                            color="success"
                                            onClick={() => handleApproveRequest(request.id)}
                                        >
                                            <Check />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleRejectRequest(request.id)}
                                        >
                                            <Close />
                                        </IconButton>
                                    </Stack>
                                </ListItem>
                            ))}
                        </List>
                    </Card>
                )}

                {isLeader && pendingRequests.length === 0 && (
                    <Alert severity="info">No pending join requests at the moment.</Alert>
                )}
            </Box>

            {/* EDIT TEAM DIALOG */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Team</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} mt={1}>
                        <TextField
                            label="Team Name"
                            value={editForm.teamName}
                            onChange={(e) => setEditForm({ ...editForm, teamName: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Maximum Members"
                            type="number"
                            value={editForm.memberCount}
                            onChange={(e) =>
                                setEditForm({ ...editForm, memberCount: parseInt(e.target.value) || 5 })
                            }
                            fullWidth
                            InputProps={{ inputProps: { min: membersArray.length, max: 20 } }}
                            helperText={`Current members: ${membersArray.length}. You cannot set a limit below this number.`}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleUpdateTeam}>
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </main>
    );
}
