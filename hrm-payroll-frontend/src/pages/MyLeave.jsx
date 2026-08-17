import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../styles/MyLeave.css";

function MyLeave() {

  const navigate = useNavigate();

  const token =
    localStorage.getItem("token");

  const username =
    localStorage.getItem("username") || "Employee";

  const email =
    localStorage.getItem("email") || "";

  const role =
    localStorage.getItem("role")?.toUpperCase() || "EMPLOYEE";


  // =====================================================
  // STATE
  // =====================================================

  const [employee, setEmployee] =
    useState(null);

  const [leaveBalance, setLeaveBalance] =
    useState(null);

  const [leaves, setLeaves] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  const [formData, setFormData] = useState({
    leaveType: "CL",
    startDate: "",
    endDate: "",
    reason: ""
  });


  // =====================================================
  // AUTH CONFIG
  // =====================================================

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };


  // =====================================================
  // LOAD EMPLOYEE
  // =====================================================

  const fetchEmployee = async () => {

    const response =
      await axios.get(
        "http://localhost:8090/api/employees",
        authConfig
      );

    const employeeList =
      response.data || [];


    // -----------------------------------------------------
    // FIRST TRY EMAIL
    // -----------------------------------------------------

    let currentEmployee =
      employeeList.find(
        (item) =>
          item.email &&
          email &&
          item.email.toLowerCase() ===
            email.toLowerCase()
      );


    // -----------------------------------------------------
    // FALLBACK TO USERNAME
    // -----------------------------------------------------

    if (!currentEmployee && username) {

      currentEmployee =
        employeeList.find(
          (item) =>
            item.name &&
            item.name.toLowerCase() ===
              username.toLowerCase()
        );

    }


    if (!currentEmployee) {

      throw new Error(
        "Employee profile not found."
      );

    }


    setEmployee(currentEmployee);

    return currentEmployee;

  };


  // =====================================================
  // LOAD LEAVE BALANCE
  // =====================================================

  const fetchLeaveBalance = async (
    employeeId
  ) => {

    const response =
      await axios.get(
        `http://localhost:8090/api/leaves/balance/${employeeId}`,
        authConfig
      );

    setLeaveBalance(
      response.data
    );

  };


  // =====================================================
  // LOAD MY LEAVES
  // =====================================================

  const fetchMyLeaves = async (
    employeeId
  ) => {

    const response =
      await axios.get(
        `http://localhost:8090/api/leaves/employee/${employeeId}`,
        authConfig
      );

    setLeaves(
      response.data || []
    );

  };


  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadData = async () => {

    try {

      setLoading(true);
      setError("");

      // -----------------------------------------------------
      // HR / ADMIN SHOULD NOT USE MY LEAVE
      // -----------------------------------------------------

      if (role === "HR" || role === "ADMIN") {

        navigate("/leave-management");

        return;

      }

      // -----------------------------------------------------
      // EMPLOYEE
      // -----------------------------------------------------

      const currentEmployee =
        await fetchEmployee();

      await Promise.all([

        fetchLeaveBalance(
          currentEmployee.id
        ),

        fetchMyLeaves(
          currentEmployee.id
        )

      ]);

    } catch (err) {

      console.error(
        "My leave error:",
        err
      );

      if (
        err.response?.status === 401
      ) {

        localStorage.clear();

        navigate("/login");

      } else {

        setError(
          err.response?.data?.message ||
          err.message ||
          "Unable to load your leave information."
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
  // HANDLE FORM CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setFormData(
      (previous) => ({
        ...previous,
        [name]: value
      })
    );


    setError("");
    setSuccess("");

  };


  // =====================================================
  // OPEN FORM
  // =====================================================

  const openForm = () => {

    setFormData({
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


    if (!employee) {

      setError(
        "Employee profile not found."
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


    if (
      formData.endDate <
      formData.startDate
    ) {

      setError(
        "End date cannot be before start date."
      );

      return;

    }


    if (!formData.reason.trim()) {

      setError(
        "Please enter a reason."
      );

      return;

    }


    try {

      setSaving(true);


      const payload = {

        employeeId:
          employee.id,

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
        payload,
        authConfig
      );


      setSuccess(
        "Leave applied successfully."
      );


      setShowForm(false);


      setFormData({
        leaveType: "CL",
        startDate: "",
        endDate: "",
        reason: ""
      });


      await loadData();


    } catch (err) {

  console.error(
    "Apply leave error:",
    err
  );

  console.error(
    "Backend response:",
    err.response?.data
  );

  console.error(
    "Backend status:",
    err.response?.status
  );

  const backendMessage =
    err.response?.data?.message ||
    err.response?.data?.error ||
    (
      typeof err.response?.data === "string"
        ? err.response.data
        : null
    );

  setError(
    backendMessage ||
    "Unable to apply leave."
  );

} finally {

  setSaving(false);

}
  };


  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (
    status
  ) => {

    const value =
      status?.toUpperCase();


    if (value === "APPROVED") {
      return "approved";
    }

    if (value === "REJECTED") {
      return "rejected";
    }

    return "pending";

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="leave-page">

      <main className="leave-main">


        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="leave-topbar">

          <div>

            <div className="leave-eyebrow">
              EMPLOYEE WORKSPACE
            </div>

            <h1>
              My Leave
            </h1>

            <p>
              View your leave balance and
              manage your leave requests.
            </p>

          </div>


          <button
            type="button"
            className="leave-apply-button"
            onClick={openForm}
          >
            + Apply Leave
          </button>

        </header>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="leave-alert error">
            {error}
          </div>

        )}


        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (

          <div className="leave-alert success">
            ✓ {success}
          </div>

        )}


        {/* =================================================
            EMPLOYEE INFO
        ================================================= */}

        {employee && (

          <section className="leave-employee-info">

            <div>

              <span>
                EMPLOYEE
              </span>

              <strong>
                {employee.name}
              </strong>

            </div>


            <div>

              <span>
                EMPLOYEE ID
              </span>

              <strong>
                {employee.employeeCode}
              </strong>

            </div>


            <div>

              <span>
                DEPARTMENT
              </span>

              <strong>
                {employee.department}
              </strong>

            </div>


            <div>

              <span>
                DESIGNATION
              </span>

              <strong>
                {employee.designation}
              </strong>

            </div>

          </section>

        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="leave-loading">
            Loading your leave information...
          </div>

        ) : (

          <>


            {/* =================================================
                LEAVE BALANCE
            ================================================= */}

            <section className="leave-balance-section">

              <div className="leave-card-heading">

                <div>

                  <div className="leave-eyebrow">
                    LEAVE BALANCE
                  </div>

                  <h2>
                    My Leave Balance
                  </h2>

                  <p>
                    Your available leave days.
                  </p>

                </div>

              </div>


              <div className="leave-balance-grid">


                <div className="leave-balance-card">

                  <span>
                    CASUAL LEAVE
                  </span>

                  <strong>
                    {leaveBalance?.casualLeave ?? 0}
                  </strong>

                  <small>
                    days available
                  </small>

                </div>


                <div className="leave-balance-card">

                  <span>
                    SICK LEAVE
                  </span>

                  <strong>
                    {leaveBalance?.sickLeave ?? 0}
                  </strong>

                  <small>
                    days available
                  </small>

                </div>


                <div className="leave-balance-card">

                  <span>
                    EARNED LEAVE
                  </span>

                  <strong>
                    {leaveBalance?.earnedLeave ?? 0}
                  </strong>

                  <small>
                    days available
                  </small>

                </div>

              </div>

            </section>


            {/* =================================================
                MY LEAVE REQUESTS
            ================================================= */}

            <section className="leave-history-section">

              <div className="leave-card-heading">

                <div>

                  <div className="leave-eyebrow">
                    LEAVE HISTORY
                  </div>

                  <h2>
                    My Leave Requests
                  </h2>

                  <p>
                    Track your submitted leave requests.
                  </p>

                </div>

                <div className="leave-pending-count">
                  {leaves.length}
                </div>

              </div>


              <div className="leave-table-wrapper">

                <table className="leave-table">

                  <thead>

                    <tr>

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

                    </tr>

                  </thead>


                  <tbody>

                    {leaves.length === 0 ? (

                      <tr>

                        <td
                          colSpan="6"
                          className="leave-empty-cell"
                        >
                          No leave requests found.
                        </td>

                      </tr>

                    ) : (

                      leaves
                        .slice()
                        .reverse()
                        .map((leave) => (

                          <tr
                            key={leave.id}
                          >

                            <td>

                              <strong>
                                {leave.leaveType}
                              </strong>

                            </td>

                            <td>
                              {leave.startDate}
                            </td>

                            <td>
                              {leave.endDate}
                            </td>

                            <td>

                              {leave.numberOfDays}

                            </td>

                            <td>

                              {leave.reason}

                            </td>

                            <td>

                              <span
                                className={`leave-status ${getStatusClass(
                                  leave.status
                                )}`}
                              >

                                {leave.status}

                              </span>

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


        {/* =================================================
            APPLY LEAVE MODAL
        ================================================= */}

        {showForm && (

          <div className="leave-modal-overlay">

            <div className="leave-modal">


              <div className="leave-modal-header">

                <div>

                  <div className="leave-eyebrow">
                    LEAVE REQUEST
                  </div>

                  <h2>
                    Apply for Leave
                  </h2>

                </div>


                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                >
                  ×
                </button>

              </div>


              <form
                onSubmit={
                  handleApplyLeave
                }
              >


                {/* LEAVE TYPE */}

                <div className="leave-form-group">

                  <label>
                    Leave Type
                  </label>

                  <select
                    name="leaveType"
                    value={
                      formData.leaveType
                    }
                    onChange={
                      handleChange
                    }
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

                <div className="leave-form-row">

                  <div className="leave-form-group">

                    <label>
                      Start Date
                    </label>

                    <input
                      type="date"
                      name="startDate"
                      value={
                        formData.startDate
                      }
                      onChange={
                        handleChange
                      }
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
                      value={
                        formData.endDate
                      }
                      onChange={
                        handleChange
                      }
                      disabled={saving}
                    />

                  </div>

                </div>


                {/* REASON */}

                <div className="leave-form-group">

                  <label>
                    Reason
                  </label>

                  <textarea
                    name="reason"
                    value={
                      formData.reason
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter reason for leave"
                    rows="4"
                    disabled={saving}
                  />

                </div>


                {/* BUTTONS */}

                <div className="leave-modal-actions">

                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                  >

                    {saving
                      ? "Applying..."
                      : "Apply Leave"}

                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </main>

    </div>

  );

}

export default MyLeave;