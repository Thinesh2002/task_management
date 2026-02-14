const Department = require("../../models/department/department_model");

exports.createDepartment = async (req, res) => {
  try {
    let { department_name, department_code } = req.body;

    if (!department_name || !department_name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department name required"
      });
    }

    department_name = department_name.trim();
    department_code = department_code?.trim().toUpperCase();

    const result = await Department.create({
      department_name,
      department_code,
    });

    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      id: result.insertId,
    });

  } catch (err) {
    console.error("Create Error:", err);

    if (
      err.message === "Department code already exists" ||
      err.message === "Department code must start with TK" ||
      err.message === "Department name is required"
    ) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.get_all();

    return res.json({
      success: true,
      data: departments
    });

  } catch (err) {
    console.error("Fetch Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getDepartment = async (req, res) => {
  try {
    const department = await Department.getById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    return res.json({
      success: true,
      data: department
    });

  } catch (err) {
    console.error("Get Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    let { department_name, department_code } = req.body;

    if (!department_name || !department_name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department name required"
      });
    }

    department_name = department_name.trim();
    department_code = department_code?.trim().toUpperCase();

    const existing = await Department.getById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    await Department.update(req.params.id, {
      department_name,
      department_code,
    });

    return res.json({
      success: true,
      message: "Department updated successfully",
    });

  } catch (err) {
    console.error("Update Error:", err);

    if (
      err.message === "Department code already exists" ||
      err.message === "Department code must start with TK" ||
      err.message === "Department name is required"
    ) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const existing = await Department.getById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    await Department.delete(req.params.id);

    return res.json({
      success: true,
      message: "Department deleted successfully",
    });

  } catch (err) {
    console.error("Delete Error:", err);

    if (
      err.message ===
      "Cannot delete department. It is linked to existing employees."
    ) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
