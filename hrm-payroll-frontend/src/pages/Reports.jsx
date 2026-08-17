import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../styles/Reports.css";

function Reports() {

  const navigate = useNavigate();

  // =====================================================
  // USER
  // =====================================================

  const username =
    localStorage.getItem("username") || "User";

  const role =
    localStorage.getItem("role") || "HR";


  // =====================================================
  // SEARCH
  // =====================================================

  const [searchText, setSearchText] = useState("");


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const [pendingLeaves, setPendingLeaves] = useState(0);

  const [payslipsGenerated, setPayslipsGenerated] =
    useState(0);

  const [showNotifications, setShowNotifications] =
    useState(false);


  // =====================================================
  // REPORT ITEMS
  // =====================================================

  const reportItems = [

    {
      id: "payroll",
      title: "Payroll Report",
      description:
        "View payroll information including gross salary, deductions and net salary.",
      icon: "💰",
      keywords:
        "payroll salary gross deductions net",
      path: "/reports/payroll"
    },

    {
      id: "leave",
      title: "Leave Report",
      description:
        "View employee leave applications, leave types, days and approval status.",
      icon: "📅",
      keywords:
        "leave applications leave type days approval status",
      path: "/reports/leave"
    },

    {
      id: "payslip",
      title: "Payslip Report",
      description:
        "View generated payslips and employee payroll information.",
      icon: "📄",
      keywords:
        "payslip payslips generated payroll employee",
      path: "/reports/payslips"
    },

    {
      id: "email",
      title: "Email Report",
      description:
        "View email delivery status, failed emails and retry information.",
      icon: "📧",
      keywords:
        "email delivery failed retry information",
      path: "/email-logs"
    }

  ];


  // =====================================================
  // LOAD REAL NOTIFICATIONS
  // =====================================================

  useEffect(() => {

    const token =
      localStorage.getItem("token");


    if (!token) {

      navigate("/login");

      return;

    }


    const config = {

      headers: {

        Authorization:
          `Bearer ${token}`

      }

    };


    const loadNotifications =
      async () => {

        try {

          const response =
            await axios.get(
              "https://hrm-payroll-backend.onrender.com/api/dashboard/summary",
              config
            );


          setPendingLeaves(
            response.data.pendingLeaves || 0
          );


          setPayslipsGenerated(
            response.data.payslipsGenerated || 0
          );


        } catch (error) {

          console.error(
            "Reports notification error:",
            error
          );

        }

      };


    loadNotifications();

  }, [navigate]);


  // =====================================================
  // SEARCH
  // =====================================================

  const search =
    searchText
      .trim()
      .toLowerCase();


  const filteredReports =
    reportItems.filter((report) => {

      if (!search) {
        return true;
      }


      return (

        report.title
          .toLowerCase()
          .includes(search)

        ||

        report.description
          .toLowerCase()
          .includes(search)

        ||

        report.keywords
          .toLowerCase()
          .includes(search)

      );

    });


  // =====================================================
  // NOTIFICATION COUNT
  // =====================================================

  const notificationCount =
    pendingLeaves + payslipsGenerated;


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <div className="reports-page">


      {/* =====================================================
          TOP BAR
          ===================================================== */}

      <header className="reports-topbar">


        {/* ===================================================
            LEFT
            =================================================== */}

        <div className="reports-topbar-left">

          <span className="reports-overline">

            HR WORKSPACE

          </span>


          <h1>

            Reports

          </h1>

        </div>


        {/* ===================================================
            TOP ACTIONS
            =================================================== */}

        <div className="reports-top-actions">


          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="reports-search-wrapper">


            <div className="reports-search">

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

              <div className="reports-search-results">


                {filteredReports.length > 0 ? (

                  filteredReports.map(
                    (report) => (

                      <div
                        key={report.id}
                        className="reports-search-result"
                        onClick={() => {

                          setSearchText("");

                          navigate(
                            report.path
                          );

                        }}
                      >

                        <div className="reports-search-avatar">

                          {report.icon}

                        </div>


                        <div className="reports-search-info">

                          <strong>

                            {report.title}

                          </strong>


                          <span>

                            {report.description}

                          </span>

                        </div>

                      </div>

                    )
                  )

                ) : (

                  <div className="reports-search-no-result">

                    No matching report found.

                  </div>

                )}

              </div>

            )}

          </div>


          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <div className="reports-notification-wrapper">


            <button
              type="button"
              className="reports-notification"
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

              <div className="reports-notification-dropdown">


                {/* =============================================
                    HEADER
                ============================================= */}

                <div className="reports-notification-header">

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
                    className="reports-notification-item"
                    onClick={() => {

                      setShowNotifications(false);

                      navigate(
                        "/leave-management"
                      );

                    }}
                  >

                    <div className="reports-notification-icon yellow">

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
                    className="reports-notification-item"
                    onClick={() => {

                      setShowNotifications(false);

                      navigate(
                        "/payslips"
                      );

                    }}
                  >

                    <div className="reports-notification-icon purple">

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

                    <div className="reports-notification-empty">

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

          <div className="reports-user">


            <div className="reports-avatar">

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
          REPORTS CONTENT
          ===================================================== */}

      <main className="reports-content">


        <div className="reports-heading">


          <span>

            REPORTS

          </span>


          <h2>

            Reports

          </h2>


          <p>

            View and analyze your HRM payroll data

          </p>


        </div>


        {/* ===================================================
            REPORT CARDS
            =================================================== */}

        <section className="reports-grid">


          {filteredReports.length > 0 ? (

            filteredReports.map(
              (report) => (

                <div
                  className="report-card"
                  key={report.id}
                >

                  <div className="report-icon">

                    {report.icon}

                  </div>


                  <h3>

                    {report.title}

                  </h3>


                  <p>

                    {report.description}

                  </p>


                  <button
                    onClick={() =>
                      navigate(
                        report.path
                      )
                    }
                  >

                    View Report

                  </button>

                </div>

              )
            )

          ) : (

            <div className="reports-no-results">

              <h3>
                No reports found
              </h3>

              <p>
                Try searching for Payroll, Leave,
                Payslip or Email.
              </p>

            </div>

          )}

        </section>


      </main>


    </div>

  );

}


export default Reports;
