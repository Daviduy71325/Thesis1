const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");

const adminController = require("../../controller/admin/admin.controller");

const passportSignIn = passport.authenticate("jwt", { session: false });

router.route("/profile").get(passportSignIn, adminController.profile);

router.get("/usersList", adminController.usersList);

router.post(
  "/register",
  adminController.grantAccess("createAny", "profile"),
  adminController.register
);

router.put(
  "/updateAdminProfile",
  adminController.grantAccess("updateAny", "profile"),
  adminController.updateAdminProfile
);

router.get("/newUser/", adminController.usersProfile);

module.exports = router;
