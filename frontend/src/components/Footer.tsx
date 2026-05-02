import { Container, Typography, Box, Stack, IconButton } from "@mui/material";
import Link from "next/link";
import { GitHub, LinkedIn, Language, Email } from "@mui/icons-material";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white pt-16 pb-8 mt-auto">
            <Container maxWidth="lg">
                <div className="grid md:grid-cols-4 gap-10 mb-12">
                    {/* Brand Column */}
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                            Skill
                            <span style={{
                                background: "linear-gradient(135deg, #818cf8, #c084fc)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}>
                                Net
                            </span>
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#94a3b8", lineHeight: 1.8, mb: 3 }}>
                            AI-powered professional networking platform connecting students, SMEs, and companies through intelligent skill matching.
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <IconButton size="small" sx={{ color: "#94a3b8", "&:hover": { color: "#818cf8" } }}>
                                <GitHub fontSize="small" />
                            </IconButton>
                            <IconButton size="small" sx={{ color: "#94a3b8", "&:hover": { color: "#818cf8" } }}>
                                <LinkedIn fontSize="small" />
                            </IconButton>
                            <IconButton size="small" sx={{ color: "#94a3b8", "&:hover": { color: "#818cf8" } }}>
                                <Language fontSize="small" />
                            </IconButton>
                            <IconButton size="small" sx={{ color: "#94a3b8", "&:hover": { color: "#818cf8" } }}>
                                <Email fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Box>

                    {/* Quick Links */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2.5, color: "#e2e8f0", textTransform: "uppercase", letterSpacing: 1.5, fontSize: "0.75rem" }}>
                            Quick Links
                        </Typography>
                        <Stack spacing={1.5}>
                            {[
                                { name: "Home", path: "/" },
                                { name: "Features", path: "/#features" },
                                { name: "About", path: "/#about" },
                                { name: "How It Works", path: "/#features" },
                            ].map((link) => (
                                <Link key={link.name} href={link.path}>
                                    <Typography variant="body2" sx={{ color: "#94a3b8", "&:hover": { color: "#818cf8" }, transition: "color 0.2s", cursor: "pointer" }}>
                                        {link.name}
                                    </Typography>
                                </Link>
                            ))}
                        </Stack>
                    </Box>

                    {/* Platform */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2.5, color: "#e2e8f0", textTransform: "uppercase", letterSpacing: 1.5, fontSize: "0.75rem" }}>
                            Platform
                        </Typography>
                        <Stack spacing={1.5}>
                            {[
                                "Student Dashboard",
                                "SME Dashboard",
                                "Company Dashboard",
                                "AI Recommendations",
                                "Skill Verification",
                            ].map((item) => (
                                <Typography key={item} variant="body2" sx={{ color: "#94a3b8" }}>
                                    {item}
                                </Typography>
                            ))}
                        </Stack>
                    </Box>

                    {/* Technology */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2.5, color: "#e2e8f0", textTransform: "uppercase", letterSpacing: 1.5, fontSize: "0.75rem" }}>
                            Technology
                        </Typography>
                        <Stack spacing={1.5}>
                            {[
                                "Next.js & React",
                                "Node.js & Express",
                                "FastText ML Models",
                                "MySQL Database",
                                "Material UI",
                            ].map((item) => (
                                <Typography key={item} variant="body2" sx={{ color: "#94a3b8" }}>
                                    {item}
                                </Typography>
                            ))}
                        </Stack>
                    </Box>
                </div>

                {/* Divider */}
                <Box sx={{ borderTop: "1px solid #1e293b", pt: 6, mt: 4 }}>
                    <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                            © {new Date().getFullYear()} SkillNet. All rights reserved.
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                            Made with ❤️ as an Academic Project
                        </Typography>
                        <Stack direction="row" spacing={3}>
                            <Typography variant="body2" sx={{ color: "#64748b", "&:hover": { color: "#818cf8" }, cursor: "pointer", transition: "color 0.2s" }}>
                                Privacy Policy
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#64748b", "&:hover": { color: "#818cf8" }, cursor: "pointer", transition: "color 0.2s" }}>
                                Terms of Service
                            </Typography>
                        </Stack>
                    </Stack>
                </Box>
            </Container>
        </footer>
    );
}
