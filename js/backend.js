/**
 * Veritas University - Academic ERP JavaScript Backend Service Layer
 * Enterprise-grade data models, RBAC authorization, and persistence engine
 */

(function () {
  "use strict";

  const STORAGE_KEY_V3 = "VERITAS_CSMS_BACKEND_V3";

  // Faculty Directory
  const SEED_FACULTY = [
    {
      id: "FAC-001",
      name: "Dr. Alan Turing",
      email: "a.turing@cs.veritas.edu",
      department: "Computer Science & Engineering",
      designation: "Professor & Chair of Computing",
      office: "Turing Complex 301",
      courseCodes: ["CS101", "MATH201"]
    },
    {
      id: "FAC-002",
      name: "Dr. Edgar Codd",
      email: "e.codd@cs.veritas.edu",
      department: "Computer Science & Engineering",
      designation: "Associate Professor",
      office: "Computing Lab C-2",
      courseCodes: ["CS102"]
    },
    {
      id: "FAC-003",
      name: "Prof. Geoffrey Hinton",
      email: "g.hinton@ds.veritas.edu",
      department: "Data Science & Artificial Intelligence",
      designation: "Distinguished Chair of AI",
      office: "AI Sandbox 310",
      courseCodes: ["DS201"]
    },
    {
      id: "FAC-004",
      name: "Dr. Claude Shannon",
      email: "c.shannon@ee.veritas.edu",
      department: "Electrical & Electronics Engineering",
      designation: "Professor of Information Theory",
      office: "Ampere Hall 105",
      courseCodes: ["EE205"]
    },
    {
      id: "FAC-005",
      name: "Dr. Sadi Carnot",
      email: "s.carnot@me.veritas.edu",
      department: "Mechanical Engineering",
      designation: "Professor of Thermal Systems",
      office: "Watt Complex 115",
      courseCodes: ["ME202"]
    },
    {
      id: "FAC-006",
      name: "Prof. Benjamin Graham",
      email: "b.graham@ba.veritas.edu",
      department: "Business Administration & Management",
      designation: "Dean of Management Studies",
      office: "Executive Suite 401",
      courseCodes: ["BA301"]
    },
    {
      id: "FAC-007",
      name: "Prof. Vint Cerf",
      email: "v.cerf@cs.veritas.edu",
      department: "Computer Science & Engineering",
      designation: "Visiting Professor of Networking",
      office: "Turing Hall 208",
      courseCodes: ["CS204"]
    },
    {
      id: "FAC-008",
      name: "Dr. Emmy Noether",
      email: "e.noether@math.veritas.edu",
      department: "Computer Science & Engineering",
      designation: "Professor of Applied Mathematics",
      office: "Euler Auditorium Wing",
      courseCodes: ["MATH201"]
    }
  ];

  // Weekly Timetable Grid Slots
  const SEED_TIMETABLE = [
    { id: "SCH-01", courseCode: "CS101", courseTitle: "Data Structures & Algorithms", day: "Monday", time: "09:30 - 11:00 AM", room: "Turing Hall 204", instructor: "Dr. Alan Turing" },
    { id: "SCH-02", courseCode: "CS101", courseTitle: "Data Structures & Algorithms", day: "Wednesday", time: "09:30 - 11:00 AM", room: "Turing Hall 204", instructor: "Dr. Alan Turing" },
    { id: "SCH-03", courseCode: "CS102", courseTitle: "Database Management Systems", day: "Tuesday", time: "11:15 - 12:45 PM", room: "Computing Lab C-1", instructor: "Dr. Edgar Codd" },
    { id: "SCH-04", courseCode: "CS102", courseTitle: "Database Management Systems", day: "Thursday", time: "11:15 - 12:45 PM", room: "Computing Lab C-1", instructor: "Dr. Edgar Codd" },
    { id: "SCH-05", courseCode: "DS201", courseTitle: "Applied Machine Learning", day: "Monday", time: "02:00 - 03:30 PM", room: "AI Sandbox 302", instructor: "Prof. Geoffrey Hinton" },
    { id: "SCH-06", courseCode: "DS201", courseTitle: "Applied Machine Learning", day: "Friday", time: "02:00 - 03:30 PM", room: "AI Sandbox 302", instructor: "Prof. Geoffrey Hinton" },
    { id: "SCH-07", courseCode: "EE205", courseTitle: "Signals and Systems", day: "Wednesday", time: "10:00 - 11:30 AM", room: "Ampere Hall 101", instructor: "Dr. Claude Shannon" },
    { id: "SCH-08", courseCode: "EE205", courseTitle: "Signals and Systems", day: "Friday", time: "10:00 - 11:30 AM", room: "Ampere Hall 101", instructor: "Dr. Claude Shannon" },
    { id: "SCH-09", courseCode: "ME202", courseTitle: "Thermodynamics & Heat Transfer", day: "Tuesday", time: "09:00 - 10:30 AM", room: "Watt Complex 110", instructor: "Dr. Sadi Carnot" },
    { id: "SCH-10", courseCode: "ME202", courseTitle: "Thermodynamics & Heat Transfer", day: "Thursday", time: "09:00 - 10:30 AM", room: "Watt Complex 110", instructor: "Dr. Sadi Carnot" },
    { id: "SCH-11", courseCode: "BA301", courseTitle: "Financial Accounting & Valuation", day: "Monday", time: "01:15 - 02:45 PM", room: "Executive Suite 405", instructor: "Prof. Benjamin Graham" },
    { id: "SCH-12", courseCode: "BA301", courseTitle: "Financial Accounting & Valuation", day: "Wednesday", time: "01:15 - 02:45 PM", room: "Executive Suite 405", instructor: "Prof. Benjamin Graham" },
    { id: "SCH-13", courseCode: "MATH201", courseTitle: "Linear Algebra & Vector Calculus", day: "Thursday", time: "10:00 - 11:30 AM", room: "Euler Auditorium", instructor: "Dr. Emmy Noether" },
    { id: "SCH-14", courseCode: "MATH201", courseTitle: "Linear Algebra & Vector Calculus", day: "Saturday", time: "10:00 - 11:30 AM", room: "Euler Auditorium", instructor: "Dr. Alan Turing" }
  ];

  // Seed Tuition & Fee Accounts
  const SEED_FEES = [
    { studentId: "STU-2024-001", tuition: 6500, labFee: 450, housing: 1800, paid: 8750, status: "Paid", cleared: true, receiptNo: "REC-2026-901" },
    { studentId: "STU-2024-002", tuition: 6500, labFee: 450, housing: 0, paid: 6950, status: "Paid", cleared: true, receiptNo: "REC-2026-902" },
    { studentId: "STU-2024-003", tuition: 6500, labFee: 450, housing: 1800, paid: 5000, status: "Partial", cleared: false, receiptNo: "REC-2026-903" },
    { studentId: "STU-2024-004", tuition: 6500, labFee: 450, housing: 0, paid: 2000, status: "Partial", cleared: false, receiptNo: "REC-2026-904" },
    { studentId: "STU-2024-005", tuition: 6500, labFee: 450, housing: 0, paid: 6950, status: "Paid", cleared: true, receiptNo: "REC-2026-905" },
    { studentId: "STU-2024-006", tuition: 6500, labFee: 450, housing: 1800, paid: 0, status: "Overdue", cleared: false, receiptNo: null },
    { studentId: "STU-2024-007", tuition: 6500, labFee: 450, housing: 1800, paid: 8750, status: "Paid", cleared: true, receiptNo: "REC-2026-907" },
    { studentId: "STU-2024-009", tuition: 7000, labFee: 600, housing: 1800, paid: 9400, status: "Paid", cleared: true, receiptNo: "REC-2026-909" }
  ];

  // Seed Advisor Intervention Notes
  const SEED_ADVISOR_NOTES = [
    {
      id: "NOTE-01",
      studentId: "STU-2024-004", // Julian Kovac
      advisorName: "Dr. Alan Turing",
      date: "2026-09-28",
      type: "Attendance & Academic Warning",
      content: "Student missed 4 consecutive sessions of Data Structures. Discussed personal difficulties; referred to peer tutoring group for recursion and tree balancing.",
      actionPlan: "Weekly attendance checkpoint every Friday with advisor."
    },
    {
      id: "NOTE-02",
      studentId: "STU-2024-006", // Devon Brooks
      advisorName: "Dr. Alan Turing",
      date: "2026-10-02",
      type: "Debarment Notice & Counseling",
      content: "Attendance dropped to 52%. Official debarment notice issued to parent (Laura Brooks). Student committed to attending all remaining classes and extra lab sessions.",
      actionPlan: "Submit medical certs if any; complete remedial assignment by Oct 15."
    },
    {
      id: "NOTE-03",
      studentId: "STU-2024-001", // Elena Rostova
      advisorName: "Dr. Alan Turing",
      date: "2026-09-14",
      type: "Honors Program Consultation",
      content: "Student expressed interest in undergraduate research on distributed graph databases. Recommended applying for Dean's Fellowship.",
      actionPlan: "Prepare proposal for Spring research seminar."
    }
  ];

  class BackendService {
    static getInitialDatabase() {
      // Pull foundational arrays from CSMSData
      const base = window.CSMSData ? window.CSMSData.StorageService.getInitialState() : {
        departments: [],
        courses: [],
        students: [],
        marks: [],
        attendance: []
      };

      return {
        ...base,
        faculty: JSON.parse(JSON.stringify(SEED_FACULTY)),
        timetable: JSON.parse(JSON.stringify(SEED_TIMETABLE)),
        fees: JSON.parse(JSON.stringify(SEED_FEES)),
        advisorNotes: JSON.parse(JSON.stringify(SEED_ADVISOR_NOTES)),
        currentRole: {
          type: "DEAN", // "DEAN" | "FACULTY" | "STUDENT"
          name: "Dr. Robert Vance",
          title: "Dean of Academic Affairs & Registrar",
          avatar: "DR",
          entityId: "DEAN-001"
        },
        version: "3.0"
      };
    }

    static load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_V3);
        if (!raw) {
          const fresh = this.getInitialDatabase();
          this.save(fresh);
          return fresh;
        }
        const data = JSON.parse(raw);
        if (!data.faculty || !data.currentRole) {
          const fresh = this.getInitialDatabase();
          this.save(fresh);
          return fresh;
        }
        return data;
      } catch (e) {
        console.warn("BackendService load error, resetting:", e);
        const fresh = this.getInitialDatabase();
        this.save(fresh);
        return fresh;
      }
    }

    static save(data) {
      try {
        data.lastUpdated = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(data));
        return true;
      } catch (e) {
        console.error("BackendService save error:", e);
        return false;
      }
    }

    static reset() {
      const fresh = this.getInitialDatabase();
      this.save(fresh);
      return fresh;
    }

    // --- RBAC Role Switching ---
    static setRole(roleType, entityId = null) {
      const db = this.load();
      if (roleType === "DEAN") {
        db.currentRole = {
          type: "DEAN",
          name: "Dr. Robert Vance",
          title: "Dean of Academic Affairs & Registrar",
          avatar: "DR",
          entityId: "DEAN-001"
        };
      } else if (roleType === "FACULTY") {
        const fac = db.faculty.find(f => f.id === entityId) || db.faculty[0];
        db.currentRole = {
          type: "FACULTY",
          name: fac.name,
          title: `${fac.designation} (${fac.department})`,
          avatar: fac.name.split(" ").slice(-1)[0][0] || "F",
          entityId: fac.id,
          facultyData: fac
        };
      } else if (roleType === "STUDENT") {
        const stu = db.students.find(s => s.id === entityId) || db.students[0];
        db.currentRole = {
          type: "STUDENT",
          name: `${stu.firstName} ${stu.lastName}`,
          title: `Student (${stu.rollNo} · ${stu.department})`,
          avatar: `${stu.firstName[0]}${stu.lastName[0]}`,
          entityId: stu.id,
          studentData: stu
        };
      }
      this.save(db);
      return db.currentRole;
    }

    static getCurrentRole() {
      const db = this.load();
      return db.currentRole || { type: "DEAN", name: "Dr. Robert Vance", title: "Dean of Academic Affairs" };
    }

    // --- Calculation Utilities ---
    static calculateGrade(totalScore) {
      const score = Math.round(Number(totalScore) || 0);
      if (score >= 90) return { letter: "A+", points: 4.0, status: "Pass", color: "emerald" };
      if (score >= 85) return { letter: "A", points: 3.8, status: "Pass", color: "emerald" };
      if (score >= 80) return { letter: "A-", points: 3.5, status: "Pass", color: "emerald" };
      if (score >= 75) return { letter: "B+", points: 3.2, status: "Pass", color: "blue" };
      if (score >= 70) return { letter: "B", points: 3.0, status: "Pass", color: "blue" };
      if (score >= 65) return { letter: "B-", points: 2.7, status: "Pass", color: "blue" };
      if (score >= 60) return { letter: "C+", points: 2.3, status: "Pass", color: "amber" };
      if (score >= 55) return { letter: "C", points: 2.0, status: "Pass", color: "amber" };
      if (score >= 50) return { letter: "D", points: 1.0, status: "Pass", color: "amber" };
      return { letter: "F", points: 0.0, status: "Fail", color: "rose" };
    }

    static getStudentGPA(studentId, db = null) {
      const s = db || this.load();
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

    static getStudentAttendanceStats(studentId, db = null) {
      const s = db || this.load();
      const student = s.students.find(st => st.id === studentId);
      if (!student) return { percentage: 0, totalSessions: 0, attended: 0, absent: 0, late: 0, isShortage: false };

      const enrolledIds = new Set(student.enrolledCourseIds || []);
      let totalSessions = 0;
      let attended = 0;
      let absent = 0;
      let late = 0;

      s.attendance.forEach(session => {
        if (enrolledIds.has(session.courseId)) {
          const rec = session.records[studentId];
          if (rec) {
            totalSessions++;
            if (rec === "Present" || rec === "Excused") attended++;
            else if (rec === "Late") { late++; attended += 0.8; }
            else if (rec === "Absent") absent++;
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
        isShortage: percentage < 75
      };
    }

    static getStudentFeeAccount(studentId, db = null) {
      const s = db || this.load();
      let fee = s.fees.find(f => f.studentId === studentId);
      if (!fee) {
        fee = {
          studentId,
          tuition: 6500,
          labFee: 450,
          housing: 1800,
          paid: 8750,
          status: "Paid",
          cleared: true,
          receiptNo: `REC-2026-${Math.floor(100 + Math.random() * 900)}`
        };
      }
      const totalDue = (fee.tuition || 0) + (fee.labFee || 0) + (fee.housing || 0);
      const balance = Math.max(0, totalDue - (fee.paid || 0));
      return { ...fee, totalDue, balance };
    }

    static getStudentHallTicket(studentId, db = null) {
      const s = db || this.load();
      const student = s.students.find(st => st.id === studentId);
      if (!student) return null;

      const attStats = this.getStudentAttendanceStats(studentId, s);
      const feeAcc = this.getStudentFeeAccount(studentId, s);
      const enrolledCourses = s.courses.filter(c => (student.enrolledCourseIds || []).includes(c.id));

      const isDebarred = attStats.percentage < 75;
      const isFeeCleared = feeAcc.cleared || feeAcc.balance === 0;

      const examSchedule = enrolledCourses.map((c, idx) => ({
        courseCode: c.code,
        courseTitle: c.title,
        credits: c.credits,
        examDate: `2026-11-${String(10 + idx * 3).padStart(2, "0")}`,
        time: "09:30 AM - 12:30 PM",
        hallRoom: `Examination Center Hall ${String.fromCharCode(65 + (idx % 3))}-10${idx + 1}`,
        seatNo: `DESK-${student.rollNo.replace(/[^0-9]/g, "").slice(-3) || "042"}`
      }));

      return {
        student,
        attendancePct: attStats.percentage,
        isDebarred,
        isFeeCleared,
        isEligible: !isDebarred && isFeeCleared,
        eligibilityStatus: isDebarred ? "Debarred Due to Attendance Shortage" : (!isFeeCleared ? "Withheld Pending Financial Clearance" : "Cleared for Examinations"),
        examSchedule,
        ticketId: `HT-FALL2026-${student.rollNo}`
      };
    }
  }

  window.CSMSBackend = BackendService;
})();
