import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/LeaveReport.css";

function LeaveReport() {
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // =====================================================
  // FETCH ALL EMPLOYEE LEAVES
  // =====================================================

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError("");

      // First get all employees
      const employeeResponse = await axios.get(
        "http://localhost:8090/api/employees",
        authConfig
      );

      const employees = employeeResponse.data;

      // Get leave records for every employee
      const leaveRequests = employees.map((employee) =>
        axios.get(
          `http://localhost:8090/api/leaves/employee/${employee.id}`,
          authConfig
        )
      );

      const responses = await Promise.all(leaveRequests);

      // Combine all employee leave records
      const allLeaves = responses.flatMap(
        (response) => response.data || []
      );

      // Latest leave first
      allLeaves.sort((a, b) => {
        const dateA = new Date(a.startDate || 0);
        const dateB = new Date(b.startDate || 0);

        return dateB - dateA;
      });

      setLeaves(allLeaves);

    } catch (err) {
      console.error("Leave report error:", err);

      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to load leave report."
        );
      }
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

    fetchLeaves();
  }, []);

  // =====================================================
  // LEAVE TYPE
  // =====================================================

  const getLeaveTypeName = (type) => {
    if (type === "CL") {
      return "Casual Leave";
    }

    if (type === "SL") {
      return "Sick Leave";
    }

    if (type === "EL") {
      return "Earned Leave";
    }

    return type || "-";
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    if (status === "APPROVED") {
      return "leave-report-status approved";
    }

    if (status === "REJECTED") {
      return "leave-report-status rejected";
    }

    return "leave-report-status pending";
  };

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalRequests = leaves.length;

  const approvedLeaves = leaves.filter(
    (leave) => leave.status === "APPROVED"
  ).length;

  const pendingLeaves = leaves.filter(
    (leave) => leave.status === "PENDING"
  ).length;

  const rejectedLeaves = leaves.filter(
    (leave) => leave.status === "REJECTED"
  ).length;

  const totalLeaveDays = leaves.reduce(
    (sum, leave) =>
      sum + Number(leave.numberOfDays || 0),
    0
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="leave-report-page">

      {/* HEADER */}

      <header className="leave-report-header">

        <div>
          <span>REPORTS</span>

          <h1>Leave Report</h1>

          <p>
            View employee leave applications,
            leave types, days and approval status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/reports")}
        >
          ← Back to Reports
        </button>

      </header>


      {/* ERROR */}

      {error && (
        <div className="leave-report-error">
          {error}
        </div>
      )}


      {/* SUMMARY */}

      <div className="leave-report-summary">

        <div className="leave-report-summary-card">
          <span>Total Requests</span>
          <strong>{totalRequests}</strong>
        </div>

        <div className="leave-report-summary-card">
          <span>Approved</span>
          <strong>{approvedLeaves}</strong>
        </div>

        <div className="leave-report-summary-card">
          <span>Pending</span>
          <strong>{pendingLeaves}</strong>
        </div>

        <div className="leave-report-summary-card">
          <span>Rejected</span>
          <strong>{rejectedLeaves}</strong>
        </div>

      </div>


      {/* TOTAL DAYS */}

      <div className="leave-report-total-days">
        <span>Total Leave Days</span>
        <strong>{totalLeaveDays}</strong>
      </div>


      {/* TABLE */}

      <section className="leave-report-card">

        <div className="leave-report-card-header">

          <div>
            <h2>Leave Details</h2>

            <p>
              All employee leave applications.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchLeaves}
            disabled={loading}
          >
            ↻ Refresh
          </button>

        </div>


        {loading ? (

          <div className="leave-report-loading">
            Loading leave report...
          </div>

        ) : (

          <div className="leave-report-table-wrapper">

            <table className="leave-report-table">

              <thead>

                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>

              </thead>


              <tbody>

                {leaves.length === 0 ? (

                  <tr>
                    <td
                      colSpan="7"
                      className="leave-report-empty"
                    >
                      No leave records found.
                    </td>
                  </tr>

                ) : (

                  leaves.map((leave) => (

                    <tr key={leave.id}>

                      <td>
                        <strong>
                          {leave.employeeName}
                        </strong>

                        <small>
                          Employee ID: {leave.employeeId}
                        </small>
                      </td>

                      <td>
                        {getLeaveTypeName(
                          leave.leaveType
                        )}
                      </td>

                      <td>
                        {leave.startDate || "-"}
                      </td>

                      <td>
                        {leave.endDate || "-"}
                      </td>

                      <td>
                        <strong>
                          {leave.numberOfDays || 0}
                        </strong>
                      </td>

                      <td className="leave-report-reason">
                        {leave.reason || "-"}
                      </td>

                      <td>
                        <span
                          className={getStatusClass(
                            leave.status
                          )}
                        >
                          {leave.status || "PENDING"}
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

export default LeaveReport;