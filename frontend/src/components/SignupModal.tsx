"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    Button,
    TextField,
    Tabs,
    Tab,
    Typography,
    Box,
    Stack,
    IconButton,
} from "@mui/material";
import { Close, School, Rocket, Business } from "@mui/icons-material";

type SignupModalProps = {
    open: boolean;
    onClose: () => void;
    onSwitchToSignIn: () => void;
};

export default function SignupModal({ open, onClose, onSwitchToSignIn }: SignupModalProps) {
    const [roleTab, setRoleTab] = useState(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [department, setDepartment] = useState("");
    const [academicYear, setAcademicYear] = useState("");

    // Company fields
    const [companyRegistrationNo, setCompanyRegistrationNo] = useState("");
    const [companyType, setCompanyType] = useState("");
    const [companyIndustry, setCompanyIndustry] = useState("");

    // SME fields
    const [smeRegistrationNo, setSmeRegistrationNo] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [smeIndustry, setSmeIndustry] = useState("");

    const getRole = () => {
        if (roleTab === 0) return "Student";
        if (roleTab === 1) return "SME";
        return "Company";
    };

    const handleClose = () => {
        setEmail("");
        setPassword("");
        setName("");
        setDepartment("");
        setAcademicYear("");
        setCompanyRegistrationNo("");
        setCompanyType("");
        setCompanyIndustry("");
        setSmeRegistrationNo("");
        setBusinessType("");
        setSmeIndustry("");
        setRoleTab(0);
        onClose();
    };

    interface SignupPayload {
        role: string;
        name: string;
        email: string;
        password: string;
        department?: string;
        academicYear?: string;
        companyRegistrationNo?: string;
        companyType?: string;
        industry?: string;
        businessType?: string;
    }

    const handleSignUp = async () => {
        const payload: SignupPayload = {
            role: getRole(),
            name,
            email,
            password,
        };

        if (getRole() === "Student") {
            payload.department = department;
            payload.academicYear = academicYear;
        }

        if (getRole() === "Company") {
            payload.companyRegistrationNo = companyRegistrationNo;
            payload.companyType = companyType;
            payload.industry = companyIndustry;
        }

        if (getRole() === "SME") {
            payload.companyRegistrationNo = smeRegistrationNo;
            payload.businessType = businessType;
            payload.industry = smeIndustry;
        }

        try {
            const res = await fetch("http://localhost:5000/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Signup successful! Please sign in.");
                onClose();
                onSwitchToSignIn();
            } else {
                alert(data.error || "Signup failed.");
            }
        } catch (err) {
            console.error(err);
            alert("Error signing up.");
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "16px",
                    overflow: "hidden",
                },
            }}
        >
            {/* Branded Header */}
            <Box
                sx={{
                    background: "linear-gradient(135deg, #1e1b4b, #312e81, #3730a3)",
                    p: { xs: 3, sm: 4 },
                    textAlign: "center",
                    position: "relative",
                }}
            >
                <IconButton
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "rgba(255,255,255,0.6)",
                        "&:hover": { color: "white" },
                    }}
                >
                    <Close />
                </IconButton>
                <Typography variant="h5" sx={{ color: "white", fontWeight: 800, mb: 0.5 }}>
                    Join SkillNet
                </Typography>
                <Typography variant="body2" sx={{ color: "#a5b4fc" }}>
                    Create your account and start building your future
                </Typography>
            </Box>

            <DialogContent sx={{ p: { xs: 2.5, sm: 4 }, pt: { xs: 2, sm: 3 } }}>
                <Tabs
                    value={roleTab}
                    onChange={(_, v) => setRoleTab(v)}
                    variant="fullWidth"
                    sx={{
                        mb: 3,
                        "& .MuiTab-root": {
                            minHeight: 48,
                            fontWeight: 600,
                            fontSize: { xs: "0.8rem", sm: "0.875rem" },
                        },
                    }}
                >
                    <Tab icon={<School sx={{ fontSize: 18 }} />} iconPosition="start" label="Student" />
                    <Tab icon={<Rocket sx={{ fontSize: 18 }} />} iconPosition="start" label="SME" />
                    <Tab icon={<Business sx={{ fontSize: 18 }} />} iconPosition="start" label="Company" />
                </Tabs>

                <Stack spacing={2}>
                    <TextField
                        label="Full Name"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        size="medium"
                        inputProps={{ autoComplete: "new-password" }}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        size="medium"
                        inputProps={{ autoComplete: "new-password" }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        size="medium"
                        inputProps={{ autoComplete: "new-password" }}
                    />

                    {/* Student fields */}
                    {getRole() === "Student" && (
                        <>
                            <TextField
                                label="Department"
                                fullWidth
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                size="medium"
                                placeholder="e.g., Computer Science"
                            />
                            <TextField
                                label="Academic Year"
                                fullWidth
                                value={academicYear}
                                onChange={(e) => setAcademicYear(e.target.value)}
                                size="medium"
                                placeholder="e.g., 3rd Year"
                            />
                        </>
                    )}

                    {/* Company fields */}
                    {getRole() === "Company" && (
                        <>
                            <TextField
                                label="Company Registration Number"
                                fullWidth
                                value={companyRegistrationNo}
                                onChange={(e) => setCompanyRegistrationNo(e.target.value)}
                                size="medium"
                            />
                            <TextField
                                select
                                label="Company Type"
                                fullWidth
                                value={companyType}
                                onChange={(e) => setCompanyType(e.target.value)}
                                size="medium"
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
                                value={companyIndustry}
                                onChange={(e) => setCompanyIndustry(e.target.value)}
                                size="medium"
                                placeholder="e.g., Technology, Finance"
                            />
                        </>
                    )}

                    {/* SME fields */}
                    {getRole() === "SME" && (
                        <>
                            <TextField
                                label="Business Registration Number"
                                fullWidth
                                value={smeRegistrationNo}
                                onChange={(e) => setSmeRegistrationNo(e.target.value)}
                                size="medium"
                            />
                            <TextField
                                label="Business Type"
                                fullWidth
                                value={businessType}
                                onChange={(e) => setBusinessType(e.target.value)}
                                size="medium"
                                placeholder="e.g., Consulting, Development"
                            />
                            <TextField
                                label="Industry"
                                fullWidth
                                value={smeIndustry}
                                onChange={(e) => setSmeIndustry(e.target.value)}
                                size="medium"
                                placeholder="e.g., IT Services, Education"
                            />
                        </>
                    )}

                    <Button
                        variant="contained"
                        onClick={handleSignUp}
                        fullWidth
                        disableElevation
                        sx={{
                            py: 1.5,
                            fontWeight: 700,
                            fontSize: "1rem",
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            "&:hover": { background: "linear-gradient(135deg, #4f46e5, #7c3aed)" },
                        }}
                    >
                        Create Account
                    </Button>
                </Stack>

                <Typography
                    variant="body2"
                    sx={{ textAlign: "center", mt: 3, color: "#64748b" }}
                >
                    Already have an account?{" "}
                    <Box
                        component="span"
                        onClick={() => { handleClose(); onSwitchToSignIn(); }}
                        sx={{
                            color: "#6366f1",
                            fontWeight: 600,
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        Sign In
                    </Box>
                </Typography>
            </DialogContent>
        </Dialog>
    );
}
