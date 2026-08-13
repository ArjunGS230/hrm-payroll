import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EmailLogs.css";

function EmailLogs() {

    const navigate = useNavigate();

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };


    // =====================================================
    // FETCH EMAIL LOGS
    // =====================================================

    const fetchLogs = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:8090/api/email-logs",
                authConfig
            );

            setLogs(response.data);

        } catch (err) {

            console.error(
                "Email logs loading error:",
                err
            );

            if (err.response?.status === 401) {

                localStorage.clear();

                navigate("/login");

            } else {

                setError(
                    err.response?.data?.message ||
                    "Unable to load email logs."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // RETRY EMAIL
    // =====================================================

    const retryEmail = async (id) => {

        try {

            await axios.post(
                `http://localhost:8090/api/email-logs/${id}/retry`,
                {},
                authConfig
            );

            alert(
                "Payslip email sent successfully"
            );

            // Refresh email logs
            fetchLogs();

        } catch (err) {

            console.error(
                "Retry email error:",
                err
            );

            if (err.response?.status === 401) {

                localStorage.clear();

                navigate("/login");

            } else {

                alert(
                    err.response?.data ||
                    err.response?.data?.message ||
                    "Failed to retry email."
                );
            }
        }
    };


    // =====================================================
    // LOAD EMAIL LOGS
    // =====================================================

    useEffect(() => {

        if (!token) {

            navigate("/login");

            return;
        }

        fetchLogs();

    }, []);


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {

            return "-";
        }

        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
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
    // UI
    // =====================================================

    return (

        <div className="email-logs-page">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="email-logs-sidebar">

                <div className="email-logs-brand">

                    <div className="email-logs-logo">
                        H
                    </div>

                    <div>

                        <div className="email-logs-brand-name">
                            HRM
                        </div>

                        <div className="email-logs-brand-subtitle">
                            PAYROLL
                            <br />
                            AUTOMATION
                        </div>

                    </div>

                </div>


                <nav className="email-logs-navigation">

                    <button
                        className="email-logs-menu-item"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        <span className="email-logs-menu-icon">
                            ⌂
                        </span>

                        Dashboard

                    </button>


                    <button
                        className="email-logs-menu-item"
                        onClick={() =>
                            navigate("/employees")
                        }
                    >
                        <span className="email-logs-menu-icon">
                            ♙
                        </span>

                        Employees

                    </button>


                    <button
                        className="email-logs-menu-item"
                        onClick={() =>
                            navigate("/salary-structures")
                        }
                    >
                        <span className="email-logs-menu-icon">
                            ₹
                        </span>

                        Salary Structures

                    </button>


                    <button
                        className="email-logs-menu-item"
                        onClick={() =>
                            navigate("/leave-management")
                        }
                    >
                        <span className="email-logs-menu-icon">
                            ◷
                        </span>

                        Leave Management

                    </button>


                    <button
                        className="email-logs-menu-item"
                        onClick={() =>
                            navigate("/payroll")
                        }
                    >
                        <span className="email-logs-menu-icon">
                            ▣
                        </span>

                        Payroll

                    </button>


                    <button
                        className="email-logs-menu-item"
                        onClick={() =>
                            navigate("/payslips")
                        }
                    >
                        <span className="email-logs-menu-icon">
                            ▤
                        </span>

                        Payslips

                    </button>


                    <button
                        className="email-logs-menu-item active"
                        onClick={() =>
                            navigate("/email-logs")
                        }
                    >
                        <span className="email-logs-menu-icon">
                            ✉
                        </span>

                        Email Logs

                    </button>


                    <button
                        className="email-logs-menu-item"
                        onClick={() =>
                            navigate("/reports")
                        }
                    >
                        <span className="email-logs-menu-icon">
                            ▥
                        </span>

                        Reports

                    </button>


                    <button
                        className="email-logs-menu-item"
                        onClick={() =>
                            navigate("/settings")
                        }
                    >
                        <span className="email-logs-menu-icon">
                            ⚙
                        </span>

                        Settings

                    </button>

                </nav>


                {/* =================================================
                    USER
                ================================================= */}

                <div className="email-logs-sidebar-footer">

                    <div className="email-logs-user">

                        <div className="email-logs-user-avatar">

                            {(
                                localStorage.getItem(
                                    "username"
                                ) || "A"
                            )
                                .charAt(0)
                                .toUpperCase()}

                        </div>

                        <div>

                            <div className="email-logs-user-name">

                                {localStorage.getItem(
                                    "username"
                                ) || "Admin"}

                            </div>

                            <div className="email-logs-user-role">

                                {localStorage.getItem(
                                    "role"
                                ) || "HR"}

                            </div>

                        </div>

                    </div>


                    <button
                        className="email-logs-logout"
                        onClick={handleLogout}
                    >
                        ↪ Logout
                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN
            ================================================= */}

            <div className="email-logs-main">

                <header className="email-logs-topbar">

                    <div>

                        <div className="email-logs-eyebrow">
                            HR WORKSPACE
                        </div>

                        <h1>
                            Email Logs
                        </h1>

                        <p>
                            Track automatic payslip email delivery.
                        </p>

                    </div>

                </header>


                <main className="email-logs-content">

                    <div className="email-logs-section-header">

                        <div>

                            <div className="email-logs-eyebrow">
                                EMAIL DELIVERY
                            </div>

                            <h2>
                                Email Activity
                            </h2>

                            <p>
                                Latest email activity appears first.
                            </p>

                        </div>


                        <div className="email-logs-total-count">

                            <span>
                                Total Emails:
                            </span>

                            <strong>
                                {logs.length}
                            </strong>

                        </div>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="email-logs-error">
                            {error}
                        </div>

                    )}


                    {/* LOADING */}

                    {loading ? (

                        <div className="email-logs-loading">
                            Loading email logs...
                        </div>

                    ) : (

                        <section className="email-logs-card">

                            <div className="email-logs-card-heading">

                                <div>

                                    <h3>
                                        Payslip Email History
                                    </h3>

                                    <p>
                                        Automatic email delivery records.
                                    </p>

                                </div>

                            </div>


                            <div className="email-logs-table-wrapper">

                                <table className="email-logs-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Employee
                                            </th>

                                            <th>
                                                Email
                                            </th>

                                            <th>
                                                Pay Month
                                            </th>

                                            <th>
                                                Payslip
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                            <th>
                                                Sent At
                                            </th>

                                            <th>
                                                Retry
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {logs.length === 0 ? (

                                            <tr>

                                                <td
                                                    colSpan="7"
                                                    className="email-logs-empty"
                                                >
                                                    No email logs found.
                                                </td>

                                            </tr>

                                        ) : (

                                            logs.map(
                                                (log) => (

                                                    <tr
                                                        key={log.id}
                                                    >

                                                        {/* EMPLOYEE */}

                                                        <td>

                                                            <div className="email-logs-employee">

                                                                <div className="email-logs-employee-code">

                                                                    {log.employeeCode}

                                                                </div>

                                                                <div className="email-logs-employee-name">

                                                                    {log.employeeName}

                                                                </div>

                                                            </div>

                                                        </td>


                                                        {/* EMAIL */}

                                                        <td>
                                                            {log.email}
                                                        </td>


                                                        {/* PAY MONTH */}

                                                        <td>
                                                            {log.payPeriod || "-"}
                                                        </td>


                                                        {/* PAYSLIP */}

                                                        <td>
                                                            #{log.payslipId}
                                                        </td>


                                                        {/* STATUS */}

                                                        <td>

                                                            <span
                                                                className={
                                                                    log.status === "SENT"
                                                                        ? "email-log-status sent"
                                                                        : "email-log-status failed"
                                                                }
                                                            >
                                                                {log.status}
                                                            </span>

                                                        </td>


                                                        {/* SENT AT */}

                                                        <td>
                                                            {formatDate(
                                                                log.sentAt
                                                            )}
                                                        </td>


                                                        {/* RETRY */}

                                                        <td>

                                                            <div className="email-logs-retry">

                                                                <span>
                                                                    {log.retryCount ?? 0}
                                                                </span>


                                                                {log.status === "FAILED" && (

                                                                    <button
                                                                        type="button"
                                                                        className="email-logs-retry-button"
                                                                        onClick={() =>
                                                                            retryEmail(
                                                                                log.id
                                                                            )
                                                                        }
                                                                    >
                                                                        Retry
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

        </div>
    );
}

export default EmailLogs;