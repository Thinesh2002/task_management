const Employee = require("../../models/task_management/employeeModel");

exports.getEmployees = async (req, res) => {
  try {
    const data = await Employee.getAllEmployees();
    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.getEmployeeById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const {
      employee_code,
      name,
      email,
      phone,
      department,
      role,
      join_date,
      status
    } = req.body;

    if (!employee_code || !name || !email || !role || !join_date) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const existing = await Employee.getEmployeeByEmail(email);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }

    const result = await Employee.createEmployee({
      employee_code,
      name,
      email,
      phone,
      department,
      role,
      join_date,
      status
    });

    res.status(201).json({
      success: true,
      message: "Employee Created",
      employeeId: result.insertId
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Employee.updateEmployee(id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee Updated"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Employee.deleteEmployee(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee Deleted"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
