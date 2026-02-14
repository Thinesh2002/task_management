const bcrypt = require('bcrypt');
const User = require('../../models/user_model');
const generateToken = require('../../utils/generateToken');

const SALT_ROUNDS = 10;

exports.register = async (req, res) => {
  try {
    const { name, user_id, email, password, role, employee_code } = req.body;

    if (!password)
      return res.status(400).json({ message: 'Password is required' });

    if (!email && !user_id)
      return res.status(400).json({ message: 'Provide email or user_id' });

    if (!employee_code)
      return res.status(400).json({ message: 'Employee code required' });

    if (email) {
      const existing = await User.findByLogin(email);
      if (existing && existing.email === email)
        return res.status(400).json({ message: 'Email already in use' });
    }

    if (user_id) {
      const existing = await User.findByLogin(user_id);
      if (existing && existing.user_id === user_id)
        return res.status(400).json({ message: 'User ID already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const insertId = await User.createUser({
      name,
      user_id,
      email,
      password: hashedPassword,
      role,
      employee_code
    });

    const newUser = await User.findById(insertId);

    const token = generateToken({
      id: newUser.id,
      role: newUser.role,
      employee_code: newUser.employee_code
    });

    res.status(201).json({
      message: 'User registered',
      user: newUser,
      token
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password)
      return res.status(400).json({ message: 'Login and password required' });

    const user = await User.findByLogin(login);

    if (!user)
      return res.status(400).json({ message: 'Invalid login or password' });

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(400).json({ message: 'Invalid login or password' });

    const token = generateToken({
      id: user.id,
      role: user.role,
      employee_code: user.employee_code
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        employee_code: user.employee_code
      },
      token
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, user_id, email, role, password, employee_code } = req.body;

    const existingUser = await User.findById(id);

    if (!existingUser)
      return res.status(404).json({ message: 'User not found' });

    if (email) {
      const existing = await User.findByLogin(email);
      if (existing && existing.id !== Number(id))
        return res.status(400).json({ message: 'Email already in use' });
    }

    if (user_id) {
      const existing = await User.findByLogin(user_id);
      if (existing && existing.id !== Number(id))
        return res.status(400).json({ message: 'User ID already in use' });
    }

    await User.updateUser(id, {
      name: name ?? existingUser.name,
      user_id: user_id ?? existingUser.user_id,
      email: email ?? existingUser.email,
      role: role ?? existingUser.role,
      employee_code: employee_code ?? existingUser.employee_code
    });

    if (password && password !== '') {
      const hashed = await bcrypt.hash(password, SALT_ROUNDS);
      await User.updatePassword(id, hashed);
    }

    const updated = await User.findById(id);

    res.json({
      message: 'User updated',
      user: updated
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await User.findById(id);

    if (!existingUser)
      return res.status(404).json({ message: 'User not found' });

    await User.deleteUser(id);

    res.json({ message: 'User deleted' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.me = async (req, res) => {
  try {
    const id = req.userId;

    if (!id)
      return res.status(401).json({ message: 'Not authorized' });

    const user = await User.findById(id);

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
