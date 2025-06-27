import pool from '../config/db.js';

export const createCourse = async (title, description, institution_id, duration, price, status) => {
  const [result] = await pool.query(
    `INSERT INTO courses (title, description, institution_id, duration, price, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, institution_id, duration, price, status]
  );
  return result.insertId;
};

// Fetch all courses with institution/admin name
export const getAllCourses = async () => {
  const [rows] = await pool.query(`
    SELECT 
      c.*, 
      u.name AS created_by_name, 
      u.role AS created_by_role 
    FROM courses c
    LEFT JOIN users u ON c.institution_id = u.id
  `);

  return rows.map(course => ({
    ...course,
    created_by: {
      name: course.created_by_name,
      role: course.created_by_role,
    }
  }));
};

export const getCourseById = async (id) => {
  const [rows] = await pool.query(`
   SELECT 
  c.*, 
  u.name AS created_by_name, 
  u.role AS created_by_role 
FROM courses c
LEFT JOIN users u ON c.institution_id = u.id
WHERE c.id = ?
  `, [id]);

  const course = rows[0];
  return course
    ? {
        ...course,
        created_by: {
          name: course.created_by_name,
          role: course.created_by_role,
        }
      }
    : null;
};

export const updateCourse = async (id, title, description, duration, price) => {
  await pool.query(
    'UPDATE courses SET title = ?, description = ?, duration = ?, price = ? WHERE id = ?',
    [title, description, duration, price, id]
  );
};

export const deleteCourse = async (id) => {
  await pool.query('DELETE FROM courses WHERE id = ?', [id]);
};

export const getCourseInstitutionId = async (id) => {
  const [rows] = await pool.query(
    'SELECT institution_id FROM courses WHERE id = ?',
    [id]
  );
  return rows[0]?.institution_id;
};


export async function updateCourseStatus(id, status) {
  await pool.query('UPDATE courses SET status = ? WHERE id = ?', [status, id]);
  console.log("DB query to update course:", id, "status:", status);
}


export const getCoursesByInstitution = async (institutionId) => {
  const [rows] = await pool.query(
    `SELECT c.id, c.title, c.description, c.status, c.created_at
     FROM courses c
     WHERE c.institution_id = ?`,
    [institutionId]
  );
  return rows;
};
