import api from "axios";

export async function fetchRoadmap(userId) {
  try {
    const res = await api.get(`http://localhost:5000/api/roadmap/${userId}`);
    return res.data;
  } catch (err) {
    // fallback to generation if not found
    if (err.response?.status === 404) {
      const res = await api.post("http://localhost:5000/api/roadmap", { userId });
      return res.data;
    } else {
      throw err;
    }
  }
}


export async function fetchProgress(userId) {
  const res = await api.get(`"http://localhost:5000/api/progress/${userId}"`);
  return Object.entries(res.data).map(([step_id, status]) => ({ step_id, status }));
};

export async function updateProgress({ userId, stepId, status }) {
  await api.post("http://localhost:5000/api/progress/", { userId, stepId, status });
}