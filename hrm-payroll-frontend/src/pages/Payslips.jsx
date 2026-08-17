import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Payslips.css";
import toast from "react-hot-toast";


function Payslips() {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

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


    // =====================================================
    // AUTH
    // =====================================================

    const token =
        localStorage.getItem("token");


    const role =
        localStorage
            .getItem("role")
            ?.toUpperCase() || "EMPLOYEE";


    const isHR =
        role === "HR" ||
        role === "ADMIN";


    const authConfig = {

        headers: {

            Authorization:
                `Bearer ${token}`
        }
    };


    // =====================================================
    // FETCH EMPLOYEES
    // =====================================================

    const fetchEmployees = async () => {

        if (!isHR) {

            setEmployees([]);

            return;
        }


        const response =
            await axios.get(
                "http://localhost:8090/api/employees",
                authConfig
            );


        setEmployees(
            response.data.filter(
                (employee) =>
                    employee.active
            )
        );
    };


    // =====================================================
    // FETCH PAYSLIPS
    // =====================================================

    const fetchPayslips = async () => {

        const url =
            isHR
                ? "http://localhost:8090/api/payslips"
                : "http://localhost:8090/api/payslips/my";


        const response =
            await axios.get(
                url,
                authConfig
            );


        const sortedPayslips =
            [...response.data].sort(
                (a, b) =>
                    b.payMonth.localeCompare(
                        a.payMonth
                    )
            );


        setPayslips(
            sortedPayslips
        );
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


        // =================================================
        // VALIDATE EMPLOYEE
        // =================================================

        if (!formData.employeeId) {

            toast.error(
                "Please select an employee."
            );

            return;
        }


        // =================================================
        // VALIDATE PAY PERIOD
        // =================================================

        if (!formData.payPeriod) {

            toast.error(
                "Please select a pay period."
            );

            return;
        }


        try {

            setSaving(true);


            console.log(
                "======================================"
            );

            console.log(
                "GENERATING PAYSLIP"
            );

            console.log(
                "Employee ID:",
                formData.employeeId
            );

            console.log(
                "Pay Period:",
                formData.payPeriod
            );

            console.log(
                "======================================"
            );


            // =================================================
            // GENERATE PAYSLIP
            // =================================================

            const response =
                await axios.post(

                    `http://localhost:8090/api/payslips/generate/${formData.employeeId}?payPeriod=${formData.payPeriod}`,

                    {},

                    authConfig
                );


            console.log(
                "GENERATE PAYSLIP RESPONSE:",
                response.data
            );


            // =================================================
            // STORE GENERATED PAYSLIP
            // =================================================

            setSelectedPayslip(
                response.data
            );


            // =================================================
            // SUCCESS TOAST
            // =================================================

            toast.success(
                response.data?.message ||
                "Payslip generated successfully."
            );


            setSuccess(
                response.data?.message ||
                "Payslip generated successfully."
            );


            // =================================================
            // REFRESH PAYSLIPS
            // =================================================

            await fetchPayslips();


            // =================================================
            // CLOSE MODAL
            // =================================================

            setTimeout(() => {

                setShowGenerate(false);

                setSelectedPayslip(null);

            }, 1000);


        } catch (err) {

            // =================================================
            // PRINT COMPLETE ERROR
            // =================================================

            console.error(
                "======================================"
            );

            console.error(
                "GENERATE PAYSLIP ERROR"
            );

            console.error(
                "======================================"
            );

            console.error(
                "Status:",
                err.response?.status
            );

            console.error(
                "Response:",
                err.response?.data
            );

            console.error(
                "Message:",
                err.response?.data?.message
            );

            console.error(
                "Full Axios Error:",
                err
            );


            // =================================================
            // UNAUTHORIZED
            // =================================================

            if (
                err.response?.status === 401
            ) {

                localStorage.clear();

                navigate("/login");

                return;
            }


            // =================================================
            // EXTRACT BACKEND MESSAGE
            // =================================================

            let backendMessage = null;


            if (
                err.response?.data
            ) {

                // ---------------------------------------------
                // Backend response:
                //
                // {
                //     "message": "Some error"
                // }
                // ---------------------------------------------

                if (
                    typeof err.response.data.message ===
                    "string"
                ) {

                    backendMessage =
                        err.response.data.message;
                }


                // ---------------------------------------------
                // Backend response is plain String
                // ---------------------------------------------

                else if (
                    typeof err.response.data ===
                    "string"
                ) {

                    backendMessage =
                        err.response.data;
                }
            }


            // =================================================
            // SHOW ACTUAL BACKEND ERROR
            // =================================================

            if (
                backendMessage &&
                backendMessage.trim()
            ) {

                console.error(
                    "BACKEND ERROR:",
                    backendMessage
                );


                toast.error(
                    backendMessage,
                    {
                        duration: 7000
                    }
                );


                setError(
                    backendMessage
                );


            } else {

                toast.error(
                    "Unable to generate payslip. Check the backend console.",
                    {
                        duration: 5000
                    }
                );


                setError(
                    "Unable to generate payslip. Check the backend console."
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


            toast.success(
                "Payslip email sent successfully."
            );


            setSuccess(
                "Payslip email sent successfully."
            );


            await fetchPayslips();


            setTimeout(() => {

                setSuccess("");

            }, 3000);


        } catch (err) {

            console.error(
                "Send email error:",
                err
            );


            if (
                err.response?.status === 401
            ) {

                localStorage.clear();

                navigate("/login");

                return;
            }


            const backendMessage =
                err.response?.data?.message ||
                (
                    typeof err.response?.data ===
                    "string"
                        ? err.response.data
                        : null
                );


            toast.error(
                backendMessage ||
                "Unable to send payslip email.",
                {
                    duration: 7000
                }
            );


            setError(
                backendMessage ||
                "Unable to send payslip email."
            );
        }
    };


    // =====================================================
    // VIEW PAYSLIP
    // =====================================================

    const handleView = (id) => {

        try {

            setError("");


            const payslip =
                payslips.find(
                    (item) =>
                        Number(item.id) ===
                        Number(id)
                );


            if (!payslip) {

                setError(
                    "Payslip not found."
                );

                return;
            }


            setSelectedPayslip(
                payslip
            );


        } catch (err) {

            console.error(
                "View payslip error:",
                err
            );


            setError(
                "Unable to load payslip."
            );
        }
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
                MAIN
            ================================================= */}

            <div className="payslip-main">


                {/* =================================================
                    TOPBAR
                ================================================= */}

                <header className="payslip-topbar">

                    <div>

                        <div className="payslip-eyebrow">

                            {isHR
                                ? "HR WORKSPACE"
                                : "EMPLOYEE WORKSPACE"}

                        </div>


                        <h1>

                            {isHR
                                ? "Payslips"
                                : "My Payslips"}

                        </h1>


                        <p>

                            {isHR
                                ? "Generate, view and send employee payslips."
                                : "View your generated payslips and payroll information."}

                        </p>

                    </div>

                </header>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <main className="payslip-content">


                    {/* =================================================
                        HEADER
                    ================================================= */}

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


                        {isHR && (

                            <button
                                className="payslip-generate-button"
                                onClick={
                                    openGenerateModal
                                }
                            >

                                + Generate Payslip

                            </button>

                        )}

                    </div>


                    {/* =================================================
                        MESSAGES
                    ================================================= */}

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


                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading ? (

                        <div className="payslip-loading">

                            Loading payslips...

                        </div>

                    ) : (

                        <section className="payslip-card">


                            {/* =================================================
                                CARD HEADING
                            ================================================= */}

                            <div className="payslip-card-heading">

                                <div>

                                    <h3>

                                        Employee Payslips

                                    </h3>


                                    <p>

                                        {isHR
                                            ? "All generated employee payslips."
                                            : "Your generated payslips."}

                                    </p>

                                </div>


                                <div className="payslip-total-count">

                                    <span>

                                        Total Payslips:

                                    </span>


                                    <strong>

                                        {payslips.length}

                                    </strong>

                                </div>

                            </div>


                            {/* =================================================
                                TABLE
                            ================================================= */}

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


                                                        {/* EMPLOYEE */}

                                                        <td>

                                                            <div className="payslip-employee">

                                                                <div className="payslip-employee-code">

                                                                    {
                                                                        payslip.employeeCode
                                                                    }

                                                                </div>


                                                                <div className="payslip-employee-name">

                                                                    {
                                                                        payslip.employeeName
                                                                    }

                                                                </div>

                                                            </div>

                                                        </td>


                                                        {/* PAY MONTH */}

                                                        <td>

                                                            {
                                                                payslip.payMonth
                                                            }

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

                                                        <td className="payslip-net">

                                                            {formatMoney(
                                                                payslip.netSalary
                                                            )}

                                                        </td>


                                                        {/* STATUS */}

                                                        <td>

                                                            <span className="payslip-status">

                                                                {
                                                                    payslip.status
                                                                }

                                                            </span>

                                                        </td>


                                                        {/* ACTIONS */}

                                                        <td>

                                                            <div className="payslip-actions">


                                                                {/* VIEW */}

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


                                                                {/* EMAIL */}

                                                                {isHR && (

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

                                                                )}

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


                        {/* HEADER */}

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


                        {/* FORM */}

                        <form
                            className="payslip-form"
                            onSubmit={
                                handleGenerate
                            }
                        >


                            {/* EMPLOYEE */}

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

                                                {
                                                    employee.employeeCode
                                                }

                                                {" — "}

                                                {
                                                    employee.name
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* PAY PERIOD */}

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


                            {/* FORM ERROR */}

                            {error && (

                                <div className="payslip-form-error">

                                    {error}

                                </div>

                            )}


                            {/* FORM SUCCESS */}

                            {success && (

                                <div className="payslip-form-success">

                                    {success}

                                </div>

                            )}


                            {/* BUTTONS */}

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


                        {/* HEADER */}

                        <div className="payslip-modal-header">

                            <div>

                                <div className="payslip-eyebrow">

                                    PAYSLIP

                                </div>


                                <h2>

                                    {
                                        selectedPayslip.employeeName
                                    }

                                </h2>


                                <p>

                                    {
                                        selectedPayslip.employeeCode
                                    }

                                    {" • "}

                                    {
                                        selectedPayslip.payMonth
                                    }

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


                        {/* DETAILS */}

                        <div className="payslip-details">


                            {/* EMPLOYEE DETAILS */}

                            <div className="payslip-detail-grid">

                                <div>

                                    <span>
                                        Department
                                    </span>


                                    <strong>

                                        {
                                            selectedPayslip.department
                                        }

                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Designation
                                    </span>


                                    <strong>

                                        {
                                            selectedPayslip.designation
                                        }

                                    </strong>

                                </div>

                            </div>


                            {/* EARNINGS */}

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


                            {/* DEDUCTIONS */}

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


                            {/* LEAVE BALANCE */}

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

                                            {
                                                selectedPayslip.casualLeave
                                            }

                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Sick
                                        </span>


                                        <strong>

                                            {
                                                selectedPayslip.sickLeave
                                            }

                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Earned
                                        </span>


                                        <strong>

                                            {
                                                selectedPayslip.earnedLeave
                                            }

                                        </strong>

                                    </div>

                                </div>

                            </div>


                            {/* NET SALARY */}

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


                            {/* EMAIL STATUS */}

                            {selectedPayslip.emailStatus && (

                                <div
                                    className={
                                        selectedPayslip.emailStatus === "SENT"
                                            ? "payslip-email-status sent"
                                            : "payslip-email-status failed"
                                    }
                                >

                                    <strong>
                                        Email Status:
                                    </strong>


                                    <span>

                                        {
                                            selectedPayslip.emailStatus
                                        }

                                    </span>


                                    {selectedPayslip.message && (

                                        <p>

                                            {
                                                selectedPayslip.message
                                            }

                                        </p>

                                    )}

                                </div>

                            )}


                            {/* RESEND EMAIL */}

                            {isHR && (

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

                            )}

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}


export default Payslips;