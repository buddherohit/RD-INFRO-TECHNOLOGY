import { useState, useEffect } from 'react';

// Pre-defined vibrant linear-gradients for student avatars
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #8b5cf6, #ec4899)', // Violet-Pink
  'linear-gradient(135deg, #06b6d4, #3b82f6)', // Cyan-Blue
  'linear-gradient(135deg, #10b981, #059669)', // Emerald-Green
  'linear-gradient(135deg, #f59e0b, #d97706)', // Amber-Orange
  'linear-gradient(135deg, #ef4444, #b91c1c)', // Red-DarkRed
  'linear-gradient(135deg, #6b7280, #374151)', // Gray-Slate
  'linear-gradient(135deg, #a855f7, #6366f1)', // Purple-Indigo
];

// Initial mock data with rich detailed student profiles
const INITIAL_STUDENTS = [
  {
    id: 'student-1',
    name: 'Hermione Granger',
    email: 'hermione@hogwarts.edu',
    age: 17,
    grade: 'Grade 12',
    attendance: 99,
    status: 'Active',
    courses: 'Ancient Runes, Arithmancy, Transfiguration',
    avatarBg: AVATAR_GRADIENTS[2],
  },
  {
    id: 'student-2',
    name: 'Harry Potter',
    email: 'harry.potter@hogwarts.edu',
    age: 17,
    grade: 'Grade 11',
    attendance: 88,
    status: 'Active',
    courses: 'Defense Against the Dark Arts, Potions',
    avatarBg: AVATAR_GRADIENTS[0],
  },
  {
    id: 'student-3',
    name: 'Luna Lovegood',
    email: 'luna.love@hogwarts.edu',
    age: 16,
    grade: 'Grade 10',
    attendance: 95,
    status: 'Active',
    courses: 'Care of Magical Creatures, Herbology',
    avatarBg: AVATAR_GRADIENTS[1],
  },
  {
    id: 'student-4',
    name: 'Ron Weasley',
    email: 'ron.weasley@hogwarts.edu',
    age: 17,
    grade: 'Grade 11',
    attendance: 76,
    status: 'Probation',
    courses: 'Divination, Charms, Flying',
    avatarBg: AVATAR_GRADIENTS[3],
  },
  {
    id: 'student-5',
    name: 'Draco Malfoy',
    email: 'draco.m@hogwarts.edu',
    age: 18,
    grade: 'Grade 12',
    attendance: 91,
    status: 'Active',
    courses: 'Dark Arts, Potions, Defense',
    avatarBg: AVATAR_GRADIENTS[5],
  },
  {
    id: 'student-6',
    name: 'Neville Longbottom',
    email: 'neville.l@hogwarts.edu',
    age: 17,
    grade: 'Grade 11',
    attendance: 64,
    status: 'Suspended',
    courses: 'Herbology, Defense Against the Dark Arts',
    avatarBg: AVATAR_GRADIENTS[4],
  },
];

// Activity logs
const INITIAL_ACTIVITIES = [
  { id: 'act-1', desc: 'Hermione Granger achieved 99% attendance score.', time: '10 mins ago', type: 'update' },
  { id: 'act-2', desc: 'New student Luna Lovegood was registered.', time: '2 hours ago', type: 'add' },
  { id: 'act-3', desc: 'Neville Longbottom suspended due to potion lab accident.', time: '1 day ago', type: 'delete' },
];

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState('dashboard'); // 'dashboard', 'directory', 'form'
  
  // Theme State (Dark by default)
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Core Application Data
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  
  // Toast notifications list
  const [toasts, setToasts] = useState([]);

  // Directory Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Form Mode State ('add' or 'edit')
  const [formMode, setFormMode] = useState('add');
  const [editingStudentId, setEditingStudentId] = useState(null);

  // Form Fields State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAge, setFormAge] = useState('');
  const [formGrade, setFormGrade] = useState('Grade 11');
  const [formAttendance, setFormAttendance] = useState(90);
  const [formStatus, setFormStatus] = useState('Active');
  const [formCourses, setFormCourses] = useState('');
  
  // Form Field Validation Errors
  const [errors, setErrors] = useState({});

  // Theme effect
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }, [isDarkMode]);

  // Toast helper
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return 'SMS';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 3);
  };

  // Dashboard Stats Calculations
  const totalStudents = students.length;
  
  const avgAttendance = totalStudents > 0 
    ? Math.round(students.reduce((sum, s) => sum + Number(s.attendance), 0) / totalStudents)
    : 0;

  const probationCount = students.filter((s) => s.status === 'Probation').length;
  const suspendedCount = students.filter((s) => s.status === 'Suspended').length;
  const activeCount = students.filter((s) => s.status === 'Active').length;

  // Grade/Attendance tier calculations for vertical breakdown chart
  const highAttendanceCount = students.filter((s) => s.attendance >= 90).length;
  const goodAttendanceCount = students.filter((s) => s.attendance >= 80 && s.attendance < 90).length;
  const averageAttendanceCount = students.filter((s) => s.attendance >= 70 && s.attendance < 80).length;
  const poorAttendanceCount = students.filter((s) => s.attendance < 70).length;

  const getPercentage = (count) => {
    if (totalStudents === 0) return '0%';
    return `${Math.round((count / totalStudents) * 100)}%`;
  };

  // Handle live filtering
  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.courses.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = gradeFilter === 'All' || student.grade === gradeFilter;
    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;

    return matchesSearch && matchesGrade && matchesStatus;
  });

  // Handle edit launch
  const handleEditClick = (student) => {
    setFormMode('edit');
    setEditingStudentId(student.id);
    
    setFormName(student.name);
    setFormEmail(student.email);
    setFormAge(student.age);
    setFormGrade(student.grade);
    setFormAttendance(student.attendance);
    setFormStatus(student.status);
    setFormCourses(student.courses);
    setErrors({});
    
    setCurrentTab('form');
    addToast(`Preloaded details for ${student.name}`, 'info');
  };

  // Handle delete action
  const handleDeleteClick = (student) => {
    if (window.confirm(`Are you sure you want to remove ${student.name}?`)) {
      setStudents((prev) => prev.filter((s) => s.id !== student.id));
      
      // Log Activity
      const newActivity = {
        id: `act-${Date.now()}`,
        desc: `Student record of ${student.name} was deleted.`,
        time: 'Just now',
        type: 'delete',
      };
      setActivities((prev) => [newActivity, ...prev]);
      addToast(`${student.name} deleted successfully!`, 'danger');
    }
  };

  // Form Validation
  const validateForm = () => {
    const formErrors = {};
    if (!formName.trim() || formName.trim().length < 3) {
      formErrors.name = 'Full Name is required and must be at least 3 characters.';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formEmail.trim() || !emailRegex.test(formEmail)) {
      formErrors.email = 'Please provide a valid email address.';
    }

    const ageNum = Number(formAge);
    if (!formAge || isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      formErrors.age = 'Please enter a valid age (1-120).';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Submit Form
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('Please fix the errors in the form.', 'danger');
      return;
    }

    if (formMode === 'add') {
      // Add Student
      const newStudent = {
        id: `student-${Date.now()}`,
        name: formName.trim(),
        email: formEmail.trim(),
        age: Number(formAge),
        grade: formGrade,
        attendance: Number(formAttendance),
        status: formStatus,
        courses: formCourses.trim() || 'General Curriculum',
        avatarBg: AVATAR_GRADIENTS[Math.floor(Math.random() * AVATAR_GRADIENTS.length)],
      };

      setStudents((prev) => [newStudent, ...prev]);

      // Log Activity
      const newActivity = {
        id: `act-${Date.now()}`,
        desc: `New student ${newStudent.name} successfully registered.`,
        time: 'Just now',
        type: 'add',
      };
      setActivities((prev) => [newActivity, ...prev]);
      addToast(`${newStudent.name} enrolled successfully!`, 'success');
    } else {
      // Edit Student
      setStudents((prev) =>
        prev.map((s) =>
          s.id === editingStudentId
            ? {
                ...s,
                name: formName.trim(),
                email: formEmail.trim(),
                age: Number(formAge),
                grade: formGrade,
                attendance: Number(formAttendance),
                status: formStatus,
                courses: formCourses.trim() || 'General Curriculum',
              }
            : s
        )
      );

      // Log Activity
      const newActivity = {
        id: `act-${Date.now()}`,
        desc: `Updated student record of ${formName.trim()}.`,
        time: 'Just now',
        type: 'update',
      };
      setActivities((prev) => [newActivity, ...prev]);
      addToast(`${formName.trim()} updated successfully!`, 'success');
    }

    // Reset Form and redirect
    resetForm();
    setCurrentTab('directory');
  };

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormAge('');
    setFormGrade('Grade 11');
    setFormAttendance(90);
    setFormStatus('Active');
    setFormCourses('');
    setErrors({});
    setEditingStudentId(null);
    setFormMode('add');
  };

  const handleAddNewLaunch = () => {
    resetForm();
    setFormMode('add');
    setCurrentTab('form');
  };

  return (
    <div className="app-container">
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-top-wrapper">
          <div className="brand-section">
            <div className="brand-logo">L</div>
            <span className="brand-name">Lumina Academy</span>
          </div>

          <nav className="navigation-menu">
            <a
              id="nav-dashboard"
              className={`nav-link ${currentTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentTab('dashboard')}
            >
              <span className="nav-icon">📊</span>
              <span>Dashboard</span>
            </a>
            <a
              id="nav-directory"
              className={`nav-link ${currentTab === 'directory' ? 'active' : ''}`}
              onClick={() => setCurrentTab('directory')}
            >
              <span className="nav-icon">👥</span>
              <span>Students</span>
            </a>
            <a
              id="nav-form"
              className={`nav-link ${currentTab === 'form' ? 'active' : ''}`}
              onClick={() => (formMode === 'add' ? handleAddNewLaunch() : setCurrentTab('form'))}
            >
              <span className="nav-icon">📝</span>
              <span>{formMode === 'add' ? 'Add Student' : 'Edit Profile'}</span>
            </a>
          </nav>
        </div>

        <div className="user-panel">
          <div className="user-avatar">AD</div>
          <div className="user-info">
            <span className="user-name">Administrator</span>
            <span className="user-role">
              <span className="status-dot"></span> Online Mode
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        
        {/* Page Header */}
        <header className="page-header">
          <div className="header-title-wrapper">
            <h1>
              {currentTab === 'dashboard' && 'Academic Dashboard'}
              {currentTab === 'directory' && 'Student Directory'}
              {currentTab === 'form' && (formMode === 'add' ? 'Register New Student' : 'Modify Student Profile')}
            </h1>
            <span className="header-subtitle">
              {currentTab === 'dashboard' && 'Overview of your institution performance and analytics'}
              {currentTab === 'directory' && `Manage and filter through all ${totalStudents} registered students`}
              {currentTab === 'form' && (formMode === 'add' ? 'Enter personal and academic parameters to enroll' : 'Edit student parameters')}
            </span>
          </div>

          <div className="header-actions">
            {/* Theme Toggle */}
            <button 
              id="btn-theme-toggle"
              className="theme-toggle" 
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Toggle Theme Mode"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            
            {currentTab !== 'form' && (
              <button 
                id="btn-add-student-header"
                className="primary-btn" 
                onClick={handleAddNewLaunch}
              >
                <span>➕</span> Add Student
              </button>
            )}
          </div>
        </header>

        {/* 1. DASHBOARD VIEW */}
        {currentTab === 'dashboard' && (
          <section id="view-dashboard">
            {/* Quick Metrics Grid */}
            <div className="metrics-grid">
              <div className="stat-card primary" id="stat-total-students">
                <div className="stat-info">
                  <span className="stat-label">Total Enrollment</span>
                  <span className="stat-value">{totalStudents}</span>
                  <span className="stat-change positive">
                    📈 +12% this semester
                  </span>
                </div>
                <div className="stat-icon">👥</div>
              </div>

              <div className="stat-card success" id="stat-avg-attendance">
                <div className="stat-info">
                  <span className="stat-label">Avg Attendance</span>
                  <span className="stat-value">{avgAttendance}%</span>
                  <span className="stat-change positive">
                    📈 +1.2% overall
                  </span>
                </div>
                <div className="stat-icon">🕒</div>
              </div>

              <div className="stat-card info" id="stat-active-students">
                <div className="stat-info">
                  <span className="stat-label">Active Records</span>
                  <span className="stat-value">{activeCount}</span>
                  <span className="stat-change positive">
                    🟢 Normal status
                  </span>
                </div>
                <div className="stat-icon">🔥</div>
              </div>

              <div className="stat-card warning" id="stat-flagged-students">
                <div className="stat-info">
                  <span className="stat-label">Flagged Issues</span>
                  <span className="stat-value">{probationCount + suspendedCount}</span>
                  <span className="stat-change negative">
                    ⚠️ Require Review
                  </span>
                </div>
                <div className="stat-icon">🚨</div>
              </div>
            </div>

            {/* Visual Analytics Section */}
            <div className="analytics-grid">
              
              {/* SVG Spline Trend Chart */}
              <div className="chart-card">
                <div className="card-header">
                  <h3 className="card-title">Enrollment Trend (6 Months)</h3>
                  <span className="header-subtitle">Live registration curve</span>
                </div>
                
                <div className="chart-container">
                  <svg className="svg-chart" viewBox="0 0 500 220" preserveAspectRatio="none">
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Chart Grid Lines */}
                    <line x1="40" y1="30" x2="480" y2="30" className="chart-grid-line" />
                    <line x1="40" y1="80" x2="480" y2="80" className="chart-grid-line" />
                    <line x1="40" y1="130" x2="480" y2="130" className="chart-grid-line" />
                    <line x1="40" y1="180" x2="480" y2="180" className="chart-grid-line" />

                    {/* Grid Y Axis Labels */}
                    <text x="15" y="34" className="chart-label">100</text>
                    <text x="15" y="84" className="chart-label">75</text>
                    <text x="15" y="134" className="chart-label">50</text>
                    <text x="15" y="184" className="chart-label">25</text>

                    {/* Trend Curve and Gradient Fill */}
                    <path
                      d="M 40 180 Q 120 150 200 120 T 360 70 T 480 50"
                      className="chart-area"
                    />
                    <path d="M 40 180 Q 120 150 200 120 T 360 70 T 480 50" className="chart-line" />

                    {/* Interactive points */}
                    <circle cx="40" cy="180" r="5" className="chart-point" onClick={() => addToast('Jan: 25 Enrolls', 'info')} />
                    <circle cx="150" cy="140" r="5" className="chart-point" onClick={() => addToast('Feb: 45 Enrolls', 'info')} />
                    <circle cx="260" cy="100" r="5" className="chart-point" onClick={() => addToast('Mar: 60 Enrolls', 'info')} />
                    <circle cx="370" cy="65" r="5" className="chart-point" onClick={() => addToast('Apr: 80 Enrolls', 'info')} />
                    <circle cx="480" cy="50" r="5" className="chart-point" onClick={() => addToast('May: 95 Enrolls', 'info')} />

                    {/* X Axis Labels */}
                    <text x="35" y="210" className="chart-label">Jan</text>
                    <text x="145" y="210" className="chart-label">Feb</text>
                    <text x="255" y="210" className="chart-label">Mar</text>
                    <text x="365" y="210" className="chart-label">Apr</text>
                    <text x="470" y="210" className="chart-label">May</text>
                  </svg>
                </div>
              </div>

              {/* Progress-based Breakdown */}
              <div className="chart-card">
                <div className="card-header">
                  <h3 className="card-title">Attendance Level Metrics</h3>
                  <span className="header-subtitle">Performance breakdown</span>
                </div>
                
                <div className="distribution-list">
                  <div className="distribution-item">
                    <div className="distribution-info">
                      <span className="dist-label">Excellent (90%+)</span>
                      <span className="dist-count">{highAttendanceCount} ({getPercentage(highAttendanceCount)})</span>
                    </div>
                    <div className="dist-bar-bg">
                      <div className="dist-bar-fill violet" style={{ width: getPercentage(highAttendanceCount) }}></div>
                    </div>
                  </div>

                  <div className="distribution-item">
                    <div className="distribution-info">
                      <span className="dist-label">Good (80-90%)</span>
                      <span className="dist-count">{goodAttendanceCount} ({getPercentage(goodAttendanceCount)})</span>
                    </div>
                    <div className="dist-bar-bg">
                      <div className="dist-bar-fill emerald" style={{ width: getPercentage(goodAttendanceCount) }}></div>
                    </div>
                  </div>

                  <div className="distribution-item">
                    <div className="distribution-info">
                      <span className="dist-label">Average (70-80%)</span>
                      <span className="dist-count">{averageAttendanceCount} ({getPercentage(averageAttendanceCount)})</span>
                    </div>
                    <div className="dist-bar-bg">
                      <div className="dist-bar-fill amber" style={{ width: getPercentage(averageAttendanceCount) }}></div>
                    </div>
                  </div>

                  <div className="distribution-item">
                    <div className="distribution-info">
                      <span className="dist-label">At Risk (&lt;70%)</span>
                      <span className="dist-count">{poorAttendanceCount} ({getPercentage(poorAttendanceCount)})</span>
                    </div>
                    <div className="dist-bar-bg">
                      <div className="dist-bar-fill rose" style={{ width: getPercentage(poorAttendanceCount) }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity History Logs */}
            <div className="activity-card">
              <div className="card-header">
                <h3 className="card-title">Academic Logs & Feed</h3>
                <span className="header-subtitle">Live events occurring in school database</span>
              </div>
              <div className="activity-list">
                {activities.map((act) => (
                  <div key={act.id} className="activity-item">
                    <div className={`activity-badge ${act.type}`}>
                      {act.type === 'add' && '➕'}
                      {act.type === 'update' && '✏️'}
                      {act.type === 'delete' && '🗑️'}
                    </div>
                    <div className="activity-details">
                      <span className="activity-desc">{act.desc}</span>
                      <span className="activity-time">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 2. DIRECTORY VIEW */}
        {currentTab === 'directory' && (
          <section id="view-directory">
            
            {/* Toolbar Filter Controls */}
            <div className="filter-toolbar">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  id="input-search"
                  type="text"
                  placeholder="Search name, email, or courses..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <select
                  id="select-grade"
                  className="filter-select"
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                >
                  <option value="All">All Grades</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>

                <select
                  id="select-status"
                  className="filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Probation">Probation</option>
                  <option value="Suspended">Suspended</option>
                </select>

                {(searchTerm || gradeFilter !== 'All' || statusFilter !== 'All') && (
                  <button
                    className="secondary-btn"
                    onClick={() => {
                      setSearchTerm('');
                      setGradeFilter('All');
                      setStatusFilter('All');
                      addToast('Reset filters successfully', 'info');
                    }}
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Directory List Table */}
            <div className="table-card">
              <div className="table-wrapper">
                {filteredStudents.length > 0 ? (
                  <table className="students-table">
                    <thead>
                      <tr>
                        <th>Student Info</th>
                        <th>Grade</th>
                        <th>Age</th>
                        <th>Enrolled Courses</th>
                        <th>Attendance</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.id} id={`row-${student.id}`}>
                          <td>
                            <div className="student-bio-cell">
                              <div
                                className="student-table-avatar"
                                style={{ background: student.avatarBg }}
                              >
                                {getInitials(student.name)}
                              </div>
                              <div className="student-meta">
                                <span className="student-name">{student.name}</span>
                                <span className="student-email">{student.email}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <strong>{student.grade}</strong>
                          </td>
                          <td>{student.age} yrs</td>
                          <td>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              {student.courses}
                            </span>
                          </td>
                          <td>
                            <div className="attendance-cell">
                              <div className="attendance-header">
                                <span
                                  className={`attendance-percentage ${
                                    student.attendance >= 90
                                      ? 'high'
                                      : student.attendance >= 75
                                      ? 'medium'
                                      : 'low'
                                  }`}
                                >
                                  {student.attendance}%
                                </span>
                              </div>
                              <div className="attendance-progress-bg">
                                <div
                                  className={`attendance-progress-fill ${
                                    student.attendance >= 90
                                      ? 'high'
                                      : student.attendance >= 75
                                      ? 'medium'
                                      : 'low'
                                  }`}
                                  style={{ width: `${student.attendance}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                student.status === 'Active'
                                  ? 'active'
                                  : student.status === 'Probation'
                                  ? 'probation'
                                  : 'suspended'
                              }`}
                            >
                              <span className="badge-pulse"></span>
                              {student.status}
                            </span>
                          </td>
                          <td>
                            <div className="actions-cell-wrapper">
                              <button
                                className="action-btn edit"
                                onClick={() => handleEditClick(student)}
                                title="Edit profile details"
                              >
                                ✏️
                              </button>
                              <button
                                className="action-btn delete"
                                onClick={() => handleDeleteClick(student)}
                                title="Delete record"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-state">
                    <span className="empty-icon">📂</span>
                    <h3 className="empty-title">No Students Found</h3>
                    <span className="empty-subtitle">
                      No student matches your current search term or filter configuration.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 3. ADD / EDIT FORM VIEW */}
        {currentTab === 'form' && (
          <section id="view-form">
            <div className="form-layout-wrapper">
              
              {/* Form Input fields card */}
              <form className="form-card" onSubmit={handleFormSubmit}>
                <h3 className="card-title" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  {formMode === 'add' ? 'Student Enrollment Sheet' : 'Academic Adjustment Sheet'}
                </h3>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      id="input-form-name"
                      type="text"
                      placeholder="e.g. Harry James Potter"
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                    />
                    {errors.name && <span className="validation-error">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      id="input-form-email"
                      type="email"
                      placeholder="harry@hogwarts.edu"
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                    />
                    {errors.email && <span className="validation-error">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Age (years)</label>
                    <input
                      id="input-form-age"
                      type="number"
                      placeholder="17"
                      className={`form-input ${errors.age ? 'error' : ''}`}
                      value={formAge}
                      onChange={(e) => setFormAge(e.target.value)}
                    />
                    {errors.age && <span className="validation-error">{errors.age}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Grade Classification</label>
                    <select
                      id="select-form-grade"
                      className="filter-select"
                      style={{ width: '100%' }}
                      value={formGrade}
                      onChange={(e) => setFormGrade(e.target.value)}
                    >
                      <option value="Grade 10">Grade 10</option>
                      <option value="Grade 11">Grade 11</option>
                      <option value="Grade 12">Grade 12</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Enrolled Courses (comma separated)</label>
                    <input
                      id="input-form-courses"
                      type="text"
                      placeholder="Defense Against the Dark Arts, Potions, Transfiguration"
                      className="form-input"
                      value={formCourses}
                      onChange={(e) => setFormCourses(e.target.value)}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Attendance Metrics ({formAttendance}%)</label>
                    <div className="slider-container">
                      <input
                        id="input-form-attendance"
                        type="range"
                        min="0"
                        max="100"
                        className="form-range"
                        value={formAttendance}
                        onChange={(e) => setFormAttendance(Number(e.target.value))}
                      />
                      <span className="slider-value">{formAttendance}%</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Academic Status</label>
                    <select
                      id="select-form-status"
                      className="filter-select"
                      style={{ width: '100%' }}
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                    >
                      <option value="Active">Active</option>
                      <option value="Probation">Probation</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="secondary-btn" onClick={resetForm}>
                    Clear Fields
                  </button>
                  <button type="submit" id="btn-form-submit" className="primary-btn">
                    <span>💾</span> {formMode === 'add' ? 'Register Student' : 'Save Adjustments'}
                  </button>
                </div>
              </form>

              {/* Dynamic Preview card */}
              <div className="preview-card">
                <h4 className="stat-label" style={{ marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Visual Avatar Preview
                </h4>
                <div
                  className="preview-avatar"
                  style={{
                    background: formMode === 'edit'
                      ? (students.find((s) => s.id === editingStudentId)?.avatarBg || AVATAR_GRADIENTS[0])
                      : AVATAR_GRADIENTS[0],
                  }}
                >
                  {getInitials(formName || 'New Student')}
                </div>
                <h3 className="preview-name">{formName || 'New Student Profile'}</h3>
                <span className="preview-email">{formEmail || 'profile@lumina.edu'}</span>

                <div className="preview-stats">
                  <div className="preview-stat">
                    <span className="preview-stat-label">Classification</span>
                    <span className="preview-stat-val">{formGrade}</span>
                  </div>
                  <div className="preview-stat">
                    <span className="preview-stat-label">Attendance Score</span>
                    <span className="preview-stat-val" style={{ color: formAttendance >= 90 ? 'var(--success)' : formAttendance >= 75 ? 'var(--warning)' : 'var(--danger)' }}>
                      {formAttendance}%
                    </span>
                  </div>
                </div>

                <span
                  className={`badge ${
                    formStatus === 'Active'
                      ? 'active'
                      : formStatus === 'Probation'
                      ? 'probation'
                      : 'suspended'
                  }`}
                >
                  <span className="badge-pulse"></span>
                  {formStatus}
                </span>
              </div>

            </div>
          </section>
        )}

      </main>
    </div>
  );
}
