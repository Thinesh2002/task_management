const db = require("../../config/db");

exports.getAllEmployees = async () => {
  const [rows] = await db.query(
    "SELECT * FROM employees ORDER BY created_at DESC"
  );
  return rows;
};

exports.getEmployeeById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM employees WHERE id = ?",
    [id]
  );
  return rows[0];
};

exports.getEmployeeByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM employees WHERE email = ?",
    [email]
  );
  return rows[0];
};

exports.createEmployee = async (data) => {
  const {
    employee_code,
    name,
    email,
    phone,
    department,
    role,
    join_date,
    status
  } = data;

  const [result] = await db.query(
    `INSERT INTO employees 
    (employee_code, name, email, phone, department, role, join_date, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      employee_code,
      name,
      email,
      phone,
      department,
      role,
      join_date,
      status || "Active"
    ]
  );

  return result;
};

exports.updateEmployee = async (id, data) => {
  const {
    name,
    email,
    phone,
    department,
    role,
    join_date,
    status
  } = data;

  const [result] = await db.query(
    `UPDATE employees
     SET name = ?, 
         email = ?, 
         phone = ?, 
         department = ?, 
         role = ?, 
         join_date = ?, 
         status = ?
     WHERE id = ?`,
    [
      name,
      email,
      phone,
      department,
      role,
      join_date,
      status,
      id
    ]
  );

  return result;
};

exports.deleteEmployee = async (id) => {
  const [result] = await db.query(
    "DELETE FROM employees WHERE id = ?",
    [id]
  );
  return result;
};
