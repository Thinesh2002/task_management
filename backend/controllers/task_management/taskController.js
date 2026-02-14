const Task = require("../../models/task_management/taskModel");

exports.getTasks = async (req, res) => {
  try {
    const { role, employee_code } = req.query;

    let tasks;

    if (!role || role === "admin") {
      tasks = await Task.getAllTasks();
    } else {
      if (!employee_code) {
        return res.status(400).json({
          message: "Employee code required"
        });
      }

      tasks = await Task.getTasksByEmployee(employee_code);
    }

    res.json(tasks);
  } catch (error) {
    console.error("Fetch Tasks Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.getTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Get Task Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createTask = async (req, res) => {
  try {
    const {
      task_code,
      department_code,
      title,
      description,
      account,
      assigned_to,
      priority,
      task_type,
      related_asin,
      task_link,
      due_date,
      estimated_hours,
      remarks,
      created_by
    } = req.body;

    if (!title || !department_code || !assigned_to || !created_by) {
      return res.status(400).json({
        message: "Required fields missing"
      });
    }

    const result = await Task.createTask({
      task_code,
      department_code,
      title,
      description,
      account,
      assigned_to,
      priority,
      task_type,
      related_asin,
      task_link,
      due_date,
      estimated_hours,
      remarks,
      created_by
    });

    res.status(201).json({
      success: true,
      message: "Task Created Successfully",
      id: result.insertId
    });

  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    await Task.updateTask(req.params.id, req.body);

    res.json({
      success: true,
      message: "Task updated successfully"
    });
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status, role } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required"
      });
    }

    await Task.updateTaskStatus(req.params.id, status, role);

    res.json({
      success: true,
      message: "Task status updated"
    });

  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

exports.startTask = async (req, res) => {
  try {
    await Task.startTask(req.params.id);

    res.json({
      success: true,
      message: "Task started successfully"
    });
  } catch (error) {
    console.error("Start Task Error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

exports.moveToReview = async (req, res) => {
  try {
    await Task.moveToReview(req.params.id);

    res.json({
      success: true,
      message: "Task moved to review"
    });
  } catch (error) {
    console.error("Move To Review Error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

exports.completeTask = async (req, res) => {
  try {
    await Task.completeTask(req.params.id);

    res.json({
      success: true,
      message: "Task completed successfully"
    });
  } catch (error) {
    console.error("Complete Task Error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.deleteTask(req.params.id);

    res.json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error("Delete Task Error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
