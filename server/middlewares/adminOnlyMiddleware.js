export default function adminOnly(req, res, next) {
    if (req.user.role === 'admin') return next();
    return res.status(403).json({ error: 'Admin access required' });
  }