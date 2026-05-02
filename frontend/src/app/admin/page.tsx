"use client";

import { useState } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from "@mui/material";

type User = {
  id: number;
  name: string;
  email: string;
  role: "student" | "sme" | "company";
  avatar?: string;
};

type Team = {
  id: number;
  name: string;
  members: string[];
};

type Project = {
  id: number;
  name: string;
  owner: string;
};

export default function AdminDashboard() {
  const [tabIndex, setTabIndex] = useState(0);

  // Mock Users
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "John Doe", email: "john@example.com", role: "student", avatar: "https://i.pravatar.cc/150?img=3" },
    { id: 2, name: "Alice Smith", email: "alice@example.com", role: "sme" },
    { id: 3, name: "Bob Corp", email: "contact@bobcorp.com", role: "company" },
  ]);

  // Mock Teams
  const [teams, setTeams] = useState<Team[]>([
    { id: 1, name: "Team Alpha", members: ["John Doe", "Alice Smith"] },
    { id: 2, name: "Team Beta", members: ["Bob Corp"] },
  ]);

  // Mock Projects
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: "Project X", owner: "Team Alpha" },
    { id: 2, name: "Project Y", owner: "Team Beta" },
  ]);

  // Dialog states
  const [openEdit, setOpenEdit] = useState(false);
  const [editItem, setEditItem] = useState<User | Team | Project | null>(null);
  const [editType, setEditType] = useState<"user" | "team" | "project">();

  const handleEdit = (item: User | Team | Project, type: "user" | "team" | "project") => {
    setEditItem(item);
    setEditType(type);
    setOpenEdit(true);
  };

  const handleDelete = (id: number, type: "user" | "team" | "project") => {
    if (type === "user") setUsers(users.filter(u => u.id !== id));
    if (type === "team") setTeams(teams.filter(t => t.id !== id));
    if (type === "project") setProjects(projects.filter(p => p.id !== id));
  };

  const handleSave = () => {
    if (!editItem) return;

    if (editType === "user") {
      setUsers(users.map(u => u.id === editItem.id ? (editItem as User) : u));
    } else if (editType === "team") {
      setTeams(teams.map(t => t.id === editItem.id ? (editItem as Team) : t));
    } else if (editType === "project") {
      setProjects(projects.map(p => p.id === editItem.id ? (editItem as Project) : p));
    }
    setOpenEdit(false);
    setEditItem(null);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Tabs */}
      <Tabs value={tabIndex} onChange={(_, value) => setTabIndex(value)} centered className="mb-6">
        <Tab label="Users" />
        <Tab label="Teams" />
        <Tab label="Projects" />
      </Tabs>

      {/* Users Tab */}
      {tabIndex === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(user => (
            <Card key={user.id}>
              <CardContent className="flex items-center space-x-4">
                {user.avatar && <Avatar src={user.avatar} />}
                <div>
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography variant="body2">{user.email}</Typography>
                  <Chip label={user.role} size="small" className="mt-1" />
                </div>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleEdit(user, "user")}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(user.id, "user")}>Delete</Button>
              </CardActions>
            </Card>
          ))}
        </div>
      )}

      {/* Teams Tab */}
      {tabIndex === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map(team => (
            <Card key={team.id}>
              <CardContent>
                <Typography variant="h6">{team.name}</Typography>
                <Typography variant="body2">Members: {team.members.join(", ")}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleEdit(team, "team")}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(team.id, "team")}>Delete</Button>
              </CardActions>
            </Card>
          ))}
        </div>
      )}

      {/* Projects Tab */}
      {tabIndex === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <Card key={project.id}>
              <CardContent>
                <Typography variant="h6">{project.name}</Typography>
                <Typography variant="body2">Owner: {project.owner}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleEdit(project, "project")}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(project.id, "project")}>Delete</Button>
              </CardActions>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit {editType}</DialogTitle>
        <DialogContent className="space-y-4">
          {editItem && editType === "user" && (
            <>
              <TextField
                label="Name"
                fullWidth
                value={(editItem as User).name}
                onChange={(e) => setEditItem({ ...editItem, name: e.target.value } as User)}
              />
              <TextField
                label="Email"
                fullWidth
                value={(editItem as User).email}
                onChange={(e) => setEditItem({ ...editItem, email: e.target.value } as User)}
              />
            </>
          )}
          {editItem && editType === "team" && (
            <TextField
              label="Team Name"
              fullWidth
              value={(editItem as Team).name}
              onChange={(e) => setEditItem({ ...editItem, name: e.target.value } as Team)}
            />
          )}
          {editItem && editType === "project" && (
            <TextField
              label="Project Name"
              fullWidth
              value={(editItem as Project).name}
              onChange={(e) => setEditItem({ ...editItem, name: e.target.value } as Project)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}
