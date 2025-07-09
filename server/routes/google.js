import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Step 1: Redirect to Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Step 2: Google callback → issue JWT and redirect with token
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/failure' }),
  (req, res) => {
    const user = req.user;

    // ✅ Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ Redirect with token and user data as query params
    const redirectUrl = `${process.env.FRONTEND_URL}/oauth-redirect?token=${token}&name=${encodeURIComponent(
      user.name
    )}&email=${user.email}&id=${user.id}&role=${user.role}`;
    

    res.redirect(redirectUrl);
  }
);

// Failure route
router.get('/failure', (req, res) => {
  res.send("Failed to authenticate with Google");
});

// Logout
router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).send("Logout error");
    res.redirect("/");
  });
});


// GitHub OAuth start
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub callback
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/auth/failure' }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const redirectUrl = `${process.env.FRONTEND_URL}/oauth-redirect?token=${token}&name=${encodeURIComponent(
      user.name
    )}&email=${user.email}&id=${user.id}&role=${user.role}`;

    res.redirect(redirectUrl);
  }
);


export default router;
