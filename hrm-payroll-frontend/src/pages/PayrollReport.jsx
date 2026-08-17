import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/PayrollReport.css";

function PayrollReport() {
  const navigate = useNavigate();

  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:8090/api/payrolls",
        authConfig
      );

      const sorted = [...response.data].sort((a, b) =>
        b.payPeriod.localeCompare(a.payPeriod)
      );

      setPayrolls(sorted);

    } catch (err) {
      console.error("Payroll report error:", err);

      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to load payroll report."
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

    fetchPayrolls();
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

  const totalGross = payrolls.reduce(
    (sum, item) =>
      sum + Number(item.grossSalary || 0),
    0
  );

  const totalDeductions = payrolls.reduce(
    (sum, item) =>
      sum + Number(item.totalDeductions || 0),
    0
  );

  const totalNet = payrolls.reduce(
    (sum, item) =>
      sum + Number(item.netSalary || 0),
    0
  );

  return (
    <div className="payroll-report-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="payroll-report-header">

        <div>

          <span>REPORTS</span>

          <h1>Payroll Report</h1>

          <p>
            View gross salary, deductions and net salary
            for processed payroll records.
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
        <div className="payroll-report-error">
          {error}
        </div>
      )}


      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="payroll-report-summary">

        <div>
          <span>Total Payrolls</span>

          <strong>
            {payrolls.length}
          </strong>
        </div>


        <div>
          <span>Total Gross</span>

          <strong>
            {formatMoney(totalGross)}
          </strong>
        </div>


        <div>
          <span>Total Deductions</span>

          <strong>
            {formatMoney(totalDeductions)}
          </strong>
        </div>


        <div>
          <span>Total Net</span>

          <strong>
            {formatMoney(totalNet)}
          </strong>
        </div>

      </div>


      {/* =====================================================
          PAYROLL CARD
      ===================================================== */}

      <section className="payroll-report-card">

        {/* CARD HEADER */}

        <div className="payroll-report-card-header">

          <div>

            <h2>Payroll Details</h2>

            <p>
              Latest processed payroll records.
            </p>

          </div>


          <button
            type="button"
            onClick={fetchPayrolls}
            disabled={loading}
          >
            ↻ Refresh
          </button>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="payroll-report-loading">
            Loading payroll report...
          </div>

        ) : (

          /* =================================================
             TABLE
          ================================================= */

          <div className="payroll-report-table-wrapper">

            <table className="payroll-report-table">

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

                {payrolls.length === 0 ? (

                  <tr>
                    <td colSpan="6">
                      No payroll records found.
                    </td>
                  </tr>

                ) : (

                  payrolls.map((payroll) => (

                    <tr key={payroll.id}>

                      {/* EMPLOYEE */}

                      <td>

                        <strong>
                          {payroll.employeeName}
                        </strong>

                        <small>
                          {payroll.employeeCode}
                        </small>

                      </td>


                      {/* PAY MONTH */}

                      <td>
                        {payroll.payPeriod}
                      </td>


                      {/* GROSS */}

                      <td>
                        {formatMoney(
                          payroll.grossSalary
                        )}
                      </td>


                      {/* DEDUCTIONS */}

                      <td>
                        {formatMoney(
                          payroll.totalDeductions
                        )}
                      </td>


                      {/* NET */}

                      <td className="payroll-report-net">
                        {formatMoney(
                          payroll.netSalary
                        )}
                      </td>


                      {/* STATUS */}

                      <td>

                        <span className="payroll-report-status">
                          {payroll.status}
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

export default PayrollReport;