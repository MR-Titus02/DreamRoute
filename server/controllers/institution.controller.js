import pool from '../config/db.js';
import logger from '../logger.js';

export const getAllInstitutions = async (req, res) => {
  try {
    const [institutions] = await pool.query('SELECT * FROM institutions');
    res.json(institutions);
  } catch (err) {
    logger.error(`Error fetching institutions: ${err.message}`);
    res.status(500).json({ error: 'Failed to fetch institutions' });
  }
};
