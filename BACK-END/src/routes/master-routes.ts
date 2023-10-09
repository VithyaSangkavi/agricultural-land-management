import express, { Router } from "express";
var landController = require("../controllers/land-controller");
var workerController = require("../controllers/worker-controller");


const auth = require("../middleware/auth-middleware");
const router: Router = express.Router();
// add authentication middleware
//router.use(auth);


//crop routes
/* router.post("/cropSave", cropController.save);
router.post("/cropUpdate", cropController.update);
router.post("/cropDelete", cropController.delete);
router.post("/cropFindAll", cropController.findAll);
router.get("/cropFindById", cropController.findById); */
//
/* router.post("/expenseSave", expenseController.save);
router.post("/expenseUpdate", expenseController.update);
router.post("/expenseDelete", expenseController.delete);
router.post("/expenseFindAll", expenseController.findAll);
router.get("/expenseFindById", expenseController.findById); */
//
/* router.post("/incomeSave", incomeController.save);
router.post("/incomeUpdate", incomeController.update);
router.post("/incomeDelete", incomeController.delete);
router.post("/incomeFindAll", incomeController.findAll);
router.get("/incomeFindById", incomeController.findById); */
//
router.post("/landSave", landController.save);
//router.post("/landUpdate", landController.update);
//router.post("/landDelete", landController.delete);
router.get("/landFindAll", landController.findAll);
//router.get("/landFindById", landController.findById);
//
/* router.post("/lotSave", lotController.save);
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
/* router.post("/taskSave", taskTypeController.save);
router.post("/taskUpdate", taskTypeController.update);
router.post("/taskDelete", taskTypeController.delete);
router.post("/taskFindAll", taskTypeController.findAll);
router.get("/taskFindById", taskTypeController.findById); */

module.exports = router;
