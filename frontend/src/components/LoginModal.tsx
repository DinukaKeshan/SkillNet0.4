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
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

type LoginModalProps = {
    open: boolean;
    onClose: () => void;
};

export default function LoginModal({ open, onClose }: LoginModalProps) {
    const [roleTab, setRoleTab] = useState(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const handleClose = () => {
        setEmail("");
        setPassword("");
        setRoleTab(0);
        onClose();
    };

    const handleSignIn = async () => {
        const payload = { email, password };

        try {
            const res = await fetch("http://localhost:5000/api/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.ok) {
                login(data.token, data.user);
                onClose();

                const role = data.user.role ? data.user.role.toLowerCase().trim() : "";
                setTimeout(() => {
                    if (role === "student") router.push("/student");
                    else if (role === "sme") router.push("/sme");
                    else if (role === "company") router.push("/companies");
                    else console.error("Unknown role:", role);
                }, 100);
            } else {
                alert(data.error || "Invalid credentials.");
            }
        } catch (err) {
            console.error(err);
            alert("Error signing in.");
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
                    Welcome Back
                </Typography>
                <Typography variant="body2" sx={{ color: "#a5b4fc" }}>
                    Sign in to your SkillNet account
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

                <Stack spacing={2.5}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined"
                        size="medium"
                        inputProps={{ autoComplete: "new-password" }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant="outlined"
                        size="medium"
                        inputProps={{ autoComplete: "new-password" }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSignIn();
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSignIn}
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
                        Sign In
                    </Button>
                </Stack>

                <Typography
                    variant="body2"
                    sx={{ textAlign: "center", mt: 3, color: "#64748b" }}
                >
                    Don&apos;t have an account? Contact your administrator to get started.
                </Typography>
            </DialogContent>
        </Dialog>
    );
}
