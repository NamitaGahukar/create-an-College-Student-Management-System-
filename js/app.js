/**
 * Veritas University - Campus Management System (CSMS)
 * Main Application Logic & User Interface Controller
 */

(function () {
  "use strict";

  // Application State
  const state = {
    db: null,
    activeView: "dashboard",
    students: {
      search: "",
      department: "",
      semester: "",
      status: "",
      sortField: "rollNo",
      sortAsc: true,
      page: 1,
      pageSize: 10
    },
    courses: {
      search: "",
      department: "",
      semester: ""
    },
    marks: {
      courseId: "CRS-101",
      search: ""
    },
    attendance: {
      activeTab: "daily",
      courseId: "CRS-101",
      date: new Date().toISOString().split("T")[0],
      topic: "",
      currentSessionRecords: {}
    },
    charts: {
      deptChart: null,
      gradeChart: null,
      monthlyChart: null
    }
  };

  // Helper Shorthand
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

  // --- INITIALIZATION ---
  function init() {
    state.db = CSMSData.StorageService.load();
    setupNavigation();
    setupModals();
    setupEventListeners();
    renderCurrentView();
    updateSidebarBadges();
  }

  // --- SIDEBAR BADGES & SYSTEM STATS ---
  function updateSidebarBadges() {
    const studentCount = state.db.students.length;
    const courseCount = state.db.courses.length;
    const shortageList = CSMSData.StorageService.getShortageStudents(75);

    const elStuBadge = $("#badge-students-count");
    if (elStuBadge) elStuBadge.textContent = studentCount;

    const elCrsBadge = $("#badge-courses-count");
    if (elCrsBadge) elCrsBadge.textContent = courseCount;

    const elAttBadge = $("#badge-attendance-shortage");
    if (elAttBadge) {
      if (shortageList.length > 0) {
        elAttBadge.textContent = `${shortageList.length} alert`;
        elAttBadge.style.display = "inline-block";
      } else {
        elAttBadge.style.display = "none";
      }
    }
  }

  // --- NAVIGATION CONTROLLER ---
  function setupNavigation() {
    const navItems = $$(".nav-item[data-view]");
    navItems.forEach(item => {
      item.addEventListener("click", e => {
        e.preventDefault();
        const targetView = item.dataset.view;
        switchView(targetView);
      });
    });

    // Mobile sidebar toggle if hamburger clicked
    const toggleBtn = $("#btn-toggle-sidebar");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        $("#sidebar").classList.toggle("open");
      });
    }

    // Header Quick Search
    const globalSearchInput = $("#header-global-search");
    if (globalSearchInput) {
      globalSearchInput.addEventListener("input", e => {
        const query = e.target.value.trim().toLowerCase();
        if (query.length > 0) {
          // Switch to students tab and filter
          state.students.search = query;
          switchView("students");
          const stuSearchInput = $("#filter-student-search");
          if (stuSearchInput) stuSearchInput.value = query;
          renderStudentsTable();
        }
      });
    }
  }

  function switchView(viewName) {
    state.activeView = viewName;
    $$(".nav-item").forEach(item => {
      item.classList.toggle("active", item.dataset.view === viewName);
    });
    $$(".view-section").forEach(section => {
      section.classList.toggle("active", section.id === `view-${viewName}`);
    });

    // Close mobile sidebar if open
    $("#sidebar").classList.remove("open");

    renderCurrentView();
  }

  function renderCurrentView() {
    switch (state.activeView) {
      case "dashboard":
        renderDashboard();
        break;
      case "students":
        renderStudentsView();
        break;
      case "courses":
        renderCoursesView();
        break;
      case "marks":
        renderMarksView();
        break;
      case "attendance":
        renderAttendanceView();
        break;
      case "analytics":
        renderAnalyticsView();
        break;
      case "settings":
        renderSettingsView();
        break;
    }
    updateSidebarBadges();
  }

  // ==========================================================================
  // DASHBOARD VIEW
  // ==========================================================================
  function renderDashboard() {
    const students = state.db.students;
    const courses = state.db.courses;
    const marks = state.db.marks;
    const shortage = CSMSData.StorageService.getShortageStudents(75);

    // 1. Calculate Average Institutional CGPA
    let gpaSum = 0;
    let studentsWithGrades = 0;
    students.forEach(st => {
      const gpaObj = CSMSData.StorageService.getStudentGPA(st.id, state.db);
      if (gpaObj.totalCredits > 0) {
        gpaSum += parseFloat(gpaObj.gpa);
        studentsWithGrades++;
      }
    });
    const avgCGPA = studentsWithGrades > 0 ? (gpaSum / studentsWithGrades).toFixed(2) : "3.42";

    // 2. Overall Attendance Rate
    let totalPresentSessions = 0;
    let totalScheduledSessions = 0;
    students.forEach(st => {
      const stats = CSMSData.StorageService.getStudentAttendanceStats(st.id, state.db);
      totalPresentSessions += stats.attended;
      totalScheduledSessions += stats.totalSessions;
    });
    const overallAttRate = totalScheduledSessions > 0
      ? Math.round((totalPresentSessions / totalScheduledSessions) * 100)
      : 89;

    // Fill KPI Elements
    $("#kpi-total-students").textContent = students.length;
    $("#kpi-active-courses").textContent = courses.length;
    $("#kpi-inst-gpa").textContent = avgCGPA;
    $("#kpi-overall-attendance").textContent = `${overallAttRate}%`;
    $("#kpi-shortage-count").textContent = shortage.length;

    // Populate At-Risk Students list preview
    const tbodyAtRisk = $("#dashboard-at-risk-body");
    if (tbodyAtRisk) {
      if (shortage.length === 0) {
        tbodyAtRisk.innerHTML = `<tr><td colspan="5" class="text-center" style="padding: 24px; color: var(--text-dim);">No students currently below attendance threshold.</td></tr>`;
      } else {
        tbodyAtRisk.innerHTML = shortage.slice(0, 5).map(item => {
          const st = item.student;
          const gpa = CSMSData.StorageService.getStudentGPA(st.id, state.db).gpa;
          return `
            <tr>
              <td><span class="roll-no" style="font-weight: 600;">${st.rollNo}</span></td>
              <td>
                <div class="student-cell">
                  <div class="avatar-initials">${st.firstName[0]}${st.lastName[0]}</div>
                  <div>
                    <div class="student-meta-name">${st.firstName} ${st.lastName}</div>
                    <div class="student-meta-email">${st.email}</div>
                  </div>
                </div>
              </td>
              <td>${st.department}</td>
              <td><span class="badge badge-rose"><span class="badge-dot"></span> ${item.stats.percentage}% (${item.stats.attended}/${item.stats.totalSessions} sess)</span></td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="window.CSMSApp.openStudentProfile('${st.id}')">View Transcript</button>
              </td>
            </tr>
          `;
        }).join("");
      }
    }

    // Render Dashboard Charts
    renderDashboardCharts();
  }

  function renderDashboardCharts() {
    // Prepare Data
    const deptCounts = {};
    state.db.departments.forEach(d => { deptCounts[d.code] = 0; });
    state.db.students.forEach(s => {
      const deptObj = state.db.departments.find(d => d.name === s.department);
      const code = deptObj ? deptObj.code : "CSE";
      deptCounts[code] = (deptCounts[code] || 0) + 1;
    });

    const gradeBuckets = { "A+": 0, "A": 0, "B+": 0, "B": 0, "C": 0, "D": 0, "F": 0 };
    state.db.marks.forEach(m => {
      const tot = Number(m.internalScore || 0) + Number(m.assignmentScore || 0) + Number(m.finalExamScore || 0);
      const grade = CSMSData.StorageService.calculateGrade(tot);
      if (gradeBuckets[grade.letter] !== undefined) {
        gradeBuckets[grade.letter]++;
      } else {
        gradeBuckets["B"]++;
      }
    });

    if (typeof Chart === "undefined") {
      const elDeptParent = $("#chart-dept-distribution")?.parentElement;
      if (elDeptParent) {
        const totalStu = state.db.students.length || 1;
        elDeptParent.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 10px; padding: 10px 0;">
            ${Object.entries(deptCounts).map(([code, count]) => `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 2px;">
                  <span>${code}</span>
                  <span>${count} students (${Math.round((count / totalStu) * 100)}%)</span>
                </div>
                <div style="height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                  <div style="width: ${(count / totalStu) * 100}%; height: 100%; background: #1e3a8a; border-radius: 4px;"></div>
                </div>
              </div>
            `).join("")}
          </div>
        `;
      }

      const elGradeParent = $("#chart-grade-distribution")?.parentElement;
      if (elGradeParent) {
        const totalMarks = state.db.marks.length || 1;
        elGradeParent.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 8px; padding: 6px 0;">
            ${Object.entries(gradeBuckets).map(([grade, count]) => `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 11.5px; font-weight: 600; margin-bottom: 2px;">
                  <span>Grade ${grade}</span>
                  <span>${count} records</span>
                </div>
                <div style="height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                  <div style="width: ${(count / totalMarks) * 100}%; height: 100%; background: #2563eb; border-radius: 3px;"></div>
                </div>
              </div>
            `).join("")}
          </div>
        `;
      }
      return;
    }

    const ctxDept = document.getElementById("chart-dept-distribution");
    if (ctxDept) {
      if (state.charts.deptChart) state.charts.deptChart.destroy();
      state.charts.deptChart = new Chart(ctxDept, {
        type: "bar",
        data: {
          labels: Object.keys(deptCounts),
          datasets: [{
            label: "Enrolled Students",
            data: Object.values(deptCounts),
            backgroundColor: ["#1e3a8a", "#2563eb", "#059669", "#d97706", "#7c3aed"],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 2 } }
          }
        }
      });
    }

    // Chart 2: Grade Distribution
    const ctxGrade = document.getElementById("chart-grade-distribution");
    if (ctxGrade) {
      if (state.charts.gradeChart) state.charts.gradeChart.destroy();
      state.charts.gradeChart = new Chart(ctxGrade, {
        type: "doughnut",
        data: {
          labels: Object.keys(gradeBuckets),
          datasets: [{
            data: Object.values(gradeBuckets),
            backgroundColor: ["#059669", "#10b981", "#2563eb", "#3b82f6", "#f59e0b", "#d97706", "#dc2626"]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "right", labels: { boxWidth: 12, font: { size: 11 } } }
          }
        }
      });
    }
  }

  // ==========================================================================
  // STUDENTS VIEW
  // ==========================================================================
  function renderStudentsView() {
    // Populate Department Filter Dropdown
    const deptSelect = $("#filter-student-dept");
    if (deptSelect && deptSelect.options.length <= 1) {
      state.db.departments.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d.name;
        opt.textContent = d.name;
        deptSelect.appendChild(opt);
      });
    }

    renderStudentsTable();
  }

  function getFilteredStudents() {
    let list = [...state.db.students];
    const q = state.students.search.toLowerCase();

    if (q) {
      list = list.filter(s =>
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    }

    if (state.students.department) {
      list = list.filter(s => s.department === state.students.department);
    }

    if (state.students.semester) {
      list = list.filter(s => String(s.semester) === String(state.students.semester));
    }

    if (state.students.status) {
      list = list.filter(s => s.status === state.students.status);
    }

    // Sorting
    const field = state.students.sortField;
    const asc = state.students.sortAsc ? 1 : -1;

    list.sort((a, b) => {
      if (field === "rollNo") return a.rollNo.localeCompare(b.rollNo) * asc;
      if (field === "name") return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`) * asc;
      if (field === "department") return a.department.localeCompare(b.department) * asc;
      if (field === "semester") return (a.semester - b.semester) * asc;
      if (field === "cgpa") {
        const gpaA = parseFloat(CSMSData.StorageService.getStudentGPA(a.id, state.db).gpa);
        const gpaB = parseFloat(CSMSData.StorageService.getStudentGPA(b.id, state.db).gpa);
        return (gpaA - gpaB) * asc;
      }
      if (field === "attendance") {
        const attA = CSMSData.StorageService.getStudentAttendanceStats(a.id, state.db).percentage;
        const attB = CSMSData.StorageService.getStudentAttendanceStats(b.id, state.db).percentage;
        return (attA - attB) * asc;
      }
      return 0;
    });

    return list;
  }

  function renderStudentsTable() {
    const allFiltered = getFilteredStudents();
    const total = allFiltered.length;
    const totalPages = Math.ceil(total / state.students.pageSize) || 1;

    if (state.students.page > totalPages) state.students.page = totalPages;
    const startIdx = (state.students.page - 1) * state.students.pageSize;
    const pageItems = allFiltered.slice(startIdx, startIdx + state.students.pageSize);

    const tbody = $("#students-table-body");
    if (!tbody) return;

    if (pageItems.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="padding: 36px; color: var(--text-dim);">No students matching current filter criteria.</td></tr>`;
    } else {
      tbody.innerHTML = pageItems.map(st => {
        const gpaObj = CSMSData.StorageService.getStudentGPA(st.id, state.db);
        const attStats = CSMSData.StorageService.getStudentAttendanceStats(st.id, state.db);

        // Attendance badge color
        let attBadgeClass = "badge-emerald";
        if (attStats.percentage < 75) attBadgeClass = "badge-rose";
        else if (attStats.percentage < 85) attBadgeClass = "badge-amber";

        // Status badge
        let statusBadgeClass = "badge-emerald";
        if (st.status === "On Leave") statusBadgeClass = "badge-amber";
        if (st.status === "Suspended") statusBadgeClass = "badge-rose";
        if (st.status === "Graduated") statusBadgeClass = "badge-blue";

        return `
          <tr>
            <td><strong class="roll-no">${st.rollNo}</strong></td>
            <td>
              <div class="student-cell">
                <div class="avatar-initials">${st.firstName[0]}${st.lastName[0]}</div>
                <div>
                  <div class="student-meta-name">${st.firstName} ${st.lastName}</div>
                  <div class="student-meta-email">${st.email}</div>
                </div>
              </div>
            </td>
            <td>${st.department}</td>
            <td><span class="badge badge-slate">Sem ${st.semester}</span></td>
            <td><strong class="num-tabular" style="font-size: 13.5px;">${gpaObj.gpa}</strong> <span style="font-size: 11px; color: var(--text-dim);">/ 4.0</span></td>
            <td>
              <div>
                <span class="badge ${attBadgeClass}"><span class="badge-dot"></span> ${attStats.percentage}%</span>
                <div class="att-bar-wrap" style="width: 80px;">
                  <div class="att-bar-fill ${attStats.percentage < 75 ? 'fill-low' : (attStats.percentage < 85 ? 'fill-med' : 'fill-high')}" style="width: ${attStats.percentage}%"></div>
                </div>
              </div>
            </td>
            <td><span class="badge ${statusBadgeClass}"><span class="badge-dot"></span> ${st.status}</span></td>
            <td>
              <div style="display: flex; gap: 6px;">
                <button class="btn btn-secondary btn-sm" title="View Profile & Official Transcript" onclick="window.CSMSApp.openStudentProfile('${st.id}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  Profile
                </button>
                <button class="btn btn-secondary btn-sm btn-icon" title="Edit Student" onclick="window.CSMSApp.openEditStudentModal('${st.id}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                </button>
                <button class="btn btn-secondary btn-sm btn-icon" style="color: var(--rose-600);" title="Delete Student" onclick="window.CSMSApp.confirmDeleteStudent('${st.id}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }

    // Pagination info & buttons
    const elInfo = $("#students-pagination-info");
    if (elInfo) {
      const from = total === 0 ? 0 : startIdx + 1;
      const to = Math.min(startIdx + state.students.pageSize, total);
      elInfo.textContent = `Showing ${from} - ${to} of ${total} students`;
    }

    const elPrev = $("#btn-students-prev");
    const elNext = $("#btn-students-next");
    if (elPrev) elPrev.disabled = state.students.page <= 1;
    if (elNext) elNext.disabled = state.students.page >= totalPages;

    const elPageNum = $("#students-current-page");
    if (elPageNum) elPageNum.textContent = `Page ${state.students.page} of ${totalPages}`;
  }

  // ==========================================================================
  // COURSES VIEW
  // ==========================================================================
  function renderCoursesView() {
    // Populate Course Dept Filter
    const deptSelect = $("#filter-course-dept");
    if (deptSelect && deptSelect.options.length <= 1) {
      state.db.departments.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d.name;
        opt.textContent = d.name;
        deptSelect.appendChild(opt);
      });
    }

    renderCoursesTable();
  }

  function getFilteredCourses() {
    let list = [...state.db.courses];
    const q = state.courses.search.toLowerCase();

    if (q) {
      list = list.filter(c =>
        c.code.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q)
      );
    }

    if (state.courses.department) {
      list = list.filter(c => c.department === state.courses.department);
    }

    if (state.courses.semester) {
      list = list.filter(c => String(c.semester) === String(state.courses.semester));
    }

    return list;
  }

  function renderCoursesTable() {
    const list = getFilteredCourses();
    const tbody = $("#courses-table-body");
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 36px; color: var(--text-dim);">No courses found.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(c => {
      // Count enrolled students
      const enrolledCount = state.db.students.filter(s => (s.enrolledCourseIds || []).includes(c.id)).length;
      const attStats = CSMSData.StorageService.getCourseAttendanceStats(c.id, state.db);

      return `
        <tr>
          <td><strong class="roll-no" style="font-size: 13.5px; color: var(--univ-navy-900);">${c.code}</strong></td>
          <td>
            <div style="font-weight: 600; color: var(--text-main); font-size: 13.5px;">${c.title}</div>
            <div style="font-size: 11.5px; color: var(--text-dim); margin-top: 2px;">${c.schedule} · Room ${c.room}</div>
          </td>
          <td>${c.department}</td>
          <td><span class="badge badge-blue">${c.credits} Credits</span></td>
          <td>
            <div style="font-weight: 500;">${c.instructor}</div>
            <div style="font-size: 11.5px; color: var(--text-dim);">${c.instructorEmail}</div>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <strong class="num-tabular">${enrolledCount} / ${c.capacity}</strong>
              <div class="att-bar-wrap" style="width: 60px;">
                <div class="att-bar-fill fill-high" style="width: ${Math.min(100, Math.round((enrolledCount / c.capacity) * 100))}%"></div>
              </div>
            </div>
            <div style="font-size: 11px; color: var(--text-dim); margin-top: 2px;">Avg Att: ${attStats.avgPercentage}% (${attStats.sessionCount} sessions)</div>
          </td>
          <td>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-secondary btn-sm" onclick="window.CSMSApp.openCourseRosterModal('${c.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Roster
              </button>
              <button class="btn btn-secondary btn-sm btn-icon" title="Edit Course" onclick="window.CSMSApp.openEditCourseModal('${c.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
              </button>
              <button class="btn btn-secondary btn-sm btn-icon" style="color: var(--rose-600);" title="Delete Course" onclick="window.CSMSApp.confirmDeleteCourse('${c.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  // ==========================================================================
  // MARKS & GRADEBOOK VIEW
  // ==========================================================================
  function renderMarksView() {
    // Populate Course Dropdown Selector
    const courseSelect = $("#marks-course-select");
    if (courseSelect) {
      courseSelect.innerHTML = state.db.courses.map(c =>
        `<option value="${c.id}" ${c.id === state.marks.courseId ? "selected" : ""}>${c.code} - ${c.title} (${c.credits} cr)</option>`
      ).join("");
    }

    renderMarksGradebook();
  }

  function renderMarksGradebook() {
    const course = state.db.courses.find(c => c.id === state.marks.courseId);
    if (!course) return;

    // Header info
    $("#marks-header-course-title").textContent = `${course.code}: ${course.title}`;
    $("#marks-header-instructor").textContent = `Instructor: ${course.instructor} · ${course.department}`;
    $("#marks-header-credits").textContent = `${course.credits} Credits`;

    // Enrolled students
    const enrolledStudents = state.db.students.filter(s => (s.enrolledCourseIds || []).includes(course.id));
    $("#marks-header-enrolled-count").textContent = `${enrolledStudents.length} Students Enrolled`;

    const searchQuery = state.marks.search.toLowerCase();
    const filteredStudents = enrolledStudents.filter(s =>
      s.firstName.toLowerCase().includes(searchQuery) ||
      s.lastName.toLowerCase().includes(searchQuery) ||
      s.rollNo.toLowerCase().includes(searchQuery)
    );

    const tbody = $("#marks-table-body");
    if (!tbody) return;

    if (filteredStudents.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center" style="padding: 36px; color: var(--text-dim);">No enrolled students found for this course.</td></tr>`;
      renderMarksStats([]);
      return;
    }

    const calculatedMarksList = [];

    tbody.innerHTML = filteredStudents.map(st => {
      // Find existing mark
      let mark = state.db.marks.find(m => m.studentId === st.id && m.courseId === course.id);
      if (!mark) {
        // Initialize placeholder mark
        mark = {
          id: `MRK-${Date.now()}-${st.id}`,
          studentId: st.id,
          courseId: course.id,
          semester: course.semester,
          internalScore: 0,
          assignmentScore: 0,
          finalExamScore: 0
        };
      }

      const total = Number(mark.internalScore || 0) + Number(mark.assignmentScore || 0) + Number(mark.finalExamScore || 0);
      const grade = CSMSData.StorageService.calculateGrade(total);
      calculatedMarksList.push({ total, grade });

      return `
        <tr data-student-id="${st.id}" data-course-id="${course.id}">
          <td><strong class="roll-no">${st.rollNo}</strong></td>
          <td>
            <div class="student-cell">
              <div class="avatar-initials">${st.firstName[0]}${st.lastName[0]}</div>
              <div class="student-meta-name">${st.firstName} ${st.lastName}</div>
            </div>
          </td>
          <td>
            <input type="number" min="0" max="30" class="grade-input mark-input-internal" value="${mark.internalScore || 0}"
              onchange="window.CSMSApp.onGradeInputChange('${st.id}', '${course.id}')" />
            <span style="font-size: 11px; color: var(--text-dim);">/ 30</span>
          </td>
          <td>
            <input type="number" min="0" max="20" class="grade-input mark-input-assignment" value="${mark.assignmentScore || 0}"
              onchange="window.CSMSApp.onGradeInputChange('${st.id}', '${course.id}')" />
            <span style="font-size: 11px; color: var(--text-dim);">/ 20</span>
          </td>
          <td>
            <input type="number" min="0" max="50" class="grade-input mark-input-final" value="${mark.finalExamScore || 0}"
              onchange="window.CSMSApp.onGradeInputChange('${st.id}', '${course.id}')" />
            <span style="font-size: 11px; color: var(--text-dim);">/ 50</span>
          </td>
          <td>
            <strong class="mark-total num-tabular" style="font-size: 14px;">${total}</strong> <span style="font-size: 11px; color: var(--text-dim);">/ 100</span>
          </td>
          <td>
            <span class="badge ${grade.color} mark-letter-badge">${grade.letter} (${grade.points.toFixed(1)})</span>
          </td>
          <td>
            <span class="badge ${grade.status === 'Pass' ? 'badge-emerald' : 'badge-rose'} mark-status-badge">
              <span class="badge-dot"></span> ${grade.status}
            </span>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="window.CSMSApp.openStudentGradeCard('${st.id}', '${course.id}')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Report
            </button>
          </td>
        </tr>
      `;
    }).join("");

    renderMarksStats(calculatedMarksList);
  }

  function renderMarksStats(marksList) {
    if (marksList.length === 0) {
      $("#marks-stat-avg").textContent = "0.0";
      $("#marks-stat-high").textContent = "0";
      $("#marks-stat-low").textContent = "0";
      $("#marks-stat-pass-rate").textContent = "0%";
      return;
    }

    const totals = marksList.map(m => m.total);
    const sum = totals.reduce((a, b) => a + b, 0);
    const avg = (sum / totals.length).toFixed(1);
    const high = Math.max(...totals);
    const low = Math.min(...totals);
    const passCount = marksList.filter(m => m.grade.status === "Pass").length;
    const passRate = Math.round((passCount / marksList.length) * 100);

    $("#marks-stat-avg").textContent = avg;
    $("#marks-stat-high").textContent = high;
    $("#marks-stat-low").textContent = low;
    $("#marks-stat-pass-rate").textContent = `${passRate}%`;
  }

  function onGradeInputChange(studentId, courseId) {
    const row = $(`tr[data-student-id="${studentId}"][data-course-id="${courseId}"]`);
    if (!row) return;

    let internal = Math.min(30, Math.max(0, parseInt(row.querySelector(".mark-input-internal").value) || 0));
    let assignment = Math.min(20, Math.max(0, parseInt(row.querySelector(".mark-input-assignment").value) || 0));
    let finalExam = Math.min(50, Math.max(0, parseInt(row.querySelector(".mark-input-final").value) || 0));

    row.querySelector(".mark-input-internal").value = internal;
    row.querySelector(".mark-input-assignment").value = assignment;
    row.querySelector(".mark-input-final").value = finalExam;

    const total = internal + assignment + finalExam;
    const grade = CSMSData.StorageService.calculateGrade(total);

    row.querySelector(".mark-total").textContent = total;
    const badgeLetter = row.querySelector(".mark-letter-badge");
    badgeLetter.className = `badge ${grade.color} mark-letter-badge`;
    badgeLetter.textContent = `${grade.letter} (${grade.points.toFixed(1)})`;

    const badgeStatus = row.querySelector(".mark-status-badge");
    badgeStatus.className = `badge ${grade.status === 'Pass' ? 'badge-emerald' : 'badge-rose'} mark-status-badge`;
    badgeStatus.innerHTML = `<span class="badge-dot"></span> ${grade.status}`;
  }

  function saveAllGrades() {
    const rows = $$("#marks-table-body tr[data-student-id]");
    const courseId = state.marks.courseId;
    let savedCount = 0;

    rows.forEach(row => {
      const studentId = row.dataset.studentId;
      const internal = parseInt(row.querySelector(".mark-input-internal").value) || 0;
      const assignment = parseInt(row.querySelector(".mark-input-assignment").value) || 0;
      const finalExam = parseInt(row.querySelector(".mark-input-final").value) || 0;

      let existing = state.db.marks.find(m => m.studentId === studentId && m.courseId === courseId);
      if (existing) {
        existing.internalScore = internal;
        existing.assignmentScore = assignment;
        existing.finalExamScore = finalExam;
      } else {
        state.db.marks.push({
          id: `MRK-${Date.now()}-${studentId}`,
          studentId,
          courseId,
          semester: 3,
          internalScore: internal,
          assignmentScore: assignment,
          finalExamScore: finalExam
        });
      }
      savedCount++;
    });

    CSMSData.StorageService.save(state.db);
    showToast(`Successfully saved grades for ${savedCount} students.`, "success");
    renderMarksGradebook();
  }

  // ==========================================================================
  // ATTENDANCE VIEW
  // ==========================================================================
  function renderAttendanceView() {
    // Populate Course Select
    const courseSelect = $("#att-course-select");
    if (courseSelect) {
      courseSelect.innerHTML = state.db.courses.map(c =>
        `<option value="${c.id}" ${c.id === state.attendance.courseId ? "selected" : ""}>${c.code} - ${c.title}</option>`
      ).join("");
    }

    // Set Date input
    const dateInput = $("#att-session-date");
    if (dateInput) {
      dateInput.value = state.attendance.date;
    }

    // Render Sub Tab
    if (state.attendance.activeTab === "daily") {
      $("#att-tab-daily-content").style.display = "block";
      $("#att-tab-shortage-content").style.display = "none";
      renderDailyAttendanceSession();
    } else {
      $("#att-tab-daily-content").style.display = "none";
      $("#att-tab-shortage-content").style.display = "block";
      renderAttendanceShortageList();
    }
  }

  function renderDailyAttendanceSession() {
    const courseId = state.attendance.courseId;
    const date = state.attendance.date;
    const course = state.db.courses.find(c => c.id === courseId);
    if (!course) return;

    // Check if attendance already recorded for this date and course
    const existingSession = state.db.attendance.find(a => a.courseId === courseId && a.date === date);
    if (existingSession) {
      $("#att-session-topic").value = existingSession.topic || "";
      state.attendance.currentSessionRecords = { ...existingSession.records };
    } else {
      // Default all enrolled students to "Present"
      const enrolled = state.db.students.filter(s => (s.enrolledCourseIds || []).includes(courseId));
      state.attendance.currentSessionRecords = {};
      enrolled.forEach(s => {
        state.attendance.currentSessionRecords[s.id] = "Present";
      });
      $("#att-session-topic").value = "";
    }

    renderDailyAttendanceTable();
  }

  function renderDailyAttendanceTable() {
    const courseId = state.attendance.courseId;
    const enrolledStudents = state.db.students.filter(s => (s.enrolledCourseIds || []).includes(courseId));

    const tbody = $("#att-table-body");
    if (!tbody) return;

    if (enrolledStudents.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding: 36px; color: var(--text-dim);">No students enrolled in this course.</td></tr>`;
      updateAttendanceCounters();
      return;
    }

    tbody.innerHTML = enrolledStudents.map(st => {
      const currentStatus = state.attendance.currentSessionRecords[st.id] || "Present";
      const stats = CSMSData.StorageService.getStudentAttendanceStats(st.id, state.db);

      return `
        <tr data-student-id="${st.id}">
          <td><strong class="roll-no">${st.rollNo}</strong></td>
          <td>
            <div class="student-cell">
              <div class="avatar-initials">${st.firstName[0]}${st.lastName[0]}</div>
              <div>
                <div class="student-meta-name">${st.firstName} ${st.lastName}</div>
                <div class="student-meta-email">${st.email}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="badge ${stats.percentage < 75 ? 'badge-rose' : 'badge-emerald'}">
              <span class="badge-dot"></span> ${stats.percentage}%
            </span>
            <span style="font-size: 11px; color: var(--text-dim); margin-left: 4px;">(${stats.attended}/${stats.totalSessions})</span>
          </td>
          <td>
            <div class="att-selector" data-student-id="${st.id}">
              <button type="button" class="att-option ${currentStatus === 'Present' ? 'selected-present' : ''}" onclick="window.CSMSApp.setStudentAttStatus('${st.id}', 'Present')">Present</button>
              <button type="button" class="att-option ${currentStatus === 'Late' ? 'selected-late' : ''}" onclick="window.CSMSApp.setStudentAttStatus('${st.id}', 'Late')">Late</button>
              <button type="button" class="att-option ${currentStatus === 'Absent' ? 'selected-absent' : ''}" onclick="window.CSMSApp.setStudentAttStatus('${st.id}', 'Absent')">Absent</button>
              <button type="button" class="att-option ${currentStatus === 'Excused' ? 'selected-excused' : ''}" onclick="window.CSMSApp.setStudentAttStatus('${st.id}', 'Excused')">Excused</button>
            </div>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="window.CSMSApp.openStudentProfile('${st.id}')">Log</button>
          </td>
        </tr>
      `;
    }).join("");

    updateAttendanceCounters();
  }

  function setStudentAttStatus(studentId, status) {
    state.attendance.currentSessionRecords[studentId] = status;
    const selector = $(`.att-selector[data-student-id="${studentId}"]`);
    if (selector) {
      $$(".att-option", selector).forEach(btn => {
        btn.className = "att-option";
        if (btn.textContent.trim() === status) {
          btn.classList.add(`selected-${status.toLowerCase()}`);
        }
      });
    }
    updateAttendanceCounters();
  }

  function markAllAttendance(status) {
    const courseId = state.attendance.courseId;
    const enrolled = state.db.students.filter(s => (s.enrolledCourseIds || []).includes(courseId));
    enrolled.forEach(s => {
      state.attendance.currentSessionRecords[s.id] = status;
    });
    renderDailyAttendanceTable();
  }

  function updateAttendanceCounters() {
    const records = Object.values(state.attendance.currentSessionRecords);
    const total = records.length;
    const present = records.filter(r => r === "Present").length;
    const late = records.filter(r => r === "Late").length;
    const absent = records.filter(r => r === "Absent").length;
    const excused = records.filter(r => r === "Excused").length;

    $("#att-counter-present").textContent = present;
    $("#att-counter-late").textContent = late;
    $("#att-counter-absent").textContent = absent;
    $("#att-counter-excused").textContent = excused;

    const rate = total > 0 ? Math.round(((present + late * 0.8 + excused) / total) * 100) : 0;
    $("#att-counter-rate").textContent = `${rate}%`;
  }

  function saveAttendanceSession() {
    const courseId = state.attendance.courseId;
    const date = state.attendance.date;
    const topic = ($("#att-session-topic").value || "").trim();

    if (!topic) {
      showToast("Please enter a session topic/lecture title before saving.", "warning");
      $("#att-session-topic").focus();
      return;
    }

    // Check if session exists for this date and course
    const existingIdx = state.db.attendance.findIndex(a => a.courseId === courseId && a.date === date);
    const sessionObj = {
      id: existingIdx >= 0 ? state.db.attendance[existingIdx].id : `ATT-${date}-${courseId}`,
      courseId,
      date,
      topic,
      records: { ...state.attendance.currentSessionRecords }
    };

    if (existingIdx >= 0) {
      state.db.attendance[existingIdx] = sessionObj;
    } else {
      state.db.attendance.push(sessionObj);
    }

    CSMSData.StorageService.save(state.db);
    showToast(`Attendance saved successfully for ${Object.keys(sessionObj.records).length} students!`, "success");
    updateSidebarBadges();
  }

  function renderAttendanceShortageList() {
    const list = CSMSData.StorageService.getShortageStudents(75);
    const tbody = $("#att-shortage-table-body");
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 36px; color: var(--text-dim);">No students currently have attendance below 75%. All students are eligible.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(item => {
      const st = item.student;
      const stats = item.stats;
      const missed = stats.totalSessions - stats.attended;

      return `
        <tr>
          <td><strong class="roll-no">${st.rollNo}</strong></td>
          <td>
            <div class="student-cell">
              <div class="avatar-initials" style="background-color: var(--rose-600);">${st.firstName[0]}${st.lastName[0]}</div>
              <div>
                <div class="student-meta-name">${st.firstName} ${st.lastName}</div>
                <div class="student-meta-email">${st.email}</div>
              </div>
            </div>
          </td>
          <td>${st.department}</td>
          <td>
            <strong class="num-tabular" style="color: var(--rose-600); font-size: 14px;">${stats.percentage}%</strong>
            <div class="att-bar-wrap" style="width: 80px;">
              <div class="att-bar-fill fill-low" style="width: ${stats.percentage}%"></div>
            </div>
          </td>
          <td>
            <span class="num-tabular">${stats.attended} / ${stats.totalSessions}</span>
            <div style="font-size: 11px; color: var(--rose-600); font-weight: 600;">Missed ${missed} sessions</div>
          </td>
          <td>
            <span class="badge badge-rose"><span class="badge-dot"></span> At-Risk / Shortage</span>
          </td>
          <td>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-secondary btn-sm" onclick="window.CSMSApp.openStudentProfile('${st.id}')">Audit</button>
              <button class="btn btn-danger btn-sm" onclick="window.CSMSApp.issueShortageNotice('${st.id}')">Issue Notice</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  function issueShortageNotice(studentId) {
    const student = state.db.students.find(s => s.id === studentId);
    if (!student) return;
    const stats = CSMSData.StorageService.getStudentAttendanceStats(studentId, state.db);
    showToast(`Official Academic Shortage Notice dispatched to ${student.firstName} ${student.lastName} (${student.email}) and guardian ${student.guardianName || 'on file'}. Attendance: ${stats.percentage}%.`, "warning");
  }

  // ==========================================================================
  // ANALYTICS VIEW
  // ==========================================================================
  function renderAnalyticsView() {
    // Scholars Leaderboard (Dean's List)
    const sortedByGPA = [...state.db.students].map(st => {
      const gpaObj = CSMSData.StorageService.getStudentGPA(st.id, state.db);
      const att = CSMSData.StorageService.getStudentAttendanceStats(st.id, state.db);
      return { student: st, gpa: parseFloat(gpaObj.gpa), credits: gpaObj.totalCredits, att: att.percentage };
    }).sort((a, b) => b.gpa - a.gpa);

    const tbody = $("#analytics-leaderboard-body");
    if (tbody) {
      tbody.innerHTML = sortedByGPA.slice(0, 10).map((item, idx) => `
        <tr>
          <td>
            <strong style="font-size: 14px; color: ${idx === 0 ? 'var(--amber-600)' : 'var(--text-muted)'};">#${idx + 1}</strong>
          </td>
          <td><strong class="roll-no">${item.student.rollNo}</strong></td>
          <td>
            <div class="student-cell">
              <div class="avatar-initials">${item.student.firstName[0]}${item.student.lastName[0]}</div>
              <div class="student-meta-name">${item.student.firstName} ${item.student.lastName}</div>
            </div>
          </td>
          <td>${item.student.department}</td>
          <td><strong class="num-tabular" style="font-size: 14px; color: var(--emerald-600);">${item.gpa.toFixed(2)}</strong></td>
          <td>${item.credits} Credits</td>
          <td><span class="badge ${item.att >= 75 ? 'badge-emerald' : 'badge-rose'}">${item.att}%</span></td>
        </tr>
      `).join("");
    }
  }

  // ==========================================================================
  // SETTINGS & DATA MANAGEMENT VIEW
  // ==========================================================================
  function renderSettingsView() {
    const elLastUpdated = $("#settings-last-updated");
    if (elLastUpdated) {
      elLastUpdated.textContent = state.db.lastUpdated ? new Date(state.db.lastUpdated).toLocaleString() : "Just now";
    }
    $("#settings-student-count").textContent = state.db.students.length;
    $("#settings-course-count").textContent = state.db.courses.length;
    $("#settings-marks-count").textContent = state.db.marks.length;
    $("#settings-att-count").textContent = state.db.attendance.length;
  }

  function exportDatabaseJSON() {
    const jsonStr = CSMSData.StorageService.exportJSON();
    downloadFile(jsonStr, `veritas_csms_backup_${new Date().toISOString().split("T")[0]}.json`, "application/json");
    showToast("Full system database backup exported successfully.", "success");
  }

  function importDatabaseJSON(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const res = CSMSData.StorageService.importJSON(e.target.result);
      if (res.success) {
        state.db = CSMSData.StorageService.load();
        renderCurrentView();
        showToast("Database restored successfully from backup!", "success");
      } else {
        showToast(`Failed to import database: ${res.error}`, "error");
      }
    };
    reader.readAsText(file);
  }

  function resetToSeedData() {
    if (confirm("Are you sure you want to reset all data to default university seed records? Any unsaved edits will be lost.")) {
      state.db = CSMSData.StorageService.reset();
      renderCurrentView();
      showToast("Database successfully restored to clean university seed data.", "success");
    }
  }

  // ==========================================================================
  // STUDENT 360 PROFILE & TRANSCRIPT MODAL
  // ==========================================================================
  function openStudentProfile(studentId) {
    const student = state.db.students.find(s => s.id === studentId);
    if (!student) return;

    const gpaObj = CSMSData.StorageService.getStudentGPA(studentId, state.db);
    const attStats = CSMSData.StorageService.getStudentAttendanceStats(studentId, state.db);

    // Profile Hero
    $("#profile-hero-initials").textContent = `${student.firstName[0]}${student.lastName[0]}`;
    $("#profile-hero-name").textContent = `${student.firstName} ${student.lastName}`;
    $("#profile-hero-rollno").textContent = `Roll No: ${student.rollNo} · ${student.department}`;
    $("#profile-hero-gpa").textContent = `${gpaObj.gpa} / 4.0`;
    $("#profile-hero-attendance").textContent = `${attStats.percentage}%`;
    $("#profile-hero-status").textContent = student.status;

    // Bio Details
    $("#profile-email").textContent = student.email;
    $("#profile-phone").textContent = student.phone || "N/A";
    $("#profile-dob").textContent = student.dob || "N/A";
    $("#profile-gender").textContent = student.gender || "N/A";
    $("#profile-semester").textContent = `Semester ${student.semester} (${student.academicYear || 'Undergrad'})`;
    $("#profile-advisor").textContent = student.advisor || "Faculty Committee";
    $("#profile-address").textContent = student.address || "On Campus";
    $("#profile-guardian").textContent = student.guardianName ? `${student.guardianName} (${student.guardianPhone || ''})` : "N/A";

    // Official Transcript Table
    const enrolledIds = student.enrolledCourseIds || [];
    const courses = state.db.courses.filter(c => enrolledIds.includes(c.id));

    const tbodyTranscript = $("#profile-transcript-body");
    if (tbodyTranscript) {
      if (courses.length === 0) {
        tbodyTranscript.innerHTML = `<tr><td colspan="8" class="text-center" style="padding: 20px; color: var(--text-dim);">No courses registered for this student.</td></tr>`;
      } else {
        tbodyTranscript.innerHTML = courses.map(c => {
          const mark = state.db.marks.find(m => m.studentId === student.id && m.courseId === c.id);
          const internal = mark ? (mark.internalScore || 0) : 0;
          const assignment = mark ? (mark.assignmentScore || 0) : 0;
          const finalExam = mark ? (mark.finalExamScore || 0) : 0;
          const total = internal + assignment + finalExam;
          const grade = CSMSData.StorageService.calculateGrade(total);

          return `
            <tr>
              <td><strong>${c.code}</strong></td>
              <td>${c.title}</td>
              <td>${c.credits}</td>
              <td>${internal} / 30</td>
              <td>${assignment} / 20</td>
              <td>${finalExam} / 50</td>
              <td><strong>${total}</strong></td>
              <td><span class="badge ${grade.color}">${grade.letter} (${grade.points.toFixed(1)})</span></td>
            </tr>
          `;
        }).join("");
      }
    }

    $("#transcript-total-credits").textContent = gpaObj.totalCredits;
    $("#transcript-final-gpa").textContent = gpaObj.gpa;

    // Attendance Breakdown per Course
    const tbodyAtt = $("#profile-attendance-body");
    if (tbodyAtt) {
      tbodyAtt.innerHTML = courses.map(c => {
        let courseSessions = 0;
        let presentCount = 0;
        state.db.attendance.filter(a => a.courseId === c.id).forEach(sess => {
          const status = sess.records[student.id];
          if (status) {
            courseSessions++;
            if (status === "Present" || status === "Excused") presentCount++;
            else if (status === "Late") presentCount += 0.8;
          }
        });

        const pct = courseSessions > 0 ? Math.round((presentCount / courseSessions) * 100) : 100;
        return `
          <tr>
            <td><strong>${c.code}</strong></td>
            <td>${c.title}</td>
            <td>${c.instructor}</td>
            <td>${Math.round(presentCount)} / ${courseSessions}</td>
            <td>
              <span class="badge ${pct < 75 ? 'badge-rose' : 'badge-emerald'}">${pct}%</span>
            </td>
            <td>
              <span class="badge ${pct < 75 ? 'badge-rose' : 'badge-emerald'}">
                ${pct < 75 ? 'Debarred / Warning' : 'Exam Eligible'}
              </span>
            </td>
          </tr>
        `;
      }).join("");
    }

    // Set Print details for transcript
    $("#print-student-name").textContent = `${student.firstName} ${student.lastName}`;
    $("#print-student-roll").textContent = student.rollNo;
    $("#print-student-dept").textContent = student.department;
    $("#print-student-date").textContent = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    // Store studentId for print action
    $("#btn-print-transcript").onclick = () => {
      window.print();
    };

    openModal("#modal-student-profile");
  }

  // ==========================================================================
  // STUDENT ADMISSION / EDIT MODAL
  // ==========================================================================
  function openAddStudentModal() {
    $("#modal-student-title").textContent = "Admit New Student";
    $("#form-student-id").value = "";
    $("#form-student-roll").value = `CS-${new Date().getFullYear()}-${String(state.db.students.length + 1).padStart(3, "0")}`;
    $("#form-student-firstname").value = "";
    $("#form-student-lastname").value = "";
    $("#form-student-email").value = "";
    $("#form-student-phone").value = "";
    $("#form-student-dob").value = "2004-01-01";
    $("#form-student-gender").value = "Male";
    $("#form-student-dept").value = state.db.departments[0].name;
    $("#form-student-sem").value = "1";
    $("#form-student-status").value = "Active";
    $("#form-student-advisor").value = "Dr. Alan Turing";
    $("#form-student-address").value = "";
    $("#form-student-guardian").value = "";
    $("#form-student-guardian-phone").value = "";

    // Render Course Enrollment Checkboxes
    renderCourseEnrollmentCheckboxes([]);

    openModal("#modal-student-form");
  }

  function openEditStudentModal(studentId) {
    const s = state.db.students.find(item => item.id === studentId);
    if (!s) return;

    $("#modal-student-title").textContent = `Edit Student: ${s.rollNo}`;
    $("#form-student-id").value = s.id;
    $("#form-student-roll").value = s.rollNo;
    $("#form-student-firstname").value = s.firstName;
    $("#form-student-lastname").value = s.lastName;
    $("#form-student-email").value = s.email;
    $("#form-student-phone").value = s.phone || "";
    $("#form-student-dob").value = s.dob || "";
    $("#form-student-gender").value = s.gender || "Male";
    $("#form-student-dept").value = s.department;
    $("#form-student-sem").value = s.semester;
    $("#form-student-status").value = s.status;
    $("#form-student-advisor").value = s.advisor || "";
    $("#form-student-address").value = s.address || "";
    $("#form-student-guardian").value = s.guardianName || "";
    $("#form-student-guardian-phone").value = s.guardianPhone || "";

    renderCourseEnrollmentCheckboxes(s.enrolledCourseIds || []);

    openModal("#modal-student-form");
  }

  function renderCourseEnrollmentCheckboxes(enrolledCourseIds) {
    const container = $("#student-enrollment-courses-list");
    if (!container) return;

    container.innerHTML = state.db.courses.map(c => {
      const isChecked = enrolledCourseIds.includes(c.id);
      return `
        <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; padding: 4px 0;">
          <input type="checkbox" value="${c.id}" class="chk-enroll-course" ${isChecked ? "checked" : ""}>
          <span><strong>${c.code}</strong> - ${c.title} (${c.credits} cr)</span>
        </label>
      `;
    }).join("");
  }

  function saveStudentForm() {
    const studentId = $("#form-student-id").value;
    const rollNo = $("#form-student-roll").value.trim();
    const firstName = $("#form-student-firstname").value.trim();
    const lastName = $("#form-student-lastname").value.trim();
    const email = $("#form-student-email").value.trim();

    if (!rollNo || !firstName || !lastName || !email) {
      showToast("Please fill all required student fields (Roll No, Names, Email).", "warning");
      return;
    }

    // Check roll no uniqueness if new
    if (!studentId) {
      const exists = state.db.students.some(s => s.rollNo.toLowerCase() === rollNo.toLowerCase());
      if (exists) {
        showToast(`Student with Roll No "${rollNo}" already exists!`, "error");
        return;
      }
    }

    // Selected enrolled courses
    const selectedCourses = $$(".chk-enroll-course:checked").map(cb => cb.value);

    const studentData = {
      id: studentId || `STU-${Date.now()}`,
      rollNo,
      firstName,
      lastName,
      email,
      phone: $("#form-student-phone").value.trim(),
      dob: $("#form-student-dob").value,
      gender: $("#form-student-gender").value,
      department: $("#form-student-dept").value,
      semester: parseInt($("#form-student-sem").value) || 1,
      academicYear: `${Math.ceil((parseInt($("#form-student-sem").value) || 1) / 2)}th Year`,
      enrollmentDate: studentId ? (state.db.students.find(s => s.id === studentId)?.enrollmentDate || "2023-08-20") : new Date().toISOString().split("T")[0],
      status: $("#form-student-status").value,
      advisor: $("#form-student-advisor").value.trim(),
      address: $("#form-student-address").value.trim(),
      guardianName: $("#form-student-guardian").value.trim(),
      guardianPhone: $("#form-student-guardian-phone").value.trim(),
      enrolledCourseIds: selectedCourses
    };

    if (studentId) {
      const idx = state.db.students.findIndex(s => s.id === studentId);
      if (idx >= 0) state.db.students[idx] = studentData;
      showToast(`Student "${firstName} ${lastName}" updated successfully.`, "success");
    } else {
      state.db.students.push(studentData);
      showToast(`New student "${firstName} ${lastName}" admitted with Roll No ${rollNo}!`, "success");
    }

    CSMSData.StorageService.save(state.db);
    closeModal("#modal-student-form");
    renderStudentsTable();
    updateSidebarBadges();
  }

  function confirmDeleteStudent(studentId) {
    const student = state.db.students.find(s => s.id === studentId);
    if (!student) return;

    if (confirm(`Are you sure you want to permanently delete student ${student.firstName} ${student.lastName} (${student.rollNo})? This will also remove their grades and attendance records.`)) {
      state.db.students = state.db.students.filter(s => s.id !== studentId);
      state.db.marks = state.db.marks.filter(m => m.studentId !== studentId);
      state.db.attendance.forEach(session => {
        delete session.records[studentId];
      });

      CSMSData.StorageService.save(state.db);
      showToast(`Student ${student.rollNo} deleted from university records.`, "success");
      renderStudentsTable();
      updateSidebarBadges();
    }
  }

  // ==========================================================================
  // COURSE ADD / EDIT MODAL
  // ==========================================================================
  function openAddCourseModal() {
    $("#modal-course-title").textContent = "Offer New Academic Course";
    $("#form-course-id").value = "";
    $("#form-course-code").value = "";
    $("#form-course-title").value = "";
    $("#form-course-dept").value = state.db.departments[0].name;
    $("#form-course-credits").value = "4";
    $("#form-course-sem").value = "3";
    $("#form-course-instructor").value = "";
    $("#form-course-email").value = "";
    $("#form-course-schedule").value = "Mon, Wed 10:00 - 11:30 AM";
    $("#form-course-room").value = "Hall 101";
    $("#form-course-capacity").value = "40";
    $("#form-course-desc").value = "";

    openModal("#modal-course-form");
  }

  function openEditCourseModal(courseId) {
    const c = state.db.courses.find(item => item.id === courseId);
    if (!c) return;

    $("#modal-course-title").textContent = `Edit Course: ${c.code}`;
    $("#form-course-id").value = c.id;
    $("#form-course-code").value = c.code;
    $("#form-course-title").value = c.title;
    $("#form-course-dept").value = c.department;
    $("#form-course-credits").value = c.credits;
    $("#form-course-sem").value = c.semester;
    $("#form-course-instructor").value = c.instructor;
    $("#form-course-email").value = c.instructorEmail;
    $("#form-course-schedule").value = c.schedule;
    $("#form-course-room").value = c.room;
    $("#form-course-capacity").value = c.capacity;
    $("#form-course-desc").value = c.description || "";

    openModal("#modal-course-form");
  }

  function saveCourseForm() {
    const courseId = $("#form-course-id").value;
    const code = $("#form-course-code").value.trim();
    const title = $("#form-course-title").value.trim();
    const instructor = $("#form-course-instructor").value.trim();

    if (!code || !title || !instructor) {
      showToast("Please fill all required course fields (Course Code, Title, Faculty).", "warning");
      return;
    }

    const courseData = {
      id: courseId || `CRS-${Date.now()}`,
      code,
      title,
      department: $("#form-course-dept").value,
      credits: parseInt($("#form-course-credits").value) || 3,
      semester: parseInt($("#form-course-sem").value) || 1,
      instructor,
      instructorEmail: $("#form-course-email").value.trim(),
      schedule: $("#form-course-schedule").value.trim(),
      room: $("#form-course-room").value.trim(),
      capacity: parseInt($("#form-course-capacity").value) || 40,
      status: "Active",
      description: $("#form-course-desc").value.trim()
    };

    if (courseId) {
      const idx = state.db.courses.findIndex(c => c.id === courseId);
      if (idx >= 0) state.db.courses[idx] = courseData;
      showToast(`Course "${code}: ${title}" updated successfully.`, "success");
    } else {
      state.db.courses.push(courseData);
      showToast(`New course "${code}: ${title}" added to academic curriculum!`, "success");
    }

    CSMSData.StorageService.save(state.db);
    closeModal("#modal-course-form");
    renderCoursesTable();
    updateSidebarBadges();
  }

  function confirmDeleteCourse(courseId) {
    const course = state.db.courses.find(c => c.id === courseId);
    if (!course) return;

    const enrolled = state.db.students.filter(s => (s.enrolledCourseIds || []).includes(courseId));

    if (confirm(`Are you sure you want to delete course ${course.code} - ${course.title}? (${enrolled.length} students currently enrolled).`)) {
      state.db.courses = state.db.courses.filter(c => c.id !== courseId);
      // Remove enrollment reference from students
      state.db.students.forEach(s => {
        if (s.enrolledCourseIds) {
          s.enrolledCourseIds = s.enrolledCourseIds.filter(id => id !== courseId);
        }
      });
      // Remove marks and attendance
      state.db.marks = state.db.marks.filter(m => m.courseId !== courseId);
      state.db.attendance = state.db.attendance.filter(a => a.courseId !== courseId);

      CSMSData.StorageService.save(state.db);
      showToast(`Course ${course.code} has been deleted.`, "success");
      renderCoursesTable();
      updateSidebarBadges();
    }
  }

  // ==========================================================================
  // COURSE ROSTER MODAL
  // ==========================================================================
  function openCourseRosterModal(courseId) {
    const course = state.db.courses.find(c => c.id === courseId);
    if (!course) return;

    $("#modal-roster-title").textContent = `Class Roster: ${course.code} - ${course.title}`;
    $("#modal-roster-meta").textContent = `Instructor: ${course.instructor} · Credits: ${course.credits} · Room: ${course.room}`;

    const enrolledStudents = state.db.students.filter(s => (s.enrolledCourseIds || []).includes(course.id));
    const notEnrolledStudents = state.db.students.filter(s => !(s.enrolledCourseIds || []).includes(course.id));

    // Populate quick enrollment dropdown
    const selectQuickEnroll = $("#roster-quick-enroll-select");
    if (selectQuickEnroll) {
      selectQuickEnroll.innerHTML = `<option value="">-- Select Student to Enroll --</option>` +
        notEnrolledStudents.map(s => `<option value="${s.id}">${s.rollNo} - ${s.firstName} ${s.lastName} (${s.department})</option>`).join("");
    }

    $("#btn-roster-do-enroll").onclick = () => {
      const studentIdToEnroll = selectQuickEnroll.value;
      if (!studentIdToEnroll) return;
      const st = state.db.students.find(s => s.id === studentIdToEnroll);
      if (st) {
        if (!st.enrolledCourseIds) st.enrolledCourseIds = [];
        st.enrolledCourseIds.push(course.id);
        CSMSData.StorageService.save(state.db);
        showToast(`${st.firstName} ${st.lastName} enrolled into ${course.code}!`, "success");
        openCourseRosterModal(course.id); // Re-render roster modal
        renderCoursesTable();
      }
    };

    const tbody = $("#roster-table-body");
    if (tbody) {
      if (enrolledStudents.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 24px; color: var(--text-dim);">No students enrolled yet.</td></tr>`;
      } else {
        tbody.innerHTML = enrolledStudents.map(st => {
          const mark = state.db.marks.find(m => m.studentId === st.id && m.courseId === course.id);
          const total = mark ? (Number(mark.internalScore || 0) + Number(mark.assignmentScore || 0) + Number(mark.finalExamScore || 0)) : 0;
          const grade = CSMSData.StorageService.calculateGrade(total);

          // Course attendance
          let sessCount = 0;
          let attendedCount = 0;
          state.db.attendance.filter(a => a.courseId === course.id).forEach(sess => {
            const status = sess.records[st.id];
            if (status) {
              sessCount++;
              if (status === "Present" || status === "Excused") attendedCount++;
              else if (status === "Late") attendedCount += 0.8;
            }
          });
          const attPct = sessCount > 0 ? Math.round((attendedCount / sessCount) * 100) : 100;

          return `
            <tr>
              <td><strong class="roll-no">${st.rollNo}</strong></td>
              <td>${st.firstName} ${st.lastName}</td>
              <td>${st.department}</td>
              <td><span class="badge ${grade.color}">${grade.letter} (${total}/100)</span></td>
              <td><span class="badge ${attPct < 75 ? 'badge-rose' : 'badge-emerald'}">${attPct}%</span></td>
              <td>
                <button class="btn btn-secondary btn-sm" style="color: var(--rose-600);" onclick="window.CSMSApp.dropStudentFromCourse('${st.id}', '${course.id}')">
                  Drop
                </button>
              </td>
            </tr>
          `;
        }).join("");
      }
    }

    openModal("#modal-course-roster");
  }

  function dropStudentFromCourse(studentId, courseId) {
    const student = state.db.students.find(s => s.id === studentId);
    const course = state.db.courses.find(c => c.id === courseId);
    if (!student || !course) return;

    if (confirm(`Remove ${student.firstName} ${student.lastName} from ${course.code}?`)) {
      student.enrolledCourseIds = (student.enrolledCourseIds || []).filter(id => id !== courseId);
      CSMSData.StorageService.save(state.db);
      showToast(`${student.firstName} was removed from ${course.code}.`, "info");
      openCourseRosterModal(courseId);
      renderCoursesTable();
    }
  }

  // ==========================================================================
  // INDIVIDUAL GRADE CARD MODAL
  // ==========================================================================
  function openStudentGradeCard(studentId, courseId) {
    const student = state.db.students.find(s => s.id === studentId);
    const course = state.db.courses.find(c => c.id === courseId);
    if (!student || !course) return;

    const mark = state.db.marks.find(m => m.studentId === studentId && m.courseId === courseId) || {
      internalScore: 0,
      assignmentScore: 0,
      finalExamScore: 0
    };

    const total = Number(mark.internalScore || 0) + Number(mark.assignmentScore || 0) + Number(mark.finalExamScore || 0);
    const grade = CSMSData.StorageService.calculateGrade(total);

    $("#gradecard-student-name").textContent = `${student.firstName} ${student.lastName}`;
    $("#gradecard-roll").textContent = student.rollNo;
    $("#gradecard-dept").textContent = student.department;
    $("#gradecard-course-code").textContent = course.code;
    $("#gradecard-course-title").textContent = course.title;
    $("#gradecard-instructor").textContent = course.instructor;

    $("#gradecard-internal").textContent = `${mark.internalScore || 0} / 30`;
    $("#gradecard-assignment").textContent = `${mark.assignmentScore || 0} / 20`;
    $("#gradecard-final").textContent = `${mark.finalExamScore || 0} / 50`;
    $("#gradecard-total").textContent = `${total} / 100`;
    $("#gradecard-letter").textContent = grade.letter;
    $("#gradecard-points").textContent = `${grade.points.toFixed(1)} / 4.0`;
    $("#gradecard-status").textContent = grade.status;

    $("#btn-print-gradecard").onclick = () => window.print();

    openModal("#modal-gradecard");
  }

  // ==========================================================================
  // CSV EXPORTS
  // ==========================================================================
  function exportStudentsCSV() {
    const students = getFilteredStudents();
    const rows = [
      ["Roll No", "First Name", "Last Name", "Email", "Phone", "Department", "Semester", "CGPA", "Attendance %", "Status", "Advisor"]
    ];

    students.forEach(s => {
      const gpa = CSMSData.StorageService.getStudentGPA(s.id, state.db).gpa;
      const att = CSMSData.StorageService.getStudentAttendanceStats(s.id, state.db).percentage;
      rows.push([
        s.rollNo,
        s.firstName,
        s.lastName,
        s.email,
        s.phone || "",
        s.department,
        s.semester,
        gpa,
        `${att}%`,
        s.status,
        s.advisor || ""
      ]);
    });

    const csvContent = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    downloadFile(csvContent, `students_roster_${new Date().toISOString().split("T")[0]}.csv`, "text/csv");
    showToast("Students roster exported to CSV.", "success");
  }

  function exportCoursesCSV() {
    const courses = getFilteredCourses();
    const rows = [
      ["Course Code", "Title", "Department", "Credits", "Semester", "Instructor", "Email", "Schedule", "Room", "Enrolled", "Capacity"]
    ];

    courses.forEach(c => {
      const enrolled = state.db.students.filter(s => (s.enrolledCourseIds || []).includes(c.id)).length;
      rows.push([
        c.code,
        c.title,
        c.department,
        c.credits,
        c.semester,
        c.instructor,
        c.instructorEmail,
        c.schedule,
        c.room,
        enrolled,
        c.capacity
      ]);
    });

    const csvContent = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    downloadFile(csvContent, `course_catalog_${new Date().toISOString().split("T")[0]}.csv`, "text/csv");
    showToast("Courses catalog exported to CSV.", "success");
  }

  function exportGradebookCSV() {
    const course = state.db.courses.find(c => c.id === state.marks.courseId);
    if (!course) return;

    const enrolled = state.db.students.filter(s => (s.enrolledCourseIds || []).includes(course.id));
    const rows = [
      ["Roll No", "Student Name", "Course Code", "Internal (/30)", "Assignment (/20)", "Final Exam (/50)", "Total (/100)", "Letter Grade", "Grade Points", "Status"]
    ];

    enrolled.forEach(s => {
      const mark = state.db.marks.find(m => m.studentId === s.id && m.courseId === course.id);
      const internal = mark ? mark.internalScore : 0;
      const assign = mark ? mark.assignmentScore : 0;
      const finalE = mark ? mark.finalExamScore : 0;
      const total = internal + assign + finalE;
      const grade = CSMSData.StorageService.calculateGrade(total);

      rows.push([
        s.rollNo,
        `${s.firstName} ${s.lastName}`,
        course.code,
        internal,
        assign,
        finalE,
        total,
        grade.letter,
        grade.points,
        grade.status
      ]);
    });

    const csvContent = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    downloadFile(csvContent, `gradebook_${course.code}_${new Date().toISOString().split("T")[0]}.csv`, "text/csv");
    showToast(`Gradebook for ${course.code} exported to CSV.`, "success");
  }

  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ==========================================================================
  // MODAL MANAGEMENT
  // ==========================================================================
  function setupModals() {
    // Backdrop and Esc dismiss
    $$(".modal-overlay").forEach(overlay => {
      overlay.addEventListener("click", e => {
        if (e.target === overlay) {
          closeModal(overlay);
        }
      });
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        $$(".modal-overlay.active").forEach(m => closeModal(m));
      }
    });

    $$(".modal-close-btn, [data-modal-dismiss]").forEach(btn => {
      btn.addEventListener("click", () => {
        const overlay = btn.closest(".modal-overlay");
        if (overlay) closeModal(overlay);
      });
    });
  }

  function openModal(selectorOrEl) {
    const el = typeof selectorOrEl === "string" ? $(selectorOrEl) : selectorOrEl;
    if (el) {
      el.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal(selectorOrEl) {
    const el = typeof selectorOrEl === "string" ? $(selectorOrEl) : selectorOrEl;
    if (el) {
      el.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  // ==========================================================================
  // EVENT LISTENERS BINDING
  // ==========================================================================
  function setupEventListeners() {
    // Quick action buttons on Dashboard
    $("#dash-btn-admit-student")?.addEventListener("click", openAddStudentModal);
    $("#dash-btn-add-course")?.addEventListener("click", openAddCourseModal);
    $("#dash-btn-take-attendance")?.addEventListener("click", () => switchView("attendance"));
    $("#dash-btn-enter-grades")?.addEventListener("click", () => switchView("marks"));

    // Students Filter Controls
    $("#filter-student-search")?.addEventListener("input", e => {
      state.students.search = e.target.value.trim();
      state.students.page = 1;
      renderStudentsTable();
    });

    $("#filter-student-dept")?.addEventListener("change", e => {
      state.students.department = e.target.value;
      state.students.page = 1;
      renderStudentsTable();
    });

    $("#filter-student-sem")?.addEventListener("change", e => {
      state.students.semester = e.target.value;
      state.students.page = 1;
      renderStudentsTable();
    });

    $("#filter-student-status")?.addEventListener("change", e => {
      state.students.status = e.target.value;
      state.students.page = 1;
      renderStudentsTable();
    });

    $("#btn-student-clear-filter")?.addEventListener("click", () => {
      state.students.search = "";
      state.students.department = "";
      state.students.semester = "";
      state.students.status = "";
      $("#filter-student-search").value = "";
      $("#filter-student-dept").value = "";
      $("#filter-student-sem").value = "";
      $("#filter-student-status").value = "";
      state.students.page = 1;
      renderStudentsTable();
    });

    $("#btn-students-prev")?.addEventListener("click", () => {
      if (state.students.page > 1) {
        state.students.page--;
        renderStudentsTable();
      }
    });

    $("#btn-students-next")?.addEventListener("click", () => {
      state.students.page++;
      renderStudentsTable();
    });

    // Table Column Sorting
    $$(".data-table th.sortable[data-sort]").forEach(th => {
      th.addEventListener("click", () => {
        const field = th.dataset.sort;
        if (state.students.sortField === field) {
          state.students.sortAsc = !state.students.sortAsc;
        } else {
          state.students.sortField = field;
          state.students.sortAsc = true;
        }
        renderStudentsTable();
      });
    });

    // Students Actions
    $("#btn-add-student")?.addEventListener("click", openAddStudentModal);
    $("#btn-export-students-csv")?.addEventListener("click", exportStudentsCSV);
    $("#btn-save-student-form")?.addEventListener("click", saveStudentForm);

    // Courses Actions
    $("#filter-course-search")?.addEventListener("input", e => {
      state.courses.search = e.target.value.trim();
      renderCoursesTable();
    });
    $("#filter-course-dept")?.addEventListener("change", e => {
      state.courses.department = e.target.value;
      renderCoursesTable();
    });
    $("#filter-course-sem")?.addEventListener("change", e => {
      state.courses.semester = e.target.value;
      renderCoursesTable();
    });
    $("#btn-add-course")?.addEventListener("click", openAddCourseModal);
    $("#btn-export-courses-csv")?.addEventListener("click", exportCoursesCSV);
    $("#btn-save-course-form")?.addEventListener("click", saveCourseForm);

    // Marks Actions
    $("#marks-course-select")?.addEventListener("change", e => {
      state.marks.courseId = e.target.value;
      renderMarksGradebook();
    });
    $("#marks-student-search")?.addEventListener("input", e => {
      state.marks.search = e.target.value.trim();
      renderMarksGradebook();
    });
    $("#btn-save-all-grades")?.addEventListener("click", saveAllGrades);
    $("#btn-export-grades-csv")?.addEventListener("click", exportGradebookCSV);

    // Attendance Actions
    $("#att-tab-daily")?.addEventListener("click", () => {
      state.attendance.activeTab = "daily";
      $("#att-tab-daily").classList.add("active");
      $("#att-tab-shortage").classList.remove("active");
      renderAttendanceView();
    });
    $("#att-tab-shortage")?.addEventListener("click", () => {
      state.attendance.activeTab = "shortage";
      $("#att-tab-shortage").classList.add("active");
      $("#att-tab-daily").classList.remove("active");
      renderAttendanceView();
    });

    $("#att-course-select")?.addEventListener("change", e => {
      state.attendance.courseId = e.target.value;
      renderAttendanceView();
    });

    $("#att-session-date")?.addEventListener("change", e => {
      state.attendance.date = e.target.value;
      renderAttendanceView();
    });

    $("#btn-att-mark-all-present")?.addEventListener("click", () => markAllAttendance("Present"));
    $("#btn-att-mark-all-absent")?.addEventListener("click", () => markAllAttendance("Absent"));
    $("#btn-save-attendance-session")?.addEventListener("click", saveAttendanceSession);
    $("#btn-print-shortage-report")?.addEventListener("click", () => window.print());

    // Settings actions
    $("#btn-export-db-json")?.addEventListener("click", exportDatabaseJSON);
    $("#btn-reset-db")?.addEventListener("click", resetToSeedData);
    $("#input-import-db-file")?.addEventListener("change", e => {
      const file = e.target.files[0];
      if (file) importDatabaseJSON(file);
    });
  }

  // ==========================================================================
  // TOAST NOTIFICATION SYSTEM
  // ==========================================================================
  function showToast(message, type = "info") {
    let container = $("#toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-msg">${message}</div>
      <button class="toast-dismiss">&times;</button>
    `;

    toast.querySelector(".toast-dismiss").onclick = () => {
      toast.remove();
    };

    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        toast.style.opacity = "0";
        toast.style.transform = "translateX(50px)";
        setTimeout(() => toast.remove(), 300);
      }
    }, 4500);
  }

  // Global exposure for event callbacks
  window.CSMSApp = {
    init,
    switchView,
    openStudentProfile,
    openEditStudentModal,
    confirmDeleteStudent,
    openEditCourseModal,
    confirmDeleteCourse,
    openCourseRosterModal,
    dropStudentFromCourse,
    onGradeInputChange,
    openStudentGradeCard,
    setStudentAttStatus,
    issueShortageNotice,
    showToast
  };

  // Launch on DOM ready
  document.addEventListener("DOMContentLoaded", init);
})();
