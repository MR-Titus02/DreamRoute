import  pool  from '../config/db.js';
export async function createUserProfile({ user_id, dob, location, career_interests, bio }) {
    const [result] = await pool.query(
      `INSERT INTO user_profiles (user_id, dob, location,  career_interests, bio)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id,  dob, location, career_interests, bio]
    );
    return { id: result.insertId };
  }
  
  export async function getUserProfile(user_id) {
    const [rows] = await pool.query(`SELECT * FROM user_profiles WHERE user_id = ?`, [user_id]);
    return rows[0];
  }
  
  export async function updateUserProfile(user_id, fields) {
    const {  dob,  location, career_interests, bio } = fields;
    await pool.query(
      `UPDATE user_profiles SET dob = ?,  location = ?,  career_interests = ?, bio = ?
       WHERE user_id = ?`,
      [ dob,  location,  career_interests, bio, user_id]
    );
  }
  
  export async function deleteUserProfile(user_id) {
    await pool.query(`DELETE FROM user_profiles WHERE user_id = ?`, [user_id]);
  }
  