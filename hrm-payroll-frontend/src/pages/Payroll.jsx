import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Payroll.css";


function Payroll() {

    const navigate = useNavigate();


    // =====================================================
    // PAYROLL STATE
    // =====================================================

    const [payrolls, setPayrolls] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // SCHEDULER STATE
    // =====================================================

    const [schedule, setSchedule] = useState(null);

    const [scheduleLoading, setScheduleLoading] =
        useState(true);

    const [scheduleSaving, setScheduleSaving] =
        useState(false);

    const [runningNow, setRunningNow] =
        useState(false);

    const [scheduleMessage, setScheduleMessage] =
        useState("");

    const [scheduleError, setScheduleError] =
        useState("");


    // =====================================================
    // PAYROLL PROCESSING RESULT
    // Shows generated / skipped / failed details
    // =====================================================

    const [
        payrollProcessingResult,
        setPayrollProcessingResult
    ] = useState(null);


    // =====================================================
    // SCHEDULER FORM
    // =====================================================

    const [scheduleEnabled, setScheduleEnabled] =
        useState(true);

    const [frequency, setFrequency] =
        useState("MONTH_END");

    const [executionTime, setExecutionTime] =
        useState("23:59");


    // =====================================================
    // PAYROLL MONTH
    // Example: 2026-08
    // =====================================================

    const [payrollPeriod, setPayrollPeriod] =
        useState("");


    // =====================================================
    // AUTH
    // =====================================================

    const token =
        localStorage.getItem("token");


    const authConfig = {

        headers: {

            Authorization:
                `Bearer ${token}`
        }
    };


    // =====================================================
    // FETCH PAYROLL
    // =====================================================

    const fetchPayrolls = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await axios.get(
                    "http://localhost:8090/api/payrolls",
                    authConfig
                );


            // -------------------------------------------------
            // NEWEST PAYROLL FIRST
            // -------------------------------------------------

            const sortedPayrolls =
                [...response.data].sort(
                    (a, b) => {

                        const monthComparison =
                            b.payPeriod.localeCompare(
                                a.payPeriod
                            );


                        if (
                            monthComparison !== 0
                        ) {

                            return monthComparison;
                        }


                        return (
                            new Date(
                                b.processedAt || 0
                            ) -
                            new Date(
                                a.processedAt || 0
                            )
                        );
                    }
                );


            setPayrolls(
                sortedPayrolls
            );


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


    // =====================================================
    // FETCH SCHEDULER CONFIGURATION
    // =====================================================

    const fetchSchedule = async () => {

        try {

            setScheduleLoading(true);

            setScheduleError("");


            const response =
                await axios.get(
                    "http://localhost:8090/api/payroll-schedule",
                    authConfig
                );


            const data =
                response.data;


            setSchedule(data);


            // -------------------------------------------------
            // SET FORM VALUES
            // -------------------------------------------------

            setScheduleEnabled(
                data.enabled
            );


            setFrequency(
                data.frequency ||
                "MONTH_END"
            );


            setExecutionTime(
                data.executionTime ||
                "23:59"
            );


            // -------------------------------------------------
            // SET PAYROLL MONTH
            // -------------------------------------------------

            setPayrollPeriod(
                data.payrollPeriod ||
                new Date()
                    .toISOString()
                    .slice(0, 7)
            );


        } catch (err) {

            console.error(
                "Schedule loading error:",
                err
            );


            if (
                err.response?.status === 401
            ) {

                localStorage.clear();

                navigate("/login");

                return;
            }


            setScheduleError(
                err.response?.data?.message ||
                "Unable to load payroll schedule."
            );


        } finally {

            setScheduleLoading(false);
        }
    };


    // =====================================================
    // SAVE SCHEDULE
    // =====================================================

    const saveSchedule = async () => {

        try {

            setScheduleSaving(true);

            setScheduleMessage("");

            setScheduleError("");

            setPayrollProcessingResult(null);


            // -------------------------------------------------
            // VALIDATE PAYROLL MONTH
            // -------------------------------------------------

            if (!payrollPeriod) {

                setScheduleError(
                    "Please select a payroll month."
                );

                return;
            }


            // -------------------------------------------------
            // REQUEST DATA
            // -------------------------------------------------

            const requestData = {

                enabled:
                    scheduleEnabled,

                frequency:
                    frequency,

                executionTime:
                    executionTime,

                payrollPeriod:
                    payrollPeriod
            };


            const response =
                await axios.put(
                    "http://localhost:8090/api/payroll-schedule",
                    requestData,
                    authConfig
                );


            setSchedule(
                response.data
            );


            // -------------------------------------------------
            // UPDATE FORM WITH SAVED DATA
            // -------------------------------------------------

            setScheduleEnabled(
                response.data.enabled
            );


            setFrequency(
                response.data.frequency ||
                "MONTH_END"
            );


            setExecutionTime(
                response.data.executionTime ||
                "23:59"
            );


            setPayrollPeriod(
                response.data.payrollPeriod ||
                payrollPeriod
            );


            setScheduleMessage(
                "Payroll schedule saved successfully."
            );


            // -------------------------------------------------
            // REMOVE MESSAGE AFTER 4 SECONDS
            // -------------------------------------------------

            setTimeout(() => {

                setScheduleMessage("");

            }, 4000);


        } catch (err) {

            console.error(
                "Schedule save error:",
                err
            );


            if (
                err.response?.status === 401
            ) {

                localStorage.clear();

                navigate("/login");

                return;
            }


            setScheduleError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to save payroll schedule."
            );


        } finally {

            setScheduleSaving(false);
        }
    };


    // =====================================================
    // RUN PAYROLL NOW
    // INTERVIEW DEMO BUTTON
    // =====================================================

    const runPayrollNow = async () => {

        try {

            setRunningNow(true);

            setScheduleMessage("");

            setScheduleError("");

            setPayrollProcessingResult(null);


            // -------------------------------------------------
            // RUN AUTOMATIC PAYROLL
            // -------------------------------------------------

            const response =
                await axios.post(
                    "http://localhost:8090/api/payroll-schedule/run-now",
                    {},
                    authConfig
                );


            const result =
                response.data;


            console.log(
                "Payroll processing result:",
                result
            );


            // -------------------------------------------------
            // SAVE COMPLETE RESULT
            // -------------------------------------------------

            setPayrollProcessingResult(
                result
            );


            // -------------------------------------------------
            // BUILD MESSAGE
            // -------------------------------------------------

            let message =
                result.message ||
                "Payroll processing completed.";


            // Add counts to message
            message +=
                ` Generated: ${result.successful || 0}` +
                ` | Skipped: ${result.skipped || 0}` +
                ` | Failed: ${result.failed || 0}`;


            setScheduleMessage(
                message
            );


            // -------------------------------------------------
            // REFRESH PAYROLL TABLE
            // -------------------------------------------------

            await fetchPayrolls();


            // -------------------------------------------------
            // REFRESH SCHEDULE
            // -------------------------------------------------

            await fetchSchedule();


            // -------------------------------------------------
            // REMOVE TOP MESSAGE AFTER 10 SECONDS
            // Detailed result remains visible
            // -------------------------------------------------

            setTimeout(() => {

                setScheduleMessage("");

            }, 10000);


        } catch (err) {

            console.error(
                "Run payroll error:",
                err
            );


            if (
                err.response?.status === 401
            ) {

                localStorage.clear();

                navigate("/login");

                return;
            }


            setScheduleError(
                err.response?.data?.message ||
                err.response?.data ||
                "Automatic payroll processing failed."
            );


        } finally {

            setRunningNow(false);
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


        fetchPayrolls();

        fetchSchedule();

    }, []);


    // =====================================================
    // EXPORT PAYROLL TO EXCEL
    // =====================================================

    const exportPayrollToExcel = async () => {

        try {

            setError("");


            const response =
                await axios.get(
                    "http://localhost:8090/api/payrolls/export",
                    {
                        headers: {

                            Authorization:
                                `Bearer ${token}`
                        },

                        responseType: "blob"
                    }
                );


            const blob =
                new Blob(
                    [response.data],
                    {
                        type:
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    }
                );


            const url =
                window.URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement("a");


            link.href =
                url;


            link.setAttribute(
                "download",
                "Payroll.xlsx"
            );


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            window.URL.revokeObjectURL(
                url
            );


        } catch (err) {

            console.error(
                "Excel export error:",
                err
            );


            if (
                err.response?.status === 401
            ) {

                localStorage.clear();

                navigate("/login");

            } else {

                setError(
                    "Unable to export payroll to Excel."
                );
            }
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
    // FORMAT DATE
    // =====================================================

    const formatDateTime = (date) => {

        if (!date) {

            return "-";
        }


        return new Date(
            date
        ).toLocaleString(
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
    // FORMAT TIME
    // =====================================================

    const formatTime = (time) => {

        if (!time) {

            return "-";
        }


        const [hour, minute] =
            time.split(":");


        const date =
            new Date();


        date.setHours(
            Number(hour)
        );


        date.setMinutes(
            Number(minute)
        );


        return date.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };


    // =====================================================
    // FORMAT PAYROLL MONTH
    // =====================================================

    const formatPayrollPeriod = (period) => {

        if (!period) {

            return "-";
        }


        try {

            const [year, month] =
                period.split("-");


            const date =
                new Date(
                    Number(year),
                    Number(month) - 1,
                    1
                );


            return date.toLocaleDateString(
                "en-IN",
                {
                    month: "long",
                    year: "numeric"
                }
            );

        } catch (error) {

            return period;
        }
    };


    // =====================================================
    // GET FREQUENCY LABEL
    // =====================================================

    const getFrequencyLabel = () => {

        if (
            frequency === "DAILY"
        ) {

            return "Every day";
        }


        if (
            frequency === "MONTH_END"
        ) {

            return "Last day of every month";
        }


        return frequency;
    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="payroll-page">


            {/* =================================================
                MAIN
            ================================================= */}

            <div className="payroll-main">


                {/* =================================================
                    TOP BAR
                ================================================= */}

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


                {/* =================================================
                    CONTENT
                ================================================= */}

                <main className="payroll-content">


                    {/* =================================================
                        AUTOMATIC PAYROLL & PAYSLIP
                    ================================================= */}

                    <section className="payroll-scheduler-card">


                        {/* =================================================
                            SCHEDULER HEADER
                        ================================================= */}

                        <div className="payroll-scheduler-header">

                            <div>

                                <div className="payroll-eyebrow">
                                    AUTOMATION
                                </div>


                                <h2>
                                    Automatic Payroll & Payslip
                                </h2>


                                <p>
                                    Automatically process payroll,
                                    generate payslips, create PDFs,
                                    and send them to employees.
                                </p>

                            </div>


                            <div
                                className={
                                    scheduleEnabled
                                        ? "payroll-scheduler-status active"
                                        : "payroll-scheduler-status inactive"
                                }
                            >

                                <span></span>

                                {scheduleEnabled
                                    ? "ACTIVE"
                                    : "DISABLED"}

                            </div>

                        </div>


                        {/* =================================================
                            SCHEDULER MESSAGE
                        ================================================= */}

                        {scheduleMessage && (

                            <div className="payroll-scheduler-success">

                                {scheduleMessage}

                            </div>

                        )}


                        {scheduleError && (

                            <div className="payroll-scheduler-error">

                                {scheduleError}

                            </div>

                        )}


                        {/* =================================================
                            PAYROLL PROCESSING RESULT
                        ================================================= */}

                        {payrollProcessingResult && (

                            <div className="payroll-processing-result">


                                {/* -------------------------------------------------
                                    RESULT HEADER
                                ------------------------------------------------- */}

                                <div className="payroll-processing-result-header">

                                    <div>

                                        <div className="payroll-eyebrow">
                                            PROCESSING RESULT
                                        </div>


                                        <h3>
                                            Payroll Processing Summary
                                        </h3>


                                        <p>
                                            Pay Period:{" "}

                                            <strong>
                                                {
                                                    formatPayrollPeriod(
                                                        payrollProcessingResult.payPeriod
                                                    )
                                                }
                                            </strong>
                                        </p>

                                    </div>

                                </div>


                                {/* -------------------------------------------------
                                    MAIN MESSAGE
                                ------------------------------------------------- */}

                                <div
                                    className={
                                        payrollProcessingResult.failed > 0
                                            ? "payroll-processing-message failed"
                                            : payrollProcessingResult.successful > 0
                                                ? "payroll-processing-message success"
                                                : "payroll-processing-message warning"
                                    }
                                >

                                    <span className="payroll-processing-message-icon">

                                        {
                                            payrollProcessingResult.failed > 0
                                                ? "❌"
                                                : payrollProcessingResult.successful > 0
                                                    ? "✅"
                                                    : "⚠️"
                                        }

                                    </span>


                                    <span>

                                        {
                                            payrollProcessingResult.message
                                        }

                                    </span>

                                </div>


                                {/* -------------------------------------------------
                                    COUNTS
                                ------------------------------------------------- */}

                                <div className="payroll-processing-stats">


                                    {/* GENERATED */}

                                    <div className="payroll-processing-stat success">

                                        <span>
                                            Generated
                                        </span>

                                        <strong>
                                            {
                                                payrollProcessingResult.successful || 0
                                            }
                                        </strong>

                                        <small>
                                            Payslips
                                        </small>

                                    </div>


                                    {/* SKIPPED */}

                                    <div className="payroll-processing-stat skipped">

                                        <span>
                                            Skipped
                                        </span>

                                        <strong>
                                            {
                                                payrollProcessingResult.skipped || 0
                                            }
                                        </strong>

                                        <small>
                                            Already processed
                                        </small>

                                    </div>


                                    {/* FAILED */}

                                    <div className="payroll-processing-stat failed">

                                        <span>
                                            Failed
                                        </span>

                                        <strong>
                                            {
                                                payrollProcessingResult.failed || 0
                                            }
                                        </strong>

                                        <small>
                                            Processing / Email
                                        </small>

                                    </div>


                                </div>


                                {/* =================================================
                                    FAILED EMPLOYEES
                                ================================================= */}

                                {
                                    payrollProcessingResult.failures &&
                                    payrollProcessingResult.failures.length > 0 && (

                                        <div className="payroll-failed-employees">


                                            <div className="payroll-failed-header">

                                                <div>

                                                    <h4>
                                                        ❌ Failed Employees
                                                    </h4>

                                                    <p>
                                                        Payslip generation or email delivery failed for these employees.
                                                    </p>

                                                </div>


                                                <span>
                                                    {
                                                        payrollProcessingResult.failures.length
                                                    }
                                                </span>

                                            </div>


                                            <div className="payroll-failed-list">

                                                {
                                                    payrollProcessingResult
                                                        .failures
                                                        .map(
                                                            (failure, index) => (

                                                                <div
                                                                    className="payroll-failed-item"
                                                                    key={
                                                                        failure.employeeId ||
                                                                        index
                                                                    }
                                                                >


                                                                    {/* EMPLOYEE */}

                                                                    <div className="payroll-failed-employee">

                                                                        <span>
                                                                            Employee ID
                                                                        </span>

                                                                        <strong>
                                                                            {
                                                                                failure.employeeId ||
                                                                                "-"
                                                                            }
                                                                        </strong>

                                                                        <small>
                                                                            {
                                                                                failure.employeeName ||
                                                                                "-"
                                                                            }
                                                                        </small>

                                                                    </div>


                                                                    {/* EMAIL */}

                                                                    <div className="payroll-failed-email">

                                                                        <span>
                                                                            Email
                                                                        </span>

                                                                        <strong>
                                                                            {
                                                                                failure.email ||
                                                                                "-"
                                                                            }
                                                                        </strong>

                                                                    </div>


                                                                    {/* REASON */}

                                                                    <div className="payroll-failed-reason">

                                                                        <span>
                                                                            Reason
                                                                        </span>

                                                                        <strong>
                                                                            {
                                                                                failure.reason ||
                                                                                "Unknown error"
                                                                            }
                                                                        </strong>

                                                                    </div>


                                                                </div>

                                                            )
                                                        )
                                                }

                                            </div>

                                        </div>

                                    )
                                }


                                {/* =================================================
                                    FAILED EMPLOYEE IDs
                                ================================================= */}

                                {
                                    payrollProcessingResult.failedEmployeeIds &&
                                    payrollProcessingResult.failedEmployeeIds.length > 0 && (

                                        <div className="payroll-failed-ids">

                                            <strong>
                                                Failed Employee IDs:
                                            </strong>

                                            <span>
                                                {
                                                    payrollProcessingResult
                                                        .failedEmployeeIds
                                                        .join(", ")
                                                }
                                            </span>

                                        </div>

                                    )
                                }


                            </div>

                        )}


                        {scheduleLoading ? (

                            <div className="payroll-scheduler-loading">

                                Loading scheduler configuration...

                            </div>

                        ) : (

                            <>


                                {/* =================================================
                                    SCHEDULER SETTINGS
                                ================================================= */}

                                <div className="payroll-scheduler-settings">


                                    {/* ENABLE */}

                                    <div className="payroll-scheduler-field">

                                        <label>
                                            Automatic Processing
                                        </label>


                                        <div className="payroll-toggle-wrapper">

                                            <button
                                                type="button"
                                                className={
                                                    scheduleEnabled
                                                        ? "payroll-toggle active"
                                                        : "payroll-toggle"
                                                }
                                                onClick={() =>
                                                    setScheduleEnabled(
                                                        !scheduleEnabled
                                                    )
                                                }
                                            >

                                                <span></span>

                                            </button>


                                            <span>

                                                {scheduleEnabled
                                                    ? "Enabled"
                                                    : "Disabled"}

                                            </span>

                                        </div>

                                    </div>


                                    {/* FREQUENCY */}

                                    <div className="payroll-scheduler-field">

                                        <label>
                                            Schedule
                                        </label>


                                        <select
                                            value={frequency}
                                            onChange={(e) =>
                                                setFrequency(
                                                    e.target.value
                                                )
                                            }
                                            disabled={
                                                !scheduleEnabled
                                            }
                                        >

                                            <option value="MONTH_END">
                                                Last day of every month
                                            </option>


                                            <option value="DAILY">
                                                Every day
                                            </option>

                                        </select>

                                    </div>


                                    {/* PAYROLL MONTH */}

                                    <div className="payroll-scheduler-field">

                                        <label>
                                            Payroll Month
                                        </label>


                                        <input
                                            type="month"
                                            value={payrollPeriod}
                                            onChange={(e) =>
                                                setPayrollPeriod(
                                                    e.target.value
                                                )
                                            }
                                            disabled={
                                                !scheduleEnabled
                                            }
                                        />

                                    </div>


                                    {/* EXECUTION TIME */}

                                    <div className="payroll-scheduler-field">

                                        <label>
                                            Execution Time
                                        </label>


                                        <input
                                            type="time"
                                            value={executionTime}
                                            onChange={(e) =>
                                                setExecutionTime(
                                                    e.target.value
                                                )
                                            }
                                            disabled={
                                                !scheduleEnabled
                                            }
                                        />

                                    </div>


                                </div>


                                {/* =================================================
                                    CURRENT CONFIGURATION
                                ================================================= */}

                                <div className="payroll-scheduler-info">


                                    <div>

                                        <span>
                                            Schedule
                                        </span>


                                        <strong>
                                            {getFrequencyLabel()}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Payroll Month
                                        </span>


                                        <strong>
                                            {formatPayrollPeriod(
                                                payrollPeriod
                                            )}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Execution Time
                                        </span>


                                        <strong>
                                            {formatTime(
                                                executionTime
                                            )}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Last Execution
                                        </span>


                                        <strong>
                                            {formatDateTime(
                                                schedule?.lastExecutedAt
                                            )}
                                        </strong>

                                    </div>


                                </div>


                                {/* =================================================
                                    FEATURES
                                ================================================= */}

                                <div className="payroll-scheduler-features">

                                    <div>
                                        ✓ Automatic payroll generation
                                    </div>

                                    <div>
                                        ✓ Automatic payslip generation
                                    </div>

                                    <div>
                                        ✓ Automatic PDF generation
                                    </div>

                                    <div>
                                        ✓ Automatic email delivery
                                    </div>

                                    <div>
                                        ✓ Failed email retry up to 3 times
                                    </div>

                                </div>


                                {/* =================================================
                                    ACTIONS
                                ================================================= */}

                                <div className="payroll-scheduler-actions">


                                    <button
                                        type="button"
                                        className="payroll-save-schedule-btn"
                                        onClick={saveSchedule}
                                        disabled={
                                            scheduleSaving
                                        }
                                    >

                                        {scheduleSaving
                                            ? "Saving..."
                                            : "Save Schedule"}

                                    </button>


                                    <button
                                        type="button"
                                        className="payroll-run-now-btn"
                                        onClick={runPayrollNow}
                                        disabled={
                                            runningNow
                                        }
                                    >

                                        {runningNow
                                            ? "Processing..."
                                            : "▶ Run Now"}

                                    </button>

                                </div>


                            </>

                        )}

                    </section>


                    {/* =================================================
                        PAYROLL RECORDS HEADER
                    ================================================= */}

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


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div className="payroll-error">

                            {error}

                        </div>

                    )}


                    {/* =================================================
                        PAYROLL TABLE
                    ================================================= */}

                    {loading ? (

                        <div className="payroll-loading">

                            Loading payroll records...

                        </div>

                    ) : (

                        <section className="payroll-card">


                            {/* =================================================
                                CARD HEADER
                            ================================================= */}

                            <div className="payroll-card-heading">

                                <div>

                                    <h3>
                                        Employee Payroll
                                    </h3>


                                    <p>
                                        Latest processed payroll appears first.
                                    </p>

                                </div>


                                {/* EXPORT EXCEL */}

                                <button
                                    type="button"
                                    onClick={
                                        exportPayrollToExcel
                                    }
                                    className="payroll-export-btn"
                                >

                                    Export Excel

                                </button>

                            </div>


                            {/* =================================================
                                TABLE
                            ================================================= */}

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

                                                        {/* EMPLOYEE */}

                                                        <td>

                                                            <div className="payroll-employee">

                                                                <div className="payroll-employee-code">

                                                                    {
                                                                        payroll.employeeCode
                                                                    }

                                                                </div>


                                                                <div className="payroll-employee-name">

                                                                    {
                                                                        payroll.employeeName
                                                                    }

                                                                </div>


                                                                <div className="payroll-employee-department">

                                                                    {
                                                                        payroll.department
                                                                    }

                                                                </div>

                                                            </div>

                                                        </td>


                                                        {/* PAY MONTH */}

                                                        <td>

                                                            {
                                                                formatPayrollPeriod(
                                                                    payroll.payPeriod
                                                                )
                                                            }

                                                        </td>


                                                        {/* GROSS */}

                                                        <td>

                                                            {
                                                                formatMoney(
                                                                    payroll.grossSalary
                                                                )
                                                            }

                                                        </td>


                                                        {/* DEDUCTIONS */}

                                                        <td>

                                                            {
                                                                formatMoney(
                                                                    payroll.totalDeductions
                                                                )
                                                            }

                                                        </td>


                                                        {/* NET */}

                                                        <td className="payroll-net">

                                                            {
                                                                formatMoney(
                                                                    payroll.netSalary
                                                                )
                                                            }

                                                        </td>


                                                        {/* STATUS */}

                                                        <td>

                                                            <span className="payroll-status">

                                                                {
                                                                    payroll.status
                                                                }

                                                            </span>

                                                        </td>


                                                        {/* PROCESSED */}

                                                        <td>

                                                            {
                                                                payroll.processedAt

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