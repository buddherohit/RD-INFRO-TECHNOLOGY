const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getDashboardStats,
} = require('../controllers/studentController');

// Route mapping for Lumina Academy REST APIs

// 1. Dashboard statistics endpoint (placed above /:id to avoid collision)
router.get('/stats', getDashboardStats);

// 2. Base endpoints for students
router.route('/')
  .get(getAllStudents)
  .post(createStudent);

// 3. ID-based endpoints
router.route('/:id')
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

module.exports = router;
