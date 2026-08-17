import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EmployeeDashboard from "./EmployeeDashboard";
import "../styles/Dashboard.css";

function Dashboard() {

  const navigate = useNavigate();

  // =====================================================
  // USER
  // =====================================================

  const username =
    localStorage.getItem("username") || "User";

  const role =
    localStorage.getItem("role") || "HR";
  if (role === "EMPLOYEE") {
  return <EmployeeDashboard />;
}

  // =====================================================
  // DASHBOARD DATA
  // =====================================================

  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    monthlyPayroll: 0,
    pendingLeaves: 0,
    payslipsGenerated: 0,
    grossSalary: 0,
    netSalary: 0,
    deductions: 0
  });


  // =====================================================
  // EMPLOYEES
  // =====================================================

  const [employees, setEmployees] = useState([]);


  // =====================================================
  // RECENT PAYROLL
  // =====================================================

  const [recentPayroll, setRecentPayroll] = useState([]);


  // =====================================================
  // SEARCH
  // =====================================================

  const [searchText, setSearchText] = useState("");


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const [showNotifications, setShowNotifications] =
    useState(false);


  // =====================================================
  // LOADING / ERROR
  // =====================================================

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  useEffect(() => {

    const fetchDashboardData = async () => {

      try {

        setLoading(true);

        setError("");

        const token =
          localStorage.getItem("token");


        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };


        // =================================================
        // 1. DASHBOARD SUMMARY
        // =================================================

        const summaryResponse =
          await axios.get(
            "https://hrm-payroll-backend.onrender.com/api/dashboard/summary",
            config
          );


        setDashboardData(
          summaryResponse.data
        );


        // =================================================
        // 2. RECENT PAYROLL
        // =================================================

        const payrollResponse =
          await axios.get(
            "https://hrm-payroll-backend.onrender.com/api/dashboard/recent-payroll",
            config
          );


        setRecentPayroll(
          payrollResponse.data
        );


        // =================================================
        // 3. ALL EMPLOYEES
        // =================================================

        const employeeResponse =
          await axios.get(
            "https://hrm-payroll-backend.onrender.com/api/employees",
            config
          );


        setEmployees(
          employeeResponse.data
        );


      } catch (err) {

        console.error(
          "Dashboard API Error:",
          err
        );

        setError(
          "Unable to load dashboard data."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchDashboardData();

  }, []);


  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (value) => {

    const amount =
      Number(value) || 0;


    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
      }
    ).format(amount);

  };


  // =====================================================
  // FORMAT SHORT CURRENCY
  // =====================================================

  const formatShortCurrency = (value) => {

    const amount =
      Number(value) || 0;


    if (amount >= 10000000) {

      return `₹${(
        amount / 10000000
      ).toFixed(2)}Cr`;

    }


    if (amount >= 100000) {

      return `₹${(
        amount / 100000
      ).toFixed(2)}L`;

    }


    if (amount >= 1000) {

      return `₹${(
        amount / 1000
      ).toFixed(1)}K`;

    }


    return `₹${amount}`;

  };


  // =====================================================
  // VALUES
  // =====================================================

  const totalEmployees =
    dashboardData.totalEmployees;

  const monthlyPayroll =
    dashboardData.monthlyPayroll;

  const pendingLeaves =
    dashboardData.pendingLeaves;

  const payslipsGenerated =
    dashboardData.payslipsGenerated;

  const grossSalary =
    dashboardData.grossSalary;

  const netSalary =
    dashboardData.netSalary;

  const deductions =
    dashboardData.deductions;


  // =====================================================
  // SEARCH EMPLOYEES
  // =====================================================

  const search =
    searchText.trim().toLowerCase();


  const filteredEmployees =
    search
      ? employees.filter((employee) => {

          return (

            employee.name
              ?.toLowerCase()
              .includes(search)

            ||

            employee.employeeCode
              ?.toLowerCase()
              .includes(search)

            ||

            employee.email
              ?.toLowerCase()
              .includes(search)

            ||

            employee.department
              ?.toLowerCase()
              .includes(search)

            ||

            employee.designation
              ?.toLowerCase()
              .includes(search)

          );

        })
      : [];


  // =====================================================
  // SEARCH PAYROLL
  // =====================================================

  const filteredPayroll =
    search
      ? recentPayroll.filter((payroll) => {

          return (

            payroll.employeeName
              ?.toLowerCase()
              .includes(search)

            ||

            payroll.department
              ?.toLowerCase()
              .includes(search)

            ||

            payroll.payPeriod
              ?.toLowerCase()
              .includes(search)

            ||

            payroll.status
              ?.toLowerCase()
              .includes(search)

          );

        })
      : [];


  // =====================================================
  // NOTIFICATION COUNT
  // =====================================================

  const notificationCount =
    pendingLeaves;


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <div className="dashboard-content">


      {/* =====================================================
          TOPBAR
      ===================================================== */}

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


          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="dashboard-search-wrapper">

            <div className="dashboard-search">

              <span>
                ⌕
              </span>

              <input
                type="text"
                value={searchText}
                onChange={(e) =>
                  setSearchText(
                    e.target.value
                  )
                }
                placeholder="Search anything..."
              />

            </div>


            {/* =================================================
                SEARCH RESULTS
            ================================================= */}

            {searchText.trim() && (

              <div className="dashboard-search-results">


                {/* =============================================
                    EMPLOYEE RESULTS
                ============================================= */}

                {filteredEmployees.length > 0 && (

                  <>

                    <div
                      style={{
                        padding: "8px 10px",
                        color: "#8191a7",
                        fontSize: "9px",
                        fontWeight: "800",
                        letterSpacing: "1px"
                      }}
                    >
                      EMPLOYEES
                    </div>


                    {filteredEmployees
                      .slice(0, 5)
                      .map((employee) => (

                        <div
                          key={employee.id}
                          className="dashboard-search-result"
                          onClick={() => {

                            setSearchText("");

                            navigate(
                              "/employees"
                            );

                          }}
                        >

                          <div className="search-result-avatar">

                            {employee.name
                              ?.substring(0, 2)
                              .toUpperCase()}

                          </div>


                          <div>

                            <strong>
                              {employee.name}
                            </strong>

                            <span>

                              {employee.employeeCode}

                              {" • "}

                              {employee.department}

                            </span>

                          </div>

                        </div>

                      ))}

                  </>

                )}


                {/* =============================================
                    PAYROLL RESULTS
                ============================================= */}

                {filteredPayroll.length > 0 && (

                  <>

                    <div
                      style={{
                        padding: "8px 10px",
                        color: "#8191a7",
                        fontSize: "9px",
                        fontWeight: "800",
                        letterSpacing: "1px"
                      }}
                    >
                      PAYROLL
                    </div>


                    {filteredPayroll
                      .slice(0, 5)
                      .map((payroll) => (

                        <div
                          key={payroll.payrollId}
                          className="dashboard-search-result"
                          onClick={() => {

                            setSearchText("");

                            navigate(
                              "/payroll"
                            );

                          }}
                        >

                          <div className="search-result-avatar">

                            {payroll.employeeName
                              ?.substring(0, 2)
                              .toUpperCase()}

                          </div>


                          <div>

                            <strong>
                              {payroll.employeeName}
                            </strong>

                            <span>

                              {payroll.department}

                              {" • "}

                              {payroll.payPeriod}

                            </span>

                          </div>

                        </div>

                      ))}

                  </>

                )}


                {/* =============================================
                    NO RESULTS
                ============================================= */}

                {filteredEmployees.length === 0 &&
                  filteredPayroll.length === 0 && (

                    <div className="dashboard-search-no-result">

                      No matching records found.

                    </div>

                  )}

              </div>

            )}

          </div>


          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <div className="notification-wrapper">


            <button
              type="button"
              className="notification-button"
              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
            >

              ♧


              {notificationCount > 0 && (

                <b>
                  {notificationCount}
                </b>

              )}

            </button>


            {/* =================================================
                NOTIFICATION DROPDOWN
            ================================================= */}

            {showNotifications && (

              <div className="notification-dropdown">


                {/* HEADER */}

                <div className="notification-header">

                  <div>

                    <strong>
                      Notifications
                    </strong>

                    <span>
                      HR workspace updates
                    </span>

                  </div>

                </div>


                {/* =============================================
                    PENDING LEAVES
                ============================================= */}

                {pendingLeaves > 0 && (

                  <div
                    className="notification-item"
                    onClick={() => {

                      setShowNotifications(false);

                      navigate(
                        "/leave-management"
                      );

                    }}
                  >

                    <div className="notification-icon yellow">
                      ◷
                    </div>


                    <div>

                      <strong>
                        Pending leave requests
                      </strong>


                      <span>

                        {pendingLeaves}

                        {" "}

                        leave request
                        {pendingLeaves !== 1
                          ? "s"
                          : ""}

                        {" "}awaiting approval

                      </span>

                    </div>

                  </div>

                )}


                {/* =============================================
                    PAYSLIPS
                ============================================= */}

                {payslipsGenerated > 0 && (

                  <div
                    className="notification-item"
                    onClick={() => {

                      setShowNotifications(false);

                      navigate(
                        "/payslips"
                      );

                    }}
                  >

                    <div className="notification-icon purple">
                      ▧
                    </div>


                    <div>

                      <strong>
                        Payslips generated
                      </strong>


                      <span>

                        {payslipsGenerated}

                        {" "}

                        payslip
                        {payslipsGenerated !== 1
                          ? "s"
                          : ""}

                        {" "}generated this month

                      </span>

                    </div>

                  </div>

                )}


                {/* =============================================
                    NO NOTIFICATIONS
                ============================================= */}

                {pendingLeaves === 0 &&
                  payslipsGenerated === 0 && (

                    <div className="notification-empty">

                      <div>
                        ✓
                      </div>

                      <strong>
                        You're all caught up
                      </strong>

                      <span>
                        No new notifications.
                      </span>

                    </div>

                  )}

              </div>

            )}

          </div>


          {/* =================================================
              USER
          ================================================= */}

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


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (

        <div
          style={{
            marginTop: "15px",
            padding: "12px 15px",
            borderRadius: "8px",
            background: "#fff1f1",
            color: "#d32f2f",
            fontSize: "13px"
          }}
        >

          {error}

        </div>

      )}


      {/* =====================================================
          WELCOME
      ===================================================== */}

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
            navigate(
              "/salary-structures"
            )
          }
        >

          Manage Salary

          <span>
            →
          </span>

        </button>


      </section>


      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <section className="dashboard-stat-grid">


        {/* TOTAL EMPLOYEES */}

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

            {loading
              ? "..."
              : totalEmployees}

          </strong>


          <small>
            Active employees
          </small>

        </div>


        {/* MONTHLY PAYROLL */}

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

            {loading
              ? "..."
              : formatShortCurrency(
                  monthlyPayroll
                )}

          </strong>


          <small>
            Current month
          </small>

        </div>


        {/* PENDING LEAVES */}

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

            {loading
              ? "..."
              : pendingLeaves}

          </strong>


          <small>
            Awaiting approval
          </small>

        </div>


        {/* PAYSLIPS */}

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

            {loading
              ? "..."
              : payslipsGenerated}

          </strong>


          <small>
            This month
          </small>

        </div>


      </section>


      {/* =====================================================
          PAYROLL + LEAVE
      ===================================================== */}

      <section className="dashboard-content-grid">


        {/* ===================================================
            PAYROLL
        =================================================== */}

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


            <select defaultValue="August 2026">

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

                {loading
                  ? "..."
                  : formatCurrency(
                      grossSalary
                    )}

              </strong>

            </div>


            <div>

              <span>
                Net Salary
              </span>

              <strong>

                {loading
                  ? "..."
                  : formatCurrency(
                      netSalary
                    )}

              </strong>

            </div>


            <div>

              <span>
                Deductions
              </span>

              <strong>

                {loading
                  ? "..."
                  : formatCurrency(
                      deductions
                    )}

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


        {/* ===================================================
            LEAVE BALANCE
        =================================================== */}

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


            <button
              type="button"
              onClick={() =>
                navigate(
                  "/leave-management"
                )
              }
            >

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

              <span
                style={{
                  width: "100%"
                }}
              ></span>

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

              <span
                style={{
                  width: "83%"
                }}
              ></span>

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

              <span
                style={{
                  width: "90%"
                }}
              ></span>

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

              <span
                style={{
                  width: "63%"
                }}
              ></span>

            </div>

          </div>


        </div>


      </section>


      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <section className="quick-actions-section">


        <div className="dashboard-section-heading">

          <span>
            QUICK ACTIONS
          </span>

          <h3>
            Manage HR operations
          </h3>

        </div>


        <div className="quick-actions-grid">


          <button
            type="button"
            onClick={() =>
              navigate(
                "/salary-structures"
              )
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


          <button
            type="button"
            onClick={() =>
              navigate(
                "/leave-management"
              )
            }
          >

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


          <button
            type="button"
            onClick={() =>
              navigate(
                "/payslips"
              )
            }
          >

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


          <button
            type="button"
            onClick={() =>
              navigate(
                "/email-logs"
              )
            }
          >

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


      {/* =====================================================
          RECENT PAYROLL ACTIVITY
      ===================================================== */}

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


          <button
            type="button"
            onClick={() =>
              navigate("/payroll")
            }
          >

            View all →

          </button>

        </div>


        <div className="activity-table">


          {/* TABLE HEADER */}

          <div className="activity-table-header">

            <span>
              Employee
            </span>

            <span>
              Department
            </span>

            <span>
              Pay Period
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


          {/* LOADING */}

          {loading ? (

            <div className="activity-table-row">

              <span>
                Loading...
              </span>

            </div>

          ) : recentPayroll.length === 0 ? (

            <div className="activity-table-row">

              <span>
                No payroll records found.
              </span>

            </div>

          ) : (

            recentPayroll.map(
              (payroll, index) => {

                const employeeName =
                  payroll.employeeName ||
                  "Unknown Employee";


                const initials =
                  employeeName
                    .split(" ")
                    .map(
                      word =>
                        word.charAt(0)
                    )
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();


                return (

                  <div
                    className="activity-table-row"
                    key={
                      payroll.payrollId ||
                      index
                    }
                  >


                    <div className="employee-cell">

                      <div
                        className={`employee-avatar ${
                          index % 3 === 1
                            ? "purple"
                            : index % 3 === 2
                            ? "orange"
                            : ""
                        }`}
                      >

                        {initials}

                      </div>


                      <strong>
                        {employeeName}
                      </strong>

                    </div>


                    <span>
                      {payroll.department || "—"}
                    </span>


                    <span>
                      {payroll.payPeriod || "—"}
                    </span>


                    <span>
                      {formatCurrency(
                        payroll.grossSalary
                      )}
                    </span>


                    <span>
                      {formatCurrency(
                        payroll.netSalary
                      )}
                    </span>


                    <b className="status-paid">

                      {payroll.status || "—"}

                    </b>


                  </div>

                );

              }

            )

          )}


        </div>

      </section>


    </div>

  );

}

export default Dashboard;
