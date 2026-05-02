const express = require("express");
const passport = require("passport");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { sendError } = require("../utils/apiResponse.js");
const userController = require("../controllers/users.js");

router.get("/me", userController.apiCurrentUser);

router.post("/signup", wrapAsync(userController.apiSignup));

router.post(
  "/login",
  (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return sendError(res, (info && info.message) || "Invalid username or password", 401);
      }

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }

        return userController.apiLogin(req, res);
      });
    })(req, res, next);
  }
);

router.post("/logout", userController.apiLogout);

module.exports = router;
