import express, { Router } from "express";
//var departmentController = require("../controllers/department-controller");
var workerController = require("../controllers/worker-controller")
var taskTypeController = require("../controllers/task-type-controller")
var cropController = require("../controllers/crop-controller");
var paymentController = require("../controllers/payment-controller")

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

//crop routes
router.post("/cropSave", cropController.save);
//router.post("/cropUpdate", cropController.update);
/* router.post("/cropDelete", cropController.delete);
router.post("/cropFindAll", cropController.findAll);
router.get("/cropFindById", cropController.findById); */
//
/* router.post("/expenseSave", expenseController.save);
router.post("/expenseUpdate", expenseController.update);
router.post("/expenseDelete", expenseController.delete);
router.post("/expenseFindAll", expenseController.findAll);
router.get("/expenseFindById", expenseController.findById);
//
router.post("/incomeSave", incomeController.save);
router.post("/incomeUpdate", incomeController.update);
router.post("/incomeDelete", incomeController.delete);
router.post("/incomeFindAll", incomeController.findAll);
router.get("/incomeFindById", incomeController.findById);
//
router.post("/landSave", landController.save);
router.post("/landUpdate", landController.update);
router.post("/landDelete", landController.delete);
router.post("/landFindAll", landController.findAll);
router.get("/landFindById", landController.findById);
//
router.post("/lotSave", lotController.save);
router.post("/lotUpdate", lotController.update);
router.post("/lotDelete", lotController.delete);
router.post("/lotFindAll", lotController.findAll);
router.get("/lotFindById", lotController.findById); */

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

// payment routes
router.post("/paymentSave", paymentController.save);
router.post("/paymentupdate", paymentController.update);
router.post("/paymentDelete", paymentController.delete);
router.post("/paymentFindAll", paymentController.findAll);
router.get("/paymentFindById", paymentController.findById);

module.exports = router;
