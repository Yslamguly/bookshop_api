const auth = require("../helpers/auth");
const controllers = require("../controllers/controllers");
const express = require("express");
const router = express.Router();

router.get('/home',auth.checkNotAuthenticated,controllers.home)

router.get('/test',controllers.test)
module.exports = router;
