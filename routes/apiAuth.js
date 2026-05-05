const express = require("express");
const passport = require("passport");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

const router = express.Router();

function serializeUser(user) {
  if (!user) return null;
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
  };
}

router.get("/me", (req, res) => {
  res.json({
    ok: true,
    isAuthenticated: req.isAuthenticated(),
    user: serializeUser(req.user),
  });
});

router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);

      req.login(registeredUser, (err) => {
        if (err) return next(err);

        return res.status(201).json({
          ok: true,
          message: "Welcome to Wanderlust",
          user: serializeUser(req.user),
        });
      });
    } catch (e) {
      res.status(400).json({
        ok: false,
        message: e.message,
      });
    }
  })
);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: (info && info.message) || "Invalid username or password",
      });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);

      const redirectUrl = req.session.redirectUrl || "/listings";
      delete req.session.redirectUrl;

      return res.json({
        ok: true,
        message: "Welcome back to Wanderlust !",
        redirectUrl,
        user: serializeUser(req.user),
      });
    });
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((destroyErr) => {
      if (destroyErr) return next(destroyErr);

      res.clearCookie("connect.sid");
      return res.json({
        ok: true,
        message: "you are logged out!",
      });
    });
  });
});

module.exports = router;