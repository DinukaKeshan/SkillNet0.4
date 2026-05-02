"use client";

import { useState } from "react";
import {
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Divider,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import {
    AccountCircle,
    Edit,
    Lock,
    Logout,
    DeleteForever,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

type UserMenuProps = {
    userName: string;
    userAvatar?: string;
    onProfileUpdate?: () => void;
};

export default function UserMenu({ userName, userAvatar, onProfileUpdate }: UserMenuProps) {
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openChangePassword, setOpenChangePassword] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/");
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            alert("New passwords do not match");
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
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Password changed successfully!");
                setOpenChangePassword(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                alert(data.error || "Failed to change password");
            }
        } catch (err) {
            console.error("Error changing password:", err);
            alert("Error changing password");
        }
    };

    const handleDeleteAccount = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch("http://localhost:5000/api/deleteUser", {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (res.ok) {
                alert("Account deleted successfully");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.push("/");
            } else {
                alert(data.error || "Failed to delete account");
            }
        } catch (err) {
            console.error("Error deleting account:", err);
            alert("Error deleting account");
        }
    };

    return (
        <>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar src={userAvatar} alt={userName}>
                    {userName.charAt(0).toUpperCase()}
                </Avatar>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MenuItem disabled>
                    <ListItemText primary={userName} secondary="View Profile" />
                </MenuItem>
                <Divider />
                <MenuItem
                    onClick={() => {
                        handleMenuClose();
                        if (onProfileUpdate) onProfileUpdate();
                    }}
                >
                    <ListItemIcon>
                        <Edit fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit Profile</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleMenuClose();
                        setOpenChangePassword(true);
                    }}
                >
                    <ListItemIcon>
                        <Lock fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Change Password</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleMenuClose();
                        setOpenDeleteConfirm(true);
                    }}
                    sx={{ color: "error.main" }}
                >
                    <ListItemIcon>
                        <DeleteForever fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete Account</ListItemText>
                </MenuItem>
            </Menu>

            {/* Change Password Dialog */}
            <Dialog open={openChangePassword} onClose={() => setOpenChangePassword(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Current Password"
                        type="password"
                        fullWidth
                        margin="dense"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        margin="dense"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        label="Confirm New Password"
                        type="password"
                        fullWidth
                        margin="dense"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenChangePassword(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleChangePassword}>
                        Change Password
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Account Confirmation Dialog */}
            <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ color: "error.main" }}>Delete Account</DialogTitle>
                <DialogContent>
                    <p>
                        Are you sure you want to delete your account? This action cannot be undone and all your data will be
                        permanently deleted.
                    </p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteConfirm(false)}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleDeleteAccount}>
                        Delete Account
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
