import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header is missing or doesn't start with Bearer
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using JWT secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded token data to request object (e.g., userId, email, role)
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
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