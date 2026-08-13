import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SalaryStructures.css";

function SalaryStructures() {

  const navigate = useNavigate();

  // =====================================================
  // DATA
  // =====================================================

  const [salaryStructures, setSalaryStructures] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // FORM
  // =====================================================

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    employeeId: "",
    basicSalary: "",
    hra: "",
    specialAllowance: "",
    pf: "",
    esi: "",
    professionalTax: "",
    effectiveFrom: ""
  });

  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");


  // =====================================================
  // AXIOS CONFIG
  // =====================================================

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };


  // =====================================================
  // FETCH EMPLOYEES
  // =====================================================

  const fetchEmployees = async () => {

    try {

      const response = await axios.get(
        "http://localhost:8090/api/employees",
        authConfig
      );

      // Only active employees should be available
      // for creating a salary structure.

      const activeEmployees =
        response.data.filter(
          (employee) => employee.active
        );

      setEmployees(activeEmployees);

    } catch (err) {

      console.error(
        "Employee loading error:",
        err
      );

      if (err.response?.status === 401) {

        localStorage.clear();
        navigate("/login");

      } else {

        setError(
          "Unable to load employee information."
        );

      }
    }
  };


  // =====================================================
  // FETCH SALARY STRUCTURES
  // =====================================================

  const fetchSalaryStructures = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:8090/api/salary-structures",
        authConfig
      );

      console.log(
        "Salary structures:",
        response.data
      );

      setSalaryStructures(
        response.data
      );

    } catch (err) {

      console.error(
        "Salary structure error:",
        err
      );

      if (err.response?.status === 401) {

        localStorage.clear();

        navigate("/login");

      } else if (err.response?.status === 403) {

        setError(
          "You do not have permission to view salary structures."
        );

      } else {

        setError(
          "Unable to load salary structures."
        );
      }

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    if (!token) {

      navigate("/login");

      return;
    }

    const loadData = async () => {

      await Promise.all([
        fetchEmployees(),
        fetchSalaryStructures()
      ]);

    };

    loadData();

  }, []);


  // =====================================================
  // FORM INPUT
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
  // OPEN ADD FORM
  // =====================================================

  const openAddForm = () => {

    setEditingId(null);

    setFormData({
      employeeId: "",
      basicSalary: "",
      hra: "",
      specialAllowance: "",
      pf: "",
      esi: "",
      professionalTax: "",
      effectiveFrom: ""
    });

    setError("");
    setSuccess("");

    setShowForm(true);
  };


  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const openEditForm = (salary) => {

    setEditingId(salary.id);

    setFormData({
      employeeId:
        salary.employeeId || "",

      basicSalary:
        salary.basicSalary || "",

      hra:
        salary.hra || "",

      specialAllowance:
        salary.specialAllowance || "",

      pf:
        salary.pf || "",

      esi:
        salary.esi || "",

      professionalTax:
        salary.professionalTax || "",

      effectiveFrom:
        salary.effectiveFrom || ""
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
    setEditingId(null);

    setError("");
  };


  // =====================================================
  // VALIDATE FORM
  // =====================================================

  const validateForm = () => {

    if (!formData.employeeId) {

      setError(
        "Please select an employee."
      );

      return false;
    }

    if (
      formData.basicSalary === "" ||
      Number(formData.basicSalary) <= 0
    ) {

      setError(
        "Please enter a valid basic salary."
      );

      return false;
    }

    if (formData.hra === "") {

      setError(
        "Please enter HRA."
      );

      return false;
    }

    if (
      formData.specialAllowance === ""
    ) {

      setError(
        "Please enter special allowance."
      );

      return false;
    }

    if (formData.pf === "") {

      setError(
        "Please enter PF."
      );

      return false;
    }

    if (formData.esi === "") {

      setError(
        "Please enter ESI."
      );

      return false;
    }

    if (
      formData.professionalTax === ""
    ) {

      setError(
        "Please enter professional tax."
      );

      return false;
    }

    if (!formData.effectiveFrom) {

      setError(
        "Please select the effective date."
      );

      return false;
    }

    return true;
  };


  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {

      setSaving(true);

      const requestData = {

        employeeId:
          Number(formData.employeeId),

        basicSalary:
          Number(formData.basicSalary),

        hra:
          Number(formData.hra),

        specialAllowance:
          Number(formData.specialAllowance),

        pf:
          Number(formData.pf),

        esi:
          Number(formData.esi),

        professionalTax:
          Number(formData.professionalTax),

        effectiveFrom:
          formData.effectiveFrom
      };


      let response;


      // =================================================
      // UPDATE
      // =================================================

      if (editingId) {

        response = await axios.put(
          `http://localhost:8090/api/salary-structures/${editingId}`,
          requestData,
          authConfig
        );

        setSuccess(
          "Salary structure updated successfully."
        );

      }

      // =================================================
      // CREATE
      // =================================================

      else {

        response = await axios.post(
          "http://localhost:8090/api/salary-structures",
          requestData,
          authConfig
        );

        setSuccess(
          "Salary structure created successfully."
        );

      }


      console.log(
        "Salary structure response:",
        response.data
      );


      // Refresh table

      await fetchSalaryStructures();


      // Close after short delay

      setTimeout(() => {

        setShowForm(false);
        setEditingId(null);
        setSuccess("");

      }, 900);

    } catch (err) {

      console.error(
        "Save salary structure error:",
        err
      );

      if (err.response?.status === 401) {

        localStorage.clear();

        navigate("/login");

      } else if (err.response?.data?.message) {

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
          editingId
            ? "Unable to update salary structure."
            : "Unable to create salary structure."
        );
      }

    } finally {

      setSaving(false);

    }
  };


  // =====================================================
  // FIND EMPLOYEE
  // =====================================================

  const getEmployee = (employeeId) => {

    return employees.find(
      (employee) =>
        employee.id === employeeId
    );
  };


  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (value) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "₹0";
    }

    return `₹${Number(value).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2
      }
    )}`;
  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    navigate("/login");
  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="salary-page">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="salary-sidebar">

        {/* LOGO */}

        <div className="salary-brand">

          <div className="salary-logo">
            H
          </div>

          <div>

            <div className="salary-brand-name">
              HRM
            </div>

            <div className="salary-brand-subtitle">
              PAYROLL
              <br />
              AUTOMATION
            </div>

          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="salary-navigation">


          {/* DASHBOARD */}

          <button
            type="button"
            className="salary-menu-item"
            onClick={() =>
              navigate("/dashboard")
            }
          >

            <span className="salary-menu-icon">
              ⌂
            </span>

            <span>
              Dashboard
            </span>

          </button>


          {/* EMPLOYEES */}

          <button
            type="button"
            className="salary-menu-item"
            onClick={() =>
              navigate("/employees")
            }
          >

            <span className="salary-menu-icon">
              ♙
            </span>

            <span>
              Employees
            </span>

          </button>


          {/* SALARY STRUCTURES */}

          <button
            type="button"
            className="salary-menu-item active"
            onClick={() =>
              navigate("/salary-structures")
            }
          >

            <span className="salary-menu-icon">
              ₹
            </span>

            <span>
              Salary Structures
            </span>

          </button>


          {/* LEAVE MANAGEMENT */}

          <button
            type="button"
            className="salary-menu-item"
            onClick={() =>
              navigate("/leave-management")
            }
          >

            <span className="salary-menu-icon">
              ◷
            </span>

            <span>
              Leave Management
            </span>

          </button>


          {/* PAYROLL */}

          <button
            type="button"
            className="salary-menu-item"
            onClick={() =>
              navigate("/payroll")
            }
          >

            <span className="salary-menu-icon">
              ▣
            </span>

            <span>
              Payroll
            </span>

          </button>


          {/* PAYSLIPS */}

          <button
            type="button"
            className="salary-menu-item"
            onClick={() =>
              navigate("/payslips")
            }
          >

            <span className="salary-menu-icon">
              ▤
            </span>

            <span>
              Payslips
            </span>

          </button>


          {/* EMAIL LOGS */}

          <button
            type="button"
            className="salary-menu-item"
            onClick={() =>
              navigate("/email-logs")
            }
          >

            <span className="salary-menu-icon">
              ✉
            </span>

            <span>
              Email Logs
            </span>

          </button>


          {/* REPORTS */}

          <button
            type="button"
            className="salary-menu-item"
            onClick={() =>
              navigate("/reports")
            }
          >

            <span className="salary-menu-icon">
              ▥
            </span>

            <span>
              Reports
            </span>

          </button>


          {/* SETTINGS */}

          <button
            type="button"
            className="salary-menu-item"
            onClick={() =>
              navigate("/settings")
            }
          >

            <span className="salary-menu-icon">
              ⚙
            </span>

            <span>
              Settings
            </span>

          </button>

        </nav>


        {/* SIDEBAR FOOTER */}

        <div className="salary-sidebar-footer">

          <div className="salary-user">

            <div className="salary-user-avatar">

              {(localStorage.getItem("username") || "A")
                .charAt(0)
                .toUpperCase()}

            </div>

            <div>

              <div className="salary-user-name">
                {localStorage.getItem("username") || "Admin"}
              </div>

              <div className="salary-user-role">
                {localStorage.getItem("role") || "HR"}
              </div>

            </div>

          </div>


          <button
            type="button"
            className="salary-logout"
            onClick={handleLogout}
          >
            ↪ Logout
          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN
      ================================================= */}

      <div className="salary-main">


        {/* TOP BAR */}

        <header className="salary-topbar">

          <div>

            <div className="salary-eyebrow">
              HR WORKSPACE
            </div>

            <h1>
              Salary Structures
            </h1>

            <p>
              Manage employee salary structures
            </p>

          </div>

        </header>


        {/* CONTENT */}

        <main className="salary-content">


          {/* SECTION HEADER */}

          <div className="salary-section-header">

            <div>

              <div className="salary-eyebrow">
                PAYROLL
              </div>

              <h2>
                Employee Salary Details
              </h2>

              <p>
                View and manage employee salary structures.
              </p>

            </div>


            <button
              type="button"
              className="salary-add-button"
              onClick={openAddForm}
            >
              + Add Salary Structure
            </button>

          </div>


          {/* ERROR */}

          {error && !showForm && (

            <div className="salary-error">
              {error}
            </div>

          )}


          {/* SUCCESS */}

          {success && !showForm && (

            <div className="salary-success">
              {success}
            </div>

          )}


          {/* LOADING */}

          {loading && (

            <div className="salary-loading">
              Loading salary structures...
            </div>

          )}


          {/* =================================================
              TABLE
          ================================================= */}

          {!loading && !error && (

            <div className="salary-table-card">


              {salaryStructures.length === 0 ? (

                <div className="salary-empty">

                  <h3>
                    No salary structures found
                  </h3>

                  <p>
                    Create a salary structure for an employee
                    to see it here.
                  </p>

                  <button
                    type="button"
                    className="salary-empty-button"
                    onClick={openAddForm}
                  >
                    + Create Salary Structure
                  </button>

                </div>

              ) : (

                <div className="salary-table-wrapper">

                  <table className="salary-table">

                    <thead>

                      <tr>

                        <th>
                          Employee
                        </th>

                        <th>
                          Basic
                        </th>

                        <th>
                          HRA
                        </th>

                        <th>
                          Gross
                        </th>

                        <th>
                          Net
                        </th>

                        <th>
                          Effective From
                        </th>

                        <th>
                          Action
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {salaryStructures.map(
                        (salary) => {

                          const employee =
                            getEmployee(
                              salary.employeeId
                            );

                          return (

                            <tr
                              key={salary.id}
                            >


                              {/* EMPLOYEE */}

                              <td>

                                <div className="salary-employee">

                                  <div className="salary-employee-code">
                                    {employee?.employeeCode ||
                                      `EMP-${salary.employeeId}`}
                                  </div>

                                  <div className="salary-employee-name">
                                    {employee?.name ||
                                      "Employee information unavailable"}
                                  </div>

                                </div>

                              </td>


                              {/* BASIC */}

                              <td>
                                {formatCurrency(
                                  salary.basicSalary
                                )}
                              </td>


                              {/* HRA */}

                              <td>
                                {formatCurrency(
                                  salary.hra
                                )}
                              </td>


                              {/* GROSS */}

                              <td className="salary-highlight">

                                {formatCurrency(
                                  salary.grossSalary
                                )}

                              </td>


                              {/* NET */}

                              <td className="salary-highlight">

                                {formatCurrency(
                                  salary.netSalary
                                )}

                              </td>


                              {/* EFFECTIVE */}

                              <td>
                                {salary.effectiveFrom}
                              </td>


                              {/* ACTION */}

                              <td>

                                <button
                                  type="button"
                                  className="salary-edit-button"
                                  onClick={() =>
                                    openEditForm(
                                      salary
                                    )
                                  }
                                >
                                  Edit
                                </button>

                              </td>

                            </tr>

                          );

                        }
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          )}

        </main>

      </div>


      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showForm && (

        <div className="salary-modal-overlay">

          <div className="salary-modal">


            {/* MODAL HEADER */}

            <div className="salary-modal-header">

              <div>

                <div className="salary-eyebrow">
                  PAYROLL
                </div>

                <h2>
                  {editingId
                    ? "Edit Salary Structure"
                    : "Add Salary Structure"}
                </h2>

                <p>
                  Configure the employee salary details.
                </p>

              </div>


              <button
                type="button"
                className="salary-modal-close"
                onClick={closeForm}
                disabled={saving}
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <form
              className="salary-form"
              onSubmit={handleSubmit}
            >


              {/* EMPLOYEE */}

              <div className="salary-form-group salary-form-full">

                <label>
                  Employee
                </label>

                <select
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  disabled={editingId !== null || saving}
                  required
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


                {employees.length === 0 && (

                  <small className="salary-form-hint">
                    No active employees available.
                  </small>

                )}

              </div>


              {/* BASIC SALARY */}

              <div className="salary-form-group">

                <label>
                  Basic Salary
                </label>

                <input
                  type="number"
                  name="basicSalary"
                  value={formData.basicSalary}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Enter basic salary"
                  required
                />

              </div>


              {/* HRA */}

              <div className="salary-form-group">

                <label>
                  HRA
                </label>

                <input
                  type="number"
                  name="hra"
                  value={formData.hra}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Enter HRA"
                  required
                />

              </div>


              {/* SPECIAL ALLOWANCE */}

              <div className="salary-form-group">

                <label>
                  Special Allowance
                </label>

                <input
                  type="number"
                  name="specialAllowance"
                  value={formData.specialAllowance}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Enter special allowance"
                  required
                />

              </div>


              {/* PF */}

              <div className="salary-form-group">

                <label>
                  PF
                </label>

                <input
                  type="number"
                  name="pf"
                  value={formData.pf}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Enter PF"
                  required
                />

              </div>


              {/* ESI */}

              <div className="salary-form-group">

                <label>
                  ESI
                </label>

                <input
                  type="number"
                  name="esi"
                  value={formData.esi}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Enter ESI"
                  required
                />

              </div>


              {/* PROFESSIONAL TAX */}

              <div className="salary-form-group">

                <label>
                  Professional Tax
                </label>

                <input
                  type="number"
                  name="professionalTax"
                  value={formData.professionalTax}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Enter professional tax"
                  required
                />

              </div>


              {/* EFFECTIVE DATE */}

              <div className="salary-form-group">

                <label>
                  Effective From
                </label>

                <input
                  type="date"
                  name="effectiveFrom"
                  value={formData.effectiveFrom}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* FORM ERROR */}

              {error && (

                <div className="salary-form-error">
                  {error}
                </div>

              )}


              {/* FORM SUCCESS */}

              {success && (

                <div className="salary-form-success">
                  {success}
                </div>

              )}


              {/* ACTIONS */}

              <div className="salary-form-actions">

                <button
                  type="button"
                  className="salary-cancel-button"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="salary-save-button"
                  disabled={saving}
                >

                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Salary Structure"
                      : "Create Salary Structure"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default SalaryStructures;