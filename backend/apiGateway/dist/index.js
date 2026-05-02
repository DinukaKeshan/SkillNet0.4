"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const auth_1 = require("./middleware/auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 5000;
// Backend server URL
const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || "http://localhost:5001";
// ✅ Allow requests from frontend (support both ports 3000 and 3001)
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin === "http://localhost:3000" || origin === "http://localhost:3001") {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS")
        return res.sendStatus(200);
    next();
});
//-----------------------Test Routes--------------------------------
// Proxy route for /api/hello
app.get("/api/hello", async (req, res) => {
    try {
        const response = await (0, node_fetch_1.default)(`${BACKEND_BASE_URL}/api/hello`);
        const data = await response.json();
        res.json(data);
    }
    catch (err) {
        console.error("Error contacting backend:", err);
        res.status(500).json({ error: "Backend service unreachable" });
    }
});
// Proxy route for /api/db-test
app.get("/api/db-test", async (req, res) => {
    try {
        const response = await (0, node_fetch_1.default)(`${BACKEND_BASE_URL}/api/db-test`);
        const data = await response.json();
        res.json(data);
    }
    catch (err) {
        console.error("Error contacting backend:", err);
        res.status(500).json({ error: "Backend service unreachable" });
    }
});
//-----------------------Auth Routes--------------------------------
// Sign Up
app.post("/api/signup", async (req, res) => {
    try {
        const response = await (0, node_fetch_1.default)(`${BACKEND_BASE_URL}/api/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
        });
        const data = await response.json();
        res.status(response.status).json(data);
    }
    catch (err) {
        console.error("Gateway Signup Error:", err);
        res.status(500).json({ error: "Gateway signup failed" });
    }
});
// Sign In
app.post("/api/signin", async (req, res) => {
    try {
        const response = await (0, node_fetch_1.default)(`${BACKEND_BASE_URL}/api/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
        });
        const data = await response.json();
        res.status(response.status).json(data);
    }
    catch (err) {
        console.error("Gateway Signin Error:", err);
        res.status(500).json({ error: "Gateway signin failed" });
    }
});
// Protected Route
app.get("/api/protected", auth_1.verifyToken, (req, res) => {
    const user = req.user;
    res.json({ message: `Welcome ${user.name}, you are a ${user.role}!` });
});
//-----------------------Student Routes--------------------------------
// Get Student Info
app.get("/api/getStudentInfo", auth_1.verifyToken, async (req, res) => {
    try {
        const token = req.headers.authorization;
        const response = await (0, node_fetch_1.default)(`${BACKEND_BASE_URL}/api/getStudentInfo`, {
            headers: { Authorization: token, "Content-Type": "application/json" },
        });
        const data = await response.json();
        res.status(response.status).json(data);
    }
    catch (err) {
        console.error("Gateway getStudentInfo error:", err);
        res.status(500).json({ error: "Failed to fetch student info" });
    }
});
// Edit Profile
app.put("/api/editProfile", auth_1.verifyToken, async (req, res) => {
    try {
        const payload = req.body;
        const response = await axios_1.default.put(`${BACKEND_BASE_URL}/api/editProfile`, payload, {
            headers: { Authorization: (req.headers.authorization || "") },
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway EditProfile Error:", err.message);
        res.status(500).json({ error: "Gateway error" });
    }
});
//-----------------------Company Routes--------------------------------
// Get Company Info
app.get("/api/getCompanyInfo", auth_1.verifyToken, async (req, res) => {
    try {
        const token = req.headers.authorization;
        const response = await (0, node_fetch_1.default)(`${BACKEND_BASE_URL}/api/getCompanyInfo`, {
            headers: { Authorization: token, "Content-Type": "application/json" },
        });
        const data = await response.json();
        res.status(response.status).json(data);
    }
    catch (err) {
        console.error("Gateway getCompanyInfo error:", err);
        res.status(500).json({ error: "Failed to fetch company info" });
    }
});
// Edit Company Profile
app.put("/api/editCompanyProfile", auth_1.verifyToken, async (req, res) => {
    try {
        const payload = req.body;
        const response = await axios_1.default.put(`${BACKEND_BASE_URL}/api/editCompanyProfile`, payload, {
            headers: { Authorization: (req.headers.authorization || "") },
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway EditCompanyProfile Error:", err.message);
        res.status(500).json({ error: "Gateway error" });
    }
});
// Add Job
app.post("/api/addJob", auth_1.verifyToken, async (req, res) => {
    try {
        const payload = req.body;
        const response = await axios_1.default.post(`${BACKEND_BASE_URL}/api/addJob`, payload, {
            headers: { Authorization: (req.headers.authorization || "") },
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway addJob error:", err.message);
        res.status(500).json({ error: "Failed to add job" });
    }
});
// =====================================================
// COMPANY JOB ROLES ROUTES
// =====================================================
// Create job role
app.post("/api/job-roles", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.post(`${BACKEND_BASE_URL}/api/job-roles`, req.body, {
            headers: { Authorization: (req.headers.authorization || "") },
        });
        res.status(response.status).json(response.data);
    }
    catch (err) {
        console.error("Gateway create job-role error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to create job role" });
    }
});
// List job roles
app.get("/api/job-roles", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.get(`${BACKEND_BASE_URL}/api/job-roles`, {
            headers: { Authorization: (req.headers.authorization || "") },
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway list job-roles error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to list job roles" });
    }
});
// Get hire statuses for all company job roles
app.get("/api/job-roles/hire-statuses", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.get(`${BACKEND_BASE_URL}/api/job-roles/hire-statuses`, {
            headers: { Authorization: (req.headers.authorization || "") },
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway hire-statuses error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to get hire statuses" });
    }
});
// Get single job role
app.get("/api/job-roles/:id", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.get(`${BACKEND_BASE_URL}/api/job-roles/${req.params.id}`, {
            headers: { Authorization: (req.headers.authorization || "") },
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway get job-role error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to get job role" });
    }
});
// Update job role
app.put("/api/job-roles/:id", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.put(`${BACKEND_BASE_URL}/api/job-roles/${req.params.id}`, req.body, {
            headers: { Authorization: (req.headers.authorization || "") },
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway update job-role error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to update job role" });
    }
});
// Delete job role
app.delete("/api/job-roles/:id", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.delete(`${BACKEND_BASE_URL}/api/job-roles/${req.params.id}`, {
            headers: { Authorization: (req.headers.authorization || "") },
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway delete job-role error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to delete job role" });
    }
});
// =====================================================
// COMPANY HIRE REQUESTS & RECOMMENDATIONS ROUTES
// =====================================================
// Get AI recommendations for a job role
app.get("/api/job-roles/:id/recommendations", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.get(`${BACKEND_BASE_URL}/api/job-roles/${req.params.id}/recommendations`, {
            headers: { Authorization: (req.headers.authorization || "") },
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway job-role recommendations error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to get recommendations" });
    }
});
// Send hire request
app.post("/api/job-roles/:id/send-hire-request", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.post(`${BACKEND_BASE_URL}/api/job-roles/${req.params.id}/send-hire-request`, req.body, {
            headers: { Authorization: (req.headers.authorization || "") },
        });
        res.status(response.status).json(response.data);
    }
    catch (err) {
        console.error("Gateway send-hire-request error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to send hire request" });
    }
});
// Student: Get hire requests
app.get("/api/student/hire-requests", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.get(`${BACKEND_BASE_URL}/api/student/hire-requests`, {
            headers: { Authorization: (req.headers.authorization || "") },
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway student hire-requests error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to get hire requests" });
    }
});
// Student: Accept hire request
app.post("/api/student/hire-requests/:id/accept", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.post(`${BACKEND_BASE_URL}/api/student/hire-requests/${req.params.id}/accept`, {}, {
            headers: { Authorization: (req.headers.authorization || "") },
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway accept hire-request error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to accept hire request" });
    }
});
// Student: Reject hire request
app.post("/api/student/hire-requests/:id/reject", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.post(`${BACKEND_BASE_URL}/api/student/hire-requests/${req.params.id}/reject`, {}, {
            headers: { Authorization: (req.headers.authorization || "") },
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway reject hire-request error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to reject hire request" });
    }
});
//-----------------------SME Routes--------------------------------
// Get SME Info
app.get("/api/getSmeInfo", auth_1.verifyToken, async (req, res) => {
    try {
        const token = req.headers.authorization;
        console.log("x:", token);
        const response = await (0, node_fetch_1.default)(`${BACKEND_BASE_URL}/api/getSmeInfo`, {
            headers: { Authorization: token, "Content-Type": "application/json" },
        });
        const data = await response.json();
        res.status(response.status).json(data);
    }
    catch (err) {
        console.error("Gateway getSmeInfo error:", err);
        res.status(500).json({ error: "Failed to fetch SME info" });
    }
});
// Change Password
app.put("/api/changePassword", auth_1.verifyToken, async (req, res) => {
    try {
        const payload = req.body;
        const response = await axios_1.default.put(`${BACKEND_BASE_URL}/api/changePassword`, payload, {
            headers: { Authorization: (req.headers.authorization || "") },
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway changePassword error:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to change password" });
    }
});
// Delete User
app.delete("/api/deleteUser", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.delete(`${BACKEND_BASE_URL}/api/deleteUser`, {
            headers: { Authorization: (req.headers.authorization || "") },
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway deleteUser error:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to delete user" });
    }
});
//-----------------------Project/Job Management--------------------------------
// ✅ API GATEWAY FIX
app.post("/api/addProject", auth_1.verifyToken, async (req, res) => {
    try {
        const payload = req.body;
        // Changed .put to .post to match the Backend Server
        const response = await axios_1.default.post(`${BACKEND_BASE_URL}/api/addProject`, payload, {
            headers: { Authorization: (req.headers.authorization || "") },
        });
        res.json(response.data);
    }
    catch (err) {
        // Helpful log to see if the backend returned a specific error (like 404 or 500)
        console.error("Gateway addProject error:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to add project" });
    }
});
// =====================================================
// SKILL MANAGEMENT ROUTES
// =====================================================
app.get("/api/getStudentSkills", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.get(`${BACKEND_BASE_URL}/api/getStudentSkills`, {
            headers: { Authorization: (req.headers.authorization || "") }
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway getStudentSkills error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to fetch skills" });
    }
});
app.post("/api/addSkill", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.post(`${BACKEND_BASE_URL}/api/addSkill`, req.body, {
            headers: { Authorization: (req.headers.authorization || "") }
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway addSkill error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to add skill" });
    }
});
app.put("/api/verifySkill", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.put(`${BACKEND_BASE_URL}/api/verifySkill`, req.body, {
            headers: { Authorization: (req.headers.authorization || "") }
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway verifySkill error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to verify skill" });
    }
});
app.delete("/api/removeSkill", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.delete(`${BACKEND_BASE_URL}/api/removeSkill`, {
            headers: { Authorization: (req.headers.authorization || "") },
            data: req.body
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway removeSkill error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to remove skill" });
    }
});
// =====================================================
// TEAM MANAGEMENT ROUTES
// =====================================================
app.post("/api/createTeam", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.post(`${BACKEND_BASE_URL}/api/createTeam`, req.body, {
            headers: { Authorization: (req.headers.authorization || "") }
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway createTeam error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to create team" });
    }
});
app.get("/api/getMyTeams", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.get(`${BACKEND_BASE_URL}/api/getMyTeams`, {
            headers: { Authorization: (req.headers.authorization || "") }
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway getMyTeams error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to fetch teams" });
    }
});
app.get("/api/getTeamDetails/:teamId", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.get(`${BACKEND_BASE_URL}/api/getTeamDetails/${req.params.teamId}`, {
            headers: { Authorization: (req.headers.authorization || "") }
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway getTeamDetails error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to fetch team details" });
    }
});
app.put("/api/updateTeam/:teamId", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.put(`${BACKEND_BASE_URL}/api/updateTeam/${req.params.teamId}`, req.body, {
            headers: { Authorization: (req.headers.authorization || "") }
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway updateTeam error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to update team" });
    }
});
app.delete("/api/deleteTeam/:teamId", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.delete(`${BACKEND_BASE_URL}/api/deleteTeam/${req.params.teamId}`, {
            headers: { Authorization: (req.headers.authorization || "") }
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway deleteTeam error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to delete team" });
    }
});
app.put("/api/removeMember/:teamId/:studentId", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.put(`${BACKEND_BASE_URL}/api/removeMember/${req.params.teamId}/${req.params.studentId}`, {}, { headers: { Authorization: (req.headers.authorization || "") } });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway removeMember error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to remove member" });
    }
});
app.post("/api/leaveTeam/:teamId", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.post(`${BACKEND_BASE_URL}/api/leaveTeam/${req.params.teamId}`, {}, { headers: { Authorization: (req.headers.authorization || "") } });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway leaveTeam error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to leave team" });
    }
});
// =====================================================
// TEAM DISCOVERY ROUTES
// =====================================================
app.get("/api/searchTeams", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.get(`${BACKEND_BASE_URL}/api/searchTeams`, {
            headers: { Authorization: (req.headers.authorization || "") },
            params: req.query
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway searchTeams error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to search teams" });
    }
});
app.post("/api/requestJoinTeam/:teamId", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.post(`${BACKEND_BASE_URL}/api/requestJoinTeam/${req.params.teamId}`, {}, { headers: { Authorization: (req.headers.authorization || "") } });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway requestJoinTeam error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to send join request" });
    }
});
app.get("/api/getTeamRequests/:teamId", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.get(`${BACKEND_BASE_URL}/api/getTeamRequests/${req.params.teamId}`, {
            headers: { Authorization: (req.headers.authorization || "") }
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway getTeamRequests error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to fetch requests" });
    }
});
app.put("/api/approveRequest/:requestId", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.put(`${BACKEND_BASE_URL}/api/approveRequest/${req.params.requestId}`, {}, { headers: { Authorization: (req.headers.authorization || "") } });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway approveRequest error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to approve request" });
    }
});
app.put("/api/rejectRequest/:requestId", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.put(`${BACKEND_BASE_URL}/api/rejectRequest/${req.params.requestId}`, {}, { headers: { Authorization: (req.headers.authorization || "") } });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway rejectRequest error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to reject request" });
    }
});
// =====================================================
// ML RECOMMENDATION ROUTE
// =====================================================
app.get("/api/getTeamRecommendations", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.get(`${BACKEND_BASE_URL}/api/getTeamRecommendations`, {
            headers: { Authorization: (req.headers.authorization || "") }
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway getTeamRecommendations error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to fetch recommendations" });
    }
});
// =====================================================
// SME PROFILE MANAGEMENT ROUTES
// =====================================================
app.get("/api/sme/profile", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.get(`${BACKEND_BASE_URL}/api/sme/profile`, {
            headers: { Authorization: (req.headers.authorization || "") },
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway GET sme/profile error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to get SME profile" });
    }
});
app.put("/api/sme/profile", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.put(`${BACKEND_BASE_URL}/api/sme/profile`, req.body, {
            headers: { Authorization: (req.headers.authorization || "") },
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway PUT sme/profile error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to update SME profile" });
    }
});
app.delete("/api/sme/profile", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.delete(`${BACKEND_BASE_URL}/api/sme/profile`, {
            headers: { Authorization: (req.headers.authorization || "") },
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway DELETE sme/profile error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to delete SME profile" });
    }
});
// =====================================================
// SME PROJECT MANAGEMENT ROUTES
// =====================================================
// Create Project
app.post("/api/projects", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.post(`${BACKEND_BASE_URL}/api/projects`, req.body, {
            headers: { Authorization: (req.headers.authorization || "") }
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway createProject error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to create project" });
    }
});
// Get All Projects
app.get("/api/projects", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.get(`${BACKEND_BASE_URL}/api/projects`, {
            headers: { Authorization: (req.headers.authorization || "") }
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway getProjects error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to fetch projects" });
    }
});
// Get Single Project
app.get("/api/projects/:id", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.get(`${BACKEND_BASE_URL}/api/projects/${req.params.id}`, {
            headers: { Authorization: (req.headers.authorization || "") }
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway getProject error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to fetch project" });
    }
});
// Update Project
app.put("/api/projects/:id", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.put(`${BACKEND_BASE_URL}/api/projects/${req.params.id}`, req.body, {
            headers: { Authorization: (req.headers.authorization || "") }
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway updateProject error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to update project" });
    }
});
// Delete Project
app.delete("/api/projects/:id", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.delete(`${BACKEND_BASE_URL}/api/projects/${req.params.id}`, {
            headers: { Authorization: (req.headers.authorization || "") }
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway deleteProject error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to delete project" });
    }
});
// Get Project Recommendations
app.get("/api/projects/:id/recommendations", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.get(`${BACKEND_BASE_URL}/api/projects/${req.params.id}/recommendations`, {
            headers: { Authorization: (req.headers.authorization || "") }
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway getRecommendations error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to fetch recommendations" });
    }
});
// Send Hiring Request
app.post("/api/projects/:id/send-request", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.post(`${BACKEND_BASE_URL}/api/projects/${req.params.id}/send-request`, req.body, {
            headers: { Authorization: (req.headers.authorization || "") }
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway sendHiringRequest error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to send request" });
    }
});
// =====================================================
// HIRING REQUEST ROUTES
// =====================================================
// Get hiring requests for a project (SME view)
app.get("/api/hiring-requests/project/:id", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.get(`${BACKEND_BASE_URL}/api/hiring-requests/project/${req.params.id}`, {
            headers: { Authorization: (req.headers.authorization || "") }
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway getProjectRequests error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to fetch requests" });
    }
});
// Get hiring requests for team leader
app.get("/api/teams/hiring-requests", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.get(`${BACKEND_BASE_URL}/api/teams/hiring-requests`, {
            headers: { Authorization: (req.headers.authorization || "") }
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway getTeamRequests error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to fetch team requests" });
    }
});
// Accept hiring request (Team leader)
app.post("/api/teams/hiring-requests/:id/accept", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.post(`${BACKEND_BASE_URL}/api/teams/hiring-requests/${req.params.id}/accept`, {}, {
            headers: { Authorization: (req.headers.authorization || "") }
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway acceptRequest error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to accept request" });
    }
});
// Reject hiring request (Team leader)
app.post("/api/teams/hiring-requests/:id/reject", auth_1.verifyToken, async (req, res) => {
    try {
        const response = await axios_1.default.post(`${BACKEND_BASE_URL}/api/teams/hiring-requests/${req.params.id}/reject`, {}, {
            headers: { Authorization: (req.headers.authorization || "") }
        });
        res.json(response.data);
    }
    catch (err) {
        console.error("Gateway rejectRequest error:", err.message);
        res.status(err.response?.status || 500).json(err.response?.data || { error: "Failed to reject request" });
    }
});
//-----------------------Start Server--------------------------------
app.listen(PORT, () => {
    console.log(`🚪 API Gateway running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map