import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Payroll.css";

function Payroll() {

    const navigate = useNavigate();

    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };


    // =====================================================
    // FETCH PAYROLL
    // =====================================================

    const fetchPayrolls = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:8090/api/payrolls",
                authConfig
            );

            // Newest payroll first
           const sortedPayrolls = [...response.data].sort(
    (a, b) => {

        // First sort by pay month - newest first
        const monthComparison =
            b.payPeriod.localeCompare(
                a.payPeriod
            );

        if (monthComparison !== 0) {
            return monthComparison;
        }

        // If same month, latest processed record first
        return (
            new Date(b.processedAt || 0) -
            new Date(a.processedAt || 0)
        );
    }
);
            setPayrolls(sortedPayrolls);

        } catch (err) {

            console.error(
                "Payroll loading error:",
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
                    "Unable to load payroll records."
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
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");

        navigate("/login");
    };


    return (

        <div className="payroll-page">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="payroll-sidebar">

                <div className="payroll-brand">

                    <div className="payroll-logo">
                        H
                    </div>

                    <div>

                        <div className="payroll-brand-name">
                            HRM
                        </div>

                        <div className="payroll-brand-subtitle">
                            PAYROLL
                            <br />
                            AUTOMATION
                        </div>

                    </div>

                </div>


                <nav className="payroll-navigation">

                    <button
                        className="payroll-menu-item"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        <span className="payroll-menu-icon">
                            ⌂
                        </span>

                        <span>
                            Dashboard
                        </span>
                    </button>


                    <button
                        className="payroll-menu-item"
                        onClick={() =>
                            navigate("/employees")
                        }
                    >
                        <span className="payroll-menu-icon">
                            ♙
                        </span>

                        <span>
                            Employees
                        </span>
                    </button>


                    <button
                        className="payroll-menu-item"
                        onClick={() =>
                            navigate("/salary-structures")
                        }
                    >
                        <span className="payroll-menu-icon">
                            ₹
                        </span>

                        <span>
                            Salary Structures
                        </span>
                    </button>


                    <button
                        className="payroll-menu-item"
                        onClick={() =>
                            navigate("/leave-management")
                        }
                    >
                        <span className="payroll-menu-icon">
                            ◷
                        </span>

                        <span>
                            Leave Management
                        </span>
                    </button>


                    <button
                        className="payroll-menu-item active"
                        onClick={() =>
                            navigate("/payroll")
                        }
                    >
                        <span className="payroll-menu-icon">
                            ▣
                        </span>

                        <span>
                            Payroll
                        </span>
                    </button>


                    <button
                        className="payroll-menu-item"
                        onClick={() =>
                            navigate("/payslips")
                        }
                    >
                        <span className="payroll-menu-icon">
                            ▤
                        </span>

                        <span>
                            Payslips
                        </span>
                    </button>


                    <button
                        className="payroll-menu-item"
                        onClick={() =>
                            navigate("/email-logs")
                        }
                    >
                        <span className="payroll-menu-icon">
                            ✉
                        </span>

                        <span>
                            Email Logs
                        </span>
                    </button>


                    <button
                        className="payroll-menu-item"
                        onClick={() =>
                            navigate("/reports")
                        }
                    >
                        <span className="payroll-menu-icon">
                            ▥
                        </span>

                        <span>
                            Reports
                        </span>
                    </button>


                    <button
                        className="payroll-menu-item"
                        onClick={() =>
                            navigate("/settings")
                        }
                    >
                        <span className="payroll-menu-icon">
                            ⚙
                        </span>

                        <span>
                            Settings
                        </span>
                    </button>

                </nav>


                {/* USER */}

                <div className="payroll-sidebar-footer">

                    <div className="payroll-user">

                        <div className="payroll-user-avatar">

                            {(
                                localStorage.getItem(
                                    "username"
                                ) || "A"
                            )
                                .charAt(0)
                                .toUpperCase()}

                        </div>

                        <div>

                            <div className="payroll-user-name">
                                {localStorage.getItem(
                                    "username"
                                ) || "Admin"}
                            </div>

                            <div className="payroll-user-role">
                                {localStorage.getItem(
                                    "role"
                                ) || "HR"}
                            </div>

                        </div>

                    </div>


                    <button
                        className="payroll-logout"
                        onClick={handleLogout}
                    >
                        ↪ Logout
                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN
            ================================================= */}

            <div className="payroll-main">


                <header className="payroll-topbar">

                    <div>

                        <div className="payroll-eyebrow">
                            HR WORKSPACE
                        </div>

                        <h1>
                            Payroll
                        </h1>

                        <p>
                            View processed employee payroll records.
                        </p>

                    </div>

                </header>


                <main className="payroll-content">


                    <div className="payroll-section-header">

                        <div>

                            <div className="payroll-eyebrow">
                                PAYROLL PROCESSING
                            </div>

                            <h2>
                                Payroll Records
                            </h2>

                            <p>
                                View salary calculations and processed payroll.
                            </p>

                        </div>


                        <div className="payroll-total-count">

                            <span>
                                Total Payrolls:
                            </span>

                            <strong>
                                {payrolls.length}
                            </strong>

                        </div>

                    </div>


                    {error && (

                        <div className="payroll-error">
                            {error}
                        </div>

                    )}


                    {loading ? (

                        <div className="payroll-loading">
                            Loading payroll records...
                        </div>

                    ) : (

                        <section className="payroll-card">

                            <div className="payroll-card-heading">

                                <div>

                                    <h3>
                                        Employee Payroll
                                    </h3>

                                    <p>
                                        Latest processed payroll appears first.
                                    </p>

                                </div>

                            </div>


                            <div className="payroll-table-wrapper">

                                <table className="payroll-table">

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
                                                Processed At
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {payrolls.length === 0 ? (

                                            <tr>

                                                <td
                                                    colSpan="7"
                                                    className="payroll-empty"
                                                >
                                                    No payroll records found.
                                                </td>

                                            </tr>

                                        ) : (

                                            payrolls.map(
                                                (payroll) => (

                                                    <tr
                                                        key={
                                                            payroll.id
                                                        }
                                                    >

                                                        <td>

                                                            <div className="payroll-employee">

                                                                <div className="payroll-employee-code">
                                                                    {payroll.employeeCode}
                                                                </div>

                                                                <div className="payroll-employee-name">
                                                                    {payroll.employeeName}
                                                                </div>

                                                                <div className="payroll-employee-department">
                                                                    {payroll.department}
                                                                </div>

                                                            </div>

                                                        </td>


                                                        <td>
                                                            {payroll.payPeriod}
                                                        </td>


                                                        <td>
                                                            {formatMoney(
                                                                payroll.grossSalary
                                                            )}
                                                        </td>


                                                        <td>
                                                            {formatMoney(
                                                                payroll.totalDeductions
                                                            )}
                                                        </td>


                                                        <td className="payroll-net">
                                                            {formatMoney(
                                                                payroll.netSalary
                                                            )}
                                                        </td>


                                                        <td>

                                                            <span className="payroll-status">
                                                                {payroll.status}
                                                            </span>

                                                        </td>


                                                        <td>

                                                            {payroll.processedAt
                                                                ? new Date(
                                                                    payroll.processedAt
                                                                ).toLocaleString(
                                                                    "en-IN",
                                                                    {
                                                                        day: "2-digit",
                                                                        month: "short",
                                                                        year: "numeric",
                                                                        hour: "2-digit",
                                                                        minute: "2-digit"
                                                                    }
                                                                )
                                                                : "-"
                                                            }

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

export default Payroll;