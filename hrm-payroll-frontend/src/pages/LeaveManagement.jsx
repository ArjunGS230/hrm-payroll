import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/LeaveManagement.css";

function LeaveManagement() {

  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [processingLeaveId, setProcessingLeaveId] =
    useState(null);

  const [formData, setFormData] = useState({
    employeeId: "",
    leaveType: "CL",
    startDate: "",
    endDate: "",
    reason: ""
  });

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };


  // =====================================================
  // FETCH EMPLOYEES
  // =====================================================

  const fetchEmployees = async () => {

    const response = await axios.get(
      "http://localhost:8090/api/employees",
      authConfig
    );

    return response.data.filter(
      (employee) => employee.active
    );
  };


  // =====================================================
  // FETCH LEAVE BALANCES
  // =====================================================

  const fetchLeaveBalances = async (employeeList) => {

    const balanceRequests =
      employeeList.map(
        (employee) =>
          axios.get(
            `http://localhost:8090/api/leaves/balance/${employee.id}`,
            authConfig
          )
      );

    const responses =
      await Promise.all(balanceRequests);

    setLeaveBalances(
      responses.map(
        (response) => response.data
      )
    );
  };


  // =====================================================
  // FETCH PENDING LEAVES
  // =====================================================

  const fetchPendingLeaves = async () => {

    const response = await axios.get(
      "http://localhost:8090/api/leaves/pending",
      authConfig
    );

    setPendingLeaves(response.data);
  };


  // =====================================================
  // LOAD ALL DATA
  // =====================================================

  const loadData = async () => {

    try {

      setLoading(true);
      setError("");

      const employeeList =
        await fetchEmployees();

      setEmployees(employeeList);

      await Promise.all([
        fetchLeaveBalances(employeeList),
        fetchPendingLeaves()
      ]);

    } catch (err) {

      console.error(
        "Leave management error:",
        err
      );

      if (err.response?.status === 401) {

        localStorage.clear();

        navigate("/login");

      } else if (err.response?.status === 403) {

        setError(
          "You do not have permission to access leave management."
        );

      } else {

        setError(
          "Unable to load leave management data."
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

    loadData();

  }, []);


  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    setError("");
    setSuccess("");
  };


  // =====================================================
  // OPEN FORM
  // =====================================================

  const openForm = () => {

    setFormData({
      employeeId: "",
      leaveType: "CL",
      startDate: "",
      endDate: "",
      reason: ""
    });

    setError("");
    setSuccess("");

    setShowForm(true);
  };


  // =====================================================
  // CLOSE FORM
  // =====================================================

  const closeForm = () => {

    if (saving) {
      return;
    }

    setShowForm(false);

    setError("");
    setSuccess("");
  };


  // =====================================================
  // APPLY LEAVE
  // =====================================================

  const handleApplyLeave = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    if (!formData.employeeId) {

      setError(
        "Please select an employee."
      );

      return;
    }


    if (!formData.startDate) {

      setError(
        "Please select a start date."
      );

      return;
    }


    if (!formData.endDate) {

      setError(
        "Please select an end date."
      );

      return;
    }


    if (!formData.reason.trim()) {

      setError(
        "Please enter a reason."
      );

      return;
    }


    if (
      formData.endDate <
      formData.startDate
    ) {

      setError(
        "End date cannot be before start date."
      );

      return;
    }


    try {

      setSaving(true);


      const requestData = {

        employeeId:
          Number(formData.employeeId),

        leaveType:
          formData.leaveType,

        startDate:
          formData.startDate,

        endDate:
          formData.endDate,

        reason:
          formData.reason.trim()
      };


      await axios.post(
        "http://localhost:8090/api/leaves",
        requestData,
        authConfig
      );


      setSuccess(
        "Leave application submitted successfully."
      );


      await loadData();


      setTimeout(() => {

        setShowForm(false);

        setSuccess("");

      }, 900);


    } catch (err) {

      console.error(
        "Apply leave error:",
        err
      );


      if (err.response?.status === 401) {

        localStorage.clear();

        navigate("/login");

      } else if (
        err.response?.data?.message
      ) {

        setError(
          err.response.data.message
        );

      } else if (
        typeof err.response?.data === "string"
      ) {

        setError(
          err.response.data
        );

      } else {

        setError(
          "Unable to apply leave."
        );
      }

    } finally {

      setSaving(false);

    }
  };


  // =====================================================
  // APPROVE LEAVE
  // =====================================================

  const handleApprove = async (leaveId) => {

    try {

      setProcessingLeaveId(leaveId);
      setError("");
      setSuccess("");


      await axios.put(
        `http://localhost:8090/api/leaves/${leaveId}/approve`,
        {},
        authConfig
      );


      setSuccess(
        "Leave approved successfully."
      );


      await loadData();


    } catch (err) {

      console.error(
        "Approve leave error:",
        err
      );


      if (
        err.response?.data?.message
      ) {

        setError(
          err.response.data.message
        );

      } else {

        setError(
          "Unable to approve leave."
        );
      }

    } finally {

      setProcessingLeaveId(null);

    }
  };


  // =====================================================
  // REJECT LEAVE
  // =====================================================

  const handleReject = async (leaveId) => {

    try {

      setProcessingLeaveId(leaveId);
      setError("");
      setSuccess("");


      await axios.put(
        `http://localhost:8090/api/leaves/${leaveId}/reject`,
        {},
        authConfig
      );


      setSuccess(
        "Leave rejected successfully."
      );


      await loadData();


    } catch (err) {

      console.error(
        "Reject leave error:",
        err
      );


      if (
        err.response?.data?.message
      ) {

        setError(
          err.response.data.message
        );

      } else {

        setError(
          "Unable to reject leave."
        );
      }

    } finally {

      setProcessingLeaveId(null);

    }
  };
  // =====================================================
  // LEAVE TYPE NAME
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

    return type;
  };


  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {

    if (status === "APPROVED") {
      return "leave-status approved";
    }

    if (status === "REJECTED") {
      return "leave-status rejected";
    }

    return "leave-status pending";
  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="leave-page">

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="leave-main">


        {/* TOP BAR */}

        <header className="leave-topbar">

          <div>

            <div className="leave-eyebrow">
              HR WORKSPACE
            </div>

            <h1>
              Leave Management
            </h1>

            <p>
              Manage employee leave balances and requests
            </p>

          </div>

        </header>


        {/* CONTENT */}

        <main className="leave-content">


          {/* HEADER */}

          <div className="leave-section-header">

            <div>

              <div className="leave-eyebrow">
                LEAVE
              </div>

              <h2>
                Employee Leave Management
              </h2>

              <p>
                View balances and manage pending leave requests.
              </p>

            </div>


            <button
              type="button"
              className="leave-add-button"
              onClick={openForm}
            >
              + Apply Leave
            </button>

          </div>


          {/* ERROR */}

          {error && !showForm && (

            <div className="leave-error">
              {error}
            </div>

          )}


          {/* SUCCESS */}

          {success && !showForm && (

            <div className="leave-success">
              {success}
            </div>

          )}


          {/* LOADING */}

          {loading && (

            <div className="leave-loading">
              Loading leave information...
            </div>

          )}


          {!loading && (

            <>


              {/* =================================================
                  BALANCE SECTION
              ================================================= */}

              <section className="leave-balance-section">

                <div className="leave-card-heading">

                  <div>

                    <h3>
                      Leave Balances
                    </h3>

                    <p>
                      Available leave for active employees.
                    </p>

                  </div>

                </div>


                <div className="leave-balance-table-wrapper">

                  <table className="leave-balance-table">

                    <thead>

                      <tr>

                        <th>
                          Employee
                        </th>

                        <th>
                          Casual Leave
                        </th>

                        <th>
                          Sick Leave
                        </th>

                        <th>
                          Earned Leave
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {leaveBalances.length === 0 ? (

                        <tr>

                          <td
                            colSpan="4"
                            className="leave-empty-cell"
                          >
                            No leave balance information found.
                          </td>

                        </tr>

                      ) : (

                        leaveBalances.map(
                          (balance) => {

                            const employee =
                              employees.find(
                                (item) =>
                                  item.id ===
                                  balance.employeeId
                              );

                            return (

                              <tr
                                key={
                                  balance.employeeId
                                }
                              >

                                <td>

                                  <div className="leave-employee">

                                    <div className="leave-employee-code">
                                      {employee?.employeeCode ||
                                        `EMP-${balance.employeeId}`}
                                    </div>

                                    <div className="leave-employee-name">
                                      {balance.employeeName}
                                    </div>

                                  </div>

                                </td>


                                <td>
                                  <strong>
                                    {balance.casualLeave}
                                  </strong>
                                  {" "}days
                                </td>


                                <td>
                                  <strong>
                                    {balance.sickLeave}
                                  </strong>
                                  {" "}days
                                </td>


                                <td>
                                  <strong>
                                    {balance.earnedLeave}
                                  </strong>
                                  {" "}days
                                </td>

                              </tr>

                            );

                          }
                        )

                      )}

                    </tbody>

                  </table>

                </div>

              </section>


              {/* =================================================
                  PENDING LEAVES
              ================================================= */}

              <section className="leave-pending-section">

                <div className="leave-card-heading">

                  <div>

                    <h3>
                      Pending Leave Requests
                    </h3>

                    <p>
                      Review and approve or reject employee leave requests.
                    </p>

                  </div>


                  <div className="leave-pending-count">
                    {pendingLeaves.length}
                  </div>

                </div>


                <div className="leave-pending-table-wrapper">

                  <table className="leave-pending-table">

                    <thead>

                      <tr>

                        <th>
                          Employee
                        </th>

                        <th>
                          Leave Type
                        </th>

                        <th>
                          Start Date
                        </th>

                        <th>
                          End Date
                        </th>

                        <th>
                          Days
                        </th>

                        <th>
                          Reason
                        </th>

                        <th>
                          Status
                        </th>

                        <th>
                          Action
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {pendingLeaves.length === 0 ? (

                        <tr>

                          <td
                            colSpan="8"
                            className="leave-empty-cell"
                          >
                            No pending leave requests.
                          </td>

                        </tr>

                      ) : (

                        pendingLeaves.map(
                          (leave) => (

                            <tr
                              key={leave.id}
                            >

                              <td>

                                <div className="leave-employee">

                                  <div className="leave-employee-code">

                                    {employees.find(
                                      (employee) =>
                                        employee.id ===
                                        leave.employeeId
                                    )?.employeeCode ||
                                      `EMP-${leave.employeeId}`}

                                  </div>

                                  <div className="leave-employee-name">
                                    {leave.employeeName}
                                  </div>

                                </div>

                              </td>


                              <td>
                                {getLeaveTypeName(
                                  leave.leaveType
                                )}
                              </td>


                              <td>
                                {leave.startDate}
                              </td>


                              <td>
                                {leave.endDate}
                              </td>


                              <td>
                                <strong>
                                  {leave.numberOfDays}
                                </strong>
                              </td>


                              <td className="leave-reason">
                                {leave.reason}
                              </td>


                              <td>

                                <span
                                  className={
                                    getStatusClass(
                                      leave.status
                                    )
                                  }
                                >
                                  {leave.status}
                                </span>

                              </td>


                              <td>

                                <div className="leave-actions">

                                  <button
                                    type="button"
                                    className="leave-approve-button"
                                    disabled={
                                      processingLeaveId ===
                                      leave.id
                                    }
                                    onClick={() =>
                                      handleApprove(
                                        leave.id
                                      )
                                    }
                                  >
                                    {processingLeaveId ===
                                    leave.id
                                      ? "..."
                                      : "Approve"}
                                  </button>


                                  <button
                                    type="button"
                                    className="leave-reject-button"
                                    disabled={
                                      processingLeaveId ===
                                      leave.id
                                    }
                                    onClick={() =>
                                      handleReject(
                                        leave.id
                                      )
                                    }
                                  >
                                    Reject
                                  </button>

                                </div>

                              </td>

                            </tr>

                          )
                        )

                      )}

                    </tbody>

                  </table>

                </div>

              </section>

            </>

          )}

        </main>

      </div>


      {/* =================================================
          APPLY LEAVE MODAL
      ================================================= */}

      {showForm && (

        <div className="leave-modal-overlay">

          <div className="leave-modal">


            {/* HEADER */}

            <div className="leave-modal-header">

              <div>

                <div className="leave-eyebrow">
                  LEAVE
                </div>

                <h2>
                  Apply Leave
                </h2>

                <p>
                  Submit a leave request for an employee.
                </p>

              </div>


              <button
                type="button"
                className="leave-modal-close"
                onClick={closeForm}
                disabled={saving}
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <form
              className="leave-form"
              onSubmit={handleApplyLeave}
            >


              {/* EMPLOYEE */}

              <div className="leave-form-group leave-form-full">

                <label>
                  Employee
                </label>

                <select
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                  disabled={saving}
                >

                  <option value="">
                    Select employee
                  </option>


                  {employees.map(
                    (employee) => (

                      <option
                        key={employee.id}
                        value={employee.id}
                      >

                        {employee.employeeCode}
                        {" — "}
                        {employee.name}

                      </option>

                    )
                  )}

                </select>

              </div>


              {/* LEAVE TYPE */}

              <div className="leave-form-group">

                <label>
                  Leave Type
                </label>

                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  required
                  disabled={saving}
                >

                  <option value="CL">
                    Casual Leave
                  </option>

                  <option value="SL">
                    Sick Leave
                  </option>

                  <option value="EL">
                    Earned Leave
                  </option>

                </select>

              </div>


              {/* START DATE */}

              <div className="leave-form-group">

                <label>
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />

              </div>


              {/* END DATE */}

              <div className="leave-form-group">

                <label>
                  End Date
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />

              </div>


              {/* REASON */}

              <div className="leave-form-group leave-form-full">

                <label>
                  Reason
                </label>

                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Enter reason for leave"
                  rows="4"
                  required
                  disabled={saving}
                />

              </div>


              {/* FORM ERROR */}

              {error && (

                <div className="leave-form-error">
                  {error}
                </div>

              )}


              {/* FORM SUCCESS */}

              {success && (

                <div className="leave-form-success">
                  {success}
                </div>

              )}


              {/* ACTIONS */}

              <div className="leave-form-actions">

                <button
                  type="button"
                  className="leave-cancel-button"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="leave-save-button"
                  disabled={saving}
                >

                  {saving
                    ? "Submitting..."
                    : "Apply Leave"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default LeaveManagement;