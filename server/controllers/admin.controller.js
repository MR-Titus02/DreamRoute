import pool from '../config/db.js';
import { logUserAction } from '../utils/logger.js';
import bcrypt from "bcryptjs"; // for password hashing
import { sendTemplateEmail } from '../utils/sendEmail.js';

export const changeUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (!user.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user role
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);

    // If role changed to institution and not already in institutions table
    if (role === 'institution') {
      const [institution] = await pool.query('SELECT * FROM institutions WHERE user_id = ?', [id]);
      if (!institution.length) {
        await pool.query('INSERT INTO institutions (user_id) VALUES (?)', [id]);
      }
    }

    res.status(200).json({ message: 'User role updated successfully' });
    await logUserAction(req.user.userId, 'Changed user role', JSON.stringify({ id, role }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while updating user role' });
    await logUserAction(req.user.userId, 'Change user role failed', JSON.stringify({ id, role }));
  }
};





// Other imports and createInstitutionRequest above...

export const getAllRequests = async (req, res) => {
  try {
    const [requests] = await pool.query(
      "SELECT * FROM institution_requests ORDER BY created_at DESC"
    );
    res.json(requests);
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const approveRequest = async (req, res) => {
  const requestId = req.params.id;

  try {
    // Fetch the request
    const [rows] = await pool.query(
      "SELECT * FROM institution_requests WHERE id = ? AND status = 'pending'",
      [requestId]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Request not found or already processed." });

    const request = rows[0];

    // Generate a random password for the new user (or use a better approach)
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Create user
    const [userResult] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'institution')",
      [request.name, request.email, hashedPassword]
    );
    const newUserId = userResult.insertId;

    // Create institution linked to the user
    await pool.query(
      "INSERT INTO institutions (user_id, name, email, description, address) VALUES (?, ?, ?, ?, ?)",
      [newUserId, request.name, request.email, request.description, request.address]
    );

    // Update request status to approved
    await pool.query(
      "UPDATE institution_requests SET status = 'approved' WHERE id = ?",
      [requestId]
    );

    await sendTemplateEmail(
      request.email,
      "institutionApproved",
      {
        name: request.name,
        email: request.email,
        password: randomPassword, // the one used when creating the user
        loginUrl: "http://localhost:5173/login" // change to actual frontend login URL
      }
    );

    res.json({
      message: "Institution request approved and user created.",
      loginEmail: request.email,
      password: randomPassword, // WARNING: For demo only, don’t return password in production!
    });
  } catch (err) {
    console.error("Error approving request:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const rejectRequest = async (req, res) => {
  const requestId = req.params.id;

  try {
    const [result] = await pool.query(
      "UPDATE institution_requests SET status = 'rejected' WHERE id = ? AND status = 'pending'",
      [requestId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Request not found or already processed." });

    res.json({ message: "Institution request rejected." });
  } catch (err) {
    console.error("Error rejecting request:", err);
    res.status(500).json({ error: "Server error" });
  }
};
