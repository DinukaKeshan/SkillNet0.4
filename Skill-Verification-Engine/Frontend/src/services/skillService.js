// services/skillService.js
import axios from "axios";
import { getToken } from "../utils/auth";

const API = axios.create({
  baseURL: import.meta.env.VITE_SVE_API_URL || "http://localhost:5005/api"
});

API.interceptors.request.use((req) => {
  const token = getToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Existing exports
export const addSkill = (skill) =>
  API.post("/skills", { skill });

export const getSkills = () =>
  API.get("/skills");

// Claim verification badge
export const claimBadge = (skill, score, total, percentage) =>
  API.post("/skills/claim-badge", { skill, score, total, percentage });

// New: get rich skill profiles for student dashboard
export const getStudentSkills = (userId) =>
  API.get(`/skills/student/${userId}/skills`);

// New: get saved roadmap for a student + skill
export const getRoadmap = (userId, skill) =>
  API.get(`/roadmap/${userId}/${skill}`);

// New: get past quiz attempts for progress tracking
export const getQuizHistory = (userId, skill) =>
  API.get(`/quiz/history/${userId}/${skill}`);