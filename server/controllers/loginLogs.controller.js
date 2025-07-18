import {
  createLoginLog,
  getAllLogs,
  getLogsByUser,
} from "../models/loginLogsModel.js";

// Log a login attempt
export async function logLoginAttempt(req, res) {
  try {
    const { user_id, status } = req.body;
    const ip_address = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const user_agent = req.headers['user-agent'];

    const logId = await createLoginLog({ user_id, ip_address, user_agent, status });

    res.status(201).json({ message: "Login log created", logId });
  } catch (error) {
    console.error("Error creating login log:", error);
    res.status(500).json({ message: "Error creating login log", error: error.message });
  }
}

// Get all login logs (admin)
export async function getAllLoginLogs(req, res) {
  try {
    const logs = await getAllLogs();
    res.json(logs);
  } catch (error) {
    console.error("Error fetching all login logs:", error);
    res.status(500).json({ message: "Error fetching login logs", error: error.message });
  }
}

// Get logs for a specific user
export async function getLoginLogsByUser(req, res) {
  try {
    const userId = req.params.id;
    const logs = await getLogsByUser(userId);
    res.json(logs);
  } catch (error) {
    console.error("Error fetching user login logs:", error);
    res.status(500).json({ message: "Error fetching user login logs", error: error.message });
  }
}
