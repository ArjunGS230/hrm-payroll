import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Payslips.css";

function Payslips() {

    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [payslips, setPayslips] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showGenerate, setShowGenerate] =
        useState(false);

    const [selectedPayslip, setSelectedPayslip] =
        useState(null);

    const [formData, setFormData] = useState({
        employeeId: "",
        payPeriod: ""
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

        setEmployees(
            response.data.filter(
                (employee) => employee.active
            )
        );
    };


    // =====================================================
    // FETCH PAYSLIPS
    // =====================================================
const fetchPayslips = async () => {

    const response = await axios.get(
        "http://localhost:8090/api/payslips",
        authConfig
    );

    const sortedPayslips = [...response.data].sort(
        (a, b) =>
            b.payMonth.localeCompare(a.payMonth)
    );

    setPayslips(sortedPayslips);
};


    // =====================================================
    // LOAD DATA
    // =====================================================

    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            await Promise.all([
                fetchEmployees(),
                fetchPayslips()
            ]);

        } catch (err) {

            console.error(
                "Payslip loading error:",
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
                    "Unable to load payslips."
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
    // OPEN GENERATE MODAL
    // =====================================================

    const openGenerateModal = () => {

        setFormData({
            employeeId: "",
            payPeriod: ""
        });

        setError("");
        setSuccess("");

        setShowGenerate(true);
    };


    // =====================================================
    // CLOSE GENERATE MODAL
    // =====================================================

    const closeGenerateModal = () => {

        if (saving) {
            return;
        }

        setShowGenerate(false);

        setError("");
        setSuccess("");
    };


    // =====================================================
    // GENERATE PAYSLIP
    // =====================================================

    const handleGenerate = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (!formData.employeeId) {

            setError(
                "Please select an employee."
            );

            return;
        }


        if (!formData.payPeriod) {

            setError(
                "Please select a pay period."
            );

            return;
        }


        try {

            setSaving(true);


            const response = await axios.post(
                `http://localhost:8090/api/payslips/generate/${formData.employeeId}?payPeriod=${formData.payPeriod}`,
                {},
                authConfig
            );


            setSuccess(
                "Payslip generated and email sent successfully."
            );


            setSelectedPayslip(
                response.data
            );


            await fetchPayslips();


            setTimeout(() => {

                setShowGenerate(false);
                setSuccess("");

            }, 1200);


        } catch (err) {

            console.error(
                "Generate payslip error:",
                err
            );


            if (
                err.response?.status === 401
            ) {

                localStorage.clear();

                navigate("/login");

            } else if (
                err.response?.data?.message
            ) {

                setError(
                    err.response.data.message
                );

            } else if (
                typeof err.response?.data ===
                "string"
            ) {

                setError(
                    err.response.data
                );

            } else {

                setError(
                    "Unable to generate payslip."
                );
            }

        } finally {

            setSaving(false);
        }
    };


    // =====================================================
    // SEND EMAIL
    // =====================================================

    const handleSendEmail = async (id) => {

        try {

            setError("");
            setSuccess("");


            await axios.post(
                `http://localhost:8090/api/payslips/${id}/send-email`,
                {},
                authConfig
            );


            setSuccess(
                "Payslip email sent successfully."
            );


            setTimeout(() => {
                setSuccess("");
            }, 3000);


        } catch (err) {

            console.error(
                "Send email error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Unable to send payslip email."
            );
        }
    };


    // =====================================================
    // VIEW PAYSLIP
    // =====================================================

    const handleView = async (id) => {

        try {

            setError("");

            const response =
                await axios.get(
                    `http://localhost:8090/api/payslips/${id}`,
                    authConfig
                );

            setSelectedPayslip(
                response.data
            );

        } catch (err) {

            console.error(
                "View payslip error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load payslip."
            );
        }
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
    // FORMAT MONEY
    // =====================================================

    const formatMoney = (value) => {

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
    // RENDER
    // =====================================================

    return (

        <div className="payslip-page">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="payslip-sidebar">

                <div className="payslip-brand">

                    <div className="payslip-logo">
                        H
                    </div>

                    <div>

                        <div className="payslip-brand-name">
                            HRM
                        </div>

                        <div className="payslip-brand-subtitle">
                            PAYROLL
                            <br />
                            AUTOMATION
                        </div>

                    </div>

                </div>


                <nav className="payslip-navigation">

                    <button
                        className="payslip-menu-item"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        <span className="payslip-menu-icon">
                            ⌂
                        </span>

                        Dashboard
                    </button>


                    <button
                        className="payslip-menu-item"
                        onClick={() =>
                            navigate("/employees")
                        }
                    >
                        <span className="payslip-menu-icon">
                            ♙
                        </span>

                        Employees
                    </button>


                    <button
                        className="payslip-menu-item"
                        onClick={() =>
                            navigate("/salary-structures")
                        }
                    >
                        <span className="payslip-menu-icon">
                            ₹
                        </span>

                        Salary Structures
                    </button>


                    <button
                        className="payslip-menu-item"
                        onClick={() =>
                            navigate("/leave-management")
                        }
                    >
                        <span className="payslip-menu-icon">
                            ◷
                        </span>

                        Leave Management
                    </button>


                    <button
                        className="payslip-menu-item"
                        onClick={() =>
                            navigate("/payroll")
                        }
                    >
                        <span className="payslip-menu-icon">
                            ▣
                        </span>

                        Payroll
                    </button>


                    <button
                        className="payslip-menu-item active"
                        onClick={() =>
                            navigate("/payslips")
                        }
                    >
                        <span className="payslip-menu-icon">
                            ▤
                        </span>

                        Payslips
                    </button>


                    <button
                        className="payslip-menu-item"
                        onClick={() =>
                            navigate("/email-logs")
                        }
                    >
                        <span className="payslip-menu-icon">
                            ✉
                        </span>

                        Email Logs
                    </button>


                    <button
                        className="payslip-menu-item"
                        onClick={() =>
                            navigate("/reports")
                        }
                    >
                        <span className="payslip-menu-icon">
                            ▥
                        </span>

                        Reports
                    </button>


                    <button
                        className="payslip-menu-item"
                        onClick={() =>
                            navigate("/settings")
                        }
                    >
                        <span className="payslip-menu-icon">
                            ⚙
                        </span>

                        Settings
                    </button>

                </nav>


                {/* USER */}

                <div className="payslip-sidebar-footer">

                    <div className="payslip-user">

                        <div className="payslip-user-avatar">

                            {(
                                localStorage.getItem(
                                    "username"
                                ) || "A"
                            )
                                .charAt(0)
                                .toUpperCase()}

                        </div>

                        <div>

                            <div className="payslip-user-name">
                                {localStorage.getItem(
                                    "username"
                                ) || "Admin"}
                            </div>

                            <div className="payslip-user-role">
                                {localStorage.getItem(
                                    "role"
                                ) || "HR"}
                            </div>

                        </div>

                    </div>


                    <button
                        className="payslip-logout"
                        onClick={handleLogout}
                    >
                        ↪ Logout
                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN
            ================================================= */}

            <div className="payslip-main">


                <header className="payslip-topbar">

                    <div>

                        <div className="payslip-eyebrow">
                            HR WORKSPACE
                        </div>

                        <h1>
                            Payslips
                        </h1>

                        <p>
                            Generate, view and send employee payslips.
                        </p>

                    </div>

                </header>


                <main className="payslip-content">


                    {/* HEADER */}

                    <div className="payslip-section-header">

                        <div>

                            <div className="payslip-eyebrow">
                                PAYROLL
                            </div>

                            <h2>
                                Payslip Directory
                            </h2>

                            <p>
                                Manage monthly employee payslips.
                            </p>

                        </div>


                        <button
                            className="payslip-generate-button"
                            onClick={
                                openGenerateModal
                            }
                        >
                            + Generate Payslip
                        </button>

                    </div>


                    {/* MESSAGES */}

                    {error && (

                        <div className="payslip-error">
                            {error}
                        </div>

                    )}


                    {success && (

                        <div className="payslip-success">
                            {success}
                        </div>

                    )}


                    {/* LOADING */}

                    {loading ? (

                        <div className="payslip-loading">
                            Loading payslips...
                        </div>

                    ) : (

                        <section className="payslip-card">

                            <div className="payslip-card-heading">

                                <div>

                                    <h3>
                                        Employee Payslips
                                    </h3>

                                    <p>
                                        All generated payslips
                                    </p>

                                </div>

                                <div className="payslip-total-count">
    <span>Total Payslips:</span>
    <strong>{payslips.length}</strong>
</div>

                            </div>


                            <div className="payslip-table-wrapper">

                                <table className="payslip-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Employee
                                            </th>

                                            <th>
                                                Pay Month
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
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {payslips.length === 0 ? (

                                            <tr>

                                                <td
                                                    colSpan="7"
                                                    className="payslip-empty"
                                                >
                                                    No payslips generated yet.
                                                </td>

                                            </tr>

                                        ) : (

                                            payslips.map(
                                                (payslip) => (

                                                    <tr
                                                        key={
                                                            payslip.id
                                                        }
                                                    >

                                                        <td>

                                                            <div className="payslip-employee">

                                                                <div className="payslip-employee-code">
                                                                    {payslip.employeeCode}
                                                                </div>

                                                                <div className="payslip-employee-name">
                                                                    {payslip.employeeName}
                                                                </div>

                                                            </div>

                                                        </td>


                                                        <td>
                                                            {payslip.payMonth}
                                                        </td>


                                                        <td>
                                                            {formatMoney(
                                                                payslip.grossSalary
                                                            )}
                                                        </td>


                                                        <td>
                                                            {formatMoney(
                                                                payslip.totalDeductions
                                                            )}
                                                        </td>


                                                        <td className="payslip-net">
                                                            {formatMoney(
                                                                payslip.netSalary
                                                            )}
                                                        </td>


                                                        <td>

                                                            <span className="payslip-status">
                                                                {payslip.status}
                                                            </span>

                                                        </td>


                                                        <td>

                                                            <div className="payslip-actions">

                                                                <button
                                                                    className="payslip-view-button"
                                                                    onClick={() =>
                                                                        handleView(
                                                                            payslip.id
                                                                        )
                                                                    }
                                                                >
                                                                    View
                                                                </button>


                                                                <button
                                                                    className="payslip-email-button"
                                                                    onClick={() =>
                                                                        handleSendEmail(
                                                                            payslip.id
                                                                        )
                                                                    }
                                                                >
                                                                    Email
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

                    )}

                </main>

            </div>


            {/* =================================================
                GENERATE MODAL
            ================================================= */}

            {showGenerate && (

                <div className="payslip-modal-overlay">

                    <div className="payslip-modal">

                        <div className="payslip-modal-header">

                            <div>

                                <div className="payslip-eyebrow">
                                    PAYROLL
                                </div>

                                <h2>
                                    Generate Payslip
                                </h2>

                                <p>
                                    Generate the monthly payslip for an employee.
                                </p>

                            </div>


                            <button
                                className="payslip-close"
                                onClick={
                                    closeGenerateModal
                                }
                                disabled={saving}
                            >
                                ×
                            </button>

                        </div>


                        <form
                            className="payslip-form"
                            onSubmit={handleGenerate}
                        >

                            <div className="payslip-form-group">

                                <label>
                                    Employee
                                </label>

                                <select
                                    name="employeeId"
                                    value={
                                        formData.employeeId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={saving}
                                    required
                                >

                                    <option value="">
                                        Select employee
                                    </option>


                                    {employees.map(
                                        (employee) => (

                                            <option
                                                key={
                                                    employee.id
                                                }
                                                value={
                                                    employee.id
                                                }
                                            >
                                                {employee.employeeCode}
                                                {" — "}
                                                {employee.name}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            <div className="payslip-form-group">

                                <label>
                                    Pay Period
                                </label>

                                <input
                                    type="month"
                                    name="payPeriod"
                                    value={
                                        formData.payPeriod
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={saving}
                                    required
                                />

                            </div>


                            {error && (

                                <div className="payslip-form-error">
                                    {error}
                                </div>

                            )}


                            {success && (

                                <div className="payslip-form-success">
                                    {success}
                                </div>

                            )}


                            <div className="payslip-form-actions">

                                <button
                                    type="button"
                                    className="payslip-cancel-button"
                                    onClick={
                                        closeGenerateModal
                                    }
                                    disabled={saving}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="payslip-save-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Generating..."
                                        : "Generate Payslip"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =================================================
                VIEW MODAL
            ================================================= */}

            {selectedPayslip && (

                <div className="payslip-modal-overlay">

                    <div className="payslip-view-modal">

                        <div className="payslip-modal-header">

                            <div>

                                <div className="payslip-eyebrow">
                                    PAYSLIP
                                </div>

                                <h2>
                                    {selectedPayslip.employeeName}
                                </h2>

                                <p>
                                    {selectedPayslip.employeeCode}
                                    {" • "}
                                    {selectedPayslip.payMonth}
                                </p>

                            </div>


                            <button
                                className="payslip-close"
                                onClick={() =>
                                    setSelectedPayslip(null)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="payslip-details">


                            <div className="payslip-detail-grid">

                                <div>
                                    <span>
                                        Department
                                    </span>

                                    <strong>
                                        {selectedPayslip.department}
                                    </strong>
                                </div>


                                <div>
                                    <span>
                                        Designation
                                    </span>

                                    <strong>
                                        {selectedPayslip.designation}
                                    </strong>
                                </div>

                            </div>


                            <div className="payslip-detail-section">

                                <h3>
                                    Earnings
                                </h3>

                                <div className="payslip-detail-row">
                                    <span>
                                        Basic Salary
                                    </span>

                                    <strong>
                                        {formatMoney(
                                            selectedPayslip.basicSalary
                                        )}
                                    </strong>
                                </div>


                                <div className="payslip-detail-row">
                                    <span>
                                        HRA
                                    </span>

                                    <strong>
                                        {formatMoney(
                                            selectedPayslip.hra
                                        )}
                                    </strong>
                                </div>


                                <div className="payslip-detail-row">
                                    <span>
                                        Special Allowance
                                    </span>

                                    <strong>
                                        {formatMoney(
                                            selectedPayslip.specialAllowance
                                        )}
                                    </strong>
                                </div>


                                <div className="payslip-detail-row total">
                                    <span>
                                        Gross Salary
                                    </span>

                                    <strong>
                                        {formatMoney(
                                            selectedPayslip.grossSalary
                                        )}
                                    </strong>
                                </div>

                            </div>


                            <div className="payslip-detail-section">

                                <h3>
                                    Deductions
                                </h3>


                                <div className="payslip-detail-row">
                                    <span>
                                        PF
                                    </span>

                                    <strong>
                                        {formatMoney(
                                            selectedPayslip.pf
                                        )}
                                    </strong>
                                </div>


                                <div className="payslip-detail-row">
                                    <span>
                                        ESI
                                    </span>

                                    <strong>
                                        {formatMoney(
                                            selectedPayslip.esi
                                        )}
                                    </strong>
                                </div>


                                <div className="payslip-detail-row">
                                    <span>
                                        Professional Tax
                                    </span>

                                    <strong>
                                        {formatMoney(
                                            selectedPayslip.professionalTax
                                        )}
                                    </strong>
                                </div>


                                <div className="payslip-detail-row total">
                                    <span>
                                        Total Deductions
                                    </span>

                                    <strong>
                                        {formatMoney(
                                            selectedPayslip.totalDeductions
                                        )}
                                    </strong>
                                </div>

                            </div>


                            <div className="payslip-leave-summary">

                                <h3>
                                    Leave Balance
                                </h3>

                                <div className="payslip-leave-grid">

                                    <div>
                                        <span>
                                            Casual
                                        </span>

                                        <strong>
                                            {selectedPayslip.casualLeave}
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Sick
                                        </span>

                                        <strong>
                                            {selectedPayslip.sickLeave}
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Earned
                                        </span>

                                        <strong>
                                            {selectedPayslip.earnedLeave}
                                        </strong>
                                    </div>

                                </div>

                            </div>


                            <div className="payslip-final">

                                <span>
                                    Net Salary
                                </span>

                                <strong>
                                    {formatMoney(
                                        selectedPayslip.netSalary
                                    )}
                                </strong>

                            </div>


                            <button
                                className="payslip-email-full-button"
                                onClick={() =>
                                    handleSendEmail(
                                        selectedPayslip.id
                                    )
                                }
                            >
                                ✉ Resend Payslip Email
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Payslips;