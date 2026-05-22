const Student = require('../models/Student');

// Initial seed dataset (Harry Potter, Hermione Granger, etc.)
const SEED_STUDENTS = [
  {
    name: 'Hermione Granger',
    email: 'hermione@hogwarts.edu',
    age: 17,
    grade: 'Grade 12',
    attendance: 99,
    status: 'Active',
    courses: 'Ancient Runes, Arithmancy, Transfiguration',
    avatarBg: 'linear-gradient(135deg, #10b981, #059669)',
  },
  {
    name: 'Harry Potter',
    email: 'harry.potter@hogwarts.edu',
    age: 17,
    grade: 'Grade 11',
    attendance: 88,
    status: 'Active',
    courses: 'Defense Against the Dark Arts, Potions',
    avatarBg: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
  },
  {
    name: 'Luna Lovegood',
    email: 'luna.love@hogwarts.edu',
    age: 16,
    grade: 'Grade 10',
    attendance: 95,
    status: 'Active',
    courses: 'Care of Magical Creatures, Herbology',
    avatarBg: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
  },
  {
    name: 'Ron Weasley',
    email: 'ron.weasley@hogwarts.edu',
    age: 17,
    grade: 'Grade 11',
    attendance: 76,
    status: 'Probation',
    courses: 'Divination, Charms, Flying',
    avatarBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  {
    name: 'Draco Malfoy',
    email: 'draco.m@hogwarts.edu',
    age: 18,
    grade: 'Grade 12',
    attendance: 91,
    status: 'Active',
    courses: 'Dark Arts, Potions, Defense',
    avatarBg: 'linear-gradient(135deg, #6b7280, #374151)',
  },
  {
    name: 'Neville Longbottom',
    email: 'neville.l@hogwarts.edu',
    age: 17,
    grade: 'Grade 11',
    attendance: 64,
    status: 'Suspended',
    courses: 'Herbology, Defense Against the Dark Arts',
    avatarBg: 'linear-gradient(135deg, #ef4444, #b91c1c)',
  },
];

// Seed Database Utility
const seedStudents = async () => {
  try {
    const count = await Student.countDocuments();
    if (count === 0) {
      console.log('Seeding initial student records in MongoDB...');
      await Student.insertMany(SEED_STUDENTS);
      console.log('Database seeded successfully with 6 student profiles!');
    }
  } catch (error) {
    console.error('Database seeding failed:', error.message);
  }
};

// 1. Fetch & Filter all Students
const getAllStudents = async (req, res, next) => {
  try {
    const { search, grade, status } = req.query;
    
    // Construct Query object
    let query = {};

    // Search filter (handles Name, Email, or Course matches)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { courses: { $regex: search, $options: 'i' } }
      ];
    }

    // Grade and Status filters
    if (grade && grade !== 'All') {
      query.grade = grade;
    }
    if (status && status !== 'All') {
      query.status = status;
    }

    // Sort by newest created first
    const students = await Student.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

// 2. Fetch Single Student profile
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      res.status(404);
      throw new Error(`Student record not found with id: ${req.params.id}`);
    }
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// 3. Register New Student
const createStudent = async (req, res, next) => {
  try {
    const { name, email, age, grade, attendance, status, courses, avatarBg } = req.body;

    // Check if email already registered (explicit check for cleaner output)
    const existingStudent = await Student.findOne({ email: email.toLowerCase() });
    if (existingStudent) {
      res.status(400);
      throw new Error('Email address is already registered in the system.');
    }

    const student = await Student.create({
      name,
      email,
      age,
      grade,
      attendance,
      status,
      courses,
      avatarBg: avatarBg || 'linear-gradient(135deg, #8b5cf6, #ec4899)'
    });

    res.status(201).json({
      success: true,
      message: 'Student registered successfully.',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// 4. Update Student parameters
const updateStudent = async (req, res, next) => {
  try {
    const { name, email, age, grade, attendance, status, courses } = req.body;

    // Check duplicate email for another student
    if (email) {
      const emailMatch = await Student.findOne({ email: email.toLowerCase(), _id: { $ne: req.params.id } });
      if (emailMatch) {
        res.status(400);
        throw new Error('Another student is already registered with this email address.');
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email, age, grade, attendance, status, courses },
      { new: true, runValidators: true } // Run schema validations on update
    );

    if (!updatedStudent) {
      res.status(404);
      throw new Error(`Student record not found with id: ${req.params.id}`);
    }

    res.status(200).json({
      success: true,
      message: 'Student record updated successfully.',
      data: updatedStudent
    });
  } catch (error) {
    next(error);
  }
};

// 5. Remove Student record
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      res.status(404);
      throw new Error(`Student record not found with id: ${req.params.id}`);
    }

    res.status(200).json({
      success: true,
      message: `${student.name} was removed from database.`
    });
  } catch (error) {
    next(error);
  }
};

// 6. Aggregate Academic Stats
const getDashboardStats = async (req, res, next) => {
  try {
    const students = await Student.find({});
    const total = students.length;

    // Averages and counts
    let avgAttendance = 0;
    let active = 0;
    let probation = 0;
    let suspended = 0;
    let high = 0;
    let good = 0;
    let average = 0;
    let poor = 0;

    if (total > 0) {
      let sumAttendance = 0;
      students.forEach((s) => {
        sumAttendance += s.attendance;
        if (s.status === 'Active') active++;
        if (s.status === 'Probation') probation++;
        if (s.status === 'Suspended') suspended++;

        if (s.attendance >= 90) high++;
        else if (s.attendance >= 80) good++;
        else if (s.attendance >= 70) average++;
        else poor++;
      });
      avgAttendance = Math.round(sumAttendance / total);
    }

    res.status(200).json({
      success: true,
      data: {
        totalStudents: total,
        avgAttendance,
        activeCount: active,
        probationCount: probation,
        suspendedCount: suspended,
        attendanceTiers: {
          high,
          good,
          average,
          poor
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getDashboardStats,
  seedStudents,
};
