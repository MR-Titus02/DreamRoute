import api from "axios";

export async function fetchRoadmap(userId) {
  const res = await api.post("http://localhost:5000/api/roadmap", { userId });
  return res.data;
}