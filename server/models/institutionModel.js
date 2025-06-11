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
  
  export async function createInstitution({ user_id, name, email, description, address }) {
    // const user_id = req.user.user_id;
    const [result] = await pool.query(
      `INSERT INTO institutions ( user_id ,name, email, description, address)
       VALUES (?, ?, ?, ?, ?)`,
      [ user_id ,name, email, description, address]
    );
    return { id: result.insertId };
  }
  
  export async function updateInstitution({ id, user_id, name, email, description, address }) {
    const [result] = await pool.query(
      `UPDATE institutions
       SET user_id = ?, name = ?, email = ?, description = ?, address = ?
       WHERE id = ?`,
      [user_id, name, email, description, address, id]
    );
    return result;
  }
  

export async function deleteInstitution(id) {
    const [result] = await pool.query('DELETE FROM institutions WHERE id = ?', [id]);
    return result;
  }