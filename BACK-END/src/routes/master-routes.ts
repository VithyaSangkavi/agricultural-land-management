import express, { Router } from "express";
//var departmentController = require("../controllers/department-controller");
var workerController = require("../controllers/worker-controller")
var taskTypeController = require("../controllers/task-type-controller")

const auth = require("../middleware/auth-middleware");
const router: Router = express.Router();
// add authentication middleware
//router.use(auth);

// department routes
// router.post("/departmentSave", departmentController.save);
// router.post("/departmentUpdate", departmentController.update);
// router.post("/departmentDelete", departmentController.delete);
// router.post("/departmentFindAll", departmentController.findAll);
// router.get("/departmentFindById", departmentController.findById);

// worker routes
router.post("/workerSave", workerController.save);
router.post("/workerUpdate", workerController.update);
router.post("/workerDelete", workerController.delete);
router.post("/workerFindAll", workerController.findAll);
router.get("/workerFindById", workerController.findById);

// task-type routes
router.post("/taskSave", taskTypeController.save);
router.post("/taskUpdate", taskTypeController.update);
router.post("/taskDelete", taskTypeController.delete);
router.post("/taskFindAll", taskTypeController.findAll);
router.get("/taskFindById", taskTypeController.findById);

module.exports = router;
