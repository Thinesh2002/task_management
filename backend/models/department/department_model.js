const db = require("../../config/db");

exports.create = async (data) => {
  if (!data.department_name) {
    throw new Error("Department name is required");
  }

  if (!data.department_code || !data.department_code.startsWith("TK")) {
    throw new Error("Department code must start with TK");
  }

  const sql = `
    INSERT INTO departments (department_name, department_code)
    VALUES (?, ?)
  `;

  try {
    const [result] = await db.execute(sql, [
      data.department_name.trim(),
      data.department_code.trim().toUpperCase(),
    ]);

    return result;
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      throw new Error("Department code already exists");
    }
    throw err;
  }
};

exports.get_all = async () => {
  const [rows] = await db.execute(
    "SELECT id, department_name, department_code FROM departments ORDER BY id DESC"
  );
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.execute(
    "SELECT id, department_name, department_code FROM departments WHERE id = ?",
    [id]
  );
  return rows[0];
};

exports.update = async (id, data) => {
  if (!data.department_name) {
    throw new Error("Department name is required");
  }

  if (!data.department_code || !data.department_code.startsWith("TK")) {
    throw new Error("Department code must start with TK");
  }

  const sql = `
    UPDATE departments
    SET department_name = ?, department_code = ?
    WHERE id = ?
  `;

  try {
    await db.execute(sql, [
      data.department_name.trim(),
      data.department_code.trim().toUpperCase(),
      id,
    ]);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      throw new Error("Department code already exists");
    }
    throw err;
  }
};

exports.delete = async (id) => {
  try {
    await db.execute("DELETE FROM departments WHERE id = ?", [id]);
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      throw new Error(
        "Cannot delete department. It is linked to existing employees."
      );
    }
    throw err;
  }
};
