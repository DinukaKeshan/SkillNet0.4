// services/quizService.js
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

export const startQuiz = (skill) =>
  API.post("/quiz/start", { skill });

// nextQuestion now takes quizId + questionIndex (no more answer submission per question)
export const nextQuestion = (quizId, questionIndex) =>
  API.post("/quiz/next", { quizId, questionIndex });

// submitQuiz takes full answers array + time taken
export const submitQuiz = (quizId, answers, timeTakenSec) =>
  API.post("/quiz/submit", { quizId, answers, timeTakenSec });