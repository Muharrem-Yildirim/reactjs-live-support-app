const router = require("express").Router(),
  { getChatHistories, getUsers, deleteUser } = require("../controllers/adminController"),
  rateLimit = require("express-rate-limit");

router.get(
  "/chat-histories",
  // rateLimit({
  //   windowMs: 60 * 1000, // 1 minutes
  //   max: 5,
  // }),
  getChatHistories
);

router.get(
  "/users",
  // rateLimit({
  //   windowMs: 60 * 1000, // 1 minutes
  //   max: 5,
  // }),
  getUsers
);

router.delete(
  "/users/:id",
  // rateLimit({
  //   windowMs: 60 * 1000, // 1 minutes
  //   max: 5,
  // }),
  deleteUser
);

module.exports = router;
