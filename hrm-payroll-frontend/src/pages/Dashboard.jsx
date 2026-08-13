import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard() {

  const navigate = useNavigate();

  const username =
    localStorage.getItem("username") || "User";

  const role =
    localStorage.getItem("role") || "HR";


  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }

  }, [navigate]);


  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    navigate("/login");
  };


  return (

    <div className="dashboard-page">


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="dashboard-sidebar">

        <div className="dashboard-brand">

          <div className="dashboard-brand-logo">
            H
          </div>

          <div>
            <strong>HRM</strong>

            <span>
              PAYROLL AUTOMATION
            </span>
          </div>

        </div>

<nav className="dashboard-navigation">

  <button
    type="button"
    className="dashboard-menu-item active"
    onClick={() => navigate("/dashboard")}
  >
    <span className="dashboard-menu-icon">⌂</span>
    <span className="dashboard-menu-text">Dashboard</span>
  </button>

  <button
    type="button"
    className="dashboard-menu-item"
    onClick={() => navigate("/employees")}
  >
    <span className="dashboard-menu-icon">♙</span>
    <span className="dashboard-menu-text">Employees</span>
  </button>

  <button
    type="button"
    className="dashboard-menu-item"
    onClick={() => navigate("/salary-structures")}
  >
    <span className="dashboard-menu-icon">₹</span>
    <span className="dashboard-menu-text">Salary Structures</span>
  </button>

  <button
    type="button"
    className="dashboard-menu-item"
    onClick={() => navigate("/leave-management")}
  >
    <span className="dashboard-menu-icon">◷</span>
    <span className="dashboard-menu-text">Leave Management</span>
  </button>

  <button
    type="button"
    className="dashboard-menu-item"
    onClick={() => navigate("/payroll")}
  >
    <span className="dashboard-menu-icon">▣</span>
    <span className="dashboard-menu-text">Payroll</span>
  </button>

  <button
    type="button"
    className="dashboard-menu-item"
    onClick={() => navigate("/payslips")}
  >
    <span className="dashboard-menu-icon">▤</span>
    <span className="dashboard-menu-text">Payslips</span>
  </button>

  <button
    type="button"
    className="dashboard-menu-item"
    onClick={() => navigate("/email-logs")}
  >
    <span className="dashboard-menu-icon">✉</span>
    <span className="dashboard-menu-text">Email Logs</span>
  </button>

  <button
    type="button"
    className="dashboard-menu-item"
    onClick={() => navigate("/reports")}
  >
    <span className="dashboard-menu-icon">▥</span>
    <span className="dashboard-menu-text">Reports</span>
  </button>

  <button
    type="button"
    className="dashboard-menu-item"
    onClick={() => navigate("/settings")}
  >
    <span className="dashboard-menu-icon">⚙</span>
    <span className="dashboard-menu-text">Settings</span>
  </button>

</nav>


        {/* SIDEBAR FOOTER */}

        <div className="dashboard-sidebar-footer">

          <div className="dashboard-user">

            <div className="dashboard-avatar">
              {username
                .substring(0, 2)
                .toUpperCase()}
            </div>

            <div>

              <strong>
                {username}
              </strong>

              <span>
                {role}
              </span>

            </div>

          </div>


          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="dashboard-main">


        {/* ===================================================
            TOPBAR
        =================================================== */}

        <header className="dashboard-topbar">

          <div>

            <span className="dashboard-overline">
              HR WORKSPACE
            </span>

            <h1>
              Dashboard
            </h1>

          </div>


          <div className="dashboard-top-actions">

            <button className="dashboard-search">
              <span>⌕</span>
              Search anything...
            </button>


            <button className="notification-button">
              ♧

              <b>
                3
              </b>

            </button>


            <div className="topbar-user">

              <div className="dashboard-avatar">
                {username
                  .substring(0, 2)
                  .toUpperCase()}
              </div>

              <div>

                <strong>
                  {username}
                </strong>

                <span>
                  {role}
                </span>

              </div>

            </div>

          </div>

        </header>


        {/* ===================================================
            WELCOME
        =================================================== */}

        <section className="dashboard-welcome">

          <div>

            <span>
              GOOD MORNING
            </span>

            <h2>
              Welcome back, {username}.
            </h2>

            <p>
              Here's an overview of your HR
              workspace and payroll operations.
            </p>

          </div>


          <button
            className="dashboard-primary-button"
            onClick={() =>
              navigate("/salary-structures")
            }
          >
            Manage Salary
            <span>→</span>
          </button>

        </section>


        {/* ===================================================
            STAT CARDS
        =================================================== */}

        <section className="dashboard-stat-grid">


          <div className="dashboard-stat-card">

            <div className="stat-card-top">

              <span>
                TOTAL EMPLOYEES
              </span>

              <div className="dashboard-stat-icon blue">
                ♙
              </div>

            </div>

            <strong>
              128
            </strong>

            <small className="stat-positive">
              ↑ 12 this month
            </small>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-card-top">

              <span>
                MONTHLY PAYROLL
              </span>

              <div className="dashboard-stat-icon green">
                ₹
              </div>

            </div>

            <strong>
              ₹48.64L
            </strong>

            <small className="stat-positive">
              ↑ 8.4% this month
            </small>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-card-top">

              <span>
                PENDING LEAVES
              </span>

              <div className="dashboard-stat-icon yellow">
                ◷
              </div>

            </div>

            <strong>
              16
            </strong>

            <small>
              Awaiting approval
            </small>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-card-top">

              <span>
                PAYSLIPS GENERATED
              </span>

              <div className="dashboard-stat-icon purple">
                ▧
              </div>

            </div>

            <strong>
              114
            </strong>

            <small>
              This month
            </small>

          </div>

        </section>


        {/* ===================================================
            CONTENT GRID
        =================================================== */}

        <section className="dashboard-content-grid">


          {/* PAYROLL OVERVIEW */}

          <div className="dashboard-panel payroll-overview">

            <div className="dashboard-panel-header">

              <div>

                <span>
                  PAYROLL
                </span>

                <h3>
                  Monthly Payroll Overview
                </h3>

              </div>


              <select>

                <option>
                  August 2026
                </option>

                <option>
                  July 2026
                </option>

                <option>
                  June 2026
                </option>

              </select>

            </div>


            <div className="payroll-summary">

              <div>

                <span>
                  Gross Salary
                </span>

                <strong>
                  ₹48,64,000
                </strong>

              </div>


              <div>

                <span>
                  Net Salary
                </span>

                <strong>
                  ₹36,72,000
                </strong>

              </div>


              <div>

                <span>
                  Deductions
                </span>

                <strong>
                  ₹11,92,000
                </strong>

              </div>

            </div>


            <div className="payroll-chart">

              <div className="chart-grid-line"></div>
              <div className="chart-grid-line"></div>
              <div className="chart-grid-line"></div>


              <div className="chart-bars">

                <div style={{ height: "45%" }}></div>
                <div style={{ height: "62%" }}></div>
                <div style={{ height: "55%" }}></div>
                <div style={{ height: "74%" }}></div>
                <div style={{ height: "68%" }}></div>
                <div style={{ height: "82%" }}></div>
                <div style={{ height: "91%" }}></div>
                <div style={{ height: "78%" }}></div>
                <div style={{ height: "88%" }}></div>
                <div style={{ height: "95%" }}></div>
                <div style={{ height: "86%" }}></div>
                <div style={{ height: "100%" }}></div>

              </div>

            </div>


            <div className="chart-months">

              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>

            </div>

          </div>


          {/* LEAVE BALANCE */}

          <div className="dashboard-panel leave-overview">

            <div className="dashboard-panel-header">

              <div>

                <span>
                  LEAVE
                </span>

                <h3>
                  Leave Balance
                </h3>

              </div>

              <button>
                View all
              </button>

            </div>


            <div className="leave-stat">

              <div>

                <span>
                  Casual Leave
                </span>

                <strong>
                  12 / 12
                </strong>

              </div>

              <div className="leave-progress">
                <span style={{ width: "100%" }}></span>
              </div>

            </div>


            <div className="leave-stat">

              <div>

                <span>
                  Sick Leave
                </span>

                <strong>
                  10 / 12
                </strong>

              </div>

              <div className="leave-progress">
                <span style={{ width: "83%" }}></span>
              </div>

            </div>


            <div className="leave-stat">

              <div>

                <span>
                  Earned Leave
                </span>

                <strong>
                  18 / 20
                </strong>

              </div>

              <div className="leave-progress">
                <span style={{ width: "90%" }}></span>
              </div>

            </div>


            <div className="leave-stat">

              <div>

                <span>
                  Comp Off
                </span>

                <strong>
                  5 / 8
                </strong>

              </div>

              <div className="leave-progress yellow-progress">
                <span style={{ width: "63%" }}></span>
              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            QUICK ACTIONS
        =================================================== */}

        <section className="quick-actions-section">

          <div className="dashboard-section-heading">

            <div>

              <span>
                QUICK ACTIONS
              </span>

              <h3>
                Manage HR operations
              </h3>

            </div>

          </div>


          <div className="quick-actions-grid">


            <button
              onClick={() =>
                navigate("/salary-structures")
              }
            >

              <div className="quick-action-icon blue">
                ₹
              </div>

              <div>

                <strong>
                  Salary Structure
                </strong>

                <span>
                  Configure employee salaries
                </span>

              </div>

              <b>
                →
              </b>

            </button>


            <button>

              <div className="quick-action-icon green">
                ◷
              </div>

              <div>

                <strong>
                  Leave Management
                </strong>

                <span>
                  Review leave requests
                </span>

              </div>

              <b>
                →
              </b>

            </button>


            <button>

              <div className="quick-action-icon purple">
                ▧
              </div>

              <div>

                <strong>
                  Payslips
                </strong>

                <span>
                  Generate employee payslips
                </span>

              </div>

              <b>
                →
              </b>

            </button>


            <button>

              <div className="quick-action-icon yellow">
                ✉
              </div>

              <div>

                <strong>
                  Email Automation
                </strong>

                <span>
                  Send payslips automatically
                </span>

              </div>

              <b>
                →
              </b>

            </button>

          </div>

        </section>


        {/* ===================================================
            RECENT ACTIVITY
        =================================================== */}

        <section className="dashboard-panel recent-activity">

          <div className="dashboard-panel-header">

            <div>

              <span>
                ACTIVITY
              </span>

              <h3>
                Recent Payroll Activity
              </h3>

            </div>

            <button>
              View all →
            </button>

          </div>


          <div className="activity-table">

            <div className="activity-table-header">

              <span>
                Employee
              </span>

              <span>
                Department
              </span>

              <span>
                Gross Salary
              </span>

              <span>
                Net Salary
              </span>

              <span>
                Status
              </span>

            </div>


            <div className="activity-table-row">

              <div className="employee-cell">

                <div className="employee-avatar">
                  RV
                </div>

                <strong>
                  Rahul Verma
                </strong>

              </div>

              <span>
                Engineering
              </span>

              <span>
                ₹52,000
              </span>

              <span>
                ₹41,600
              </span>

              <b className="status-paid">
                PAID
              </b>

            </div>


            <div className="activity-table-row">

              <div className="employee-cell">

                <div className="employee-avatar purple">
                  PS
                </div>

                <strong>
                  Priya Singh
                </strong>

              </div>

              <span>
                Marketing
              </span>

              <span>
                ₹45,000
              </span>

              <span>
                ₹36,250
              </span>

              <b className="status-paid">
                PAID
              </b>

            </div>


            <div className="activity-table-row">

              <div className="employee-cell">

                <div className="employee-avatar orange">
                  AK
                </div>

                <strong>
                  Amit Kumar
                </strong>

              </div>

              <span>
                Sales
              </span>

              <span>
                ₹38,000
              </span>

              <span>
                ₹30,400
              </span>

              <b className="status-paid">
                PAID
              </b>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;