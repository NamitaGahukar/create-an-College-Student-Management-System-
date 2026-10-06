/**
 * Veritas University College Student Management System (CSMS)
 * Data Layer & Persistent Storage Service
 */

const SEED_DEPARTMENTS = [
  { id: "DEP-CS", code: "CSE", name: "Computer Science & Engineering" },
  { id: "DEP-DS", code: "DSAI", name: "Data Science & Artificial Intelligence" },
  { id: "DEP-EE", code: "EEE", name: "Electrical & Electronics Engineering" },
  { id: "DEP-ME", code: "MECH", name: "Mechanical Engineering" },
  { id: "DEP-BA", code: "BBA", name: "Business Administration & Management" }
];

const SEED_COURSES = [
  {
    id: "CRS-101",
    code: "CS101",
    title: "Data Structures & Algorithms",
    department: "Computer Science & Engineering",
    credits: 4,
    instructor: "Dr. Alan Turing",
    instructorEmail: "a.turing@cs.veritas.edu",
    semester: 3,
    schedule: "Mon, Wed 09:30 - 11:00 AM",
    room: "Turing Hall 204",
    capacity: 45,
    status: "Active",
    description: "Algorithmic complexity, linear data structures, balanced trees, heaps, graphs, hashing, and sorting algorithms."
  },
  {
    id: "CRS-102",
    code: "CS102",
    title: "Database Management Systems",
    department: "Computer Science & Engineering",
    credits: 4,
    instructor: "Dr. Edgar Codd",
    instructorEmail: "e.codd@cs.veritas.edu",
    semester: 3,
    schedule: "Tue, Thu 11:15 - 12:45 PM",
    room: "Computing Lab C-1",
    capacity: 40,
    status: "Active",
    description: "Relational algebra, SQL, normalization, ACID properties, indexing, query optimization, and transaction handling."
  },
  {
    id: "CRS-103",
    code: "DS201",
    title: "Applied Machine Learning",
    department: "Data Science & Artificial Intelligence",
    credits: 3,
    instructor: "Prof. Geoffrey Hinton",
    instructorEmail: "g.hinton@ds.veritas.edu",
    semester: 5,
    schedule: "Mon, Fri 02:00 - 03:30 PM",
    room: "AI Sandbox 302",
    capacity: 35,
    status: "Active",
    description: "Supervised and unsupervised learning, regression, classification trees, neural networks, cross-validation and metrics."
  },
  {
    id: "CRS-104",
    code: "EE205",
    title: "Signals and Systems",
    department: "Electrical & Electronics Engineering",
    credits: 4,
    instructor: "Dr. Claude Shannon",
    instructorEmail: "c.shannon@ee.veritas.edu",
    semester: 3,
    schedule: "Wed, Fri 10:00 - 11:30 AM",
    room: "Ampere Hall 101",
    capacity: 40,
    status: "Active",
    description: "Continuous and discrete-time signals, LTI systems, Fourier analysis, Laplace and Z-transforms, filtering."
  },
  {
    id: "CRS-105",
    code: "ME202",
    title: "Thermodynamics & Heat Transfer",
    department: "Mechanical Engineering",
    credits: 4,
    instructor: "Dr. Sadi Carnot",
    instructorEmail: "s.carnot@me.veritas.edu",
    semester: 3,
    schedule: "Tue, Thu 09:00 - 10:30 AM",
    room: "Watt Complex 110",
    capacity: 35,
    status: "Active",
    description: "Laws of thermodynamics, entropy, power cycles, conduction, convection, radiation heat transfer."
  },
  {
    id: "CRS-106",
    code: "BA301",
    title: "Financial Accounting & Valuation",
    department: "Business Administration & Management",
    credits: 3,
    instructor: "Prof. Benjamin Graham",
    instructorEmail: "b.graham@ba.veritas.edu",
    semester: 3,
    schedule: "Mon, Wed 01:15 - 02:45 PM",
    room: "Executive Suite 405",
    capacity: 50,
    status: "Active",
    description: "Financial statement analysis, balance sheet ratios, cash flows, corporate finance fundamentals, valuation models."
  },
  {
    id: "CRS-107",
    code: "CS204",
    title: "Computer Networks & Protocols",
    department: "Computer Science & Engineering",
    credits: 3,
    instructor: "Prof. Vint Cerf",
    instructorEmail: "v.cerf@cs.veritas.edu",
    semester: 5,
    schedule: "Tue, Fri 01:00 - 02:30 PM",
    room: "Turing Hall 206",
    capacity: 40,
    status: "Active",
    description: "OSI and TCP/IP stack, routing protocols, flow control, transport layer security, socket programming."
  },
  {
    id: "CRS-108",
    code: "MATH201",
    title: "Linear Algebra & Vector Calculus",
    department: "Computer Science & Engineering",
    credits: 4,
    instructor: "Dr. Emmy Noether",
    instructorEmail: "e.noether@math.veritas.edu",
    semester: 3,
    schedule: "Thu, Sat 10:00 - 11:30 AM",
    room: "Euler Auditorium",
    capacity: 60,
    status: "Active",
    description: "Vector spaces, linear transformations, eigenvalues/eigenvectors, multivariable calculus, Green's & Stokes' theorems."
  }
];

const SEED_STUDENTS = [
  {
    id: "STU-2024-001",
    rollNo: "CS-2024-001",
    firstName: "Elena",
    lastName: "Rostova",
    email: "e.rostova@students.veritas.edu",
    phone: "+1 (555) 234-8901",
    gender: "Female",
    dob: "2004-04-12",
    department: "Computer Science & Engineering",
    semester: 3,
    academicYear: "2nd Year",
    enrollmentDate: "2023-08-20",
    status: "Active",
    advisor: "Dr. Alan Turing",
    enrolledCourseIds: ["CRS-101", "CRS-102", "CRS-108"],
    address: "Campus Residence Hall 3, Suite 204",
    bloodGroup: "O+",
    guardianName: "Mikhail Rostov",
    guardianPhone: "+1 (555) 901-2345"
  },
  {
    id: "STU-2024-002",
    rollNo: "CS-2024-002",
    firstName: "Marcus",
    lastName: "Vance",
    email: "m.vance@students.veritas.edu",
    phone: "+1 (555) 345-1290",
    gender: "Male",
    dob: "2003-11-28",
    department: "Computer Science & Engineering",
    semester: 3,
    academicYear: "2nd Year",
    enrollmentDate: "2023-08-20",
    status: "Active",
    advisor: "Dr. Alan Turing",
    enrolledCourseIds: ["CRS-101", "CRS-102", "CRS-108"],
    address: "410 University Ave, Apt 3B, Metro City",
    bloodGroup: "A+",
    guardianName: "David Vance",
    guardianPhone: "+1 (555) 872-9102"
  },
  {
    id: "STU-2024-003",
    rollNo: "CS-2024-003",
    firstName: "Aaliyah",
    lastName: "Patel",
    email: "a.patel@students.veritas.edu",
    phone: "+1 (555) 456-7812",
    gender: "Female",
    dob: "2004-02-19",
    department: "Computer Science & Engineering",
    semester: 3,
    academicYear: "2nd Year",
    enrollmentDate: "2023-08-20",
    status: "Active",
    advisor: "Dr. Edgar Codd",
    enrolledCourseIds: ["CRS-101", "CRS-102", "CRS-108"],
    address: "Campus Residence Hall 1, Room 112",
    bloodGroup: "B+",
    guardianName: "Rajesh Patel",
    guardianPhone: "+1 (555) 654-3210"
  },
  {
    id: "STU-2024-004",
    rollNo: "CS-2024-004",
    firstName: "Julian",
    lastName: "Kovac",
    email: "j.kovac@students.veritas.edu",
    phone: "+1 (555) 567-2341",
    gender: "Male",
    dob: "2003-09-05",
    department: "Computer Science & Engineering",
    semester: 3,
    academicYear: "2nd Year",
    enrollmentDate: "2023-08-20",
    status: "Active",
    advisor: "Dr. Alan Turing",
    enrolledCourseIds: ["CRS-101", "CRS-102", "CRS-108"],
    address: "18 North Campus Way, Metro City",
    bloodGroup: "AB+",
    guardianName: "Stefan Kovac",
    guardianPhone: "+1 (555) 432-8765"
  },
  {
    id: "STU-2024-005",
    rollNo: "CS-2024-005",
    firstName: "Claire",
    lastName: "Dubois",
    email: "c.dubois@students.veritas.edu",
    phone: "+1 (555) 678-9012",
    gender: "Female",
    dob: "2004-07-22",
    department: "Computer Science & Engineering",
    semester: 3,
    academicYear: "2nd Year",
    enrollmentDate: "2023-08-20",
    status: "Active",
    advisor: "Dr. Edgar Codd",
    enrolledCourseIds: ["CRS-101", "CRS-102"],
    address: "215 College Green, Unit 5",
    bloodGroup: "O-",
    guardianName: "Henri Dubois",
    guardianPhone: "+1 (555) 321-7890"
  },
  {
    id: "STU-2024-006",
    rollNo: "CS-2024-006",
    firstName: "Devon",
    lastName: "Brooks",
    email: "d.brooks@students.veritas.edu",
    phone: "+1 (555) 789-3456",
    gender: "Male",
    dob: "2003-12-14",
    department: "Computer Science & Engineering",
    semester: 3,
    academicYear: "2nd Year",
    enrollmentDate: "2023-08-20",
    status: "Active",
    advisor: "Dr. Alan Turing",
    enrolledCourseIds: ["CRS-101", "CRS-102", "CRS-108"],
    address: "Campus Residence Hall 4, Room 310",
    bloodGroup: "A-",
    guardianName: "Laura Brooks",
    guardianPhone: "+1 (555) 210-9876"
  },
  {
    id: "STU-2024-007",
    rollNo: "CS-2024-007",
    firstName: "Siddharth",
    lastName: "Menon",
    email: "s.menon@students.veritas.edu",
    phone: "+1 (555) 890-4567",
    gender: "Male",
    dob: "2004-01-30",
    department: "Computer Science & Engineering",
    semester: 3,
    academicYear: "2nd Year",
    enrollmentDate: "2023-08-20",
    status: "Active",
    advisor: "Dr. Edgar Codd",
    enrolledCourseIds: ["CRS-101", "CRS-102", "CRS-108"],
    address: "Campus Residence Hall 2, Room 402",
    bloodGroup: "B+",
    guardianName: "Gopal Menon",
    guardianPhone: "+1 (555) 109-8765"
  },
  {
    id: "STU-2024-008",
    rollNo: "CS-2024-008",
    firstName: "Hanna",
    lastName: "Lindqvist",
    email: "h.lindqvist@students.veritas.edu",
    phone: "+1 (555) 901-5678",
    gender: "Female",
    dob: "2004-06-08",
    department: "Computer Science & Engineering",
    semester: 3,
    academicYear: "2nd Year",
    enrollmentDate: "2023-08-20",
    status: "Active",
    advisor: "Dr. Alan Turing",
    enrolledCourseIds: ["CRS-101", "CRS-102"],
    address: "88 University Oaks, Townhouse 12",
    bloodGroup: "O+",
    guardianName: "Astrid Lindqvist",
    guardianPhone: "+1 (555) 098-7654"
  },
  {
    id: "STU-2024-009",
    rollNo: "DS-2024-001",
    firstName: "Kai",
    lastName: "Takahashi",
    email: "k.takahashi@students.veritas.edu",
    phone: "+1 (555) 112-2334",
    gender: "Non-Binary",
    dob: "2003-03-17",
    department: "Data Science & Artificial Intelligence",
    semester: 5,
    academicYear: "3rd Year",
    enrollmentDate: "2022-08-22",
    status: "Active",
    advisor: "Prof. Geoffrey Hinton",
    enrolledCourseIds: ["CRS-103", "CRS-107", "CRS-108"],
    address: "Campus Residence Hall 5, Suite 101",
    bloodGroup: "A+",
    guardianName: "Kenji Takahashi",
    guardianPhone: "+1 (555) 987-6543"
  },
  {
    id: "STU-2024-010",
    rollNo: "DS-2024-002",
    firstName: "Maya",
    lastName: "Al-Mansoor",
    email: "m.almansoor@students.veritas.edu",
    phone: "+1 (555) 223-3445",
    gender: "Female",
    dob: "2003-10-02",
    department: "Data Science & Artificial Intelligence",
    semester: 5,
    academicYear: "3rd Year",
    enrollmentDate: "2022-08-22",
    status: "Active",
    advisor: "Prof. Geoffrey Hinton",
    enrolledCourseIds: ["CRS-103", "CRS-107"],
    address: "Campus Residence Hall 1, Room 224",
    bloodGroup: "O+",
    guardianName: "Tariq Al-Mansoor",
    guardianPhone: "+1 (555) 876-5432"
  },
  {
    id: "STU-2024-011",
    rollNo: "DS-2024-003",
    firstName: "Leo",
    lastName: "Moretti",
    email: "l.moretti@students.veritas.edu",
    phone: "+1 (555) 334-4556",
    gender: "Male",
    dob: "2003-08-11",
    department: "Data Science & Artificial Intelligence",
    semester: 5,
    academicYear: "3rd Year",
    enrollmentDate: "2022-08-22",
    status: "Active",
    advisor: "Prof. Geoffrey Hinton",
    enrolledCourseIds: ["CRS-103", "CRS-107", "CRS-108"],
    address: "64 Elm St, Apt 2A, Metro City",
    bloodGroup: "B-",
    guardianName: "Carlo Moretti",
    guardianPhone: "+1 (555) 765-4321"
  },
  {
    id: "STU-2024-012",
    rollNo: "EE-2024-001",
    firstName: "Zara",
    lastName: "Chen",
    email: "z.chen@students.veritas.edu",
    phone: "+1 (555) 445-5667",
    gender: "Female",
    dob: "2004-05-03",
    department: "Electrical & Electronics Engineering",
    semester: 3,
    academicYear: "2nd Year",
    enrollmentDate: "2023-08-20",
    status: "Active",
    advisor: "Dr. Claude Shannon",
    enrolledCourseIds: ["CRS-104", "CRS-108"],
    address: "Campus Residence Hall 3, Suite 308",
    bloodGroup: "AB-",
    guardianName: "Wei Chen",
    guardianPhone: "+1 (555) 654-9870"
  },
  {
    id: "STU-2024-013",
    rollNo: "EE-2024-002",
    firstName: "Mateo",
    lastName: "Hernandez",
    email: "m.hernandez@students.veritas.edu",
    phone: "+1 (555) 556-6778",
    gender: "Male",
    dob: "2004-09-18",
    department: "Electrical & Electronics Engineering",
    semester: 3,
    academicYear: "2nd Year",
    enrollmentDate: "2023-08-20",
    status: "Active",
    advisor: "Dr. Claude Shannon",
    enrolledCourseIds: ["CRS-104", "CRS-108"],
    address: "Campus Residence Hall 2, Room 215",
    bloodGroup: "O+",
    guardianName: "Carlos Hernandez",
    guardianPhone: "+1 (555) 543-2109"
  },
  {
    id: "STU-2024-014",
    rollNo: "ME-2024-001",
    firstName: "Chloe",
    lastName: "Johansson",
    email: "c.johansson@students.veritas.edu",
    phone: "+1 (555) 667-7889",
    gender: "Female",
    dob: "2004-03-29",
    department: "Mechanical Engineering",
    semester: 3,
    academicYear: "2nd Year",
    enrollmentDate: "2023-08-20",
    status: "Active",
    advisor: "Dr. Sadi Carnot",
    enrolledCourseIds: ["CRS-105", "CRS-108"],
    address: "Campus Residence Hall 4, Room 108",
    bloodGroup: "A+",
    guardianName: "Lars Johansson",
    guardianPhone: "+1 (555) 432-1098"
  },
  {
    id: "STU-2024-015",
    rollNo: "ME-2024-002",
    firstName: "Isaac",
    lastName: "Okonkwo",
    email: "i.okonkwo@students.veritas.edu",
    phone: "+1 (555) 778-8990",
    gender: "Male",
    dob: "2004-01-15",
    department: "Mechanical Engineering",
    semester: 3,
    academicYear: "2nd Year",
    enrollmentDate: "2023-08-20",
    status: "Active",
    advisor: "Dr. Sadi Carnot",
    enrolledCourseIds: ["CRS-105", "CRS-108"],
    address: "52 University Heights, Flat 7",
    bloodGroup: "B+",
    guardianName: "Chinedu Okonkwo",
    guardianPhone: "+1 (555) 321-0987"
  },
  {
    id: "STU-2024-016",
    rollNo: "BA-2024-001",
    firstName: "Victoria",
    lastName: "Sterling",
    email: "v.sterling@students.veritas.edu",
    phone: "+1 (555) 889-9001",
    gender: "Female",
    dob: "2004-12-05",
    department: "Business Administration & Management",
    semester: 3,
    academicYear: "2nd Year",
    enrollmentDate: "2023-08-20",
    status: "Active",
    advisor: "Prof. Benjamin Graham",
    enrolledCourseIds: ["CRS-106"],
    address: "Campus Residence Hall 1, Room 418",
    bloodGroup: "O+",
    guardianName: "Richard Sterling",
    guardianPhone: "+1 (555) 210-9870"
  },
  {
    id: "STU-2024-017",
    rollNo: "BA-2024-002",
    firstName: "Tariq",
    lastName: "Nasser",
    email: "t.nasser@students.veritas.edu",
    phone: "+1 (555) 990-0112",
    gender: "Male",
    dob: "2003-07-25",
    department: "Business Administration & Management",
    semester: 3,
    academicYear: "2nd Year",
    enrollmentDate: "2023-08-20",
    status: "Active",
    advisor: "Prof. Benjamin Graham",
    enrolledCourseIds: ["CRS-106"],
    address: "14 Highland Terrace, Metro City",
    bloodGroup: "A+",
    guardianName: "Adnan Nasser",
    guardianPhone: "+1 (555) 109-8701"
  },
  {
    id: "STU-2024-018",
    rollNo: "CS-2024-009",
    firstName: "Nadia",
    lastName: "Volkova",
    email: "n.volkova@students.veritas.edu",
    phone: "+1 (555) 123-4500",
    gender: "Female",
    dob: "2004-10-10",
    department: "Computer Science & Engineering",
    semester: 3,
    academicYear: "2nd Year",
    enrollmentDate: "2023-08-20",
    status: "Active",
    advisor: "Dr. Alan Turing",
    enrolledCourseIds: ["CRS-101", "CRS-102"],
    address: "Campus Residence Hall 3, Room 118",
    bloodGroup: "B-",
    guardianName: "Oleg Volkov",
    guardianPhone: "+1 (555) 678-0123"
  },
  {
    id: "STU-2024-019",
    rollNo: "CS-2024-010",
    firstName: "Ethan",
    lastName: "Hawthorne",
    email: "e.hawthorne@students.veritas.edu",
    phone: "+1 (555) 234-5601",
    gender: "Male",
    dob: "2003-06-18",
    department: "Computer Science & Engineering",
    semester: 3,
    academicYear: "2nd Year",
    enrollmentDate: "2023-08-20",
    status: "Active",
    advisor: "Dr. Edgar Codd",
    enrolledCourseIds: ["CRS-101", "CRS-102", "CRS-108"],
    address: "Campus Residence Hall 2, Room 301",
    bloodGroup: "O+",
    guardianName: "Arthur Hawthorne",
    guardianPhone: "+1 (555) 789-1234"
  },
  {
    id: "STU-2024-020",
    rollNo: "CS-2024-011",
    firstName: "Priya",
    lastName: "Sharma",
    email: "p.sharma@students.veritas.edu",
    phone: "+1 (555) 345-6702",
    gender: "Female",
    dob: "2004-08-29",
    department: "Computer Science & Engineering",
    semester: 3,
    academicYear: "2nd Year",
    enrollmentDate: "2023-08-20",
    status: "Active",
    advisor: "Dr. Alan Turing",
    enrolledCourseIds: ["CRS-101", "CRS-102", "CRS-108"],
    address: "Campus Residence Hall 5, Room 404",
    bloodGroup: "AB+",
    guardianName: "Sunil Sharma",
    guardianPhone: "+1 (555) 890-2345"
  }
];

// Realistic Marks Seed Data (Internal out of 30, Assignment out of 20, Final Exam out of 50)
const SEED_MARKS = [
  // Elena Rostova (STU-2024-001) - Top Performer
  { id: "MRK-001", studentId: "STU-2024-001", courseId: "CRS-101", semester: 3, internalScore: 28, assignmentScore: 19, finalExamScore: 47 },
  { id: "MRK-002", studentId: "STU-2024-001", courseId: "CRS-102", semester: 3, internalScore: 29, assignmentScore: 20, finalExamScore: 48 },
  { id: "MRK-003", studentId: "STU-2024-001", courseId: "CRS-108", semester: 3, internalScore: 27, assignmentScore: 18, finalExamScore: 45 },

  // Marcus Vance (STU-2024-002) - Good Performer
  { id: "MRK-004", studentId: "STU-2024-002", courseId: "CRS-101", semester: 3, internalScore: 24, assignmentScore: 17, finalExamScore: 40 },
  { id: "MRK-005", studentId: "STU-2024-002", courseId: "CRS-102", semester: 3, internalScore: 23, assignmentScore: 16, finalExamScore: 38 },
  { id: "MRK-006", studentId: "STU-2024-002", courseId: "CRS-108", semester: 3, internalScore: 25, assignmentScore: 18, finalExamScore: 42 },

  // Aaliyah Patel (STU-2024-003) - Consistent
  { id: "MRK-007", studentId: "STU-2024-003", courseId: "CRS-101", semester: 3, internalScore: 26, assignmentScore: 19, finalExamScore: 43 },
  { id: "MRK-008", studentId: "STU-2024-003", courseId: "CRS-102", semester: 3, internalScore: 25, assignmentScore: 17, finalExamScore: 41 },
  { id: "MRK-009", studentId: "STU-2024-003", courseId: "CRS-108", semester: 3, internalScore: 28, assignmentScore: 19, finalExamScore: 46 },

  // Julian Kovac (STU-2024-004) - At Risk / Needs Improvement
  { id: "MRK-010", studentId: "STU-2024-004", courseId: "CRS-101", semester: 3, internalScore: 14, assignmentScore: 11, finalExamScore: 24 },
  { id: "MRK-011", studentId: "STU-2024-004", courseId: "CRS-102", semester: 3, internalScore: 15, assignmentScore: 12, finalExamScore: 26 },
  { id: "MRK-012", studentId: "STU-2024-004", courseId: "CRS-108", semester: 3, internalScore: 13, assignmentScore: 10, finalExamScore: 22 },

  // Claire Dubois (STU-2024-005) - Above Average
  { id: "MRK-013", studentId: "STU-2024-005", courseId: "CRS-101", semester: 3, internalScore: 25, assignmentScore: 18, finalExamScore: 42 },
  { id: "MRK-014", studentId: "STU-2024-005", courseId: "CRS-102", semester: 3, internalScore: 26, assignmentScore: 19, finalExamScore: 44 },

  // Devon Brooks (STU-2024-006) - Struggling / Low Attendance and Grades
  { id: "MRK-015", studentId: "STU-2024-006", courseId: "CRS-101", semester: 3, internalScore: 12, assignmentScore: 9, finalExamScore: 21 },
  { id: "MRK-016", studentId: "STU-2024-006", courseId: "CRS-102", semester: 3, internalScore: 14, assignmentScore: 10, finalExamScore: 23 },
  { id: "MRK-017", studentId: "STU-2024-006", courseId: "CRS-108", semester: 3, internalScore: 11, assignmentScore: 8, finalExamScore: 19 },

  // Siddharth Menon (STU-2024-007) - Solid B+/A-
  { id: "MRK-018", studentId: "STU-2024-007", courseId: "CRS-101", semester: 3, internalScore: 23, assignmentScore: 16, finalExamScore: 39 },
  { id: "MRK-019", studentId: "STU-2024-007", courseId: "CRS-102", semester: 3, internalScore: 24, assignmentScore: 17, finalExamScore: 41 },
  { id: "MRK-020", studentId: "STU-2024-007", courseId: "CRS-108", semester: 3, internalScore: 22, assignmentScore: 15, finalExamScore: 37 },

  // Hanna Lindqvist (STU-2024-008)
  { id: "MRK-021", studentId: "STU-2024-008", courseId: "CRS-101", semester: 3, internalScore: 27, assignmentScore: 18, finalExamScore: 44 },
  { id: "MRK-022", studentId: "STU-2024-008", courseId: "CRS-102", semester: 3, internalScore: 28, assignmentScore: 19, finalExamScore: 45 },

  // Kai Takahashi (STU-2024-009) - High distinction
  { id: "MRK-023", studentId: "STU-2024-009", courseId: "CRS-103", semester: 5, internalScore: 29, assignmentScore: 20, finalExamScore: 48 },
  { id: "MRK-024", studentId: "STU-2024-009", courseId: "CRS-107", semester: 5, internalScore: 28, assignmentScore: 19, finalExamScore: 47 },
  { id: "MRK-025", studentId: "STU-2024-009", courseId: "CRS-108", semester: 5, internalScore: 29, assignmentScore: 20, finalExamScore: 49 },

  // Maya Al-Mansoor (STU-2024-010)
  { id: "MRK-026", studentId: "STU-2024-010", courseId: "CRS-103", semester: 5, internalScore: 26, assignmentScore: 18, finalExamScore: 43 },
  { id: "MRK-027", studentId: "STU-2024-010", courseId: "CRS-107", semester: 5, internalScore: 27, assignmentScore: 19, finalExamScore: 44 },

  // Leo Moretti (STU-2024-011)
  { id: "MRK-028", studentId: "STU-2024-011", courseId: "CRS-103", semester: 5, internalScore: 21, assignmentScore: 15, finalExamScore: 35 },
  { id: "MRK-029", studentId: "STU-2024-011", courseId: "CRS-107", semester: 5, internalScore: 22, assignmentScore: 14, finalExamScore: 36 },
  { id: "MRK-030", studentId: "STU-2024-011", courseId: "CRS-108", semester: 5, internalScore: 20, assignmentScore: 14, finalExamScore: 33 },

  // Zara Chen (STU-2024-012)
  { id: "MRK-031", studentId: "STU-2024-012", courseId: "CRS-104", semester: 3, internalScore: 27, assignmentScore: 19, finalExamScore: 46 },
  { id: "MRK-032", studentId: "STU-2024-012", courseId: "CRS-108", semester: 3, internalScore: 26, assignmentScore: 18, finalExamScore: 44 },

  // Mateo Hernandez (STU-2024-013)
  { id: "MRK-033", studentId: "STU-2024-013", courseId: "CRS-104", semester: 3, internalScore: 23, assignmentScore: 16, finalExamScore: 38 },
  { id: "MRK-034", studentId: "STU-2024-013", courseId: "CRS-108", semester: 3, internalScore: 22, assignmentScore: 15, finalExamScore: 36 },

  // Chloe Johansson (STU-2024-014)
  { id: "MRK-035", studentId: "STU-2024-014", courseId: "CRS-105", semester: 3, internalScore: 28, assignmentScore: 19, finalExamScore: 46 },
  { id: "MRK-036", studentId: "STU-2024-014", courseId: "CRS-108", semester: 3, internalScore: 27, assignmentScore: 18, finalExamScore: 45 },

  // Isaac Okonkwo (STU-2024-015)
  { id: "MRK-037", studentId: "STU-2024-015", courseId: "CRS-105", semester: 3, internalScore: 24, assignmentScore: 17, finalExamScore: 40 },
  { id: "MRK-038", studentId: "STU-2024-015", courseId: "CRS-108", semester: 3, internalScore: 23, assignmentScore: 16, finalExamScore: 39 },

  // Victoria Sterling (STU-2024-016)
  { id: "MRK-039", studentId: "STU-2024-016", courseId: "CRS-106", semester: 3, internalScore: 29, assignmentScore: 20, finalExamScore: 47 },

  // Tariq Nasser (STU-2024-017)
  { id: "MRK-040", studentId: "STU-2024-017", courseId: "CRS-106", semester: 3, internalScore: 25, assignmentScore: 17, finalExamScore: 41 },

  // Nadia Volkova (STU-2024-018)
  { id: "MRK-041", studentId: "STU-2024-018", courseId: "CRS-101", semester: 3, internalScore: 26, assignmentScore: 18, finalExamScore: 42 },
  { id: "MRK-042", studentId: "STU-2024-018", courseId: "CRS-102", semester: 3, internalScore: 27, assignmentScore: 18, finalExamScore: 43 },

  // Ethan Hawthorne (STU-2024-019)
  { id: "MRK-043", studentId: "STU-2024-019", courseId: "CRS-101", semester: 3, internalScore: 22, assignmentScore: 15, finalExamScore: 37 },
  { id: "MRK-044", studentId: "STU-2024-019", courseId: "CRS-102", semester: 3, internalScore: 21, assignmentScore: 14, finalExamScore: 35 },
  { id: "MRK-045", studentId: "STU-2024-019", courseId: "CRS-108", semester: 3, internalScore: 20, assignmentScore: 15, finalExamScore: 34 },

  // Priya Sharma (STU-2024-020)
  { id: "MRK-046", studentId: "STU-2024-020", courseId: "CRS-101", semester: 3, internalScore: 28, assignmentScore: 19, finalExamScore: 47 },
  { id: "MRK-047", studentId: "STU-2024-020", courseId: "CRS-102", semester: 3, internalScore: 29, assignmentScore: 20, finalExamScore: 48 },
  { id: "MRK-048", studentId: "STU-2024-020", courseId: "CRS-108", semester: 3, internalScore: 27, assignmentScore: 18, finalExamScore: 45 }
];

// Multi-session Attendance Seed Data across recent academic dates
const SEED_ATTENDANCE = [
  // Session 1: CS101 - 2026-09-15
  {
    id: "ATT-2026-09-15-CRS-101",
    courseId: "CRS-101",
    date: "2026-09-15",
    topic: "Introduction & Asymptotic Notations (Big-O)",
    records: {
      "STU-2024-001": "Present",
      "STU-2024-002": "Present",
      "STU-2024-003": "Present",
      "STU-2024-004": "Present",
      "STU-2024-005": "Present",
      "STU-2024-006": "Absent",
      "STU-2024-007": "Present",
      "STU-2024-008": "Present",
      "STU-2024-018": "Present",
      "STU-2024-019": "Present",
      "STU-2024-020": "Present"
    }
  },
  // Session 2: CS101 - 2026-09-18
  {
    id: "ATT-2026-09-18-CRS-101",
    courseId: "CRS-101",
    date: "2026-09-18",
    topic: "Linear Linked Lists & Pointer Manipulations",
    records: {
      "STU-2024-001": "Present",
      "STU-2024-002": "Present",
      "STU-2024-003": "Present",
      "STU-2024-004": "Absent",
      "STU-2024-005": "Present",
      "STU-2024-006": "Absent",
      "STU-2024-007": "Present",
      "STU-2024-008": "Present",
      "STU-2024-018": "Present",
      "STU-2024-019": "Late",
      "STU-2024-020": "Present"
    }
  },
  // Session 3: CS101 - 2026-09-22
  {
    id: "ATT-2026-09-22-CRS-101",
    courseId: "CRS-101",
    date: "2026-09-22",
    topic: "Stacks, Queues, and Circular Buffers",
    records: {
      "STU-2024-001": "Present",
      "STU-2024-002": "Late",
      "STU-2024-003": "Present",
      "STU-2024-004": "Absent",
      "STU-2024-005": "Present",
      "STU-2024-006": "Absent",
      "STU-2024-007": "Present",
      "STU-2024-008": "Present",
      "STU-2024-018": "Present",
      "STU-2024-019": "Present",
      "STU-2024-020": "Present"
    }
  },
  // Session 4: CS101 - 2026-09-25
  {
    id: "ATT-2026-09-25-CRS-101",
    courseId: "CRS-101",
    date: "2026-09-25",
    topic: "Binary Search Trees & Tree Traversals",
    records: {
      "STU-2024-001": "Present",
      "STU-2024-002": "Present",
      "STU-2024-003": "Present",
      "STU-2024-004": "Present",
      "STU-2024-005": "Present",
      "STU-2024-006": "Absent",
      "STU-2024-007": "Present",
      "STU-2024-008": "Present",
      "STU-2024-018": "Excused",
      "STU-2024-019": "Present",
      "STU-2024-020": "Present"
    }
  },
  // Session 5: CS101 - 2026-09-29
  {
    id: "ATT-2026-09-29-CRS-101",
    courseId: "CRS-101",
    date: "2026-09-29",
    topic: "AVL Trees & Self-Balancing Rotations",
    records: {
      "STU-2024-001": "Present",
      "STU-2024-002": "Present",
      "STU-2024-003": "Present",
      "STU-2024-004": "Absent",
      "STU-2024-005": "Present",
      "STU-2024-006": "Late",
      "STU-2024-007": "Present",
      "STU-2024-008": "Present",
      "STU-2024-018": "Present",
      "STU-2024-019": "Present",
      "STU-2024-020": "Present"
    }
  },
  // Session 6: CS101 - 2026-10-02
  {
    id: "ATT-2026-10-02-CRS-101",
    courseId: "CRS-101",
    date: "2026-10-02",
    topic: "Heap Sort & Priority Queues",
    records: {
      "STU-2024-001": "Present",
      "STU-2024-002": "Present",
      "STU-2024-003": "Late",
      "STU-2024-004": "Present",
      "STU-2024-005": "Present",
      "STU-2024-006": "Absent",
      "STU-2024-007": "Present",
      "STU-2024-008": "Present",
      "STU-2024-018": "Present",
      "STU-2024-019": "Late",
      "STU-2024-020": "Present"
    }
  },
  // Session 7: CS101 - 2026-10-06 (Today's Lecture)
  {
    id: "ATT-2026-10-06-CRS-101",
    courseId: "CRS-101",
    date: "2026-10-06",
    topic: "Graph Representations & Breadth-First Search (BFS)",
    records: {
      "STU-2024-001": "Present",
      "STU-2024-002": "Present",
      "STU-2024-003": "Present",
      "STU-2024-004": "Absent",
      "STU-2024-005": "Present",
      "STU-2024-006": "Absent",
      "STU-2024-007": "Present",
      "STU-2024-008": "Present",
      "STU-2024-018": "Present",
      "STU-2024-019": "Present",
      "STU-2024-020": "Present"
    }
  },

  // Sessions for CS102 (DBMS)
  {
    id: "ATT-2026-09-16-CRS-102",
    courseId: "CRS-102",
    date: "2026-09-16",
    topic: "Entity-Relationship Diagrams & Schema Design",
    records: {
      "STU-2024-001": "Present",
      "STU-2024-002": "Present",
      "STU-2024-003": "Present",
      "STU-2024-004": "Present",
      "STU-2024-005": "Present",
      "STU-2024-006": "Absent",
      "STU-2024-007": "Present",
      "STU-2024-008": "Present",
      "STU-2024-018": "Present",
      "STU-2024-019": "Present",
      "STU-2024-020": "Present"
    }
  },
  {
    id: "ATT-2026-09-23-CRS-102",
    courseId: "CRS-102",
    date: "2026-09-23",
    topic: "Relational Algebra & Tuple Calculus",
    records: {
      "STU-2024-001": "Present",
      "STU-2024-002": "Present",
      "STU-2024-003": "Present",
      "STU-2024-004": "Absent",
      "STU-2024-005": "Present",
      "STU-2024-006": "Absent",
      "STU-2024-007": "Present",
      "STU-2024-008": "Present",
      "STU-2024-018": "Present",
      "STU-2024-019": "Absent",
      "STU-2024-020": "Present"
    }
  },
  {
    id: "ATT-2026-09-30-CRS-102",
    courseId: "CRS-102",
    date: "2026-09-30",
    topic: "Functional Dependencies & 3NF / BCNF Normalization",
    records: {
      "STU-2024-001": "Present",
      "STU-2024-002": "Present",
      "STU-2024-003": "Present",
      "STU-2024-004": "Present",
      "STU-2024-005": "Present",
      "STU-2024-006": "Absent",
      "STU-2024-007": "Present",
      "STU-2024-008": "Late",
      "STU-2024-018": "Present",
      "STU-2024-019": "Present",
      "STU-2024-020": "Present"
    }
  },
  {
    id: "ATT-2026-10-05-CRS-102",
    courseId: "CRS-102",
    date: "2026-10-05",
    topic: "Indexing Techniques: B+ Trees and Hash Tables",
    records: {
      "STU-2024-001": "Present",
      "STU-2024-002": "Late",
      "STU-2024-003": "Present",
      "STU-2024-004": "Absent",
      "STU-2024-005": "Present",
      "STU-2024-006": "Absent",
      "STU-2024-007": "Present",
      "STU-2024-008": "Present",
      "STU-2024-018": "Present",
      "STU-2024-019": "Present",
      "STU-2024-020": "Present"
    }
  },

  // Sessions for DS201 (Applied Machine Learning)
  {
    id: "ATT-2026-09-17-CRS-103",
    courseId: "CRS-103",
    date: "2026-09-17",
    topic: "Linear Regression and Gradient Descent",
    records: {
      "STU-2024-009": "Present",
      "STU-2024-010": "Present",
      "STU-2024-011": "Present"
    }
  },
  {
    id: "ATT-2026-09-24-CRS-103",
    courseId: "CRS-103",
    date: "2026-09-24",
    topic: "Logistic Regression & ROC/AUC Curves",
    records: {
      "STU-2024-009": "Present",
      "STU-2024-010": "Present",
      "STU-2024-011": "Late"
    }
  },
  {
    id: "ATT-2026-10-01-CRS-103",
    courseId: "CRS-103",
    date: "2026-10-01",
    topic: "Support Vector Machines & Kernel Trick",
    records: {
      "STU-2024-009": "Present",
      "STU-2024-010": "Present",
      "STU-2024-011": "Present"
    }
  },

  // Sessions for MATH201 (Linear Algebra & Vector Calculus)
  {
    id: "ATT-2026-09-19-CRS-108",
    courseId: "CRS-108",
    date: "2026-09-19",
    topic: "Vector Spaces, Subspaces & Basis",
    records: {
      "STU-2024-001": "Present",
      "STU-2024-002": "Present",
      "STU-2024-003": "Present",
      "STU-2024-004": "Absent",
      "STU-2024-006": "Absent",
      "STU-2024-007": "Present",
      "STU-2024-009": "Present",
      "STU-2024-011": "Present",
      "STU-2024-012": "Present",
      "STU-2024-013": "Present",
      "STU-2024-014": "Present",
      "STU-2024-015": "Present",
      "STU-2024-019": "Present",
      "STU-2024-020": "Present"
    }
  },
  {
    id: "ATT-2026-09-26-CRS-108",
    courseId: "CRS-108",
    date: "2026-09-26",
    topic: "Eigenvalues, Eigenvectors & Diagonalization",
    records: {
      "STU-2024-001": "Present",
      "STU-2024-002": "Present",
      "STU-2024-003": "Present",
      "STU-2024-004": "Absent",
      "STU-2024-006": "Absent",
      "STU-2024-007": "Present",
      "STU-2024-009": "Present",
      "STU-2024-011": "Late",
      "STU-2024-012": "Present",
      "STU-2024-013": "Present",
      "STU-2024-014": "Present",
      "STU-2024-015": "Present",
      "STU-2024-019": "Present",
      "STU-2024-020": "Present"
    }
  },
  {
    id: "ATT-2026-10-03-CRS-108",
    courseId: "CRS-108",
    date: "2026-10-03",
    topic: "Multivariable Gradients, Divergence & Curl",
    records: {
      "STU-2024-001": "Present",
      "STU-2024-002": "Present",
      "STU-2024-003": "Present",
      "STU-2024-004": "Absent",
      "STU-2024-006": "Absent",
      "STU-2024-007": "Present",
      "STU-2024-009": "Present",
      "STU-2024-011": "Present",
      "STU-2024-012": "Present",
      "STU-2024-013": "Present",
      "STU-2024-014": "Present",
      "STU-2024-015": "Present",
      "STU-2024-019": "Late",
      "STU-2024-020": "Present"
    }
  }
];

/**
 * Storage & Business Logic Service
 */
class StorageService {
  static STORAGE_KEY = "VERITAS_CSMS_DATABASE_V2";

  static getInitialState() {
    return {
      departments: JSON.parse(JSON.stringify(SEED_DEPARTMENTS)),
      courses: JSON.parse(JSON.stringify(SEED_COURSES)),
      students: JSON.parse(JSON.stringify(SEED_STUDENTS)),
      marks: JSON.parse(JSON.stringify(SEED_MARKS)),
      attendance: JSON.parse(JSON.stringify(SEED_ATTENDANCE)),
      academicYear: "2026-2027",
      currentSemester: "Fall 2026",
      lastUpdated: new Date().toISOString()
    };
  }

  static load() {
    try {
      const dataStr = localStorage.getItem(this.STORAGE_KEY);
      if (!dataStr) {
        const state = this.getInitialState();
        this.save(state);
        return state;
      }
      const parsed = JSON.parse(dataStr);
      // Ensure all arrays exist
      if (!parsed.students || !parsed.courses || !parsed.marks || !parsed.attendance) {
        const state = this.getInitialState();
        this.save(state);
        return state;
      }
      return parsed;
    } catch (e) {
      console.error("Failed to read storage, fallback to seed:", e);
      const state = this.getInitialState();
      this.save(state);
      return state;
    }
  }

  static save(state) {
    try {
      state.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      console.error("Failed to save storage:", e);
      return false;
    }
  }

  static reset() {
    const fresh = this.getInitialState();
    this.save(fresh);
    return fresh;
  }

  static exportJSON() {
    const data = this.load();
    return JSON.stringify(data, null, 2);
  }

  static importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed.students) || !Array.isArray(parsed.courses)) {
        throw new Error("Invalid schema: missing students or courses array.");
      }
      this.save(parsed);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // --- Grade Conversion & Calculation Utilities ---
  static calculateGrade(totalScore) {
    const score = Math.round(Number(totalScore) || 0);
    if (score >= 90) return { letter: "A+", points: 4.0, status: "Pass", color: "badge-emerald" };
    if (score >= 85) return { letter: "A", points: 3.8, status: "Pass", color: "badge-emerald" };
    if (score >= 80) return { letter: "A-", points: 3.5, status: "Pass", color: "badge-emerald" };
    if (score >= 75) return { letter: "B+", points: 3.2, status: "Pass", color: "badge-blue" };
    if (score >= 70) return { letter: "B", points: 3.0, status: "Pass", color: "badge-blue" };
    if (score >= 65) return { letter: "B-", points: 2.7, status: "Pass", color: "badge-blue" };
    if (score >= 60) return { letter: "C+", points: 2.3, status: "Pass", color: "badge-amber" };
    if (score >= 55) return { letter: "C", points: 2.0, status: "Pass", color: "badge-amber" };
    if (score >= 50) return { letter: "D", points: 1.0, status: "Pass", color: "badge-amber" };
    return { letter: "F", points: 0.0, status: "Fail", color: "badge-rose" };
  }

  static getStudentGPA(studentId, state = null) {
    const s = state || this.load();
    const studentMarks = s.marks.filter(m => m.studentId === studentId);
    if (studentMarks.length === 0) return { gpa: "0.00", totalCredits: 0, pointsTotal: 0 };

    let weightedPoints = 0;
    let totalCredits = 0;

    studentMarks.forEach(m => {
      const course = s.courses.find(c => c.id === m.courseId);
      const credits = course ? course.credits : 3;
      const total = Number(m.internalScore || 0) + Number(m.assignmentScore || 0) + Number(m.finalExamScore || 0);
      const grade = this.calculateGrade(total);
      weightedPoints += grade.points * credits;
      totalCredits += credits;
    });

    const gpa = totalCredits > 0 ? (weightedPoints / totalCredits).toFixed(2) : "0.00";
    return { gpa, totalCredits, weightedPoints };
  }

  // --- Attendance Calculation Utilities ---
  static getStudentAttendanceStats(studentId, state = null) {
    const s = state || this.load();
    const student = s.students.find(st => st.id === studentId);
    if (!student) return { percentage: 0, totalSessions: 0, attended: 0, absent: 0, late: 0, excused: 0 };

    // Find all attendance sessions for courses the student is enrolled in
    const enrolledIds = new Set(student.enrolledCourseIds || []);
    let totalSessions = 0;
    let attended = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;

    s.attendance.forEach(session => {
      if (enrolledIds.has(session.courseId)) {
        const record = session.records[studentId];
        if (record) {
          totalSessions++;
          if (record === "Present") {
            attended++;
          } else if (record === "Late") {
            late++;
            // Count Late as 0.8 attendance credit in academic analytics
            attended += 0.8;
          } else if (record === "Excused") {
            excused++;
            // Excused is excused from penalty, counts full
            attended += 1.0;
          } else if (record === "Absent") {
            absent++;
          }
        }
      }
    });

    const percentage = totalSessions > 0 ? Math.round((attended / totalSessions) * 100) : 100;
    return {
      percentage,
      totalSessions,
      attended: Math.round(attended),
      absent,
      late,
      excused,
      isShortage: percentage < 75
    };
  }

  // --- Course Level Attendance Stats ---
  static getCourseAttendanceStats(courseId, state = null) {
    const s = state || this.load();
    const sessions = s.attendance.filter(a => a.courseId === courseId);
    if (sessions.length === 0) return { sessionCount: 0, avgPercentage: 100 };

    let totalPossible = 0;
    let totalPresent = 0;

    sessions.forEach(sess => {
      Object.values(sess.records).forEach(status => {
        totalPossible++;
        if (status === "Present" || status === "Excused") totalPresent++;
        else if (status === "Late") totalPresent += 0.8;
      });
    });

    const avgPercentage = totalPossible > 0 ? Math.round((totalPresent / totalPossible) * 100) : 100;
    return { sessionCount: sessions.length, avgPercentage };
  }

  // --- At-Risk Attendance Students (<75%) ---
  static getShortageStudents(threshold = 75) {
    const s = this.load();
    const list = [];
    s.students.forEach(st => {
      const stats = this.getStudentAttendanceStats(st.id, s);
      if (stats.totalSessions > 0 && stats.percentage < threshold) {
        list.push({
          student: st,
          stats
        });
      }
    });
    return list.sort((a, b) => a.stats.percentage - b.stats.percentage);
  }
}

// Global exposure for modular scripts
window.CSMSData = {
  SEED_DEPARTMENTS,
  SEED_COURSES,
  SEED_STUDENTS,
  SEED_MARKS,
  SEED_ATTENDANCE,
  StorageService
};
