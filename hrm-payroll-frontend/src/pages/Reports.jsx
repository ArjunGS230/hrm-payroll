import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Reports() {

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

      {/* ================= SIDEBAR ================= */}

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
            className="dashboard-menu-item"
            onClick={() => navigate("/dashboard")}
          >
            <span className="dashboard-menu-icon">⌂</span>
            <span className="dashboard-menu-text">
              Dashboard
            </span>
          </button>


          <button
            type="button"
            className="dashboard-menu-item"
            onClick={() => navigate("/employees")}
          >
            <span className="dashboard-menu-icon">♙</span>
            <span className="dashboard-menu-text">
              Employees
            </span>
          </button>


          <button
            type="button"
            className="dashboard-menu-item"
            onClick={() => navigate("/salary-structures")}
          >
            <span className="dashboard-menu-icon">₹</span>
            <span className="dashboard-menu-text">
              Salary Structures
            </span>
          </button>


          <button
            type="button"
            className="dashboard-menu-item"
            onClick={() => navigate("/leave-management")}
          >
            <span className="dashboard-menu-icon">◷</span>
            <span className="dashboard-menu-text">
              Leave Management
            </span>
          </button>


          <button
            type="button"
            className="dashboard-menu-item"
            onClick={() => navigate("/payroll")}
          >
            <span className="dashboard-menu-icon">▣</span>
            <span className="dashboard-menu-text">
              Payroll
            </span>
          </button>


          <button
            type="button"
            className="dashboard-menu-item"
            onClick={() => navigate("/payslips")}
          >
            <span className="dashboard-menu-icon">▤</span>
            <span className="dashboard-menu-text">
              Payslips
            </span>
          </button>


          <button
            type="button"
            className="dashboard-menu-item"
            onClick={() => navigate("/email-logs")}
          >
            <span className="dashboard-menu-icon">✉</span>
            <span className="dashboard-menu-text">
              Email Logs
            </span>
          </button>


          {/* REPORTS - ACTIVE */}

          <button
            type="button"
            className="dashboard-menu-item active"
            onClick={() => navigate("/reports")}
          >
            <span className="dashboard-menu-icon">▥</span>
            <span className="dashboard-menu-text">
              Reports
            </span>
          </button>


          <button
            type="button"
            className="dashboard-menu-item"
            onClick={() => navigate("/settings")}
          >
            <span className="dashboard-menu-icon">⚙</span>
            <span className="dashboard-menu-text">
              Settings
            </span>
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


      {/* ================= MAIN CONTENT ================= */}

      <main className="dashboard-main">


        {/* TOPBAR */}

        <header className="dashboard-topbar">

          <div>

            <span className="dashboard-overline">
              HR WORKSPACE
            </span>

            <h1>
              Reports
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


        {/* ================= REPORTS ================= */}

        <section
          style={{
            padding: "32px"
          }}
        >

          <div
            style={{
              marginBottom: "30px"
            }}
          >

            <span
              style={{
                color: "#2563eb",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "2px"
              }}
            >
              REPORTS
            </span>

            <h2
              style={{
                fontSize: "32px",
                margin: "8px 0",
                color: "#172033"
              }}
            >
              Reports
            </h2>

            <p
              style={{
                color: "#64748b",
                margin: 0,
                fontSize: "16px"
              }}
            >
              View and analyze your HRM payroll data
            </p>

          </div>


          {/* REPORT CARDS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))",
              gap: "22px"
            }}
          >


            {/* PAYROLL REPORT */}

            <div
              style={{
                background: "#ffffff",
                padding: "25px",
                borderRadius: "14px",
                boxShadow:
                  "0 3px 12px rgba(0,0,0,0.08)"
              }}
            >

              <div
                style={{
                  fontSize: "32px",
                  marginBottom: "20px"
                }}
              >
                💰
              </div>

              <h3
                style={{
                  color: "#172033",
                  fontSize: "20px",
                  marginBottom: "10px"
                }}
              >
                Payroll Report
              </h3>

              <p
                style={{
                  color: "#64748b",
                  lineHeight: "1.6",
                  minHeight: "52px"
                }}
              >
                View payroll information including
                gross salary, deductions and net salary.
              </p>

              <button
                onClick={() => navigate("/reports/payroll")}
                style={{
                  background: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  padding: "11px 20px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                View Report
              </button>

            </div>


            {/* LEAVE REPORT */}

            <div
              style={{
                background: "#ffffff",
                padding: "25px",
                borderRadius: "14px",
                boxShadow:
                  "0 3px 12px rgba(0,0,0,0.08)"
              }}
            >

              <div
                style={{
                  fontSize: "32px",
                  marginBottom: "20px"
                }}
              >
                📅
              </div>

              <h3
                style={{
                  color: "#172033",
                  fontSize: "20px",
                  marginBottom: "10px"
                }}
              >
                Leave Report
              </h3>

              <p
                style={{
                  color: "#64748b",
                  lineHeight: "1.6",
                  minHeight: "52px"
                }}
              >
                View employee leave applications,
                leave types, days and approval status.
              </p>

              <button
                onClick={() => navigate("/reports/leave")}
                style={{
                  background: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  padding: "11px 20px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                View Report
              </button>

            </div>


            {/* PAYSLIP REPORT */}

            <div
              style={{
                background: "#ffffff",
                padding: "25px",
                borderRadius: "14px",
                boxShadow:
                  "0 3px 12px rgba(0,0,0,0.08)"
              }}
            >

              <div
                style={{
                  fontSize: "32px",
                  marginBottom: "20px"
                }}
              >
                📄
              </div>

              <h3
                style={{
                  color: "#172033",
                  fontSize: "20px",
                  marginBottom: "10px"
                }}
              >
                Payslip Report
              </h3>

              <p
                style={{
                  color: "#64748b",
                  lineHeight: "1.6",
                  minHeight: "52px"
                }}
              >
                View generated payslips and employee
                payroll information.
              </p>

              <button
                onClick={() => navigate("/reports/payslips")}
                style={{
                  background: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  padding: "11px 20px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                View Report
              </button>

            </div>


            {/* EMAIL REPORT */}

            <div
              style={{
                background: "#ffffff",
                padding: "25px",
                borderRadius: "14px",
                boxShadow:
                  "0 3px 12px rgba(0,0,0,0.08)"
              }}
            >

              <div
                style={{
                  fontSize: "32px",
                  marginBottom: "20px"
                }}
              >
                📧
              </div>

              <h3
                style={{
                  color: "#172033",
                  fontSize: "20px",
                  marginBottom: "10px"
                }}
              >
                Email Report
              </h3>

              <p
                style={{
                  color: "#64748b",
                  lineHeight: "1.6",
                  minHeight: "52px"
                }}
              >
                View email delivery status, failed
                emails and retry information.
              </p>

              <button
                onClick={() => navigate("/email-logs")}
                style={{
                  background: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  padding: "11px 20px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                View Report
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Reports;