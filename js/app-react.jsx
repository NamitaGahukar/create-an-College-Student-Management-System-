/**
 * Veritas University - Academic Management Portal (CSMS)
 * React 18 + Tailwind CSS Application with Multi-Role Portal Switcher
 */

const { useState, useEffect, useMemo } = React;

// Main Portal Component
function UniversityPortal() {
  const [db, setDb] = useState(() => CSMSBackend.load());
  const [currentRole, setCurrentRole] = useState(() => CSMSBackend.getCurrentRole());
  const [activeTab, setActiveTab] = useState("dashboard");
  const [toasts, setToasts] = useState([]);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState(null);

  // Synchronize state changes to Backend
  const updateDatabase = (newDb) => {
    setDb(newDb);
    CSMSBackend.save(newDb);
  };

  const showToast = (message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // Role Switching Handler
  const handleRoleChange = (roleType, entityId = null) => {
    const updatedRole = CSMSBackend.setRole(roleType, entityId);
    setCurrentRole(updatedRole);
    setDb(CSMSBackend.load());

    // Switch default tab according to role
    if (roleType === "DEAN") {
      setActiveTab("dashboard");
      showToast("Switched to Registrar & Dean of Academic Affairs view", "info");
    } else if (roleType === "FACULTY") {
      setActiveTab("faculty-courses");
      showToast(`Logged in as Faculty: ${updatedRole.name}`, "info");
    } else if (roleType === "STUDENT") {
      setActiveTab("student-overview");
      showToast(`Logged in as Student: ${updatedRole.name}`, "info");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top University Header & Role Switcher */}
      <TopHeader
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        db={db}
      />

      {/* Main Layout Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Dynamic Sidebar according to Role */}
        <Sidebar
          currentRole={currentRole}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          db={db}
        />

        {/* Dynamic Content View */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* Dean / Registrar Views */}
          {currentRole.type === "DEAN" && (
            <>
              {activeTab === "dashboard" && <DeanDashboard db={db} setActiveTab={setActiveTab} onOpenProfile={setSelectedStudentForProfile} />}
              {activeTab === "students" && <DeanStudentsDirectory db={db} updateDb={updateDatabase} showToast={showToast} onOpenProfile={setSelectedStudentForProfile} />}
              {activeTab === "courses" && <DeanCourseCatalog db={db} updateDb={updateDatabase} showToast={showToast} />}
              {activeTab === "marks" && <DeanGradebook db={db} updateDb={updateDatabase} showToast={showToast} />}
              {activeTab === "attendance" && <DeanAttendanceLedger db={db} updateDb={updateDatabase} showToast={showToast} onOpenProfile={setSelectedStudentForProfile} />}
              {activeTab === "timetable" && <UniversityTimetableGrid db={db} />}
              {activeTab === "fees" && <TuitionFeeLedger db={db} updateDb={updateDatabase} showToast={showToast} />}
              {activeTab === "halltickets" && <HallTicketsManager db={db} />}
              {activeTab === "advising" && <AdvisorInterventionView db={db} updateDb={updateDatabase} showToast={showToast} />}
              {activeTab === "settings" && <SystemSettingsView db={db} setDb={setDb} showToast={showToast} />}
            </>
          )}

          {/* Faculty Portal Views */}
          {currentRole.type === "FACULTY" && (
            <FacultyPortalView
              faculty={currentRole.facultyData || db.faculty[0]}
              db={db}
              updateDb={updateDatabase}
              showToast={showToast}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onOpenProfile={setSelectedStudentForProfile}
            />
          )}

          {/* Student Portal Views */}
          {currentRole.type === "STUDENT" && (
            <StudentPortalView
              student={currentRole.studentData || db.students[0]}
              db={db}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}
        </main>
      </div>

      {/* Student 360 Profile Modal */}
      {selectedStudentForProfile && (
        <Student360Modal
          studentId={selectedStudentForProfile}
          db={db}
          onClose={() => setSelectedStudentForProfile(null)}
        />
      )}

      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-3 rounded-md shadow-lg text-white text-sm font-medium flex items-center justify-between gap-3 border-l-4 transition-all ${
              t.type === "success" ? "bg-slate-900 border-emerald-500" :
              t.type === "warning" ? "bg-slate-900 border-amber-500" :
              t.type === "error" ? "bg-slate-900 border-rose-500" :
              "bg-slate-900 border-blue-500"
            }`}
          >
            <span>{t.message}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
              className="text-slate-400 hover:text-white"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================================================
// TOP HEADER & MULTI-ROLE SWITCHER
// ==========================================================================
function TopHeader({ currentRole, onRoleChange, db }) {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
      {/* Brand Identity */}
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-md bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-sm">
          VU
        </div>
        <div>
          <h1 className="text-sm font-bold uppercase tracking-wider text-slate-900">Veritas University</h1>
          <p className="text-xs text-slate-500 font-medium">Campus Information & Student ERP</p>
        </div>
        <div className="hidden md:flex items-center gap-2 ml-4 px-3 py-1 bg-slate-100 rounded-md border border-slate-200 text-xs font-semibold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span>Term: Fall 2026</span>
        </div>
      </div>

      {/* Role Switcher Controller */}
      <div className="relative">
        <button
          onClick={() => setRoleMenuOpen(!roleMenuOpen)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg border border-slate-300 hover:border-slate-400 bg-white shadow-xs transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
            {currentRole.avatar || "VU"}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>{currentRole.name}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ${
                currentRole.type === "DEAN" ? "bg-purple-100 text-purple-800" :
                currentRole.type === "FACULTY" ? "bg-blue-100 text-blue-800" :
                "bg-emerald-100 text-emerald-800"
              }`}>
                {currentRole.type}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{currentRole.title}</div>
          </div>
          <svg className="w-4 h-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Role Switcher Dropdown Modal */}
        {roleMenuOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-3 py-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Switch University Portal Role</span>
            </div>

            {/* 1. Dean / Registrar Option */}
            <div className="p-1">
              <button
                onClick={() => { onRoleChange("DEAN"); setRoleMenuOpen(false); }}
                className={`w-full text-left p-2.5 rounded-lg flex items-start gap-3 transition-colors ${
                  currentRole.type === "DEAN" ? "bg-blue-50 text-blue-900 font-semibold" : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="w-7 h-7 rounded bg-purple-700 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  DR
                </div>
                <div>
                  <div className="text-xs font-bold">Registrar & Dean of Affairs</div>
                  <div className="text-[11px] text-slate-500">Full institutional oversight, admissions & catalog</div>
                </div>
              </button>
            </div>

            {/* 2. Faculty Switcher Sub-list */}
            <div className="p-1 border-t border-slate-100">
              <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Impersonate Faculty / Professor:
              </div>
              <div className="max-h-40 overflow-y-auto space-y-0.5">
                {db.faculty.map(f => (
                  <button
                    key={f.id}
                    onClick={() => { onRoleChange("FACULTY", f.id); setRoleMenuOpen(false); }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between text-xs transition-colors ${
                      currentRole.type === "FACULTY" && currentRole.entityId === f.id
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span className="truncate">{f.name}</span>
                    <span className="text-[10px] text-slate-400 ml-2">{f.courseCodes.join(", ")}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Student Switcher Sub-list */}
            <div className="p-1 border-t border-slate-100">
              <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Impersonate Student:
              </div>
              <div className="max-h-40 overflow-y-auto space-y-0.5">
                {db.students.slice(0, 8).map(s => {
                  const att = CSMSBackend.getStudentAttendanceStats(s.id, db);
                  return (
                    <button
                      key={s.id}
                      onClick={() => { onRoleChange("STUDENT", s.id); setRoleMenuOpen(false); }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between text-xs transition-colors ${
                        currentRole.type === "STUDENT" && currentRole.entityId === s.id
                          ? "bg-emerald-50 text-emerald-800 font-semibold"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span className="truncate">{s.firstName} {s.lastName} ({s.rollNo})</span>
                      <span className={`text-[10px] font-bold px-1 rounded ${att.percentage < 75 ? "bg-rose-100 text-rose-700" : "text-slate-400"}`}>
                        {att.percentage}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// ==========================================================================
// DYNAMIC SIDEBAR NAVIGATION
// ==========================================================================
function Sidebar({ currentRole, activeTab, setActiveTab, db }) {
  const shortageCount = useMemo(() => {
    return db.students.filter(s => CSMSBackend.getStudentAttendanceStats(s.id, db).percentage < 75).length;
  }, [db]);

  return (
    <aside className="w-64 bg-slate-950 text-slate-200 flex-shrink-0 flex flex-col border-r border-slate-800">
      <div className="p-4 flex-1 overflow-y-auto space-y-1">
        {/* DEAN / REGISTRAR NAVIGATION */}
        {currentRole.type === "DEAN" && (
          <>
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Institutional Core
            </div>
            <NavItem id="dashboard" label="Executive Dashboard" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} icon="📊" />
            <NavItem id="students" label="Student Directory" badge={db.students.length} active={activeTab === "students"} onClick={() => setActiveTab("students")} icon="🎓" />
            <NavItem id="courses" label="Curriculum Courses" badge={db.courses.length} active={activeTab === "courses"} onClick={() => setActiveTab("courses")} icon="📚" />
            <NavItem id="marks" label="Continuous Gradebook" active={activeTab === "marks"} onClick={() => setActiveTab("marks")} icon="📝" />
            <NavItem id="attendance" label="Attendance Ledger" badge={shortageCount > 0 ? `${shortageCount} Alert` : null} badgeColor="rose" active={activeTab === "attendance"} onClick={() => setActiveTab("attendance")} icon="📅" />

            <div className="px-3 pt-4 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              ERP Features
            </div>
            <NavItem id="timetable" label="Weekly Timetable Grid" active={activeTab === "timetable"} onClick={() => setActiveTab("timetable")} icon="🗓️" />
            <NavItem id="fees" label="Tuition & Fee Accounts" active={activeTab === "fees"} onClick={() => setActiveTab("fees")} icon="💳" />
            <NavItem id="halltickets" label="Exam Hall Tickets" active={activeTab === "halltickets"} onClick={() => setActiveTab("halltickets")} icon="🎫" />
            <NavItem id="advising" label="Advisor Interventions" active={activeTab === "advising"} onClick={() => setActiveTab("advising")} icon="⚠️" />
            <NavItem id="settings" label="Database & Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} icon="⚙️" />
          </>
        )}

        {/* FACULTY PORTAL NAVIGATION */}
        {currentRole.type === "FACULTY" && (
          <>
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Faculty Workspace
            </div>
            <NavItem id="faculty-courses" label="My Teaching Courses" active={activeTab === "faculty-courses"} onClick={() => setActiveTab("faculty-courses")} icon="📚" />
            <NavItem id="faculty-rollcall" label="1-Click Roll-Call" active={activeTab === "faculty-rollcall"} onClick={() => setActiveTab("faculty-rollcall")} icon="📅" />
            <NavItem id="faculty-grades" label="Submit Course Grades" active={activeTab === "faculty-grades"} onClick={() => setActiveTab("faculty-grades")} icon="📝" />
            <NavItem id="faculty-schedule" label="My Teaching Schedule" active={activeTab === "faculty-schedule"} onClick={() => setActiveTab("faculty-schedule")} icon="🗓️" />
            <NavItem id="faculty-advisees" label="My Advisees & Notes" active={activeTab === "faculty-advisees"} onClick={() => setActiveTab("faculty-advisees")} icon="⚠️" />
          </>
        )}

        {/* STUDENT PORTAL NAVIGATION */}
        {currentRole.type === "STUDENT" && (
          <>
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Student Self-Service
            </div>
            <NavItem id="student-overview" label="Academic Dashboard" active={activeTab === "student-overview"} onClick={() => setActiveTab("student-overview")} icon="🎓" />
            <NavItem id="student-courses" label="My Registered Courses" active={activeTab === "student-courses"} onClick={() => setActiveTab("student-courses")} icon="📚" />
            <NavItem id="student-grades" label="My Grade Sheet & CGPA" active={activeTab === "student-grades"} onClick={() => setActiveTab("student-grades")} icon="📝" />
            <NavItem id="student-attendance" label="My Attendance Status" active={activeTab === "student-attendance"} onClick={() => setActiveTab("student-attendance")} icon="📅" />
            <NavItem id="student-timetable" label="My Weekly Class Grid" active={activeTab === "student-timetable"} onClick={() => setActiveTab("student-timetable")} icon="🗓️" />
            <NavItem id="student-hallticket" label="Exam Hall Ticket" active={activeTab === "student-hallticket"} onClick={() => setActiveTab("student-hallticket")} icon="🎫" />
            <NavItem id="student-fees" label="Fee Clearance Statement" active={activeTab === "student-fees"} onClick={() => setActiveTab("student-fees")} icon="💳" />
            <NavItem id="student-idcard" label="Digital University ID" active={activeTab === "student-idcard"} onClick={() => setActiveTab("student-idcard")} icon="🪪" />
          </>
        )}
      </div>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-400 bg-slate-900/50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Role: <strong className="text-white">{currentRole.type}</strong></span>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ id, label, icon, badge, badgeColor, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
        active ? "bg-slate-800 text-white shadow-xs" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className="text-base">{icon}</span>
        <span>{label}</span>
      </div>
      {badge && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          badgeColor === "rose" ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-300"
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}

// ==========================================================================
// FEATURE 1: FACULTY PORTAL COMPONENT
// ==========================================================================
function FacultyPortalView({ faculty, db, updateDb, showToast, activeTab, setActiveTab, onOpenProfile }) {
  // Assigned courses for this professor
  const assignedCourses = useMemo(() => {
    return db.courses.filter(c => c.instructor === faculty.name || (faculty.courseCodes || []).includes(c.code));
  }, [faculty, db.courses]);

  const [selectedCourseId, setSelectedCourseId] = useState(assignedCourses[0]?.id || db.courses[0]?.id);

  // Enrolled students in selected course
  const currentCourse = db.courses.find(c => c.id === selectedCourseId) || assignedCourses[0];
  const enrolledStudents = useMemo(() => {
    if (!currentCourse) return [];
    return db.students.filter(s => (s.enrolledCourseIds || []).includes(currentCourse.id));
  }, [currentCourse, db.students]);

  // Attendance state for faculty 1-click roll-call
  const [sessionTopic, setSessionTopic] = useState("Lecture 12: Applied Concepts");
  const [sessionDate, setSessionDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [attendanceRecords, setAttendanceRecords] = useState({});

  useEffect(() => {
    const initial = {};
    enrolledStudents.forEach(s => { initial[s.id] = "Present"; });
    setAttendanceRecords(initial);
  }, [currentCourse, enrolledStudents]);

  const handleMarkStatus = (studentId, status) => {
    setAttendanceRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = () => {
    if (!currentCourse) return;
    const sessionObj = {
      id: `ATT-${sessionDate}-${currentCourse.id}`,
      courseId: currentCourse.id,
      date: sessionDate,
      topic: sessionTopic,
      records: { ...attendanceRecords }
    };

    const newAttendance = [...db.attendance.filter(a => !(a.courseId === currentCourse.id && a.date === sessionDate)), sessionObj];
    updateDb({ ...db, attendance: newAttendance });
    showToast(`Attendance recorded for ${Object.keys(attendanceRecords).length} students in ${currentCourse.code}!`, "success");
  };

  return (
    <div className="space-y-6">
      {/* Faculty Profile Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <span>Faculty Academic Station</span>
            <span>·</span>
            <span>{faculty.department}</span>
          </div>
          <h2 className="text-2xl font-bold">{faculty.name}</h2>
          <p className="text-sm text-slate-300 mt-0.5">{faculty.designation} · Office: {faculty.office}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700 text-center">
            <div className="text-xs text-slate-400">Assigned Courses</div>
            <div className="text-xl font-bold text-white">{assignedCourses.length}</div>
          </div>
          <div className="bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700 text-center">
            <div className="text-xs text-slate-400">Total Students</div>
            <div className="text-xl font-bold text-blue-400">
              {assignedCourses.reduce((sum, c) => sum + db.students.filter(s => (s.enrolledCourseIds || []).includes(c.id)).length, 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Course Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <span className="text-xs font-bold uppercase text-slate-500 mr-2">Select Course:</span>
        {assignedCourses.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCourseId(c.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCourseId === c.id
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            {c.code} · {c.title}
          </button>
        ))}
      </div>

      {/* View 1: 1-Click Roll-Call */}
      {(activeTab === "faculty-courses" || activeTab === "faculty-rollcall") && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm text-slate-900">Lecture Session Roll-Call: {currentCourse?.code}</span>
              <input
                type="date"
                value={sessionDate}
                onChange={e => setSessionDate(e.target.value)}
                className="text-xs border border-slate-300 rounded px-2 py-1 bg-white"
              />
              <input
                type="text"
                value={sessionTopic}
                onChange={e => setSessionTopic(e.target.value)}
                placeholder="Topic / Chapter..."
                className="text-xs border border-slate-300 rounded px-2.5 py-1 bg-white w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const allP = {};
                  enrolledStudents.forEach(s => allP[s.id] = "Present");
                  setAttendanceRecords(allP);
                }}
                className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
              >
                Mark All Present
              </button>
              <button
                onClick={handleSaveAttendance}
                className="px-3.5 py-1 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded shadow-xs"
              >
                Save Attendance
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[11px] font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Attendance History</th>
                  <th className="p-3">Today's Session Roll-Call</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrolledStudents.map(st => {
                  const status = attendanceRecords[st.id] || "Present";
                  const attStats = CSMSBackend.getStudentAttendanceStats(st.id, db);
                  return (
                    <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-900">{st.rollNo}</td>
                      <td className="p-3 font-semibold text-slate-800">{st.firstName} {st.lastName}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          attStats.percentage < 75 ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {attStats.percentage}% ({attStats.attended}/{attStats.totalSessions})
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100">
                          {["Present", "Late", "Absent", "Excused"].map(s => (
                            <button
                              key={s}
                              onClick={() => handleMarkStatus(st.id, s)}
                              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                                status === s
                                  ? s === "Present" ? "bg-emerald-600 text-white shadow-xs" :
                                    s === "Late" ? "bg-amber-500 text-white shadow-xs" :
                                    s === "Absent" ? "bg-rose-600 text-white shadow-xs" :
                                    "bg-blue-600 text-white shadow-xs"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => onOpenProfile(st.id)}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 2: Faculty Continuous Gradebook Entry */}
      {activeTab === "faculty-grades" && (
        <FacultyGradebookEditor
          course={currentCourse}
          students={enrolledStudents}
          db={db}
          updateDb={updateDb}
          showToast={showToast}
        />
      )}

      {/* View 3: Faculty Teaching Schedule */}
      {activeTab === "faculty-schedule" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4">Teaching Slots & Lecture Halls for {faculty.name}</h3>
          <div className="space-y-3">
            {db.timetable.filter(t => t.instructor === faculty.name).map(slot => (
              <div key={slot.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-sm">{slot.courseCode}: {slot.courseTitle}</span>
                  <p className="text-xs text-slate-500 mt-0.5">{slot.day} · {slot.time}</p>
                </div>
                <div className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded border border-blue-200">
                  {slot.room}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 4: Faculty Advisees & Intervention Notes */}
      {activeTab === "faculty-advisees" && (
        <FacultyAdviseesNotes
          faculty={faculty}
          db={db}
          updateDb={updateDb}
          showToast={showToast}
          onOpenProfile={onOpenProfile}
        />
      )}
    </div>
  );
}

// Faculty Gradebook Editor Component
function FacultyGradebookEditor({ course, students, db, updateDb, showToast }) {
  const [localScores, setLocalScores] = useState({});

  useEffect(() => {
    const scores = {};
    students.forEach(s => {
      const mark = db.marks.find(m => m.studentId === s.id && m.courseId === course.id) || {
        internalScore: 0,
        assignmentScore: 0,
        finalExamScore: 0
      };
      scores[s.id] = { ...mark };
    });
    setLocalScores(scores);
  }, [course, students, db.marks]);

  const handleScoreChange = (studentId, field, val) => {
    const num = Math.max(0, parseInt(val) || 0);
    setLocalScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: num
      }
    }));
  };

  const handleSaveGrades = () => {
    const newMarks = [...db.marks.filter(m => m.courseId !== course.id)];
    Object.entries(localScores).forEach(([studentId, scores]) => {
      newMarks.push({
        id: `MRK-${course.id}-${studentId}`,
        studentId,
        courseId: course.id,
        semester: course.semester,
        internalScore: scores.internalScore || 0,
        assignmentScore: scores.assignmentScore || 0,
        finalExamScore: scores.finalExamScore || 0
      });
    });
    updateDb({ ...db, marks: newMarks });
    showToast(`Saved grades for ${students.length} students in ${course.code}`, "success");
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <span className="font-bold text-sm text-slate-900">Enter Grades: {course?.code} ({course?.credits} Credits)</span>
        <button
          onClick={handleSaveGrades}
          className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-xs"
        >
          Save All Grades
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-600 uppercase text-[11px] font-bold border-b border-slate-200">
            <tr>
              <th className="p-3">Roll No</th>
              <th className="p-3">Student Name</th>
              <th className="p-3">Internal (30)</th>
              <th className="p-3">Assignments (20)</th>
              <th className="p-3">Final Exam (50)</th>
              <th className="p-3">Total (100)</th>
              <th className="p-3">Letter Grade</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map(st => {
              const sc = localScores[st.id] || { internalScore: 0, assignmentScore: 0, finalExamScore: 0 };
              const total = (sc.internalScore || 0) + (sc.assignmentScore || 0) + (sc.finalExamScore || 0);
              const grade = CSMSBackend.calculateGrade(total);

              return (
                <tr key={st.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-900">{st.rollNo}</td>
                  <td className="p-3 font-semibold text-slate-800">{st.firstName} {st.lastName}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={sc.internalScore || 0}
                      onChange={e => handleScoreChange(st.id, "internalScore", e.target.value)}
                      className="w-16 p-1 border rounded text-center font-bold"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={sc.assignmentScore || 0}
                      onChange={e => handleScoreChange(st.id, "assignmentScore", e.target.value)}
                      className="w-16 p-1 border rounded text-center font-bold"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={sc.finalExamScore || 0}
                      onChange={e => handleScoreChange(st.id, "finalExamScore", e.target.value)}
                      className="w-16 p-1 border rounded text-center font-bold"
                    />
                  </td>
                  <td className="p-3 font-bold text-sm text-slate-900">{total} / 100</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      grade.color === "emerald" ? "bg-emerald-100 text-emerald-800" :
                      grade.color === "blue" ? "bg-blue-100 text-blue-800" :
                      grade.color === "amber" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                    }`}>
                      {grade.letter} ({grade.points.toFixed(1)})
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${grade.status === "Pass" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                      {grade.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Faculty Advisees & Notes Component
function FacultyAdviseesNotes({ faculty, db, updateDb, showToast, onOpenProfile }) {
  const advisees = useMemo(() => {
    return db.students.filter(s => s.advisor === faculty.name);
  }, [faculty, db.students]);

  const [selectedStudentId, setSelectedStudentId] = useState(advisees[0]?.id || "");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteType, setNewNoteType] = useState("Academic Advising");

  const handleAddNote = () => {
    if (!newNoteContent.trim() || !selectedStudentId) return;
    const noteObj = {
      id: `NOTE-${Date.now()}`,
      studentId: selectedStudentId,
      advisorName: faculty.name,
      date: new Date().toISOString().split("T")[0],
      type: newNoteType,
      content: newNoteContent.trim(),
      actionPlan: "Follow-up checkpoint next week."
    };

    updateDb({ ...db, advisorNotes: [noteObj, ...(db.advisorNotes || [])] });
    setNewNoteContent("");
    showToast("Intervention note logged to student's academic record.", "success");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Advisee Roster */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 mb-3">Assigned Advisees ({advisees.length})</h3>
        <div className="space-y-2">
          {advisees.map(st => {
            const att = CSMSBackend.getStudentAttendanceStats(st.id, db);
            const gpa = CSMSBackend.getStudentGPA(st.id, db);
            return (
              <div
                key={st.id}
                onClick={() => setSelectedStudentId(st.id)}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  selectedStudentId === st.id ? "bg-blue-50 border-blue-400" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{st.firstName} {st.lastName}</span>
                  <span className="font-mono">{st.rollNo}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>GPA: <strong className="text-slate-800">{gpa.gpa}</strong></span>
                  <span className={att.percentage < 75 ? "text-rose-600 font-bold" : "text-emerald-700 font-bold"}>
                    Att: {att.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Counseling / Intervention Logs */}
      <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Log Academic Counseling & Intervention</h3>

        <div className="flex gap-2">
          <select
            value={newNoteType}
            onChange={e => setNewNoteType(e.target.value)}
            className="text-xs border rounded-lg p-2 bg-slate-50 font-semibold"
          >
            <option value="Academic Advising">Academic Advising</option>
            <option value="Attendance & Debarment Warning">Attendance & Debarment Warning</option>
            <option value="Probation Intervention">Probation Intervention</option>
            <option value="Honors / Research Guidance">Honors / Research Guidance</option>
          </select>
          <input
            type="text"
            value={newNoteContent}
            onChange={e => setNewNoteContent(e.target.value)}
            placeholder="Type confidential advisor meeting notes and action plan..."
            className="flex-1 text-xs border rounded-lg px-3 py-2"
          />
          <button
            onClick={handleAddNote}
            className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800"
          >
            Add Log
          </button>
        </div>

        {/* Existing Notes for Selected Student */}
        <div className="border-t border-slate-100 pt-3 space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase">Previous Intervention Records</h4>
          {db.advisorNotes.filter(n => n.studentId === selectedStudentId).length === 0 ? (
            <p className="text-xs text-slate-400 italic">No notes logged for this student yet.</p>
          ) : (
            db.advisorNotes.filter(n => n.studentId === selectedStudentId).map(n => (
              <div key={n.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span className="text-blue-700">{n.type}</span>
                  <span className="text-slate-400">{n.date} · {n.advisorName}</span>
                </div>
                <p className="text-slate-700">{n.content}</p>
                {n.actionPlan && <p className="text-slate-500 text-[11px]"><strong>Action:</strong> {n.actionPlan}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================================================
// FEATURE 1: STUDENT PORTAL COMPONENT
// ==========================================================================
function StudentPortalView({ student, db, activeTab, setActiveTab }) {
  const gpaObj = useMemo(() => CSMSBackend.getStudentGPA(student.id, db), [student, db]);
  const attStats = useMemo(() => CSMSBackend.getStudentAttendanceStats(student.id, db), [student, db]);
  const feeAccount = useMemo(() => CSMSBackend.getStudentFeeAccount(student.id, db), [student, db]);
  const hallTicket = useMemo(() => CSMSBackend.getStudentHallTicket(student.id, db), [student, db]);

  const enrolledCourses = useMemo(() => {
    return db.courses.filter(c => (student.enrolledCourseIds || []).includes(c.id));
  }, [student, db.courses]);

  return (
    <div className="space-y-6">
      {/* Student Welcome Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-xl p-6 text-white shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <span>Student Self-Service Portal</span>
            <span>·</span>
            <span>{student.department}</span>
          </div>
          <h2 className="text-2xl font-bold">{student.firstName} {student.lastName}</h2>
          <p className="text-sm text-slate-300 mt-0.5">
            Roll No: <span className="font-mono font-bold text-white">{student.rollNo}</span> · Semester {student.semester} · Advisor: {student.advisor}
          </p>
        </div>

        {/* Quick Academic Standing Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 px-4 py-2.5 rounded-lg border border-slate-700 text-center">
            <div className="text-xs text-slate-400">Cumulative GPA</div>
            <div className="text-2xl font-bold text-emerald-400">{gpaObj.gpa} <span className="text-xs font-normal text-slate-400">/ 4.0</span></div>
          </div>
          <div className="bg-slate-800/80 px-4 py-2.5 rounded-lg border border-slate-700 text-center">
            <div className="text-xs text-slate-400">Overall Attendance</div>
            <div className={`text-2xl font-bold ${attStats.percentage < 75 ? "text-rose-400" : "text-white"}`}>
              {attStats.percentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Debarment Alert if <75% */}
      {attStats.percentage < 75 && (
        <div className="p-4 rounded-xl border border-rose-300 bg-rose-50 text-rose-900 flex items-start gap-3 shadow-xs">
          <span className="text-2xl">⚠️</span>
          <div>
            <h4 className="font-bold text-sm text-rose-800">Academic Attendance Shortage Debarment Notice</h4>
            <p className="text-xs text-rose-700 mt-0.5">
              Your overall attendance is currently {attStats.percentage}%, which is below the mandatory university threshold of 75%.
              You are currently flagged as debarred from appearing in semester final examinations. Please contact your advisor ({student.advisor}) immediately.
            </p>
          </div>
        </div>
      )}

      {/* Sub-tab 1: Student Overview & Registered Courses */}
      {(activeTab === "student-overview" || activeTab === "student-courses") && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900">Enrolled Courses & Academic Standing (Fall 2026)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[11px] font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Course Code</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Credits</th>
                  <th className="p-3">Faculty Instructor</th>
                  <th className="p-3">Schedule & Room</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrolledCourses.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-blue-700">{c.code}</td>
                    <td className="p-3 font-semibold text-slate-800">{c.title}</td>
                    <td className="p-3 font-bold">{c.credits} Cr</td>
                    <td className="p-3 text-slate-700">{c.instructor}</td>
                    <td className="p-3 text-slate-500">{c.schedule} · {c.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Student Grade Sheet */}
      {activeTab === "student-grades" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base text-slate-900">Official Continuous Assessment Marks & Grade Sheet</h3>
            <span className="font-bold text-sm text-emerald-700">Cumulative GPA: {gpaObj.gpa}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[11px] font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Course</th>
                  <th className="p-3">Credits</th>
                  <th className="p-3">Internal (30)</th>
                  <th className="p-3">Assignment (20)</th>
                  <th className="p-3">Final Exam (50)</th>
                  <th className="p-3">Total (100)</th>
                  <th className="p-3">Letter Grade</th>
                  <th className="p-3">Grade Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrolledCourses.map(c => {
                  const mark = db.marks.find(m => m.studentId === student.id && m.courseId === c.id) || {
                    internalScore: 0, assignmentScore: 0, finalExamScore: 0
                  };
                  const total = mark.internalScore + mark.assignmentScore + mark.finalExamScore;
                  const grade = CSMSBackend.calculateGrade(total);

                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">{c.code} - {c.title}</td>
                      <td className="p-3 font-bold">{c.credits}</td>
                      <td className="p-3">{mark.internalScore}</td>
                      <td className="p-3">{mark.assignmentScore}</td>
                      <td className="p-3">{mark.finalExamScore}</td>
                      <td className="p-3 font-bold text-sm text-slate-900">{total}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-800">
                          {grade.letter}
                        </span>
                      </td>
                      <td className="p-3 font-bold">{grade.points.toFixed(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 3: Student Attendance Status */}
      {activeTab === "student-attendance" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900">Course-Wise Attendance Compliance Log</h3>
          <div className="space-y-4">
            {enrolledCourses.map(c => {
              let totalSess = 0;
              let presentCount = 0;
              db.attendance.filter(a => a.courseId === c.id).forEach(sess => {
                const s = sess.records[student.id];
                if (s) {
                  totalSess++;
                  if (s === "Present" || s === "Excused") presentCount++;
                  else if (s === "Late") presentCount += 0.8;
                }
              });
              const pct = totalSess > 0 ? Math.round((presentCount / totalSess) * 100) : 100;

              return (
                <div key={c.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-bold text-slate-900">{c.code}: {c.title}</span>
                    <span className={`font-bold px-2 py-0.5 rounded ${pct < 75 ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-800"}`}>
                      {pct}% ({Math.round(presentCount)}/{totalSess} sessions)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${pct < 75 ? "bg-rose-500" : "bg-emerald-600"}`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-tab 4: Student Weekly Timetable */}
      {activeTab === "student-timetable" && (
        <StudentTimetableGrid student={student} db={db} />
      )}

      {/* Sub-tab 5: Semester Exam Hall Ticket */}
      {activeTab === "student-hallticket" && (
        <StudentHallTicketView ticket={hallTicket} />
      )}

      {/* Sub-tab 6: Fee Statement */}
      {activeTab === "student-fees" && (
        <StudentFeeStatementView feeAccount={feeAccount} student={student} />
      )}

      {/* Sub-tab 7: Digital Student ID Card */}
      {activeTab === "student-idcard" && (
        <DigitalStudentIDCard student={student} db={db} />
      )}
    </div>
  );
}

// ==========================================================================
// FEATURE 2: EXAM HALL TICKET / ADMIT CARD
// ==========================================================================
function StudentHallTicketView({ ticket }) {
  if (!ticket) return <div>No ticket available</div>;

  return (
    <div className="bg-white rounded-xl border border-slate-300 p-8 shadow-sm max-w-3xl mx-auto space-y-6">
      {/* Official Header */}
      <div className="text-center border-b-2 border-slate-900 pb-4">
        <h2 className="text-xl font-extrabold uppercase tracking-wide text-slate-900">Veritas University</h2>
        <p className="text-xs uppercase tracking-widest text-slate-600 font-semibold">Office of University Registrar & Controller of Examinations</p>
        <div className="mt-2 text-sm font-bold bg-slate-100 inline-block px-4 py-1 rounded border border-slate-300 text-slate-800">
          Fall 2026 Semester Examination Admit Card / Hall Ticket
        </div>
      </div>

      {/* Student Meta Details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border p-4 rounded-lg bg-slate-50">
        <div>
          <span className="text-slate-500 font-semibold">Candidate Name</span>
          <div className="font-bold text-slate-900">{ticket.student.firstName} {ticket.student.lastName}</div>
        </div>
        <div>
          <span className="text-slate-500 font-semibold">Roll Number</span>
          <div className="font-mono font-bold text-slate-900">{ticket.student.rollNo}</div>
        </div>
        <div>
          <span className="text-slate-500 font-semibold">Department</span>
          <div className="font-bold text-slate-900">{ticket.student.department}</div>
        </div>
        <div>
          <span className="text-slate-500 font-semibold">Eligibility Stamp</span>
          <div className={`font-bold ${ticket.isEligible ? "text-emerald-700" : "text-rose-700"}`}>
            {ticket.isEligible ? "✓ CLEARED" : "✗ DEBARRED"}
          </div>
        </div>
      </div>

      {/* Automated Debarment Indicator */}
      {ticket.isDebarred && (
        <div className="border-2 border-rose-600 bg-rose-50 text-rose-900 p-4 rounded-lg text-center font-bold text-sm uppercase tracking-wide">
          DEBARRED DUE TO ATTENDANCE SHORTAGE ({ticket.attendancePct}% &lt; 75% REQUIREMENT)
        </div>
      )}

      {/* Exam Timetable Schedule Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border">
          <thead className="bg-slate-100 font-bold border-b text-slate-700 uppercase">
            <tr>
              <th className="p-2.5">Date</th>
              <th className="p-2.5">Time</th>
              <th className="p-2.5">Course Code & Title</th>
              <th className="p-2.5">Examination Hall</th>
              <th className="p-2.5">Seat No</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {ticket.examSchedule.map((ex, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="p-2.5 font-bold">{ex.examDate}</td>
                <td className="p-2.5 text-slate-600">{ex.time}</td>
                <td className="p-2.5 font-semibold text-slate-900">{ex.courseCode} · {ex.courseTitle}</td>
                <td className="p-2.5">{ex.hallRoom}</td>
                <td className="p-2.5 font-mono font-bold text-blue-700">{ex.seatNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Official Signatures */}
      <div className="flex justify-between pt-8 border-t border-slate-300 text-xs">
        <div className="text-center">
          <div className="w-36 border-b border-slate-400 mb-1"></div>
          <span className="text-slate-500 font-medium">Candidate Signature</span>
        </div>
        <div className="text-center">
          <div className="w-36 border-b border-slate-900 mb-1 font-serif italic text-slate-900">Dr. Robert Vance</div>
          <span className="text-slate-700 font-bold">Controller of Examinations</span>
        </div>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-sm"
        >
          Print Official Hall Ticket
        </button>
      </div>
    </div>
  );
}

// ==========================================================================
// FEATURE 3: WEEKLY SCHEDULE / TIMETABLE GRID
// ==========================================================================
function StudentTimetableGrid({ student, db }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const enrolledCodes = useMemo(() => {
    const list = db.courses.filter(c => (student.enrolledCourseIds || []).includes(c.id));
    return new Set(list.map(c => c.code));
  }, [student, db.courses]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
      <h3 className="font-bold text-base text-slate-900">Personalized Weekly Timetable Grid (Monday – Friday)</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {days.map(day => {
          const daySlots = db.timetable.filter(t => t.day === day && enrolledCodes.has(t.courseCode));
          return (
            <div key={day} className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
              <div className="bg-slate-900 text-white p-2.5 text-center font-bold text-xs uppercase tracking-wider">
                {day}
              </div>
              <div className="p-2 space-y-2 min-h-[220px]">
                {daySlots.length === 0 ? (
                  <p className="text-[11px] text-slate-400 text-center italic py-6">No scheduled lectures</p>
                ) : (
                  daySlots.map(slot => (
                    <div key={slot.id} className="p-2.5 rounded bg-white border border-slate-200 shadow-2xs space-y-1">
                      <div className="font-bold text-xs text-blue-800">{slot.courseCode}</div>
                      <div className="text-[11px] text-slate-800 font-semibold leading-tight">{slot.courseTitle}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{slot.time}</div>
                      <div className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded inline-block">
                        {slot.room}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Master Timetable Grid for Admin / Dean
function UniversityTimetableGrid({ db }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h3 className="font-bold text-base text-slate-900">Institutional Master Timetable Grid</h3>
          <p className="text-xs text-slate-500">Lecture hall occupancy and weekly departmental periods</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {days.map(day => {
          const slots = db.timetable.filter(t => t.day === day);
          return (
            <div key={day} className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
              <div className="bg-slate-900 text-white p-2.5 text-center font-bold text-xs uppercase tracking-wider">
                {day} ({slots.length} Lectures)
              </div>
              <div className="p-2 space-y-2">
                {slots.map(s => (
                  <div key={s.id} className="p-2.5 bg-white border rounded shadow-2xs text-xs space-y-1">
                    <div className="font-bold text-blue-700">{s.courseCode} · {s.room}</div>
                    <div className="font-semibold text-slate-800 leading-tight">{s.courseTitle}</div>
                    <div className="text-[11px] text-slate-500">{s.instructor}</div>
                    <div className="text-[10px] font-mono text-slate-600 bg-slate-100 px-1 py-0.5 rounded inline-block">{s.time}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================================================
// FEATURE 4: TUITION & FEE MANAGEMENT
// ==========================================================================
function TuitionFeeLedger({ db, updateDb, showToast }) {
  const handleMarkPaid = (studentId) => {
    const updatedFees = db.fees.map(f => {
      if (f.studentId === studentId) {
        const total = (f.tuition || 0) + (f.labFee || 0) + (f.housing || 0);
        return { ...f, paid: total, status: "Paid", cleared: true, receiptNo: `REC-2026-${Math.floor(100 + Math.random() * 900)}` };
      }
      return f;
    });
    updateDb({ ...db, fees: updatedFees });
    showToast("Tuition account marked as Fully Cleared.", "success");
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-sm text-slate-900">Student Tuition & Campus Housing Accounts</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-600 uppercase text-[11px] font-bold border-b border-slate-200">
            <tr>
              <th className="p-3">Roll No</th>
              <th className="p-3">Student Name</th>
              <th className="p-3">Tuition Fee</th>
              <th className="p-3">Lab Fee</th>
              <th className="p-3">Housing</th>
              <th className="p-3">Total Due</th>
              <th className="p-3">Paid Amount</th>
              <th className="p-3">Balance</th>
              <th className="p-3">Financial Clearance</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {db.students.map(st => {
              const fee = CSMSBackend.getStudentFeeAccount(st.id, db);
              return (
                <tr key={st.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-900">{st.rollNo}</td>
                  <td className="p-3 font-semibold text-slate-800">{st.firstName} {st.lastName}</td>
                  <td className="p-3 font-mono">${fee.tuition}</td>
                  <td className="p-3 font-mono">${fee.labFee}</td>
                  <td className="p-3 font-mono">${fee.housing}</td>
                  <td className="p-3 font-mono font-bold">${fee.totalDue}</td>
                  <td className="p-3 font-mono text-emerald-700 font-bold">${fee.paid}</td>
                  <td className="p-3 font-mono font-bold text-rose-700">${fee.balance}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      fee.cleared ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {fee.cleared ? "✓ Cleared" : "Pending Due"}
                    </span>
                  </td>
                  <td className="p-3">
                    {!fee.cleared && (
                      <button
                        onClick={() => handleMarkPaid(st.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px]"
                      >
                        Clear Balance
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StudentFeeStatementView({ feeAccount, student }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-start border-b pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Student Fee Account Statement</h3>
          <p className="text-xs text-slate-500">Fall 2026 Academic Term · Veritas University</p>
        </div>
        <div className={`px-3 py-1 rounded text-xs font-bold ${feeAccount.cleared ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
          {feeAccount.cleared ? "Financial Status: Cleared" : "Payment Pending"}
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div className="flex justify-between py-1.5 border-b border-slate-100">
          <span>Semester Tuition Fee</span>
          <span className="font-mono font-bold">${feeAccount.tuition}</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-slate-100">
          <span>Laboratory & Computing Surcharge</span>
          <span className="font-mono font-bold">${feeAccount.labFee}</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-slate-100">
          <span>Campus Housing / Residence Hall</span>
          <span className="font-mono font-bold">${feeAccount.housing}</span>
        </div>
        <div className="flex justify-between py-2 text-sm font-bold border-t-2 border-slate-900">
          <span>Total Assessed</span>
          <span className="font-mono">${feeAccount.totalDue}</span>
        </div>
        <div className="flex justify-between py-1.5 text-xs text-emerald-700 font-bold">
          <span>Amount Remitted</span>
          <span className="font-mono">-${feeAccount.paid}</span>
        </div>
        <div className="flex justify-between py-2 text-sm font-bold border-t border-slate-200 text-rose-700">
          <span>Outstanding Balance</span>
          <span className="font-mono">${feeAccount.balance}</span>
        </div>
      </div>

      {feeAccount.receiptNo && (
        <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded border">
          Official Receipt Number: <strong className="font-mono text-slate-800">{feeAccount.receiptNo}</strong>
        </div>
      )}
    </div>
  );
}

// ==========================================================================
// FEATURE 5: PRINTABLE DIGITAL ID CARD WITH SVG QR CODE
// ==========================================================================
function DigitalStudentIDCard({ student, db }) {
  // Simple SVG QR code placeholder generator
  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="w-full bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white rounded-2xl p-6 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* University Crest Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
              VU
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-white">Veritas University</div>
              <div className="text-[10px] text-slate-400">Official Student Identity Card</div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">2026-2027</span>
        </div>

        {/* Student Photo & Demographics */}
        <div className="flex gap-4 items-center">
          <div className="w-20 h-20 rounded-xl bg-blue-600 flex items-center justify-center text-2xl font-bold text-white border-2 border-white/20 shadow-md">
            {student.firstName[0]}{student.lastName[0]}
          </div>

          <div className="space-y-1 text-xs">
            <h3 className="text-base font-bold text-white leading-tight">{student.firstName} {student.lastName}</h3>
            <p className="font-mono text-blue-400 font-bold text-xs">{student.rollNo}</p>
            <p className="text-[11px] text-slate-300">{student.department}</p>
            <p className="text-[10px] text-slate-400">Blood: <strong className="text-white">{student.bloodGroup || "O+"}</strong></p>
          </div>
        </div>

        {/* QR Code & Barcode Verification */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[10px] text-slate-400">
            <div>Valid Through: <strong>June 2027</strong></div>
            <div>Emergency: {student.phone || "+1 (555) 234-8901"}</div>
          </div>

          {/* SVG QR Code */}
          <div className="w-14 h-14 bg-white p-1 rounded-md shadow-xs flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-full h-full text-slate-900" fill="currentColor">
              <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4 4h4v4h-4v-4zm0-4h4v-4h-4v4z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => window.print()}
          className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-sm"
        >
          Print Student ID Card
        </button>
      </div>
    </div>
  );
}

// ==========================================================================
// FEATURE 6: ACADEMIC EARLY WARNING & ADVISOR INTERVENTION (DEAN VIEW)
// ==========================================================================
function AdvisorInterventionView({ db, updateDb, showToast }) {
  const atRiskStudents = useMemo(() => {
    return db.students.filter(s => {
      const gpa = parseFloat(CSMSBackend.getStudentGPA(s.id, db).gpa);
      const att = CSMSBackend.getStudentAttendanceStats(s.id, db).percentage;
      return gpa < 2.0 || att < 75;
    });
  }, [db]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div>
        <h3 className="font-bold text-base text-slate-900">Academic Early Warning & Intervention Center</h3>
        <p className="text-xs text-slate-500">Students flagged for Academic Probation (GPA &lt; 2.0) or Debarment Risk (Attendance &lt; 75%)</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border">
          <thead className="bg-slate-100 font-bold uppercase text-[11px] text-slate-600 border-b">
            <tr>
              <th className="p-3">Roll No</th>
              <th className="p-3">Student Name</th>
              <th className="p-3">Department</th>
              <th className="p-3">CGPA</th>
              <th className="p-3">Attendance</th>
              <th className="p-3">Risk Trigger</th>
              <th className="p-3">Assigned Advisor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {atRiskStudents.map(st => {
              const gpa = parseFloat(CSMSBackend.getStudentGPA(st.id, db).gpa);
              const att = CSMSBackend.getStudentAttendanceStats(st.id, db).percentage;
              return (
                <tr key={st.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold">{st.rollNo}</td>
                  <td className="p-3 font-semibold">{st.firstName} {st.lastName}</td>
                  <td className="p-3">{st.department}</td>
                  <td className="p-3 font-bold">{gpa.toFixed(2)}</td>
                  <td className="p-3 font-bold text-rose-700">{att}%</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-800 text-[10px]">
                      {att < 75 ? "Attendance Shortage" : "Academic Probation"}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-slate-700">{st.advisor}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Hall Tickets Manager for Dean
function HallTicketsManager({ db }) {
  const [selectedStudentId, setSelectedStudentId] = useState(db.students[0]?.id || "");
  const ticket = useMemo(() => CSMSBackend.getStudentHallTicket(selectedStudentId, db), [selectedStudentId, db]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold uppercase text-slate-500">Select Candidate for Hall Ticket:</span>
        <select
          value={selectedStudentId}
          onChange={e => setSelectedStudentId(e.target.value)}
          className="border rounded-lg p-2 text-xs font-semibold bg-white"
        >
          {db.students.map(s => (
            <option key={s.id} value={s.id}>{s.rollNo} - {s.firstName} {s.lastName}</option>
          ))}
        </select>
      </div>
      <StudentHallTicketView ticket={ticket} />
    </div>
  );
}

// ==========================================================================
// DEAN / REGISTRAR DASHBOARD & CRUD VIEWS
// ==========================================================================
function DeanDashboard({ db, setActiveTab, onOpenProfile }) {
  const shortage = useMemo(() => {
    return db.students.filter(s => CSMSBackend.getStudentAttendanceStats(s.id, db).percentage < 75);
  }, [db]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Academic Operations Command</h2>
          <p className="text-sm text-slate-500">Registrar oversight, enrollment matrices, and institutional performance</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab("students")} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800">
            Admit Student
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Enrolled Students</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{db.students.length}</div>
          <span className="text-xs text-emerald-600 font-semibold">Active Standing</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Curriculum Units</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{db.courses.length}</div>
          <span className="text-xs text-slate-500">Across 5 departments</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Faculty Members</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{db.faculty.length}</div>
          <span className="text-xs text-blue-600 font-semibold">Active Teaching</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Shortages</span>
          <div className="text-2xl font-bold text-rose-600 mt-1">{shortage.length}</div>
          <span className="text-xs text-rose-600 font-semibold">&lt;75% Threshold Alert</span>
        </div>
      </div>

      {/* At-Risk Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-rose-50 flex justify-between items-center">
          <span className="font-bold text-sm text-rose-900">Attendance Debarment Risk Watchlist (&lt; 75%)</span>
          <button onClick={() => setActiveTab("attendance")} className="text-xs font-bold text-rose-700 hover:underline">
            View Full Attendance Ledger
          </button>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-slate-600 uppercase text-[11px] font-bold">
            <tr>
              <th className="p-3">Roll No</th>
              <th className="p-3">Student Name</th>
              <th className="p-3">Department</th>
              <th className="p-3">Attendance %</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {shortage.slice(0, 5).map(st => {
              const att = CSMSBackend.getStudentAttendanceStats(st.id, db);
              return (
                <tr key={st.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-900">{st.rollNo}</td>
                  <td className="p-3 font-semibold text-slate-800">{st.firstName} {st.lastName}</td>
                  <td className="p-3">{st.department}</td>
                  <td className="p-3 font-bold text-rose-600">{att.percentage}%</td>
                  <td className="p-3">
                    <button onClick={() => onOpenProfile(st.id)} className="text-blue-600 hover:text-blue-800 font-semibold">
                      Profile
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Dean Student Directory Component
function DeanStudentsDirectory({ db, updateDb, showToast, onOpenProfile }) {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");

  const filtered = useMemo(() => {
    return db.students.filter(s => {
      const matchQ = s.firstName.toLowerCase().includes(search.toLowerCase()) ||
                     s.lastName.toLowerCase().includes(search.toLowerCase()) ||
                     s.rollNo.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter ? s.department === deptFilter : true;
      return matchQ && matchDept;
    });
  }, [db.students, search, deptFilter]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Student Directory ({filtered.length})</h2>
          <p className="text-xs text-slate-500">Official student registry and academic transcripts</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search students..."
            className="text-xs border rounded-lg px-3 py-1.5 w-60"
          />
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="text-xs border rounded-lg px-3 py-1.5"
          >
            <option value="">All Departments</option>
            {db.departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border">
          <thead className="bg-slate-100 text-slate-600 uppercase text-[11px] font-bold border-b">
            <tr>
              <th className="p-3">Roll No</th>
              <th className="p-3">Name</th>
              <th className="p-3">Department</th>
              <th className="p-3">CGPA</th>
              <th className="p-3">Attendance</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(st => {
              const gpa = CSMSBackend.getStudentGPA(st.id, db);
              const att = CSMSBackend.getStudentAttendanceStats(st.id, db);
              return (
                <tr key={st.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-900">{st.rollNo}</td>
                  <td className="p-3 font-semibold text-slate-800">{st.firstName} {st.lastName}</td>
                  <td className="p-3">{st.department}</td>
                  <td className="p-3 font-bold">{gpa.gpa}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${att.percentage < 75 ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"}`}>
                      {att.percentage}%
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-700 text-[10px]">{st.status}</span>
                  </td>
                  <td className="p-3">
                    <button onClick={() => onOpenProfile(st.id)} className="text-blue-600 hover:text-blue-800 font-semibold mr-3">
                      Profile
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Course Catalog for Dean
function DeanCourseCatalog({ db }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
      <h2 className="text-lg font-bold text-slate-900">Curriculum Course Catalog ({db.courses.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {db.courses.map(c => (
          <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-mono font-bold text-sm text-blue-700">{c.code}</span>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">{c.credits} Credits</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm leading-tight">{c.title}</h4>
            <p className="text-slate-500">{c.department}</p>
            <div className="pt-2 border-t text-[11px] text-slate-600 flex justify-between">
              <span>Instructor: <strong>{c.instructor}</strong></span>
              <span>Room: <strong>{c.room}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Dean Gradebook
function DeanGradebook({ db, updateDb, showToast }) {
  const [selectedCourseId, setSelectedCourseId] = useState(db.courses[0]?.id || "");
  const course = db.courses.find(c => c.id === selectedCourseId) || db.courses[0];
  const enrolled = db.students.filter(s => (s.enrolledCourseIds || []).includes(course.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold uppercase text-slate-500">Select Course:</span>
        <select
          value={selectedCourseId}
          onChange={e => setSelectedCourseId(e.target.value)}
          className="border rounded-lg p-2 text-xs font-semibold bg-white"
        >
          {db.courses.map(c => (
            <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
          ))}
        </select>
      </div>

      <FacultyGradebookEditor
        course={course}
        students={enrolled}
        db={db}
        updateDb={updateDb}
        showToast={showToast}
      />
    </div>
  );
}

// Dean Attendance Ledger
function DeanAttendanceLedger({ db, updateDb, showToast, onOpenProfile }) {
  const list = db.students.filter(s => CSMSBackend.getStudentAttendanceStats(s.id, db).percentage < 75);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
      <h2 className="text-lg font-bold text-slate-900">Attendance Debarment & Shortage Audit (&lt;75%)</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border">
          <thead className="bg-slate-100 uppercase text-[11px] font-bold border-b">
            <tr>
              <th className="p-3">Roll No</th>
              <th className="p-3">Name</th>
              <th className="p-3">Department</th>
              <th className="p-3">Attendance</th>
              <th className="p-3">Sessions (Att/Tot)</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {list.map(st => {
              const att = CSMSBackend.getStudentAttendanceStats(st.id, db);
              return (
                <tr key={st.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold">{st.rollNo}</td>
                  <td className="p-3 font-semibold">{st.firstName} {st.lastName}</td>
                  <td className="p-3">{st.department}</td>
                  <td className="p-3 font-bold text-rose-700">{att.percentage}%</td>
                  <td className="p-3">{att.attended} / {att.totalSessions}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-800 text-[10px]">Debarred</span>
                  </td>
                  <td className="p-3">
                    <button onClick={() => onOpenProfile(st.id)} className="text-blue-600 font-bold">Audit</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Settings View
function SystemSettingsView({ db, setDb, showToast }) {
  const handleReset = () => {
    if (confirm("Reset to clean university seed database?")) {
      const fresh = CSMSBackend.reset();
      setDb(fresh);
      showToast("Database restored to default university seed.", "success");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-xl space-y-4">
      <h2 className="text-lg font-bold text-slate-900">System Configuration & Data Backup</h2>
      <p className="text-xs text-slate-500">Restore or export university records</p>
      <div className="space-y-3 pt-2">
        <button
          onClick={handleReset}
          className="w-full px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-lg hover:bg-rose-700"
        >
          Reset to Clean Sample Database
        </button>
      </div>
    </div>
  );
}

// Student 360 Modal
function Student360Modal({ studentId, db, onClose }) {
  const student = db.students.find(s => s.id === studentId);
  if (!student) return null;
  const gpa = CSMSBackend.getStudentGPA(student.id, db);
  const att = CSMSBackend.getStudentAttendanceStats(student.id, db);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start border-b pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{student.firstName} {student.lastName}</h3>
            <p className="text-xs text-slate-500">Roll No: {student.rollNo} · {student.department}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl font-bold">&times;</button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border">
          <div>Email: <strong>{student.email}</strong></div>
          <div>Phone: <strong>{student.phone}</strong></div>
          <div>CGPA: <strong className="text-emerald-700">{gpa.gpa} / 4.0</strong></div>
          <div>Attendance: <strong className={att.percentage < 75 ? "text-rose-600" : "text-emerald-700"}>{att.percentage}%</strong></div>
          <div>Advisor: <strong>{student.advisor}</strong></div>
          <div>Status: <strong>{student.status}</strong></div>
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={onClose} className="px-4 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Mount React Root
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<UniversityPortal />);
}
