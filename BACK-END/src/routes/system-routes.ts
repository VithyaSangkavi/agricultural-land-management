import express, { Router } from "express";
var systemController = require("../controllers/system-controller");
const auth = require("../middleware/auth-middleware");
const router: Router = express.Router();
// add authentication middleware
// router.use(auth);

router.get("/health", systemController.getSystemHealth);

module.exports = router;
