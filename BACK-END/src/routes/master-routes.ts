import express, { Router } from "express";
var departmentController = require("../controllers/department-controller");

const auth = require("../middleware/auth-middleware");
const router: Router = express.Router();
// add authentication middleware
//router.use(auth);

// department routes
router.post("/departmentSave", departmentController.save);
router.post("/departmentUpdate", departmentController.update);
router.post("/departmentDelete", departmentController.delete);
router.post("/departmentFindAll", departmentController.findAll);
router.get("/departmentFindById", departmentController.findById);



module.exports = router;
