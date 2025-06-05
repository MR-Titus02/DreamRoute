// controllers/institutionController.js
import pool from '../config/db.js';

// Get all institutions
export async function getAllInstitutions(req, res) {
  try {
    const [institutions] = await pool.query('SELECT * FROM institutions');
    res.json(institutions);
  } catch (error) {
    console.error('Error fetching institutions:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get institution by ID
export async function getInstitutionById(req, res) {
  const institutionId = req.params.id;

  try {
    const [rows] = await pool.query('SELECT * FROM institutions WHERE id = ?', [institutionId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Institution not found' });

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching institution:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
