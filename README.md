# Veritas University — College Student Management System (CSMS)

An enterprise-grade, institutional **College Student Management System (CSMS)** engineered for university registrars, academic deans, department chairs, and faculty advisors. Built with authentic academic ERP information architecture, high-density operational data tables, and strict zero-placeholder functionality.

---

## 🏛️ System Philosophy: Authentic Institutional ERP (No "AI-Vibe" Aesthetics)

Unlike generic template designs that rely on dark neon gradients, blurry blobs, and non-functional buttons, the Veritas CSMS provides:
- **Authoritative Academic Design System**: Deep University Oxford Navy (`#0f1d32`), crisp white cards, clean cool slate borders (`#e2e8f0`), high-contrast typography, and tabular figures for numbers, roll codes, and grades.
- **100% Fully Functional Operations**: Every button, input field, filter dropdown, search bar, sort column, calculation engine, modal, export, and printable layout is completely wired up and functional.
- **Zero Build Tooling Dependency**: Runs natively in any modern web browser (Chrome, Edge, Firefox, Safari) simply by opening `index.html`. Persists data seamlessly via `localStorage` with full JSON backup, restore, and CSV export capabilities.

---

## 📋 Comprehensive Feature Breakdown

### 1. 🎓 Student Directory & Profile Records (`Students`)
- **Rich Student Attributes**:
  - Unique Institutional Roll Number (e.g. `CS-2024-001`, `DS-2024-001`, `EE-2024-001`)
  - Full Name (First & Last) with initial avatar badges
  - Institutional Email (`@students.veritas.edu`) & Contact Phone
  - Date of Birth & Gender
  - Academic Department (CSE, DSAI, EEE, MECH, BBA)
  - Academic Semester (Sem 1 through 8) & Year Level
  - Enrollment Date & Status (`Active`, `On Leave`, `Graduated`, `Suspended`)
  - Assigned Faculty Mentor / Advisor
  - Residential Address, Guardian Name & Guardian Phone
  - Course Registration Array (Enrolled Curriculum Units)
  - Dynamic Cumulative GPA (CGPA) calculated from weighted course credits
  - Overall Attendance Percentage across all enrolled courses
- **Operations & Controls**:
  - Live full-text search by name, roll number, or email
  - Multi-criteria filtering by Academic Department, Semester, and Status
  - Column header sorting (Ascending / Descending by Roll No, Name, Department, Term, CGPA, Attendance)
  - Pagination (10 records per page with active range indicators)
  - **Admit Student Modal**: Form validation, uniqueness checks on Roll Number, auto-generated ID formatting, and course enrollment selection.
  - **Edit Student Modal**: Instant updating of biographical and enrollment data.
  - **Delete Student**: Confirmative deletion with automatic cascading cleanup of marks and attendance records.
  - **Student 360° Profile & Official Transcript**: Complete modal displaying student bio, credit totals, cumulative GPA, course grade breakdown, course attendance compliance, and a one-click **Print Official Transcript** action with academic letterhead.

---

### 2. 📚 Curriculum & Course Catalog (`Courses`)
- **Course Attributes**:
  - Course Code (e.g., `CS101`, `CS102`, `DS201`, `EE205`, `ME202`, `BA301`, `MATH201`)
  - Course Title & Detailed Syllabus Description
  - Academic Department & Semester Allocation
  - Credit Weighting (1 to 5 Credits)
  - Faculty Instructor Name & Academic Email
  - Weekly Lecture Schedule (e.g. *Mon, Wed 09:30 - 11:00 AM*)
  - Assigned Lecture Hall / Laboratory (e.g. *Turing Hall 204*)
  - Class Capacity & Live Enrolled Student Counter
  - Course-Level Attendance Average
- **Operations & Controls**:
  - Instant course filtering by title, code, department, and semester
  - **Create Course Modal**: Comprehensive validation for credits, faculty, room, and capacity
  - **Edit Course Modal**: Update schedules, instructors, or descriptions
  - **Delete Course**: Safely removes course and updates student enrollments
  - **Class Roster Modal**: Lists all currently enrolled students with their current grades and attendance, plus a **Quick Enroll** dropdown to register new students into the class or drop existing ones.

---

### 3. 📝 Continuous Assessment & Gradebook (`Marks`)
- **Institutional Grading Model**:
  - Course Selector: Dynamically inspect enrolled students per course
  - Multi-component continuous assessment breakdown:
    - **Internal Continuous Assessment** (Max: 30 marks)
    - **Quizzes & Assignments** (Max: 20 marks)
    - **Semester Final Examination** (Max: 50 marks)
    - **Aggregate Total Score** (Calculated live, /100)
    - **Letter Grade Scale**:
      - `90 - 100`: **A+** (4.0 Grade Points)
      - `85 - 89`: **A** (3.8 Grade Points)
      - `80 - 84`: **A-** (3.5 Grade Points)
      - `75 - 79`: **B+** (3.2 Grade Points)
      - `70 - 74`: **B** (3.0 Grade Points)
      - `65 - 69`: **B-** (2.7 Grade Points)
      - `60 - 64`: **C+** (2.3 Grade Points)
      - `55 - 59`: **C** (2.0 Grade Points)
      - `50 - 54`: **D** (1.0 Grade Points)
      - `< 50`: **F** (0.0 Grade Points — Fail)
    - **Pass/Fail Evaluation**: Minimum 50 aggregate score required
- **Live Spreadsheet-Like Interaction**:
  - Inline input fields with instant recalculation: Typing marks dynamically recalculates total score, letter grade badge, and pass/fail indicator on the fly.
  - **Class Metric Summary**: Real-time Class Average, Highest Mark, Lowest Mark, and Pass Rate %.
  - **Save All Grades**: Persists updated marks to the database with feedback toasts.
  - **Individual Student Grade Card**: Generates an official printable course evaluation statement with score tables.
  - **Export Gradebook to CSV**: Formatted export for university records.

---

### 4. 📅 Attendance Tracker & Shortage Audit (`Attendance`)
- **Daily Session Roll-Call**:
  - Course selection & date picker (defaults to current date)
  - Lecture topic input (e.g. *Binary Search Trees & Balancing*)
  - Rapid roll-call action pills: `Present` (Green), `Late` (Amber, 0.8 credit), `Absent` (Rose, 0 credit), `Excused` (Blue, exempt)
  - Batch helper buttons: **Mark All Present** and **Mark All Absent**
  - Session counters: Live tally of Present, Late, Absent, Excused, and overall Session Attendance Rate %
  - **Save Session Attendance**: Persists session log to database and updates all student aggregate attendance metrics.
- **Attendance Shortage List (< 75%)**:
  - Standard university compliance rule: Students with attendance below **75%** are flagged as at-risk of debarment.
  - Dedicated audit table showing Roll Number, Name, Department, exact Attendance %, Missed Session Count, and Debarment Status.
  - **Issue Official Notice**: Dispatches administrative notification to student and registered guardian.
  - **Print Shortage Report**: Formatted printable summary for the Examination Committee.

---

### 5. 📊 Institutional Dashboard & Dean's Scholars
- **Executive KPI Cards**: Enrolled Students, Curriculum Courses, Institutional CGPA, Overall Attendance Rate, and At-Risk Attendance Count.
- **Interactive Visualizations**:
  - Department Enrollment Distribution (Bar Chart / Breakdown)
  - Institutional Grade Distribution (Doughnut Chart / Proportions)
  - Resilient offline fallback rendering: If Chart.js CDN is unavailable, renders elegant CSS/HTML proportional bars.
- **Dean's List Leaderboard**: Top 10 scholars ranked by cumulative GPA with honors identification.

---

### 6. 💾 Persistence, Backup & CSV Exports
- **LocalStorage Database Service**: Auto-saves every modification under `VERITAS_CSMS_DATABASE_V2`.
- **Preloaded University Seed Dataset**: Pre-populated with 20+ realistic students across 5 departments, 8 complete courses with faculty and schedules, realistic marks, and multi-week historical attendance logs.
- **Full JSON Backup**: Download complete snapshot of all students, courses, grades, and attendance with one click.
- **JSON Restore**: Upload any previously exported JSON database to restore system state.
- **Reset to Seed Data**: Instantly restore clean sample data at any time.
- **RFC 4180 CSV Export**: One-click spreadsheet exports for Student Roster, Course Catalog, and Course Gradebooks.

---

### 7. 🖨️ Print Stylesheet (`@media print`)
- Clean, printer-friendly CSS stylesheet.
- Strips out sidebars, navigation bars, search inputs, pagination buttons, and action icons.
- Adds official institutional university letterhead, student biographical header, clean tabular borders, and signature blocks for the Dean of Academic Affairs and University Registrar Seal.

---

## 🚀 How to Run the Application

### Option 1: Direct Browser Launch (Recommended)
1. Navigate to the project directory: `c:\Users\ASUS\OneDrive\Documents\CSMS`.
2. Double-click **`index.html`** or right-click and select **Open with Google Chrome / Microsoft Edge / Firefox**.
3. The application will load immediately with the preloaded university database.

### Option 2: Local HTTP Server (Python / Node / VS Code Live Server)
If you prefer running via a local HTTP server:
```bash
# Using Python
python -m http.server 8000

# Open http://localhost:8000 in your browser
```

---

## 📂 Project Structure

```
CSMS/
├── index.html          # Main Single-Page Application (HTML5 semantic structure)
├── css/
│   └── styles.css      # Institutional ERP Design System & Print Stylesheet
├── js/
│   ├── data.js         # Seed database, GPA calculators, StorageService
│   └── app.js          # Reactive UI controller, event handlers, modals, exports
└── README.md           # System documentation and operational manual
```

---

## ✅ Feature Verification Matrix

| Requirement | Implementation Detail | Status |
| :--- | :--- | :---: |
| **Students Module** | Roll No, Names, Email, Phone, Dept, Sem, Status, Advisor, GPA, Attendance, CRUD | Complete |
| **Courses Module** | Code, Title, Dept, Credits, Instructor, Schedule, Room, Capacity, Roster CRUD | Complete |
| **Marks Module** | Internal (30), Assignment (20), Final (50), Total (100), Letter Grade, GPA, Pass/Fail | Complete |
| **Attendance Module** | Daily Session Roll-Call (P/L/A/E), Shortage List (<75%), Missed Counts, Notice Dispatch | Complete |
| **Non-AI UI/UX** | Deep Navy / Slate corporate ERP palette, crisp typography, clean data tables, no glow | Complete |
| **Data Persistence** | LocalStorage, JSON Export/Import, CSV Export for all modules, Seed Reset | Complete |
| **Official Printables** | Print Academic Transcript & Student Grade Card with official university letterhead | Complete |
