import {
    createLoginLog,
    getAllLogs,
    getLogsByUser,
  } from "../models/loginLogsModel.js";
  
  // Create a log (you can call this from auth controller)
  export async function logLoginAttempt(req, res) {
    try {
      const { user_id, status } = req.body;
      const ip_address = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const user_agent = req.headers['user-agent'];
  
      const logId = await createLoginLog({ user_id, ip_address, user_agent, status });
  
      res.status(201).json({ message: "Login log created", logId });
    } catch (error) {
      res.status(500).json({ message: "Error creating log", error: error.message });
    }
  }
  
  // Get all login logs (admin only)
  export async function getAllLoginLogs(req, res) {
    try {
      const logs = await getAllLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching logs", error: error.message });
    }
  }
  
  // Get login logs for a user (user profile or dashboard)
  export async function getUserLoginLogs(req, res) {
    try {
      const user_id = req.params.id;
      const logs = await getLogsByUser(user_id);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching logs", error: error.message });
    }
  }
  