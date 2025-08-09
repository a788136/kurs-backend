import { Router } from 'express';
import passport from 'passport';
import { buildRedirect } from '../lib/buildRedirect.js';

const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: buildRedirect('/signin?error=google') }),
  (req, res) => {
    res.redirect(buildRedirect('/'));
  }
);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: buildRedirect('/signin?error=github') }),
  (req, res) => {
    res.redirect(buildRedirect('/'));
  }
);

router.get('/me', (req, res) => {
  if (req.user) {
    const { _id, email, name, avatar, roles } = req.user;
    return res.json({ authenticated: true, user: { id: _id, email, name, avatar, roles } });
  }
  res.json({ authenticated: false });
});

router.post('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ ok: true });
    });
  });
});

export default router;