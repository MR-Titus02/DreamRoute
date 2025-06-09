import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Titus@1234',
  database: 'career_guidance_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
