import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = user; // This must contain user.id and user.role
    next();
  });
}
export const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden: Insufficient role' });
    }
    next();
  };
};


export const checkInstitutionOrAdmin = async (req, res, next) => {
  const courseId = req.params.id;
  const userRole = req.user.role;
  const userInstitutionId = req.user.institution_id; // Make sure this is in the JWT

  const course = await getCourseById(courseId);
  if (!course) return res.status(404).json({ error: 'Course not found' });

  if (userRole === 'admin' || course.institution_id === userInstitutionId) {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied' });
  }
};

export const isInstitution = (req, res, next) => {
  if (req.user.role === 'institution') {
    return next();
  }
  return res.status(403).json({ error: 'Access denied. Not an institution.' });
};

// export const isAdmin = (req, res, next) => {
//   if (req.user.role === 'admin') {
//     return next();
//   }
//   return res.status(403).json({ error: 'Access denied. Not an admin.' });
// };