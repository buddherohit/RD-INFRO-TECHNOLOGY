const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full Name is required.'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters long.'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required.'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address.',
      ],
    },
    age: {
      type: Number,
      required: [true, 'Age is required.'],
      min: [1, 'Age must be a positive number.'],
    },
    grade: {
      type: String,
      required: [true, 'Grade level is required.'],
      enum: {
        values: ['Grade 10', 'Grade 11', 'Grade 12'],
        message: '{VALUE} is not a valid grade level. Choose Grade 10, 11, or 12.',
      },
    },
    attendance: {
      type: Number,
      required: [true, 'Attendance score is required.'],
      min: [0, 'Attendance cannot be below 0%.'],
      max: [100, 'Attendance cannot exceed 100%.'],
      default: 90,
    },
    status: {
      type: String,
      required: [true, 'Academic status is required.'],
      enum: {
        values: ['Active', 'Probation', 'Suspended'],
        message: '{VALUE} is not a valid status. Choose Active, Probation, or Suspended.',
      },
      default: 'Active',
    },
    courses: {
      type: String,
      default: 'General Curriculum',
      trim: true,
    },
    avatarBg: {
      type: String,
      default: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    },
  },
  {
    timestamps: true, // Automatically includes createdAt and updatedAt
  }
);

// Indexes to speed up text queries and filtering
studentSchema.index({ name: 'text', email: 'text', courses: 'text' });
studentSchema.index({ grade: 1 });
studentSchema.index({ status: 1 });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
