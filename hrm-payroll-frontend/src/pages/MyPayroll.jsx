import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../styles/MyPayroll.css";

function MyPayroll() {

  const navigate = useNavigate();

  const token =
    localStorage.getItem("token");

  const username =
    localStorage.getItem("username") || "Employee";


  // =====================================================
  // STATE
  // =====================================================

  const [payrolls, setPayrolls] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // AUTH CONFIG
  // =====================================================

  const authConfig = {

    headers: {
      Authorization: `Bearer ${token}`
    }

  };


  // =====================================================
  // FETCH MY PAYROLL
  // =====================================================

  const fetchMyPayroll = async () => {

    try {

      setLoading(true);
      setError("");


      const response =
        await axios.get(
          "http://localhost:8090/api/payrolls/my",
          authConfig
        );


      setPayrolls(
        response.data || []
      );


    } catch (err) {

      console.error(
        "My payroll error:",
        err
      );


      if (
        err.response?.status === 401
      ) {

        localStorage.clear();

        navigate("/login");

        return;

      }


      setError(
        err.response?.data?.message ||
        "Unable to load your payroll records."
      );


    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    if (!token) {

      navigate("/login");

      return;

    }

    fetchMyPayroll();

  }, []);


  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatMoney = (
    value
  ) => {

    if (
      value === null ||
      value === undefined
    ) {

      return "₹0.00";

    }


    return `₹${Number(value).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    )}`;

  };


  // =====================================================
  // GET LATEST PAYROLL
  // =====================================================

  const latestPayroll =
    payrolls.length > 0
      ? payrolls[payrolls.length - 1]
      : null;


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="payroll-page">

      <main className="payroll-main">


        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="payroll-topbar">

          <div>

            <div className="payroll-eyebrow">
              EMPLOYEE WORKSPACE
            </div>

            <h1>
              My Payroll
            </h1>

            <p>
              View your processed salary records.
            </p>

          </div>

        </header>


        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="payroll-content">


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="payroll-error">
              {error}
            </div>

          )}


          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (

            <div className="payroll-loading">
              Loading your payroll records...
            </div>

          ) : (

            <>


              {/* =================================================
                  EMPLOYEE SUMMARY
              ================================================= */}

              <section className="payroll-card">

                <div className="payroll-card-heading">

                  <div>

                    <h3>
                      {username}'s Payroll
                    </h3>

                    <p>
                      Your salary and processed
                      payroll information.
                    </p>

                  </div>


                  <div className="payroll-total-count">

                    <span>
                      Total Payrolls
                    </span>

                    <strong>
                      {payrolls.length}
                    </strong>

                  </div>

                </div>


                {/* =================================================
                    LATEST PAYROLL
                ================================================= */}

                {latestPayroll && (

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(4, 1fr)",
                      gap: "15px",
                      marginBottom: "25px"
                    }}
                  >


                    <div className="payroll-summary-card">

                      <span>
                        PAY PERIOD
                      </span>

                      <strong>
                        {latestPayroll.payPeriod || "—"}
                      </strong>

                    </div>


                    <div className="payroll-summary-card">

                      <span>
                        GROSS SALARY
                      </span>

                      <strong>
                        {formatMoney(
                          latestPayroll.grossSalary
                        )}
                      </strong>

                    </div>


                    <div className="payroll-summary-card">

                      <span>
                        DEDUCTIONS
                      </span>

                      <strong>
                        {formatMoney(
                          latestPayroll.totalDeductions
                        )}
                      </strong>

                    </div>


                    <div className="payroll-summary-card">

                      <span>
                        NET SALARY
                      </span>

                      <strong>
                        {formatMoney(
                          latestPayroll.netSalary
                        )}
                      </strong>

                    </div>

                  </div>

                )}


                {/* =================================================
                    TABLE
                ================================================= */}

                <div className="payroll-table-wrapper">

                  <table className="payroll-table">

                    <thead>

                      <tr>

                        <th>
                          Pay Period
                        </th>

                        <th>
                          Employee
                        </th>

                        <th>
                          Gross Salary
                        </th>

                        <th>
                          Deductions
                        </th>

                        <th>
                          Net Salary
                        </th>

                        <th>
                          Status
                        </th>

                        <th>
                          Processed At
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {payrolls.length === 0 ? (

                        <tr>

                          <td
                            colSpan="7"
                            style={{
                              textAlign: "center",
                              padding: "35px"
                            }}
                          >

                            No payroll records found.

                          </td>

                        </tr>

                      ) : (

                        payrolls
                          .slice()
                          .reverse()
                          .map((payroll) => (

                            <tr
                              key={
                                payroll.id
                              }
                            >

                              <td>
                                {payroll.payPeriod || "—"}
                              </td>

                              <td>

                                <div>

                                  <strong>
                                    {payroll.employeeName}
                                  </strong>

                                  <small
                                    style={{
                                      display:
                                        "block"
                                    }}
                                  >
                                    {payroll.employeeCode}
                                  </small>

                                </div>

                              </td>

                              <td>
                                {formatMoney(
                                  payroll.grossSalary
                                )}
                              </td>

                              <td>
                                {formatMoney(
                                  payroll.totalDeductions
                                )}
                              </td>

                              <td>

                                <strong>
                                  {formatMoney(
                                    payroll.netSalary
                                  )}
                                </strong>

                              </td>

                              <td>

                                <span
                                  className={
                                    "payroll-status"
                                  }
                                >
                                  {payroll.status}
                                </span>

                              </td>

                              <td>
                                {payroll.processedAt
                                  ? new Date(
                                      payroll.processedAt
                                    ).toLocaleString(
                                      "en-IN"
                                    )
                                  : "—"}
                              </td>

                            </tr>

                          ))

                      )}

                    </tbody>

                  </table>

                </div>

              </section>

            </>

          )}

        </main>

      </main>

    </div>

  );

}

export default MyPayroll;