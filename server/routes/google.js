import express from "express";
import passport from "passport";

const router = express.Router();

// Step 1: Redirect to Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Step 2: Google callback → we handle here
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    successRedirect: '/profile', // or a frontend route
  })
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

export default router;
