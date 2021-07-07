const router = require("express").Router(),
    jwt = require("jsonwebtoken"),
    cors = require("cors"),
    { verifyJwtMiddleware, loginRequired } = require("./controllers/authController"),
    rateLimit = require("express-rate-limit");



router.use(cors());
router.use(verifyJwtMiddleware);


router.use("/admin", loginRequired, require("./routes/adminRoute"));

router.use("/auth", require("./routes/authRoute"));

router.get("/*", (req, res, next) => {
    res.status(404).json({ error: 404, message: "Page not found." });
});

module.exports = router;