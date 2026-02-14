const express = require("express");
const router = express.Router();
const taskController = require("../../controllers/task_management/taskController");

router.get("/view", taskController.getTasks);
router.get("/:id", taskController.getTaskById);
router.post("/create", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.put("/:id/status", taskController.updateTaskStatus);
router.put("/:id/start", taskController.startTask);
router.put("/:id/review", taskController.moveToReview);
router.put("/:id/complete", taskController.completeTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
