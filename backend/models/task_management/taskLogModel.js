const db = require("../../config/db");

exports.getAllTasks = async () => {
  const [rows] = await db.query(`
    SELECT 
      t.*, 
      e.name AS assigned_name,
      e.department
    FROM tasks t
    LEFT JOIN employees e 
      ON t.assigned_to = e.employee_code
    ORDER BY t.created_at DESC
  `);
  return rows;
};

exports.getTasksByEmployee = async (employeeCode) => {
  const [rows] = await db.query(
    `SELECT 
       t.*, 
       e.name AS assigned_name,
       e.department
     FROM tasks t
     LEFT JOIN employees e 
       ON t.assigned_to = e.employee_code
     WHERE t.assigned_to = ?
     ORDER BY t.created_at DESC`,
    [employeeCode]
  );
  return rows;
};

exports.getTaskById = async (taskId) => {
  const [rows] = await db.query(
    `SELECT * FROM tasks WHERE id = ?`,
    [taskId]
  );
  return rows[0];
};

exports.createTask = async (data) => {
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
    created_by,
  } = data;

  const [result] = await db.query(
    `INSERT INTO tasks 
    (task_code, department_code, title, description, account, assigned_to,
     priority, task_type, related_asin, task_link,
     due_date, estimated_hours, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
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
      created_by,
    ]
  );

  return result;
};

exports.updateTask = async (taskId, data) => {
  const {
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
    remarks
  } = data;

  const [rows] = await db.query(
    `SELECT status FROM tasks WHERE id = ?`,
    [taskId]
  );

  if (!rows.length) throw new Error("Task not found");

  if (
    rows[0].status === "Completed" ||
    rows[0].status === "Cancelled"
  ) {
    throw new Error("Completed or Cancelled tasks cannot be edited");
  }

  const [result] = await db.query(
    `UPDATE tasks 
     SET department_code = ?,
         title = ?,
         description = ?,
         account = ?,
         assigned_to = ?,
         priority = ?,
         task_type = ?,
         related_asin = ?,
         task_link = ?,
         due_date = ?,
         estimated_hours = ?,
         remarks = ?
     WHERE id = ?`,
    [
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
      taskId
    ]
  );

  return result;
};

exports.updateTaskStatus = async (taskId, status, role) => {
  const allowedStatuses = [
    "Pending",
    "In Progress",
    "Review",
    "Completed",
    "On Hold",
    "Cancelled",
    "Overdue"
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid status value");
  }

  const [rows] = await db.query(
    `SELECT status FROM tasks WHERE id = ?`,
    [taskId]
  );

  if (!rows.length) throw new Error("Task not found");

  if (
    (rows[0].status === "Cancelled" ||
     rows[0].status === "Completed") &&
    role !== "admin"
  ) {
    throw new Error("Completed or Cancelled tasks cannot be modified");
  }

  let progress = 0;

  switch (status) {
    case "Pending": progress = 0; break;
    case "In Progress": progress = 50; break;
    case "Review": progress = 80; break;
    case "Completed": progress = 100; break;
    case "On Hold": progress = 30; break;
    case "Cancelled": progress = 0; break;
    case "Overdue": progress = 60; break;
  }

  const [result] = await db.query(
    `UPDATE tasks 
     SET status = ?, progress = ?
     WHERE id = ?`,
    [status, progress, taskId]
  );

  return result;
};

exports.startTask = async (taskId) => {
  const [rows] = await db.query(
    `SELECT status FROM tasks WHERE id = ?`,
    [taskId]
  );

  if (!rows.length) throw new Error("Task not found");
  if (rows[0].status !== "Pending") {
    throw new Error("Only Pending tasks can be started");
  }

  const [result] = await db.query(
    `UPDATE tasks 
     SET status = 'In Progress',
         progress = 50,
         start_date = CURDATE(),
         start_time = CURTIME()
     WHERE id = ?`,
    [taskId]
  );

  return result;
};

exports.moveToReview = async (taskId) => {
  const [rows] = await db.query(
    `SELECT status FROM tasks WHERE id = ?`,
    [taskId]
  );

  if (!rows.length) throw new Error("Task not found");
  if (rows[0].status !== "In Progress") {
    throw new Error("Only In Progress tasks can move to Review");
  }

  const [result] = await db.query(
    `UPDATE tasks 
     SET status = 'Review',
         progress = 80
     WHERE id = ?`,
    [taskId]
  );

  return result;
};

exports.completeTask = async (taskId) => {
  const [rows] = await db.query(
    `SELECT status, start_date, start_time 
     FROM tasks 
     WHERE id = ?`,
    [taskId]
  );

  if (!rows.length) throw new Error("Task not found");
  if (rows[0].status !== "Review") {
    throw new Error("Task must be in Review before completing");
  }
  if (!rows[0].start_date || !rows[0].start_time) {
    throw new Error("Task has no start time recorded");
  }

  const startDateTime = new Date(
    `${rows[0].start_date}T${rows[0].start_time}`
  );

  const now = new Date();
  const diffMs = now - startDateTime;
  const actualHours = (diffMs / (1000 * 60 * 60)).toFixed(2);

  const [result] = await db.query(
    `UPDATE tasks 
     SET status = 'Completed',
         progress = 100,
         end_time = CURTIME(),
         actual_hours = ?
     WHERE id = ?`,
    [actualHours, taskId]
  );

  return result;
};

exports.deleteTask = async (taskId) => {
  const [rows] = await db.query(
    `SELECT status FROM tasks WHERE id = ?`,
    [taskId]
  );

  if (!rows.length) throw new Error("Task not found");
  if (rows[0].status !== "Pending") {
    throw new Error("Only Pending tasks can be deleted");
  }

  const [result] = await db.query(
    `DELETE FROM tasks WHERE id = ?`,
    [taskId]
  );

  return result;
};
