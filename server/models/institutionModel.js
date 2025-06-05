// models/institutionModel.js
import pool from '../config/db.js';

export async function getAllInstitutions() {
    const [rows] = await pool.query('SELECT * FROM institutions');
    return rows;
  }
  
  export async function getInstitutionById(id) {
    const [rows] = await pool.query('SELECT * FROM institutions WHERE id = ?', [id]);
    return rows[0];
  }
  
  export async function createInstitution({ name, email, phone, latitude, longitude }) {
    const [result] = await pool.query(
      `INSERT INTO institutions (name, email, phone, latitude, longitude)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone, latitude, longitude]
    );
    return { id: result.insertId };
  }
  