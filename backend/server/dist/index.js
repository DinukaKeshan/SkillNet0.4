"use strict";
// import express, { Application, Request, Response } from "express";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const app: Application = express();
// const PORT = process.env.PORT || 5001;
// app.use(express.json());
// // Sample route
// app.get("/api/hello", (req: Request, res: Response) => {
//   res.json({ message: "Hello from Express + TypeScript!" });
// });
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const promise_1 = __importDefault(require("mysql2/promise"));
// import bcrypt from "bcrypt";
const bcrypt = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
// Validate required environment variables at startup
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const JWT_SECRET = process.env.JWT_SECRET;
if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error("Missing required database environment variables (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)");
}
if (!JWT_SECRET) {
    throw new Error("Missing required JWT_SECRET environment variable");
}
// Define pool options with validated strings
const dbConfig = {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
};
// Create MySQL connection pool
const pool = promise_1.default.createPool(dbConfig);
// Middleware
app.use((0, cors_1.default)({ origin: ["http://localhost:3000", "http://localhost:3001"], credentials: true }));
app.use(express_1.default.json());
// Test route for database connectivity
app.get("/api/db-test", async (req, res) => {
    try {
        const [rows] = await pool.query("SHOW TABLES");
        res.json({
            message: "Database connection successful!",
            tables: rows,
        });
    }
    catch (error) {
        console.error("Database connection failed:", error.message);
        res.status(500).json({
            message: "Database connection failed",
            error: error.message,
        });
    }
});
// Default route
app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from Express + TypeScript!" });
});
// authentication and autherization
// 🧾 Sign Up Route
// app.post("/api/signup", async (req: Request, res: Response) => {
//   try {
//     const { role, name, email, password } = req.body;
//     if (!role || !name || !email || !password) {
//       return res.status(400).json({ error: "All fields are required." });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const [result] = await pool.query(
//       "INSERT INTO auth (category, name, username, password_hash) VALUES (?, ?, ?, ?)",
//       [role, name, email, hashedPassword]
//     );
//     res.json({ message: "User registered successfully." });
//   } catch (err: any) {
//     if (err.code === "ER_DUP_ENTRY") {
//       res.status(400).json({ error: "Email already exists." });
//     } else {
//       console.error("Signup Error:", err);
//       res.status(500).json({ error: "Server error." });
//     }
//   }
// });
// 🧾 Sign Up Route - Enhanced for Role-Based Registration
app.post("/api/signup", async (req, res) => {
    try {
        const { role, name, email, password, department, academicYear, companyRegistrationNo, companyType, industry, businessType } = req.body;
        // Validate required fields
        if (!role || !name || !email || !password) {
            return res.status(400).json({ error: "Role, name, email, and password are required." });
        }
        // Role-specific validation
        if (role === "Company") {
            if (!companyRegistrationNo || !companyType || !industry) {
                return res.status(400).json({
                    error: "Company registration number, company type, and industry are required for companies."
                });
            }
        }
        else if (role === "SME") {
            if (!companyRegistrationNo || !industry || !businessType) {
                return res.status(400).json({
                    error: "Registration number, industry, and business type are required for SMEs."
                });
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // Insert into MySQL with role-specific fields
        const [result] = await pool.query(`INSERT INTO auth (
        category, 
        name, 
        department, 
        academic_year, 
        username, 
        password_hash,
        company_registration_no,
        company_type,
        industry,
        business_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            role,
            name,
            role === "Student" ? department || null : null,
            role === "Student" ? academicYear || null : null,
            email,
            hashedPassword,
            (role === "Company" || role === "SME") ? companyRegistrationNo || null : null,
            role === "Company" ? companyType || null : null,
            (role === "Company" || role === "SME") ? industry || null : null,
            role === "SME" ? businessType || null : null
        ]);
        res.json({ message: "User registered successfully." });
    }
    catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            res.status(400).json({ error: "Email already exists." });
        }
        else {
            console.error("Signup Error:", err);
            res.status(500).json({ error: "Server error." });
        }
    }
});
// 🔐 Sign In Route
// app.post("/api/signin", async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const [rows]: any = await pool.query(
//       "SELECT * FROM auth WHERE username = ?",
//       [email]
//     );
//     if (rows.length === 0) {
//       return res.status(400).json({ error: "Invalid email or password." });
//     }
//     const user = rows[0];
//     const isMatch = await bcrypt.compare(password, user.password_hash);
//     if (!isMatch) {
//       return res.status(400).json({ error: "Invalid email or password." });
//     }
//     res.json({
//       message: "Login successful",
//       user: {
//         id: user.id,
//         name: user.name,
//         role: user.category,
//       },
//     });
//   } catch (err) {
//     console.error("Signin Error:", err);
//     res.status(500).json({ error: "Server error." });
//   }
// });
app.post("/api/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const [rows] = await pool.query("SELECT * FROM auth WHERE username = ?", [email]);
        if (!rows.length)
            return res.status(404).json({ error: "User not found" });
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch)
            return res.status(401).json({ error: "Invalid password" });
        // ✅ Create JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.category, name: user.name }, JWT_SECRET, { expiresIn: "2h" });
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.category,
            },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during signin" });
    }
});
// from student dashboard to get details
app.get("/api/getStudentInfo", async (req, res) => {
    try {
        // ✅ Extract and verify JWT token
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing Authorization header" });
        const token = authHeader.split(" ")[1];
        if (!token)
            return res.status(401).json({ error: "Missing token" });
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // ✅ Fetch user data from DB (except password)
        const [rows] = await pool.query("SELECT id, name, category AS role, department, academic_year, username FROM auth WHERE id = ?", [decoded.id]);
        if (!rows.length)
            return res.status(404).json({ error: "User not found" });
        res.json({ user: rows[0] });
    }
    catch (err) {
        console.error("Error fetching student info:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Edit Profile - Generic for all roles
app.put("/api/editProfile", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        if (!token)
            return res.status(401).json({ error: "Missing token" });
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const { name, department, academic_year, company_registration_no, company_type, industry, business_type } = req.body;
        // Update all fields that are provided
        const [result] = await pool.query(`UPDATE auth SET 
        name = ?, 
        department = ?, 
        academic_year = ?,
        company_registration_no = ?,
        company_type = ?,
        industry = ?,
        business_type = ?
      WHERE id = ?`, [
            name || null,
            department || null,
            academic_year || null,
            company_registration_no || null,
            company_type || null,
            industry || null,
            business_type || null,
            decoded.id
        ]);
        if (result.affectedRows === 0)
            return res.status(404).json({ error: "User not found" });
        res.json({ message: "Profile updated successfully" });
    }
    catch (err) {
        console.error("EditProfile Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Change Password
app.put("/api/changePassword", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        if (!token)
            return res.status(401).json({ error: "Missing token" });
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Current and new passwords are required" });
        }
        // Fetch current password hash
        const [rows] = await pool.query("SELECT password_hash FROM auth WHERE id = ?", [decoded.id]);
        if (!rows.length)
            return res.status(404).json({ error: "User not found" });
        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, rows[0].password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }
        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        // Update password
        await pool.query("UPDATE auth SET password_hash = ? WHERE id = ?", [hashedNewPassword, decoded.id]);
        res.json({ message: "Password changed successfully" });
    }
    catch (err) {
        console.error("ChangePassword Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Delete User Account
app.delete("/api/deleteUser", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        if (!token)
            return res.status(401).json({ error: "Missing token" });
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Delete user (cascade will handle related data)
        const [result] = await pool.query("DELETE FROM auth WHERE id = ?", [decoded.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User account deleted successfully" });
    }
    catch (err) {
        console.error("DeleteUser Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// from sme dashboard to get details
app.get("/api/getSmeInfo", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing Authorization header" });
        const token = authHeader.split(" ")[1];
        if (!token)
            return res.status(401).json({ error: "Missing token" });
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Fetch SME data from DB
        const [rows] = await pool.query(`SELECT id, name, category AS role, username, 
       company_registration_no, industry, business_type, created_at 
       FROM auth WHERE id = ?`, [decoded.id]);
        if (!rows.length)
            return res.status(404).json({ error: "User not found" });
        res.json({ user: rows[0] });
    }
    catch (err) {
        console.error("Error fetching SME info:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// from company dashboard to get details
app.get("/api/getCompanyInfo", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing Authorization header" });
        const token = authHeader.split(" ")[1];
        if (!token)
            return res.status(401).json({ error: "Missing token" });
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Fetch Company data from DB
        const [rows] = await pool.query(`SELECT id, name, category AS role, username,
       company_registration_no, company_type, industry, created_at 
       FROM auth WHERE id = ?`, [decoded.id]);
        if (!rows.length)
            return res.status(404).json({ error: "User not found" });
        res.json({ user: rows[0] });
    }
    catch (err) {
        console.error("Error fetching company info:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// =====================================================
// COMPANY JOB ROLES CRUD
// =====================================================
// Create job role
app.post("/api/job-roles", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.role.toLowerCase() !== "company") {
            return res.status(403).json({ error: "Access denied" });
        }
        const { role_name, role_description, skills_required, job_type, contract_period, payment_type, payment_amount } = req.body;
        if (!role_name || !job_type || !payment_type) {
            return res.status(400).json({ error: "Role name, job type, and payment type are required" });
        }
        const [result] = await pool.query(`INSERT INTO job_roles (company_id, role_name, role_description, skills_required, job_type, contract_period, payment_type, payment_amount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            decoded.id,
            role_name,
            role_description || null,
            JSON.stringify(skills_required || []),
            job_type,
            job_type === "contract" ? contract_period || null : null,
            payment_type,
            payment_type === "fixed" ? payment_amount || null : null
        ]);
        res.status(201).json({ message: "Job role created successfully", jr_id: result.insertId });
    }
    catch (err) {
        console.error("Create Job Role Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// List company's job roles
app.get("/api/job-roles", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.role.toLowerCase() !== "company") {
            return res.status(403).json({ error: "Access denied" });
        }
        const [roles] = await pool.query("SELECT * FROM job_roles WHERE company_id = ? ORDER BY created_at DESC", [decoded.id]);
        roles.forEach((r) => {
            if (typeof r.skills_required === "string") {
                try {
                    r.skills_required = JSON.parse(r.skills_required);
                }
                catch { }
            }
        });
        res.json({ roles });
    }
    catch (err) {
        console.error("List Job Roles Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Get hire statuses for all company job roles
app.get("/api/job-roles/hire-statuses", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const [hires] = await pool.query(`
      SELECT chr.chr_id, chr.job_role_id, chr.student_id, chr.message, chr.contact_info,
             chr.status, chr.created_at,
             a.name AS student_name, a.username AS student_email,
             a.department AS student_department, a.academic_year AS student_academic_year,
             s.verified_skills, s.unverified_skills
      FROM company_hire_requests chr
      JOIN auth a ON chr.student_id = a.id
      LEFT JOIN skills s ON chr.student_id = s.student_id
      WHERE chr.company_id = ? AND chr.status = 'accepted'
    `, [decoded.id]);
        const hireMap = {};
        for (const hire of hires) {
            let verified = hire.verified_skills;
            let unverified = hire.unverified_skills;
            if (typeof verified === "string")
                try {
                    verified = JSON.parse(verified);
                }
                catch {
                    verified = [];
                }
            if (typeof unverified === "string")
                try {
                    unverified = JSON.parse(unverified);
                }
                catch {
                    unverified = [];
                }
            hireMap[hire.job_role_id] = {
                chr_id: hire.chr_id,
                student_id: hire.student_id,
                student_name: hire.student_name,
                student_email: hire.student_email,
                student_department: hire.student_department,
                student_academic_year: hire.student_academic_year,
                verified_skills: verified || [],
                unverified_skills: unverified || [],
                hired_at: hire.created_at,
            };
        }
        res.json({ hire_statuses: hireMap });
    }
    catch (err) {
        console.error("Hire statuses error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Get single job role
app.get("/api/job-roles/:id", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const [roles] = await pool.query("SELECT * FROM job_roles WHERE jr_id = ? AND company_id = ?", [req.params.id, decoded.id]);
        if (!roles.length)
            return res.status(404).json({ error: "Job role not found" });
        const role = roles[0];
        if (typeof role.skills_required === "string") {
            try {
                role.skills_required = JSON.parse(role.skills_required);
            }
            catch { }
        }
        res.json({ role });
    }
    catch (err) {
        console.error("Get Job Role Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Update job role
app.put("/api/job-roles/:id", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.role.toLowerCase() !== "company") {
            return res.status(403).json({ error: "Access denied" });
        }
        const { role_name, role_description, skills_required, job_type, contract_period, payment_type, payment_amount } = req.body;
        const [result] = await pool.query(`UPDATE job_roles SET 
        role_name = ?, role_description = ?, skills_required = ?, 
        job_type = ?, contract_period = ?, payment_type = ?, payment_amount = ?
       WHERE jr_id = ? AND company_id = ?`, [
            role_name,
            role_description || null,
            JSON.stringify(skills_required || []),
            job_type,
            job_type === "contract" ? contract_period || null : null,
            payment_type,
            payment_type === "fixed" ? payment_amount || null : null,
            req.params.id,
            decoded.id
        ]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Job role not found" });
        }
        res.json({ message: "Job role updated successfully" });
    }
    catch (err) {
        console.error("Update Job Role Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Delete job role
app.delete("/api/job-roles/:id", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.role.toLowerCase() !== "company") {
            return res.status(403).json({ error: "Access denied" });
        }
        const [result] = await pool.query("DELETE FROM job_roles WHERE jr_id = ? AND company_id = ?", [req.params.id, decoded.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Job role not found" });
        }
        res.json({ message: "Job role deleted successfully" });
    }
    catch (err) {
        console.error("Delete Job Role Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// =====================================================
// COMPANY JOB ROLE RECOMMENDATIONS & HIRE REQUESTS
// =====================================================
// Get AI recommendations for a job role
app.get("/api/job-roles/:id/recommendations", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Get job role details
        const [roles] = await pool.query("SELECT * FROM job_roles WHERE jr_id = ? AND company_id = ?", [req.params.id, decoded.id]);
        if (!roles.length)
            return res.status(404).json({ error: "Job role not found" });
        const role = roles[0];
        let skills = role.skills_required;
        if (typeof skills === "string") {
            try {
                skills = JSON.parse(skills);
            }
            catch {
                skills = [skills];
            }
        }
        if (!Array.isArray(skills)) {
            skills = [skills].filter(Boolean);
        }
        // Call recruiter engine ML model
        try {
            const recruiterUrl = process.env.RECRUITER_ENGINE_URL || "http://127.0.0.1:5004";
            const mlResponse = await fetch(`${recruiterUrl}/predict`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    position: role.role_name,
                    skills: skills,
                    top_n: 20
                }),
            });
            if (mlResponse.ok) {
                const mlData = await mlResponse.json();
                return res.json({
                    job_role: {
                        jr_id: role.jr_id,
                        role_name: role.role_name,
                        skills_required: skills
                    },
                    recommendations: mlData.ranked_students || [],
                    total_evaluated: mlData.total_evaluated,
                    total_matched: mlData.total_matched,
                });
            }
        }
        catch (mlErr) {
            console.error("ML model error:", mlErr);
        }
        // Fallback: keyword matching if ML is down
        const [students] = await pool.query(`
      SELECT s.student_id, s.verified_skills, s.unverified_skills,
             a.name, a.username AS email, a.department, a.academic_year
      FROM skills s JOIN auth a ON s.student_id = a.id
      WHERE a.category = 'Student'
    `);
        const recommendations = students.map((stu) => {
            let verified = stu.verified_skills;
            let unverified = stu.unverified_skills;
            if (typeof verified === "string")
                try {
                    verified = JSON.parse(verified);
                }
                catch {
                    verified = [];
                }
            if (typeof unverified === "string")
                try {
                    unverified = JSON.parse(unverified);
                }
                catch {
                    unverified = [];
                }
            const normalizeSkill = (s) => s.toLowerCase().trim().replace(/\.js/g, 'js').replace(/[^a-z0-9]/g, '');
            const exactMatch = (jobSkills, studentSkills) => {
                const studentNorm = studentSkills.map(normalizeSkill);
                return jobSkills.filter(js => {
                    const jn = normalizeSkill(js);
                    return studentNorm.some(sn => jn === sn);
                }).length;
            };
            const vMatches = exactMatch(skills, verified || []);
            const uMatches = exactMatch(skills, unverified || []);
            const total = skills.length || 1;
            // True coverage: verified counts as 1.0, unverified as 0.5
            let score = ((vMatches * 1.0 + uMatches * 0.5) / total) * 100;
            score = Math.min(score, 100.0);
            return {
                student_id: stu.student_id,
                name: stu.name,
                email: stu.email,
                department: stu.department,
                academic_year: stu.academic_year,
                verified_skills: verified || [],
                unverified_skills: unverified || [],
                score: Math.round(score * 100) / 100
            };
        }).filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
        res.json({
            job_role: { jr_id: role.jr_id, role_name: role.role_name, skills_required: skills },
            recommendations,
            total_evaluated: students.length,
            total_matched: recommendations.length,
            fallback: true
        });
    }
    catch (err) {
        console.error("Job Role Recommendations Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Send hire request from company to student
app.post("/api/job-roles/:id/send-hire-request", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.role.toLowerCase() !== "company") {
            return res.status(403).json({ error: "Access denied" });
        }
        const { student_id, message, contact_info } = req.body;
        if (!student_id)
            return res.status(400).json({ error: "Student ID is required" });
        // Verify ownership of job role
        const [roles] = await pool.query("SELECT * FROM job_roles WHERE jr_id = ? AND company_id = ?", [req.params.id, decoded.id]);
        if (!roles.length)
            return res.status(404).json({ error: "Job role not found" });
        // Check for duplicate
        const [existing] = await pool.query("SELECT * FROM company_hire_requests WHERE job_role_id = ? AND student_id = ?", [req.params.id, student_id]);
        if (existing.length)
            return res.status(409).json({ error: "Hire request already sent to this student for this role" });
        const [result] = await pool.query(`INSERT INTO company_hire_requests (job_role_id, company_id, student_id, message, contact_info)
       VALUES (?, ?, ?, ?, ?)`, [req.params.id, decoded.id, student_id, message || null, contact_info || null]);
        res.status(201).json({ message: "Hire request sent successfully", chr_id: result.insertId });
    }
    catch (err) {
        console.error("Send Hire Request Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Student: Get hire requests
app.get("/api/student/hire-requests", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const [requests] = await pool.query(`
      SELECT chr.*, jr.role_name, jr.role_description, jr.skills_required, jr.job_type, 
             jr.contract_period, jr.payment_type, jr.payment_amount,
             a.name AS company_name, a.username AS company_email, a.industry
      FROM company_hire_requests chr
      JOIN job_roles jr ON chr.job_role_id = jr.jr_id
      JOIN auth a ON chr.company_id = a.id
      WHERE chr.student_id = ?
      ORDER BY chr.created_at DESC
    `, [decoded.id]);
        requests.forEach((r) => {
            if (typeof r.skills_required === "string") {
                try {
                    r.skills_required = JSON.parse(r.skills_required);
                }
                catch { }
            }
        });
        res.json({ requests });
    }
    catch (err) {
        console.error("Student Hire Requests Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Student: Accept hire request
app.post("/api/student/hire-requests/:id/accept", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const [result] = await pool.query("UPDATE company_hire_requests SET status = 'accepted' WHERE chr_id = ? AND student_id = ?", [req.params.id, decoded.id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Request not found" });
        res.json({ message: "Hire request accepted" });
    }
    catch (err) {
        console.error("Accept Hire Request Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Student: Reject hire request
app.post("/api/student/hire-requests/:id/reject", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const [result] = await pool.query("UPDATE company_hire_requests SET status = 'rejected' WHERE chr_id = ? AND student_id = ?", [req.params.id, decoded.id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Request not found" });
        res.json({ message: "Hire request rejected" });
    }
    catch (err) {
        console.error("Reject Hire Request Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
app.post("/api/addProject", async (req, res) => {
    console.log("AddProject:", req.body);
    console.log("AddProject:1", req.headers.authorization);
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        if (!token)
            return res.status(401).json({ error: "Missing token" });
        console.log("AddProject:2");
        console.log("AddProject:3");
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // const { name, department, acadamic_year } = req.body;
        // const [result]: any = await pool.query(
        //   "UPDATE auth SET name = ?, department = ?, acadamic_year = ? WHERE id = ?",
        //   [name, department, acadamic_year, decoded.id]
        // );
        // if (result.affectedRows === 0)
        //   return res.status(404).json({ error: "User not found" });
        console.log("AddProject:4");
        res.json({ message: "Project created successfully" });
    }
    catch (err) {
        console.error("AddProject Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// =====================================================
// SKILL MANAGEMENT ENDPOINTS
// =====================================================
// Get Student Skills
app.get("/api/getStudentSkills", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const [rows] = await pool.query("SELECT unverified_skills, verified_skills, updated_at FROM skills WHERE student_id = ?", [decoded.id]);
        if (!rows.length) {
            // No skills record yet, return empty arrays
            return res.json({
                unverified_skills: [],
                verified_skills: [],
                updated_at: null
            });
        }
        const row = rows[0];
        // Parse JSON string fields — MySQL/MariaDB may return JSON columns as strings
        if (typeof row.verified_skills === "string") {
            try {
                row.verified_skills = JSON.parse(row.verified_skills);
            }
            catch {
                row.verified_skills = [];
            }
        }
        if (typeof row.unverified_skills === "string") {
            try {
                row.unverified_skills = JSON.parse(row.unverified_skills);
            }
            catch {
                row.unverified_skills = [];
            }
        }
        if (!Array.isArray(row.verified_skills))
            row.verified_skills = [];
        if (!Array.isArray(row.unverified_skills))
            row.unverified_skills = [];
        res.json(row);
    }
    catch (err) {
        console.error("GetStudentSkills Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Add Skill (to unverified list)
app.post("/api/addSkill", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const { skill } = req.body;
        if (!skill || typeof skill !== "string") {
            return res.status(400).json({ error: "Skill name is required" });
        }
        // Check if skills record exists
        const [existing] = await pool.query("SELECT unverified_skills, verified_skills FROM skills WHERE student_id = ?", [decoded.id]);
        if (!existing.length) {
            // Create new skills record
            await pool.query("INSERT INTO skills (student_id, unverified_skills, verified_skills) VALUES (?, ?, ?)", [decoded.id, JSON.stringify([skill]), JSON.stringify([])]);
        }
        else {
            // Update existing record — parse JSON strings returned by MariaDB
            let unverified = existing[0].unverified_skills || [];
            let verified = existing[0].verified_skills || [];
            if (typeof unverified === "string") {
                try {
                    unverified = JSON.parse(unverified);
                }
                catch {
                    unverified = [];
                }
            }
            if (typeof verified === "string") {
                try {
                    verified = JSON.parse(verified);
                }
                catch {
                    verified = [];
                }
            }
            if (!Array.isArray(unverified))
                unverified = [];
            if (!Array.isArray(verified))
                verified = [];
            // Check if skill already exists in either list
            if (unverified.includes(skill) || verified.includes(skill)) {
                return res.status(400).json({ error: "Skill already exists" });
            }
            unverified.push(skill);
            await pool.query("UPDATE skills SET unverified_skills = ? WHERE student_id = ?", [JSON.stringify(unverified), decoded.id]);
        }
        res.json({ message: "Skill added successfully" });
    }
    catch (err) {
        console.error("AddSkill Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Verify Skill (move from unverified to verified)
app.put("/api/verifySkill", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const { skill } = req.body;
        if (!skill) {
            return res.status(400).json({ error: "Skill name is required" });
        }
        const [rows] = await pool.query("SELECT unverified_skills, verified_skills FROM skills WHERE student_id = ?", [decoded.id]);
        if (!rows.length) {
            return res.status(404).json({ error: "No skills found" });
        }
        // Parse JSON strings returned by MariaDB
        let unverified = rows[0].unverified_skills || [];
        let verified = rows[0].verified_skills || [];
        if (typeof unverified === "string") {
            try {
                unverified = JSON.parse(unverified);
            }
            catch {
                unverified = [];
            }
        }
        if (typeof verified === "string") {
            try {
                verified = JSON.parse(verified);
            }
            catch {
                verified = [];
            }
        }
        if (!Array.isArray(unverified))
            unverified = [];
        if (!Array.isArray(verified))
            verified = [];
        // Check if skill exists in unverified list
        const index = unverified.indexOf(skill);
        if (index === -1) {
            return res.status(400).json({ error: "Skill not found in unverified list" });
        }
        // Move skill from unverified to verified
        unverified.splice(index, 1);
        verified.push(skill);
        await pool.query("UPDATE skills SET unverified_skills = ?, verified_skills = ? WHERE student_id = ?", [JSON.stringify(unverified), JSON.stringify(verified), decoded.id]);
        res.json({ message: "Skill verified successfully" });
    }
    catch (err) {
        console.error("VerifySkill Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Remove Skill
app.delete("/api/removeSkill", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const { skill, type } = req.body; // type: 'verified' or 'unverified'
        if (!skill || !type) {
            return res.status(400).json({ error: "Skill name and type are required" });
        }
        const [rows] = await pool.query("SELECT unverified_skills, verified_skills FROM skills WHERE student_id = ?", [decoded.id]);
        if (!rows.length) {
            return res.status(404).json({ error: "No skills found" });
        }
        // Parse JSON strings returned by MariaDB
        let unverified = rows[0].unverified_skills || [];
        let verified = rows[0].verified_skills || [];
        if (typeof unverified === "string") {
            try {
                unverified = JSON.parse(unverified);
            }
            catch {
                unverified = [];
            }
        }
        if (typeof verified === "string") {
            try {
                verified = JSON.parse(verified);
            }
            catch {
                verified = [];
            }
        }
        if (!Array.isArray(unverified))
            unverified = [];
        if (!Array.isArray(verified))
            verified = [];
        if (type === "verified") {
            const index = verified.indexOf(skill);
            if (index === -1) {
                return res.status(400).json({ error: "Skill not found in verified list" });
            }
            verified.splice(index, 1);
        }
        else {
            const index = unverified.indexOf(skill);
            if (index === -1) {
                return res.status(400).json({ error: "Skill not found in unverified list" });
            }
            unverified.splice(index, 1);
        }
        await pool.query("UPDATE skills SET unverified_skills = ?, verified_skills = ? WHERE student_id = ?", [JSON.stringify(unverified), JSON.stringify(verified), decoded.id]);
        res.json({ message: "Skill removed successfully" });
    }
    catch (err) {
        console.error("RemoveSkill Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// =====================================================
// TEAM MANAGEMENT ENDPOINTS
// =====================================================
// Create Team
app.post("/api/createTeam", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const { teamName, memberCount, skillsRequired } = req.body;
        if (!teamName || !memberCount) {
            return res.status(400).json({ error: "Team name and member count are required" });
        }
        // Auto-add team leader to current_members
        const currentMembers = [{ id: decoded.id, name: decoded.name, role: "leader" }];
        const [result] = await pool.query(`INSERT INTO teams (t_name, team_leader_id, member_count, current_members, t_skills_req) 
       VALUES (?, ?, ?, ?, ?)`, [
            teamName,
            decoded.id,
            memberCount,
            JSON.stringify(currentMembers),
            JSON.stringify(skillsRequired || [])
        ]);
        res.json({
            message: "Team created successfully",
            teamId: result.insertId
        });
    }
    catch (err) {
        console.error("CreateTeam Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Get My Teams
app.get("/api/getMyTeams", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Fetch all teams where user is leader OR a member
        // JSON_CONTAINS is avoided here for MariaDB compatibility — filter in application layer
        const [rows] = await pool.query(`SELECT t.*, a.name as leader_name 
       FROM teams t
       JOIN auth a ON t.team_leader_id = a.id
       WHERE t.team_leader_id = ? OR t.current_members LIKE ?`, [decoded.id, `%"id":${decoded.id}%`]);
        res.json({ teams: rows });
    }
    catch (err) {
        console.error("GetMyTeams Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Get Team Details
app.get("/api/getTeamDetails/:teamId", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const { teamId } = req.params;
        const [rows] = await pool.query(`SELECT t.*, a.name as leader_name 
       FROM teams t
       JOIN auth a ON t.team_leader_id = a.id
       WHERE t.t_id = ?`, [teamId]);
        if (!rows.length) {
            return res.status(404).json({ error: "Team not found" });
        }
        // Get pending join requests for this team (if user is leader)
        let pendingRequests = [];
        if (rows[0].team_leader_id === decoded.id) {
            const [requests] = await pool.query(`SELECT r.*, a.name as student_name, a.username as student_email
         FROM team_join_requests r
         JOIN auth a ON r.student_id = a.id
         WHERE r.team_id = ? AND r.status = 'pending'`, [teamId]);
            pendingRequests = requests;
        }
        res.json({
            team: rows[0],
            pendingRequests,
            isLeader: rows[0].team_leader_id === decoded.id
        });
    }
    catch (err) {
        console.error("GetTeamDetails Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Update Team (leader only)
app.put("/api/updateTeam/:teamId", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const { teamId } = req.params;
        const { teamName, memberCount } = req.body;
        // Verify user is team leader
        const [team] = await pool.query("SELECT team_leader_id FROM teams WHERE t_id = ?", [teamId]);
        if (!team.length) {
            return res.status(404).json({ error: "Team not found" });
        }
        if (team[0].team_leader_id !== decoded.id) {
            return res.status(403).json({ error: "Only team leader can update team" });
        }
        await pool.query("UPDATE teams SET t_name = ?, member_count = ? WHERE t_id = ?", [teamName, memberCount, teamId]);
        res.json({ message: "Team updated successfully" });
    }
    catch (err) {
        console.error("UpdateTeam Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Delete Team (leader only)
app.delete("/api/deleteTeam/:teamId", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const { teamId } = req.params;
        // Verify user is team leader
        const [team] = await pool.query("SELECT team_leader_id FROM teams WHERE t_id = ?", [teamId]);
        if (!team.length) {
            return res.status(404).json({ error: "Team not found" });
        }
        if (team[0].team_leader_id !== decoded.id) {
            return res.status(403).json({ error: "Only team leader can delete team" });
        }
        await pool.query("DELETE FROM teams WHERE t_id = ?", [teamId]);
        res.json({ message: "Team deleted successfully" });
    }
    catch (err) {
        console.error("DeleteTeam Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Remove Member from Team (leader only)
app.put("/api/removeMember/:teamId/:studentId", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const { teamId, studentId } = req.params;
        // Verify user is team leader
        const [team] = await pool.query("SELECT team_leader_id, current_members FROM teams WHERE t_id = ?", [teamId]);
        if (!team.length) {
            return res.status(404).json({ error: "Team not found" });
        }
        if (team[0].team_leader_id !== decoded.id) {
            return res.status(403).json({ error: "Only team leader can remove members" });
        }
        // Remove member from current_members — parse JSON string for MariaDB compatibility
        let members = team[0].current_members || [];
        if (typeof members === "string") {
            try {
                members = JSON.parse(members);
            }
            catch {
                members = [];
            }
        }
        if (!Array.isArray(members))
            members = [];
        const updatedMembers = members.filter((m) => m.id !== parseInt(studentId));
        await pool.query("UPDATE teams SET current_members = ? WHERE t_id = ?", [JSON.stringify(updatedMembers), teamId]);
        res.json({ message: "Member removed successfully" });
    }
    catch (err) {
        console.error("RemoveMember Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Leave Team
app.post("/api/leaveTeam/:teamId", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const { teamId } = req.params;
        const [team] = await pool.query("SELECT team_leader_id, current_members FROM teams WHERE t_id = ?", [teamId]);
        if (!team.length) {
            return res.status(404).json({ error: "Team not found" });
        }
        if (team[0].team_leader_id === decoded.id) {
            return res.status(400).json({ error: "Team leader cannot leave team. Delete team instead." });
        }
        // Remove user from current_members — parse JSON string for MariaDB compatibility
        let members = team[0].current_members || [];
        if (typeof members === "string") {
            try {
                members = JSON.parse(members);
            }
            catch {
                members = [];
            }
        }
        if (!Array.isArray(members))
            members = [];
        const updatedMembers = members.filter((m) => m.id !== decoded.id);
        await pool.query("UPDATE teams SET current_members = ? WHERE t_id = ?", [JSON.stringify(updatedMembers), teamId]);
        res.json({ message: "Left team successfully" });
    }
    catch (err) {
        console.error("LeaveTeam Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// =====================================================
// TEAM DISCOVERY ENDPOINTS
// =====================================================
// Search Teams
app.get("/api/searchTeams", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const { query, type } = req.query; // type: 'name' or 'skills'
        let sql = `SELECT t.*, a.name as leader_name 
               FROM teams t
               JOIN auth a ON t.team_leader_id = a.id`;
        const params = [];
        if (query && type === "name") {
            sql += " WHERE t.t_name LIKE ?";
            params.push(`%${query}%`);
        }
        else if (query && type === "skills") {
            // Support multiple skills separated by comma
            const skillsArray = String(query).split(',').map(s => s.trim().toLowerCase()).filter(s => s);
            if (skillsArray.length > 0) {
                // Build WHERE clause to match any of the provided skills
                const conditions = skillsArray.map(() => "LOWER(t.t_skills_req) LIKE ?").join(" OR ");
                sql += ` WHERE (${conditions})`;
                // Add parameters for each skill
                skillsArray.forEach(skill => {
                    params.push(`%${skill}%`);
                });
            }
        }
        sql += " ORDER BY t.created_at DESC LIMIT 50";
        const [rows] = await pool.query(sql, params);
        res.json({ teams: rows });
    }
    catch (err) {
        console.error("SearchTeams Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Request to Join Team
app.post("/api/requestJoinTeam/:teamId", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const { teamId } = req.params;
        // Check if team exists
        const [team] = await pool.query("SELECT * FROM teams WHERE t_id = ?", [teamId]);
        if (!team.length) {
            return res.status(404).json({ error: "Team not found" });
        }
        // Check if already a member — parse JSON string for MariaDB compatibility
        let members = team[0].current_members || [];
        if (typeof members === "string") {
            try {
                members = JSON.parse(members);
            }
            catch {
                members = [];
            }
        }
        if (!Array.isArray(members))
            members = [];
        if (members.some((m) => m.id === decoded.id)) {
            return res.status(400).json({ error: "Already a member of this team" });
        }
        // Check if team is full
        if (members.length >= team[0].member_count) {
            return res.status(400).json({ error: "Team is full" });
        }
        // Create join request
        await pool.query("INSERT INTO team_join_requests (team_id, student_id, status) VALUES (?, ?, 'pending')", [teamId, decoded.id]);
        res.json({ message: "Join request sent successfully" });
    }
    catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Join request already exists" });
        }
        console.error("RequestJoinTeam Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Get Team Join Requests (leader only)
app.get("/api/getTeamRequests/:teamId", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const { teamId } = req.params;
        // Verify user is team leader
        const [team] = await pool.query("SELECT team_leader_id FROM teams WHERE t_id = ?", [teamId]);
        if (!team.length) {
            return res.status(404).json({ error: "Team not found" });
        }
        if (team[0].team_leader_id !== decoded.id) {
            return res.status(403).json({ error: "Only team leader can view requests" });
        }
        const [rows] = await pool.query(`SELECT r.*, a.name as student_name, a.username as student_email
       FROM team_join_requests r
       JOIN auth a ON r.student_id = a.id
       WHERE r.team_id = ? AND r.status = 'pending'`, [teamId]);
        res.json({ requests: rows });
    }
    catch (err) {
        console.error("GetTeamRequests Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Approve Join Request (leader only)
app.put("/api/approveRequest/:requestId", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const { requestId } = req.params;
        // Get request details
        const [request] = await pool.query(`SELECT r.*, a.name as student_name
       FROM team_join_requests r
       JOIN auth a ON r.student_id = a.id
       WHERE r.id = ?`, [requestId]);
        if (!request.length) {
            return res.status(404).json({ error: "Request not found" });
        }
        // Verify user is team leader
        const [team] = await pool.query("SELECT team_leader_id, current_members, member_count FROM teams WHERE t_id = ?", [request[0].team_id]);
        if (!team.length) {
            return res.status(404).json({ error: "Team not found" });
        }
        if (team[0].team_leader_id !== decoded.id) {
            return res.status(403).json({ error: "Only team leader can approve requests" });
        }
        // Check if team is full — parse JSON string for MariaDB compatibility
        let members = team[0].current_members || [];
        if (typeof members === "string") {
            try {
                members = JSON.parse(members);
            }
            catch {
                members = [];
            }
        }
        if (!Array.isArray(members))
            members = [];
        if (members.length >= team[0].member_count) {
            return res.status(400).json({ error: "Team is full" });
        }
        // Add student to team
        members.push({
            id: request[0].student_id,
            name: request[0].student_name,
            role: "member"
        });
        await pool.query("UPDATE teams SET current_members = ? WHERE t_id = ?", [JSON.stringify(members), request[0].team_id]);
        // Update request status
        await pool.query("UPDATE team_join_requests SET status = 'approved' WHERE id = ?", [requestId]);
        res.json({ message: "Request approved successfully" });
    }
    catch (err) {
        console.error("ApproveRequest Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Reject Join Request (leader only)
app.put("/api/rejectRequest/:requestId", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const { requestId } = req.params;
        // Get request details
        const [request] = await pool.query("SELECT * FROM team_join_requests WHERE id = ?", [requestId]);
        if (!request.length) {
            return res.status(404).json({ error: "Request not found" });
        }
        // Verify user is team leader
        const [team] = await pool.query("SELECT team_leader_id FROM teams WHERE t_id = ?", [request[0].team_id]);
        if (!team.length) {
            return res.status(404).json({ error: "Team not found" });
        }
        if (team[0].team_leader_id !== decoded.id) {
            return res.status(403).json({ error: "Only team leader can reject requests" });
        }
        // Update request status
        await pool.query("UPDATE team_join_requests SET status = 'rejected' WHERE id = ?", [requestId]);
        res.json({ message: "Request rejected successfully" });
    }
    catch (err) {
        console.error("RejectRequest Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// =====================================================
// ML RECOMMENDATION ENDPOINT
// =====================================================
// Get Team Recommendations
app.get("/api/getTeamRecommendations", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Get student's verified skills
        const [skillsRow] = await pool.query("SELECT verified_skills FROM skills WHERE student_id = ?", [decoded.id]);
        // Parse verified_skills — MariaDB returns JSON columns as strings
        let verifiedSkillsParsed = skillsRow[0].verified_skills;
        if (typeof verifiedSkillsParsed === "string") {
            try {
                verifiedSkillsParsed = JSON.parse(verifiedSkillsParsed);
            }
            catch {
                verifiedSkillsParsed = [];
            }
        }
        if (!Array.isArray(verifiedSkillsParsed))
            verifiedSkillsParsed = [];
        if (!skillsRow.length || !verifiedSkillsParsed || verifiedSkillsParsed.length === 0) {
            return res.json({
                recommendations: [],
                message: "No verified skills found. Add and verify skills to get recommendations."
            });
        }
        const verifiedSkills = verifiedSkillsParsed.join(" ");
        // Call ML API for team recommendations
        const mlApiUrl = process.env.ML_API_URL || "http://127.0.0.1:5002";
        const mlResponse = await fetch(`${mlApiUrl}/ml/recommend`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                skills: verifiedSkills,
                top_n: 5,
                min_similarity: 0.1
            })
        });
        if (!mlResponse.ok) {
            console.error("ML API returned error:", mlResponse.status);
            return res.json({
                student_skills: verifiedSkills,
                recommendations: [],
                total_evaluated: 0,
                message: "ML service returned an error. Please try again later."
            });
        }
        const mlData = await mlResponse.json();
        res.json({
            student_skills: verifiedSkills,
            recommendations: mlData.recommendations || [],
            total_evaluated: mlData.total_teams_evaluated || 0
        });
    }
    catch (err) {
        console.error("GetTeamRecommendations Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// =====================================================
// SME DASHBOARD ENDPOINTS
// =====================================================
// Create tables if they don't exist
async function initSMETables() {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        p_id INT PRIMARY KEY AUTO_INCREMENT,
        sme_id INT NOT NULL,
        p_name VARCHAR(255) NOT NULL,
        p_description TEXT,
        p_time_period VARCHAR(100),
        p_skills_req JSON NOT NULL,
        p_value_type ENUM('fixed', 'discuss') DEFAULT 'discuss',
        p_value_amount DECIMAL(10, 2),
        hired_team_id INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (sme_id) REFERENCES auth(id) ON DELETE CASCADE,
        INDEX idx_sme_id (sme_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
        await pool.query(`
      CREATE TABLE IF NOT EXISTS hiring_requests (
        hr_id INT PRIMARY KEY AUTO_INCREMENT,
        project_id INT NOT NULL,
        team_id INT NOT NULL,
        sme_id INT NOT NULL,
        message TEXT,
        sme_email VARCHAR(255),
        sme_contact VARCHAR(100),
        status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        responded_at TIMESTAMP NULL,
        FOREIGN KEY (project_id) REFERENCES projects(p_id) ON DELETE CASCADE,
        FOREIGN KEY (team_id) REFERENCES teams(t_id) ON DELETE CASCADE,
        FOREIGN KEY (sme_id) REFERENCES auth(id) ON DELETE CASCADE,
        INDEX idx_team_id (team_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
        console.log("✅ SME dashboard tables initialized");
    }
    catch (err) {
        console.error("SME tables initialization error:", err);
    }
}
// initSMETables(); // Tables already created manually with root credentials
// SME Profile Management
app.get("/api/sme/profile", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.role?.toLowerCase() !== "sme") {
            return res.status(403).json({ error: "Access denied" });
        }
        const [rows] = await pool.query("SELECT id, name, username as email, category FROM auth WHERE id = ?", [decoded.id]);
        if (!rows.length) {
            return res.status(404).json({ error: "Profile not found" });
        }
        res.json({ profile: rows[0] });
    }
    catch (err) {
        console.error("Get SME Profile Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
app.put("/api/sme/profile", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.role?.toLowerCase() !== "sme") {
            return res.status(403).json({ error: "Access denied" });
        }
        const { name, email } = req.body;
        await pool.query("UPDATE auth SET name = ?, username = ? WHERE id = ?", [name, email, decoded.id]);
        res.json({ message: "Profile updated successfully" });
    }
    catch (err) {
        console.error("Update SME Profile Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
app.delete("/api/sme/profile", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.role?.toLowerCase() !== "sme") {
            return res.status(403).json({ error: "Access denied" });
        }
        await pool.query("DELETE FROM auth WHERE id = ?", [decoded.id]);
        res.json({ message: "Account deleted successfully" });
    }
    catch (err) {
        console.error("Delete SME Profile Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Project CRUD Operations
app.post("/api/projects", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.role?.toLowerCase() !== "sme") {
            return res.status(403).json({ error: "Access denied" });
        }
        const { p_name, p_description, p_time_period, p_skills_req, p_value_type, p_value_amount } = req.body;
        if (!p_name || !p_skills_req || !Array.isArray(p_skills_req)) {
            return res.status(400).json({ error: "Name and skills are required" });
        }
        const [result] = await pool.query(`INSERT INTO projects (sme_id, p_name, p_description, p_time_period, p_skills_req, p_value_type, p_value_amount)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, [
            decoded.id,
            p_name,
            p_description,
            p_time_period,
            JSON.stringify(p_skills_req),
            p_value_type || 'discuss',
            p_value_amount
        ]);
        res.json({ message: "Project created successfully", p_id: result.insertId });
    }
    catch (err) {
        console.error("Create Project Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
app.get("/api/projects", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.role?.toLowerCase() !== "sme") {
            return res.status(403).json({ error: "Access denied" });
        }
        const [projects] = await pool.query(`SELECT p.*, t.t_name as hired_team_name, a.name as leader_name
       FROM projects p
       LEFT JOIN teams t ON p.hired_team_id = t.t_id
       LEFT JOIN auth a ON t.team_leader_id = a.id
       WHERE p.sme_id = ?
       ORDER BY p.created_at DESC`, [decoded.id]);
        // Parse JSON skills
        projects.forEach((p) => {
            if (typeof p.p_skills_req === 'string') {
                p.p_skills_req = JSON.parse(p.p_skills_req);
            }
        });
        res.json({ projects });
    }
    catch (err) {
        console.error("Get Projects Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
app.get("/api/projects/:id", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const [projects] = await pool.query(`SELECT p.*, t.t_name as hired_team_name, t.t_skills_req as hired_team_skills, 
              a.name as leader_name, a.username as leader_email
       FROM projects p
       LEFT JOIN teams t ON p.hired_team_id = t.t_id
       LEFT JOIN auth a ON t.team_leader_id = a.id
       WHERE p.p_id = ? AND p.sme_id = ?`, [req.params.id, decoded.id]);
        if (!projects.length) {
            return res.status(404).json({ error: "Project not found" });
        }
        const project = projects[0];
        if (typeof project.p_skills_req === 'string') {
            project.p_skills_req = JSON.parse(project.p_skills_req);
        }
        res.json({ project });
    }
    catch (err) {
        console.error("Get Project Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
app.put("/api/projects/:id", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const { p_name, p_description, p_time_period, p_skills_req, p_value_type, p_value_amount } = req.body;
        await pool.query(`UPDATE projects 
       SET p_name = ?, p_description = ?, p_time_period = ?, 
           p_skills_req = ?, p_value_type = ?, p_value_amount = ?
       WHERE p_id = ? AND sme_id = ?`, [
            p_name,
            p_description,
            p_time_period,
            JSON.stringify(p_skills_req),
            p_value_type,
            p_value_amount,
            req.params.id,
            decoded.id
        ]);
        res.json({ message: "Project updated successfully" });
    }
    catch (err) {
        console.error("Update Project Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
app.delete("/api/projects/:id", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        await pool.query("DELETE FROM projects WHERE p_id = ? AND sme_id = ?", [req.params.id, decoded.id]);
        res.json({ message: "Project deleted successfully" });
    }
    catch (err) {
        console.error("Delete Project Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// AI Project Matcher with Fallback
app.get("/api/projects/:id/recommendations", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const [projects] = await pool.query("SELECT p_skills_req FROM projects WHERE p_id = ? AND sme_id = ?", [req.params.id, decoded.id]);
        if (!projects.length) {
            return res.status(404).json({ error: "Project not found" });
        }
        let projectSkills = projects[0].p_skills_req;
        if (typeof projectSkills === 'string') {
            projectSkills = JSON.parse(projectSkills);
        }
        const skillsString = projectSkills.join(" ");
        // Call ML API for project-team matching
        const mlApiUrl = process.env.ML_API_URL_PROJECT || "http://127.0.0.1:5003";
        const mlResponse = await fetch(`${mlApiUrl}/ml/recommend`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ skills: skillsString, top_n: 5 })
        });
        if (!mlResponse.ok) {
            console.error("ML API (Project) returned error:", mlResponse.status);
            return res.json({
                project_skills: skillsString,
                recommendations: [],
                total_evaluated: 0,
                message: "ML service returned an error. Please try again later."
            });
        }
        const mlData = await mlResponse.json();
        res.json({
            project_skills: skillsString,
            recommendations: mlData.recommendations || [],
            total_evaluated: mlData.total_teams_evaluated || 0
        });
    }
    catch (err) {
        console.error("Get Recommendations Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
// Hiring Workflow
app.post("/api/projects/:id/send-request", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const { team_id, message, sme_contact } = req.body;
        const [sme] = await pool.query("SELECT username FROM auth WHERE id = ?", [decoded.id]);
        await pool.query(`INSERT INTO hiring_requests (project_id, team_id, sme_id, message, sme_email, sme_contact)
       VALUES (?, ?, ?, ?, ?, ?)`, [req.params.id, team_id, decoded.id, message, sme[0].username, sme_contact]);
        res.json({ message: "Hiring request sent successfully" });
    }
    catch (err) {
        console.error("Send Hiring Request Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
app.get("/api/teams/hiring-requests", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const [requests] = await pool.query(`SELECT hr.*, p.p_name, p.p_description, p.p_time_period, p.p_skills_req,
              p.p_value_type, p.p_value_amount, a.name as sme_name
       FROM hiring_requests hr
       JOIN projects p ON hr.project_id = p.p_id
       JOIN auth a ON hr.sme_id = a.id
       WHERE hr.team_id IN (SELECT t_id FROM teams WHERE team_leader_id = ?)
       ORDER BY hr.created_at DESC`, [decoded.id]);
        requests.forEach((r) => {
            if (typeof r.p_skills_req === 'string') {
                r.p_skills_req = JSON.parse(r.p_skills_req);
            }
        });
        res.json({ requests });
    }
    catch (err) {
        console.error("Get Hiring Requests Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
app.post("/api/teams/hiring-requests/:id/accept", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const [request] = await pool.query(`SELECT hr.*, t.team_leader_id FROM hiring_requests hr
       JOIN teams t ON hr.team_id = t.t_id
       WHERE hr.hr_id = ?`, [req.params.id]);
        if (!request.length || request[0].team_leader_id !== decoded.id) {
            return res.status(403).json({ error: "Access denied" });
        }
        const projectId = request[0].project_id;
        const teamId = request[0].team_id;
        // Accept this request
        await pool.query("UPDATE hiring_requests SET status = 'accepted', responded_at = NOW() WHERE hr_id = ?", [req.params.id]);
        // Update project with hired team
        await pool.query("UPDATE projects SET hired_team_id = ? WHERE p_id = ?", [teamId, projectId]);
        // Reject other pending requests for this project
        await pool.query("UPDATE hiring_requests SET status = 'rejected', responded_at = NOW() WHERE project_id = ? AND hr_id != ?", [projectId, req.params.id]);
        res.json({ message: "Hiring request accepted successfully" });
    }
    catch (err) {
        console.error("Accept Hiring Request Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
app.post("/api/teams/hiring-requests/:id/reject", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing token" });
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const [request] = await pool.query(`SELECT hr.*, t.team_leader_id FROM hiring_requests hr
       JOIN teams t ON hr.team_id = t.t_id
       WHERE hr.hr_id = ?`, [req.params.id]);
        if (!request.length || request[0].team_leader_id !== decoded.id) {
            return res.status(403).json({ error: "Access denied" });
        }
        await pool.query("UPDATE hiring_requests SET status = 'rejected', responded_at = NOW() WHERE hr_id = ?", [req.params.id]);
        res.json({ message: "Hiring request rejected" });
    }
    catch (err) {
        console.error("Reject Hiring Request Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map