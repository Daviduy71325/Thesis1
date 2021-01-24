const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");

const adminController = require("../../controller/admin/admin.controller");
const adminProductsController = require("../../controller/admin/products/addCategory");

const passportSignIn = passport.authenticate("login", { session: false });

router.route("/profile").get(passportSignIn, adminController.profile);

router.get("/usersList", passportSignIn, adminController.usersList);

router.post(
  "/register",
  passportSignIn,
  adminController.grantAccess("createAny", "profile"),
  adminController.register
);

router.put(
  "/updateUsersProfile",
  passport.authenticate("login", { session: false }),
  adminController.grantAccess("updateAny", "profile"),
  adminController.updateUsersProfile
);

router.get("/newUser/", passportSignIn, adminController.usersProfile);

///para sa products

router.get("/categoryList", adminProductsController.categoryList);

router.post("/addCategory", adminProductsController.addCategory);

module.exports = router;
