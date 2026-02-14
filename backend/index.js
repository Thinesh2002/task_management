require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./routes/user_route');
const taskRoutes = require('./routes/task_management/taskRoutes');
const employeeRoutes = require('./routes/task_management/employeeRoutes');
const deparment = require('./routes/department/department_route');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/user', userRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/department',deparment);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});
