"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppBar, Toolbar, Button, Container, Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

export default function Header() {
    const { user, logout } = useAuth();
    const [openLogin, setOpenLogin] = useState(false);
    const [openSignup, setOpenSignup] = useState(false);
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    const isLandingPage = pathname === "/";

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "About", path: "/#about" },
        { name: "Features", path: "/#features" },
    ];

    // Always show a solid header
    const headerBg = scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.98)";
    const headerShadow = scrolled ? "0 1px 3px rgba(0,0,0,0.08)" : "0 1px 0 rgba(226,232,240,0.6)";
    const textColor = "#334155";
    const logoColor = "#6366f1";

    return (
        <>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    backgroundColor: headerBg,
                    backdropFilter: scrolled || !isLandingPage ? "blur(20px)" : "none",
                    boxShadow: headerShadow,
                    borderBottom: scrolled || !isLandingPage ? "1px solid rgba(226,232,240,0.5)" : "none",
                    transition: "all 0.3s ease",
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 70 } }}>
                        {/* Logo Desktop */}
                        <Typography
                            variant="h6"
                            noWrap
                            component={Link}
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: "none", md: "flex" },
                                fontWeight: 800,
                                fontSize: "1.4rem",
                                color: logoColor,
                                textDecoration: "none",
                                letterSpacing: ".05rem",
                                transition: "color 0.3s",
                            }}
                        >
                            SkillNet
                        </Typography>

                        {/* Mobile Menu */}
                        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                            <IconButton
                                size="large"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                sx={{ color: textColor }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                                keepMounted
                                transformOrigin={{ vertical: "top", horizontal: "left" }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{ display: { xs: "block", md: "none" } }}
                            >
                                {navLinks.map((link) => (
                                    <MenuItem key={link.name} onClick={handleCloseNavMenu} component={Link} href={link.path}>
                                        <Typography textAlign="center">{link.name}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>

                        {/* Logo Mobile */}
                        <Typography
                            variant="h5"
                            noWrap
                            component={Link}
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: "flex", md: "none" },
                                flexGrow: 1,
                                fontWeight: 800,
                                color: logoColor,
                                textDecoration: "none",
                                transition: "color 0.3s",
                            }}
                        >
                            SkillNet
                        </Typography>

                        {/* Desktop Nav */}
                        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "center", gap: 1 }}>
                            {navLinks.map((link) => (
                                <Button
                                    key={link.name}
                                    component={Link}
                                    href={link.path}
                                    sx={{
                                        color: textColor,
                                        fontWeight: 500,
                                        fontSize: "0.95rem",
                                        px: 2,
                                        position: "relative",
                                        transition: "color 0.3s",
                                        "&:hover": {
                                            backgroundColor: "transparent",
                                            color: isLandingPage && !scrolled ? "#c7d2fe" : "#6366f1",
                                        },
                                        "&::after": {
                                            content: '""',
                                            position: "absolute",
                                            bottom: 4,
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            width: 0,
                                            height: "2px",
                                            backgroundColor: isLandingPage && !scrolled ? "#c7d2fe" : "#6366f1",
                                            transition: "width 0.3s",
                                            borderRadius: "1px",
                                        },
                                        "&:hover::after": { width: "60%" },
                                    }}
                                >
                                    {link.name}
                                </Button>
                            ))}
                        </Box>

                        {/* Auth Buttons */}
                        <Box sx={{ flexGrow: 0 }}>
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            display: { xs: "none", sm: "block" },
                                            fontWeight: 600,
                                            color: textColor,
                                            transition: "color 0.3s",
                                        }}
                                    >
                                        Hello, {user.name}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        onClick={logout}
                                        size="small"
                                        sx={{
                                            borderColor: isLandingPage && !scrolled ? "rgba(255,255,255,0.4)" : undefined,
                                            color: textColor,
                                            transition: "all 0.3s",
                                            "&:hover": {
                                                borderColor: isLandingPage && !scrolled ? "white" : undefined,
                                            },
                                        }}
                                    >
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setOpenLogin(true)}
                                        sx={{
                                            color: textColor,
                                            fontWeight: 500,
                                            transition: "color 0.3s",
                                            "&:hover": {
                                                backgroundColor: "transparent",
                                                color: "#6366f1",
                                            },
                                        }}
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => setOpenSignup(true)}
                                        disableElevation
                                        sx={{
                                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                            border: "none",
                                            backdropFilter: "none",
                                            color: "white",
                                            fontWeight: 600,
                                            "&:hover": {
                                                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                                            },
                                            transition: "all 0.3s",
                                            borderRadius: "10px",
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </div>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Spacer to prevent content from hiding behind fixed header */}
            <Box sx={{ height: { xs: 64, md: 70 } }} />

            <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
            <SignupModal
                open={openSignup}
                onClose={() => setOpenSignup(false)}
                onSwitchToSignIn={() => {
                    setOpenSignup(false);
                    setOpenLogin(true);
                }}
            />
        </>
    );
}
