// middleware/roleMiddleware.js
export default function roleMiddleware(req, res, next) {
    const { userId, role } = req.user; // req.user comes from your auth middleware
    const requestedUserId = parseInt(req.params.id);
  
    // If the user is the owner of the data OR is an admin
    if (userId === requestedUserId || role === 'admin') {
      return next();
    }
  
    return res.status(403).json({ error: 'Access forbidden: Not authorized' });
  }
  