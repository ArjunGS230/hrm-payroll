import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/PayslipReport.css";

function PayslipReport() {
  const navigate = useNavigate();

  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchPayslips = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "https://hrm-payroll-backend.onrender.com/api/payslips",
        authConfig
      );

      const sorted = [...response.data].sort((a, b) =>
        b.payMonth.localeCompare(a.payMonth)
      );

      setPayslips(sorted);
    } catch (err) {
      console.error("Payslip report error:", err);

      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to load payslip report."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchPayslips();
  }, []);

  const formatMoney = (value) => {
    if (value === null || value === undefined) {
      return "₹0.00";
    }

    return `₹${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="payslip-report-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="payslip-report-header">
        <div>
          <span>REPORTS</span>

          <h1>Payslip Report</h1>

          <p>
            View generated employee payslips and
            payroll information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/reports")}
        >
          ← Back to Reports
        </button>
      </header>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="payslip-report-error">
          {error}
        </div>
      )}


      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="payslip-report-summary">

        <div>
          <span>Total Payslips</span>

          <strong>
            {payslips.length}
          </strong>
        </div>


        <div>
          <span>Total Gross</span>

          <strong>
            {formatMoney(
              payslips.reduce(
                (sum, item) =>
                  sum + Number(item.grossSalary || 0),
                0
              )
            )}
          </strong>
        </div>


        <div>
          <span>Total Deductions</span>

          <strong>
            {formatMoney(
              payslips.reduce(
                (sum, item) =>
                  sum +
                  Number(item.totalDeductions || 0),
                0
              )
            )}
          </strong>
        </div>


        <div>
          <span>Total Net</span>

          <strong>
            {formatMoney(
              payslips.reduce(
                (sum, item) =>
                  sum + Number(item.netSalary || 0),
                0
              )
            )}
          </strong>
        </div>

      </div>


      {/* =====================================================
          PAYSLIP CARD
      ===================================================== */}

      <section className="payslip-report-card">

        {/* CARD HEADER */}

        <div className="payslip-report-card-header">

          <div>
            <h2>Payslip Details</h2>

            <p>
              All generated employee payslips.
            </p>
          </div>


          <button
            type="button"
            onClick={fetchPayslips}
            disabled={loading}
          >
            ↻ Refresh
          </button>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="payslip-report-loading">
            Loading payslip report...
          </div>

        ) : (

          /* =================================================
             TABLE
          ================================================= */

          <div className="payslip-report-table-wrapper">

            <table className="payslip-report-table">

              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Pay Month</th>
                  <th>Gross Salary</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th>Status</th>
                </tr>
              </thead>


              <tbody>

                {payslips.length === 0 ? (

                  <tr>
                    <td colSpan="6">
                      No payslips generated yet.
                    </td>
                  </tr>

                ) : (

                  payslips.map((payslip) => (

                    <tr key={payslip.id}>

                      {/* EMPLOYEE */}

                      <td>
                        <strong>
                          {payslip.employeeName}
                        </strong>

                        <small>
                          {payslip.employeeCode}
                        </small>
                      </td>


                      {/* PAY MONTH */}

                      <td>
                        {payslip.payMonth}
                      </td>


                      {/* GROSS */}

                      <td>
                        {formatMoney(
                          payslip.grossSalary
                        )}
                      </td>


                      {/* DEDUCTIONS */}

                      <td>
                        {formatMoney(
                          payslip.totalDeductions
                        )}
                      </td>


                      {/* NET */}

                      <td className="payslip-report-net">
                        {formatMoney(
                          payslip.netSalary
                        )}
                      </td>


                      {/* STATUS */}

                      <td>
                        <span className="payslip-report-status">
                          {payslip.status}
                        </span>
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}

export default PayslipReport;
