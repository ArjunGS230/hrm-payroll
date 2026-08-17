import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EmployeeDashboard() {

  const navigate = useNavigate();

  const username =
    localStorage.getItem("username") || "Employee";

  const token =
    localStorage.getItem("token");

  const [payrolls, setPayrolls] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);

  const [loadingPayroll, setLoadingPayroll] =
    useState(true);

  const [loadingLeave, setLoadingLeave] =
    useState(true);

  const [error, setError] = useState("");


  // =====================================================
  // AXIOS CONFIG
  // =====================================================

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };


  // =====================================================
  // LOAD EMPLOYEE DATA
  // =====================================================

  useEffect(() => {

    const loadEmployeeData = async () => {

      try {

        setError("");

        // -------------------------------------------------
        // MY PAYROLL
        // -------------------------------------------------

        const payrollResponse =
          await axios.get(
            "https://hrm-payroll-backend.onrender.com/api/payrolls/my",
            config
          );

        setPayrolls(
          payrollResponse.data || []
        );


        // -------------------------------------------------
        // FIND EMPLOYEE ID
        //
        // We need the employee ID for the leave balance
        // endpoint.
        // -------------------------------------------------

        const employeeResponse =
          await axios.get(
            "https://hrm-payroll-backend.onrender.com/api/employees",
            config
          );

        const employees =
          employeeResponse.data || [];


        const employee =
          employees.find(
            (emp) =>
              emp.email &&
              localStorage.getItem("email") &&
              emp.email.toLowerCase() ===
                localStorage
                  .getItem("email")
                  .toLowerCase()
          );


        // -------------------------------------------------
        // GET LEAVE BALANCE
        // -------------------------------------------------

        if (employee) {

          try {

            const leaveResponse =
              await axios.get(
                `https://hrm-payroll-backend.onrender.com/api/leaves/balance/${employee.id}`,
                config
              );

            setLeaveBalance(
              leaveResponse.data
            );

          } catch (leaveError) {

            console.error(
              "Leave balance error:",
              leaveError
            );

          }

        }

      } catch (err) {

        console.error(
          "Employee dashboard error:",
          err
        );

        setError(
          "Unable to load employee dashboard data."
        );

      } finally {

        setLoadingPayroll(false);
        setLoadingLeave(false);

      }

    };


    loadEmployeeData();

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
  // LATEST PAYROLL
  // =====================================================

  const latestPayroll =
    payrolls.length > 0
      ? payrolls[payrolls.length - 1]
      : null;


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="dashboard-content">


      {/* =================================================
          TOPBAR
      ================================================= */}

      <header className="dashboard-topbar">

        <div>

          <span className="dashboard-overline">
            EMPLOYEE WORKSPACE
          </span>

          <h1>
            Dashboard
          </h1>

        </div>


        <div className="dashboard-top-actions">

          {/* SETTINGS */}



          {/* USER */}

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
                EMPLOYEE
              </span>

            </div>

          </div>

        </div>

      </header>


      {/* =================================================
          ERROR
      ================================================= */}

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


      {/* =================================================
          WELCOME
      ================================================= */}

      <section className="dashboard-welcome">

        <div>

          <span>
            EMPLOYEE PORTAL
          </span>

          <h2>
            Welcome back, {username}.
          </h2>

          <p>
            Here's an overview of your payroll
            and leave information.
          </p>

        </div>

      </section>


      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <section className="quick-actions-section">

        <div className="dashboard-section-heading">

          <span>
            QUICK ACTIONS
          </span>

          <h3>
            Employee Services
          </h3>

        </div>


        <div className="quick-actions-grid">


          {/* MY LEAVE */}

          <button
            type="button"
            onClick={() =>
              navigate("/leave-management")
            }
          >

            <div className="quick-action-icon green">
              ◷
            </div>

            <div>

              <strong>
                My Leave
              </strong>

              <span>
                Apply and view your leaves
              </span>

            </div>

            <b>
              →
            </b>

          </button>


          {/* MY PAYROLL */}

          <button
            type="button"
            onClick={() =>
              navigate("/payroll")
            }
          >

            <div className="quick-action-icon blue">
              ₹
            </div>

            <div>

              <strong>
                My Payroll
              </strong>

              <span>
                View your salary details
              </span>

            </div>

            <b>
              →
            </b>

          </button>


          {/* MY PAYSLIPS */}

          <button
            type="button"
            onClick={() =>
              navigate("/payslips")
            }
          >

            <div className="quick-action-icon purple">
              ▧
            </div>

            <div>

              <strong>
                My Payslips
              </strong>

              <span>
                View your generated payslips
              </span>

            </div>

            <b>
              →
            </b>

          </button>


          {/* SETTINGS */}

         

        </div>

      </section>


      {/* =================================================
          PAYROLL + LEAVE
      ================================================= */}

      <section className="dashboard-content-grid">


        {/* =================================================
            LATEST PAYROLL
        ================================================= */}

        <div className="dashboard-panel payroll-overview">

          <div className="dashboard-panel-header">

            <div>

              <span>
                PAYROLL
              </span>

              <h3>
                Latest Payroll
              </h3>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/payroll")
              }
            >
              View all
            </button>

          </div>


          {loadingPayroll ? (

            <div
              style={{
                padding: "30px",
                textAlign: "center"
              }}
            >
              Loading payroll...
            </div>

          ) : !latestPayroll ? (

            <div
              style={{
                padding: "30px",
                textAlign: "center"
              }}
            >
              No payroll records found.
            </div>

          ) : (

            <div className="payroll-summary">

              <div>

                <span>
                  Pay Period
                </span>

                <strong>
                  {latestPayroll.payPeriod || "—"}
                </strong>

              </div>


              <div>

                <span>
                  Gross Salary
                </span>

                <strong>
                  {formatCurrency(
                    latestPayroll.grossSalary
                  )}
                </strong>

              </div>


              <div>

                <span>
                  Net Salary
                </span>

                <strong>
                  {formatCurrency(
                    latestPayroll.netSalary
                  )}
                </strong>

              </div>


              <div>

                <span>
                  Status
                </span>

                <strong>
                  {latestPayroll.status || "—"}
                </strong>

              </div>

            </div>

          )}

        </div>


        {/* =================================================
            LEAVE BALANCE
        ================================================= */}

        <div className="dashboard-panel leave-overview">

          <div className="dashboard-panel-header">

            <div>

              <span>
                LEAVE
              </span>

              <h3>
                My Leave Balance
              </h3>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/leave-management")
              }
            >
              View all
            </button>

          </div>


          {loadingLeave ? (

            <div
              style={{
                padding: "30px",
                textAlign: "center"
              }}
            >
              Loading leave balance...
            </div>

          ) : !leaveBalance ? (

            <div
              style={{
                padding: "30px",
                textAlign: "center"
              }}
            >
              Leave balance not available.
            </div>

          ) : (

            <>

              {/* CASUAL */}

              <div className="leave-stat">

                <div>

                  <span>
                    Casual Leave
                  </span>

                  <strong>
                    {leaveBalance.casualLeave}
                  </strong>

                </div>

              </div>


              {/* SICK */}

              <div className="leave-stat">

                <div>

                  <span>
                    Sick Leave
                  </span>

                  <strong>
                    {leaveBalance.sickLeave}
                  </strong>

                </div>

              </div>


              {/* EARNED */}

              <div className="leave-stat">

                <div>

                  <span>
                    Earned Leave
                  </span>

                  <strong>
                    {leaveBalance.earnedLeave}
                  </strong>

                </div>

              </div>

            </>

          )}

        </div>

      </section>


      {/* =================================================
          RECENT PAYROLL
      ================================================= */}

      <section className="dashboard-panel recent-activity">

        <div className="dashboard-panel-header">

          <div>

            <span>
              PAYROLL
            </span>

            <h3>
              My Recent Payroll
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


          <div className="activity-table-header">

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


          {loadingPayroll ? (

            <div className="activity-table-row">

              <span>
                Loading...
              </span>

            </div>

          ) : payrolls.length === 0 ? (

            <div className="activity-table-row">

              <span>
                No payroll records found.
              </span>

            </div>

          ) : (

            payrolls
              .slice()
              .reverse()
              .slice(0, 5)
              .map((payroll, index) => (

                <div
                  className="activity-table-row"
                  key={
                    payroll.id || index
                  }
                >

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

              ))

          )}

        </div>

      </section>

    </div>

  );
}

export default EmployeeDashboard;
