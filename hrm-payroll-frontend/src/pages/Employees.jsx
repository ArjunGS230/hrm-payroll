import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../styles/Employees.css";

const API_URL = "http://localhost:8090/api/employees";

function Employees() {

  /* =====================================================
     STATE
  ===================================================== */

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");


  /* =====================================================
     ADD / EDIT MODAL
  ===================================================== */

  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);


  /* =====================================================
     VIEW MODAL
  ===================================================== */

  const [viewEmployee, setViewEmployee] = useState(null);


  /* =====================================================
     FORM
  ===================================================== */

  const emptyForm = {
    employeeCode: "",
    name: "",
    email: "",
    department: "",
    designation: "",
    joiningDate: "",
  };

  const [formData, setFormData] = useState(emptyForm);


  /* =====================================================
     AXIOS CONFIG
  ===================================================== */

  const getConfig = () => {

    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };


  /* =====================================================
     SORT EMPLOYEES BY EMPLOYEE CODE
     
     HRMEMP001
     HRMEMP002
     HRMEMP003
     HRMEMP004
     ...
  ===================================================== */

  const sortEmployeesByCode = (employeeList) => {

    return [...employeeList].sort(
      (a, b) => {

        const codeA =
          a?.employeeCode || "";

        const codeB =
          b?.employeeCode || "";

        return codeA.localeCompare(
          codeB,
          undefined,
          {
            numeric: true,
            sensitivity: "base",
          }
        );
      }
    );
  };


  /* =====================================================
     LOAD EMPLOYEES
  ===================================================== */

  const fetchEmployees = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await axios.get(
        API_URL,
        getConfig()
      );


      /* -------------------------------------------------
         SORT BY EMPLOYEE CODE ASCENDING
      ------------------------------------------------- */

      const employeeData =
        Array.isArray(response.data)
          ? response.data
          : [];


      const sortedEmployees =
        sortEmployeesByCode(
          employeeData
        );


      setEmployees(
        sortedEmployees
      );


    } catch (err) {

      console.error(
        "Employee fetch error:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {

        setError(
          "Your session has expired. Please sign in again."
        );

      } else {

        setError(
          err.response?.data?.message ||
          "Unable to load employees."
        );
      }

    } finally {

      setLoading(false);

    }
  };


  /* =====================================================
     LOAD ON PAGE OPEN
  ===================================================== */

  useEffect(() => {

    fetchEmployees();

  }, []);


  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };


  /* =====================================================
     OPEN ADD MODAL
  ===================================================== */

  const openAddModal = () => {

    setEditingEmployee(null);

    setFormData(emptyForm);

    setError("");
    setSuccess("");

    setShowModal(true);
  };


  /* =====================================================
     OPEN EDIT MODAL
  ===================================================== */

  const openEditModal = (employee) => {

    setEditingEmployee(employee);

    setFormData({
      employeeCode:
        employee.employeeCode || "",

      name:
        employee.name || "",

      email:
        employee.email || "",

      department:
        employee.department || "",

      designation:
        employee.designation || "",

      joiningDate:
        employee.joiningDate || "",
    });

    setError("");
    setSuccess("");

    setShowModal(true);
  };


  /* =====================================================
     CLOSE MODAL
  ===================================================== */

  const closeModal = () => {

    if (submitting) {
      return;
    }

    setShowModal(false);
    setEditingEmployee(null);
    setFormData(emptyForm);

    setError("");
  };


  /* =====================================================
     CREATE / UPDATE EMPLOYEE
  ===================================================== */

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    /* -------------------------------------------------
       FRONTEND VALIDATION
    ------------------------------------------------- */

    if (
      !formData.employeeCode.trim() ||
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.department.trim() ||
      !formData.designation.trim() ||
      !formData.joiningDate
    ) {

      setError(
        "Please fill in all required fields."
      );

      return;
    }


    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
      !emailPattern.test(
        formData.email.trim()
      )
    ) {

      setError(
        "Please enter a valid email address."
      );

      return;
    }


    try {

      setSubmitting(true);


      const payload = {

        employeeCode:
          formData.employeeCode.trim(),

        name:
          formData.name.trim(),

        email:
          formData.email.trim(),

        department:
          formData.department.trim(),

        designation:
          formData.designation.trim(),

        joiningDate:
          formData.joiningDate,
      };


      let response;


      /* -------------------------------------------------
         UPDATE
      ------------------------------------------------- */

      if (editingEmployee) {

        response = await axios.put(
          `${API_URL}/${editingEmployee.id}`,
          payload,
          getConfig()
        );

      }


      /* -------------------------------------------------
         CREATE
      ------------------------------------------------- */

      else {

        response = await axios.post(
          API_URL,
          payload,
          getConfig()
        );
      }


      const updatedEmployee =
        response.data;


      /* -------------------------------------------------
         UPDATE LOCAL LIST
         
         ALWAYS SORT AFTER UPDATE
      ------------------------------------------------- */

      if (editingEmployee) {

        setEmployees((previous) => {

          const updatedList =
            previous.map((employee) =>
              employee.id === editingEmployee.id
                ? updatedEmployee
                : employee
            );

          return sortEmployeesByCode(
            updatedList
          );
        });


        setSuccess(
          "Employee updated successfully."
        );

      }


      /* -------------------------------------------------
         CREATE
         
         ALWAYS SORT AFTER ADD
      ------------------------------------------------- */

      else {

        setEmployees((previous) => {

          const updatedList = [
            ...previous,
            updatedEmployee,
          ];

          return sortEmployeesByCode(
            updatedList
          );
        });


        setSuccess(
          "Employee added successfully."
        );
      }


      /* -------------------------------------------------
         CLOSE AFTER SHORT DELAY
      ------------------------------------------------- */

      setTimeout(() => {

        setShowModal(false);
        setEditingEmployee(null);
        setFormData(emptyForm);
        setSuccess("");

      }, 900);

    } catch (err) {

      console.error(
        "Employee save error:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {

        setError(
          "You are not authorized to perform this action."
        );

      } else {

        setError(
          err.response?.data?.message ||
          "Unable to save employee."
        );
      }

    } finally {

      setSubmitting(false);

    }
  };


  /* =====================================================
     DEACTIVATE EMPLOYEE
  ===================================================== */

  const handleDeactivate = async (employee) => {

    const confirmed =
      window.confirm(
        `Deactivate ${employee.name}?`
      );

    if (!confirmed) {
      return;
    }


    try {

      setError("");
      setSuccess("");

      await axios.delete(
        `${API_URL}/${employee.id}`,
        getConfig()
      );


      setEmployees((previous) =>
        sortEmployeesByCode(
          previous.map((item) =>
            item.id === employee.id
              ? {
                  ...item,
                  active: false,
                  status: "APPROVED",
                }
              : item
          )
        )
      );


      setSuccess(
        `${employee.name} has been deactivated.`
      );


      setTimeout(() => {
        setSuccess("");
      }, 2500);

    } catch (err) {

      console.error(
        "Employee deactivate error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to deactivate employee."
      );
    }
  };


  /* =====================================================
     REACTIVATE EMPLOYEE
  ===================================================== */

  const handleReactivate = async (employee) => {

    const confirmed =
      window.confirm(
        `Reactivate ${employee.name}?`
      );

    if (!confirmed) {
      return;
    }


    try {

      setError("");
      setSuccess("");

      const response = await axios.put(
        `${API_URL}/${employee.id}/reactivate`,
        {},
        getConfig()
      );


      const updatedEmployee =
        response.data;


      setEmployees((previous) => {

        const updatedList =
          previous.map((item) =>
            item.id === employee.id
              ? updatedEmployee
              : item
          );

        return sortEmployeesByCode(
          updatedList
        );
      });


      setSuccess(
        `${employee.name} has been reactivated.`
      );


      setTimeout(() => {
        setSuccess("");
      }, 2500);

    } catch (err) {

      console.error(
        "Employee reactivate error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to reactivate employee."
      );
    }
  };


  /* =====================================================
     APPROVE EMPLOYEE
  ===================================================== */

  const handleApprove = async (employee) => {

    // -------------------------------------------------
    // PENDING EMPLOYEES MUST HAVE HR DETAILS
    // -------------------------------------------------

    if (employee.status === "PENDING") {

      const missingDetails =
        !employee.department?.trim() ||
        employee.department.trim().toLowerCase() === "not assigned" ||
        !employee.designation?.trim() ||
        employee.designation.trim().toLowerCase() === "not assigned" ||
        !employee.joiningDate;

      if (missingDetails) {

        setError(
          "Please edit the employee and provide department, designation and joining date before approval."
        );

        setSuccess("");

        openEditModal(employee);

        return;
      }
    }


    const confirmed =
      window.confirm(
        `Approve ${employee.name}'s employee access request?`
      );

    if (!confirmed) {
      return;
    }


    try {

      setError("");
      setSuccess("");

      const response = await axios.put(
        `${API_URL}/${employee.id}/approve`,
        {},
        getConfig()
      );


      const approvedEmployee =
        response.data;


      setEmployees((previous) => {

        const updatedList =
          previous.map((item) =>
            item.id === employee.id
              ? approvedEmployee
              : item
          );

        return sortEmployeesByCode(
          updatedList
        );
      });


      setSuccess(
        `${employee.name} has been approved successfully.`
      );


      setTimeout(() => {
        setSuccess("");
      }, 2500);

    } catch (err) {

      console.error(
        "Employee approval error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to approve employee."
      );
    }
  };


  /* =====================================================
     REJECT EMPLOYEE
  ===================================================== */

  const handleReject = async (employee) => {

    const confirmed =
      window.confirm(
        `Reject ${employee.name}'s employee access request?`
      );

    if (!confirmed) {
      return;
    }


    try {

      setError("");
      setSuccess("");

      const response = await axios.put(
        `${API_URL}/${employee.id}/reject`,
        {},
        getConfig()
      );


      const rejectedEmployee =
        response.data;


      setEmployees((previous) => {

        const updatedList =
          previous.map((item) =>
            item.id === employee.id
              ? rejectedEmployee
              : item
          );

        return sortEmployeesByCode(
          updatedList
        );
      });


      setSuccess(
        `${employee.name}'s access request has been rejected.`
      );


      setTimeout(() => {
        setSuccess("");
      }, 2500);

    } catch (err) {

      console.error(
        "Employee rejection error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to reject employee."
      );
    }
  };


  /* =====================================================
     SEARCH + FILTER
  ===================================================== */

  const filteredEmployees = useMemo(() => {

    const searchValue =
      search.trim().toLowerCase();


    /*
     * SORT FIRST
     * 
     * This ensures that search and status filters
     * still display employees in Employee Code order.
     */

    const sortedEmployees =
      sortEmployeesByCode(
        employees
      );


    return sortedEmployees.filter(
      (employee) => {

        const matchesSearch =
          !searchValue ||

          employee.name
            ?.toLowerCase()
            .includes(searchValue) ||

          employee.employeeCode
            ?.toLowerCase()
            .includes(searchValue) ||

          employee.email
            ?.toLowerCase()
            .includes(searchValue) ||

          employee.department
            ?.toLowerCase()
            .includes(searchValue) ||

          employee.designation
            ?.toLowerCase()
            .includes(searchValue);


        /* =================================================
           STATUS FILTER
        ================================================= */

        const matchesStatus =
          statusFilter === "ALL" ||

          (
            statusFilter === "PENDING" &&
            employee.status === "PENDING"
          ) ||

          (
            statusFilter === "ACTIVE" &&
            employee.status === "APPROVED" &&
            employee.active === true
          ) ||

          (
            statusFilter === "INACTIVE" &&
            employee.status === "APPROVED" &&
            employee.active === false
          ) ||

          (
            statusFilter === "REJECTED" &&
            employee.status === "REJECTED"
          );


        return (
          matchesSearch &&
          matchesStatus
        );

      }
    );

  }, [
    employees,
    search,
    statusFilter,
  ]);


  /* =====================================================
     STATISTICS
  ===================================================== */

  const totalEmployees =
    employees.length;


  const pendingEmployees =
    employees.filter(
      (employee) =>
        employee.status === "PENDING"
    ).length;


  const activeEmployees =
    employees.filter(
      (employee) =>
        employee.status === "APPROVED" &&
        employee.active === true
    ).length;


  const inactiveEmployees =
    employees.filter(
      (employee) =>
        employee.status === "APPROVED" &&
        employee.active === false
    ).length;


  const rejectedEmployees =
    employees.filter(
      (employee) =>
        employee.status === "REJECTED"
    ).length;


  /* =====================================================
     DATE FORMAT
  ===================================================== */

  const formatDate = (date) => {

    if (!date) {
      return "—";
    }

    const parts =
      date.split("-");

    if (parts.length !== 3) {
      return date;
    }

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };


  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <div className="employees-page">

      {/* =================================================
          MAIN EMPLOYEES CONTENT
      ================================================= */}

      <main className="employees-main">


        {/* =================================================
            HEADER
        ================================================= */}

        <header className="employees-header">

          <div>

            <span className="employees-overline">
              HR WORKSPACE
            </span>

            <h1>
              Employees
            </h1>

            <p>
              Manage employee records and
              workforce information.
            </p>

          </div>


          <button
            type="button"
            className="add-employee-button"
            onClick={openAddModal}
          >

            <span>+</span>

            Add Employee

          </button>

        </header>


        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {success && (

          <div className="employees-alert success">
            ✓ {success}
          </div>

        )}


        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (

          <div className="employees-alert error">
            {error}
          </div>

        )}


        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="employee-stat-grid">


          {/* TOTAL */}

          <div className="employee-stat-card">

            <div className="employee-stat-icon blue">
              👥
            </div>

            <div>

              <span>
                TOTAL EMPLOYEES
              </span>

              <strong>
                {totalEmployees}
              </strong>

            </div>

          </div>


          {/* PENDING */}

          <div className="employee-stat-card">

            <div className="employee-stat-icon orange">
              !
            </div>

            <div>

              <span>
                PENDING REQUESTS
              </span>

              <strong>
                {pendingEmployees}
              </strong>

            </div>

          </div>


          {/* ACTIVE */}

          <div className="employee-stat-card">

            <div className="employee-stat-icon green">
              ✓
            </div>

            <div>

              <span>
                ACTIVE
              </span>

              <strong>
                {activeEmployees}
              </strong>

            </div>

          </div>


          {/* INACTIVE */}

          <div className="employee-stat-card">

            <div className="employee-stat-icon orange">
              !
            </div>

            <div>

              <span>
                INACTIVE
              </span>

              <strong>
                {inactiveEmployees}
              </strong>

            </div>

          </div>

        </section>


        {/* =================================================
            EMPLOYEE DIRECTORY
        ================================================= */}

        <section className="employees-panel">


          {/* PANEL HEADER */}

          <div className="employees-panel-header">

            <div>

              <span>
                WORKFORCE
              </span>

              <h2>
                Employee Directory
              </h2>

            </div>


            <button
              type="button"
              className="refresh-button"
              onClick={fetchEmployees}
              disabled={loading}
            >

              ↻ Refresh

            </button>

          </div>


          {/* =================================================
              SEARCH / FILTER
          ================================================= */}

          <div className="employee-toolbar">


            <div className="employee-search">

              <span>
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search employees..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>


            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="employee-filter"
            >

              <option value="ALL">
                All Employees
              </option>

              <option value="PENDING">
                Pending Requests
              </option>

              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>

              <option value="REJECTED">
                Rejected
              </option>

            </select>

          </div>


          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (

            <div className="employees-loading">

              <div className="loading-spinner"></div>

              <span>
                Loading employees...
              </span>

            </div>

          ) : filteredEmployees.length === 0 ? (


            /* =================================================
               EMPTY STATE
            ================================================= */

            <div className="employees-empty">

              <div>
                👥
              </div>

              <h3>
                No employees found
              </h3>

              <p>

                {search
                  ? "Try a different search."
                  : statusFilter === "PENDING"
                    ? "There are no pending employee requests."
                    : "Add your first employee to get started."
                }

              </p>


              {!search &&
                statusFilter === "ALL" && (

                <button
                  type="button"
                  onClick={openAddModal}
                >

                  + Add Employee

                </button>

              )}

            </div>

          ) : (


            /* =================================================
               TABLE
            ================================================= */

            <div className="employees-table-wrapper">

              <table className="employees-table">


                <thead>

                  <tr>

                    <th>
                      EMPLOYEE
                    </th>

                    <th>
                      EMAIL
                    </th>

                    <th>
                      DEPARTMENT
                    </th>

                    <th>
                      DESIGNATION
                    </th>

                    <th>
                      JOINING DATE
                    </th>

                    <th>
                      STATUS
                    </th>

                    <th>
                      ACTIONS
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredEmployees.map(
                    (employee) => (

                    <tr
                      key={employee.id}
                      className={
                        !employee.active
                          ? "inactive-row"
                          : ""
                      }
                    >


                      {/* EMPLOYEE */}

                      <td>

                        <div className="employee-person">

                          <div className="employee-person-avatar">

                            {employee.name
                              ?.charAt(0)
                              .toUpperCase()}

                          </div>


                          <div>

                            <strong>
                              {employee.name}
                            </strong>

                            <span>
                              {employee.employeeCode}
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* EMAIL */}

                      <td>

                        <span className="employee-email">
                          {employee.email}
                        </span>

                      </td>


                      {/* DEPARTMENT */}

                      <td>
                        {employee.department}
                      </td>


                      {/* DESIGNATION */}

                      <td>
                        {employee.designation}
                      </td>


                      {/* JOINING DATE */}

                      <td>
                        {formatDate(
                          employee.joiningDate
                        )}
                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={
                            employee.status === "PENDING"
                              ? "employee-status pending"

                              : employee.status === "REJECTED"
                                ? "employee-status rejected"

                                : employee.active
                                  ? "employee-status active"

                                  : "employee-status inactive"
                          }
                        >

                          <i></i>

                          {
                            employee.status === "PENDING"

                              ? "Pending"

                              : employee.status === "REJECTED"

                                ? "Rejected"

                                : employee.active
                                  ? "Active"
                                  : "Inactive"
                          }

                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="employee-actions">


                          {/* VIEW */}

                          <button
                            type="button"
                            title="View employee"
                            onClick={() =>
                              setViewEmployee(
                                employee
                              )
                            }
                          >
                            View
                          </button>


                          {/* EDIT */}

                          <button
                            type="button"
                            title="Edit employee"
                            onClick={() =>
                              openEditModal(
                                employee
                              )
                            }
                            disabled={
                              !employee.active &&
                              employee.status !== "PENDING"
                            }
                          >
                            Edit
                          </button>


                          {/* =================================================
                              PENDING → ACCEPT / REJECT
                          ================================================= */}

                          {employee.status === "PENDING" ? (

                            <>

                              <button
                                type="button"
                                className="approve-button"
                                title="Approve employee"
                                onClick={() =>
                                  handleApprove(
                                    employee
                                  )
                                }
                              >
                                Accept
                              </button>


                              <button
                                type="button"
                                className="reject-button"
                                title="Reject employee"
                                onClick={() =>
                                  handleReject(
                                    employee
                                  )
                                }
                              >
                                Reject
                              </button>

                            </>

                          ) : employee.status === "REJECTED" ? (


                            /* REJECTED */

                            <span className="employee-request-rejected">
                              Rejected
                            </span>


                          ) : employee.active ? (


                            /* ACTIVE */

                            <button
                              type="button"
                              className="danger"
                              title="Deactivate employee"
                              onClick={() =>
                                handleDeactivate(
                                  employee
                                )
                              }
                            >
                              Deactivate
                            </button>


                          ) : (


                            /* INACTIVE */

                            <button
                              type="button"
                              className="reactivate-button"
                              title="Reactivate employee"
                              onClick={() =>
                                handleReactivate(
                                  employee
                                )
                              }
                            >
                              Reactivate
                            </button>

                          )}

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>


      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {showModal && (

        <div className="employee-modal-backdrop">

          <div className="employee-modal">


            {/* MODAL HEADER */}

            <div className="employee-modal-header">

              <div>

                <span>
                  {editingEmployee
                    ? "UPDATE EMPLOYEE"
                    : "NEW EMPLOYEE"}
                </span>

                <h2>
                  {editingEmployee
                    ? "Edit employee"
                    : "Add employee"}
                </h2>

                {editingEmployee?.status === "PENDING" && (

                  <small className="employee-pending-note">
                    Complete the department, designation and joining date before approving this employee.
                  </small>

                )}

              </div>


              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
                disabled={submitting}
              >
                ×
              </button>

            </div>


            {/* MODAL ERROR */}

            {error && (

              <div className="modal-error">
                {error}
              </div>

            )}


            {/* MODAL SUCCESS */}

            {success && (

              <div className="modal-success">
                {success}
              </div>

            )}


            {/* FORM */}

            <form
              className="employee-form"
              onSubmit={handleSubmit}
            >


              {/* EMPLOYEE CODE */}

              <div className="employee-form-group">

                <label>
                  Employee Code
                </label>

                <input
                  type="text"
                  name="employeeCode"
                  value={
                    formData.employeeCode
                  }
                  onChange={handleChange}
                  placeholder="EMP001"
                  disabled={
                    submitting ||
                    Boolean(editingEmployee)
                  }
                  required
                />

                {editingEmployee && (

                  <small>
                    Employee code cannot be changed.
                  </small>

                )}

              </div>


              {/* NAME */}

              <div className="employee-form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter employee name"
                  disabled={submitting}
                  required
                />

              </div>


              {/* EMAIL */}

              <div className="employee-form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="employee@gmail.com"
                  disabled={submitting}
                  required
                />

              </div>


              {/* DEPARTMENT + DESIGNATION */}

              <div className="employee-form-row">


                <div className="employee-form-group">

                  <label>
                    Department
                  </label>

                  <input
                    type="text"
                    name="department"
                    value={
                      formData.department
                    }
                    onChange={handleChange}
                    placeholder="Engineering"
                    disabled={submitting}
                    required
                  />

                </div>


                <div className="employee-form-group">

                  <label>
                    Designation
                  </label>

                  <input
                    type="text"
                    name="designation"
                    value={
                      formData.designation
                    }
                    onChange={handleChange}
                    placeholder="Software Engineer"
                    disabled={submitting}
                    required
                  />

                </div>

              </div>


              {/* JOINING DATE */}

              <div className="employee-form-group">

                <label>
                  Joining Date
                </label>

                <input
                  type="date"
                  name="joiningDate"
                  value={
                    formData.joiningDate
                  }
                  onChange={handleChange}
                  disabled={submitting}
                  required
                />

              </div>


              {/* FORM BUTTONS */}

              <div className="employee-form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="save-employee-button"
                  disabled={submitting}
                >

                  {submitting
                    ? "Saving..."
                    : editingEmployee
                      ? "Save Changes"
                      : "Add Employee"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =====================================================
          VIEW EMPLOYEE MODAL
      ===================================================== */}

      {viewEmployee && (

        <div
          className="employee-modal-backdrop"
          onClick={() =>
            setViewEmployee(null)
          }
        >

          <div
            className="employee-view-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            {/* VIEW HEADER */}

            <div className="employee-view-header">

              <div className="employee-view-avatar">

                {viewEmployee.name
                  ?.charAt(0)
                  .toUpperCase()}

              </div>


              <div>

                <span>
                  {viewEmployee.employeeCode}
                </span>

                <h2>
                  {viewEmployee.name}
                </h2>

              </div>


              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setViewEmployee(null)
                }
              >
                ×
              </button>

            </div>


            {/* VIEW DETAILS */}

            <div className="employee-view-grid">


              <div>

                <span>
                  EMAIL
                </span>

                <strong>
                  {viewEmployee.email}
                </strong>

              </div>


              <div>

                <span>
                  DEPARTMENT
                </span>

                <strong>
                  {viewEmployee.department}
                </strong>

              </div>


              <div>

                <span>
                  DESIGNATION
                </span>

                <strong>
                  {viewEmployee.designation}
                </strong>

              </div>


              <div>

                <span>
                  JOINING DATE
                </span>

                <strong>
                  {formatDate(
                    viewEmployee.joiningDate
                  )}
                </strong>

              </div>


              <div>

                <span>
                  STATUS
                </span>

                <strong
                  className={
                    viewEmployee.status === "PENDING"
                      ? "view-pending"

                      : viewEmployee.status === "REJECTED"
                        ? "view-rejected"

                        : viewEmployee.active
                          ? "view-active"
                          : "view-inactive"
                  }
                >

                  {
                    viewEmployee.status === "PENDING"

                      ? "Pending"

                      : viewEmployee.status === "REJECTED"

                        ? "Rejected"

                        : viewEmployee.active
                          ? "Active"
                          : "Inactive"
                  }

                </strong>

              </div>

            </div>


            {/* VIEW ACTIONS */}

            <div className="employee-view-actions">


              {/* ACCEPT FROM VIEW */}

              {viewEmployee.status === "PENDING" && (

                <>

                  <button
                    type="button"
                    className="approve-button"
                    onClick={async () => {

                      await handleApprove(
                        viewEmployee
                      );

                      setViewEmployee(null);

                    }}
                  >
                    Accept
                  </button>


                  <button
                    type="button"
                    className="reject-button"
                    onClick={async () => {

                      await handleReject(
                        viewEmployee
                      );

                      setViewEmployee(null);

                    }}
                  >
                    Reject
                  </button>

                </>

              )}


              {/* EDIT */}

              {viewEmployee.status !== "PENDING" &&
                viewEmployee.active && (

                <button
                  type="button"
                  onClick={() => {

                    setViewEmployee(null);

                    openEditModal(
                      viewEmployee
                    );

                  }}
                >
                  Edit Employee
                </button>

              )}


              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  setViewEmployee(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Employees;