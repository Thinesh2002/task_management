const express = require("express");
const router = express.Router();
const departmentController = require("../../controllers/department_controller/department_controller");

router.get("/view", departmentController.getDepartments);
router.get("/:id", departmentController.getDepartment);
router.post("/create", departmentController.createDepartment);
router.put("/update/:id", departmentController.updateDepartment);
router.delete("/delete/:id", departmentController.deleteDepartment);

module.exports = router;
