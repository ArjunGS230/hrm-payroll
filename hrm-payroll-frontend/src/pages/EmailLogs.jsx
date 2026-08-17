import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EmailLogs.css";


function EmailLogs() {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [logs, setLogs] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [successMessage, setSuccessMessage] = useState("");

    const [retryingId, setRetryingId] = useState(null);

    // Selected technical error for popup
    const [selectedError, setSelectedError] = useState(null);


    // =====================================================
    // AUTH
    // =====================================================

    const token =
        localStorage.getItem("token");


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

            setError("");

            const response =
                await axios.get(
                    "http://localhost:8090/api/email-logs",
                    authConfig
                );


            setLogs(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );


        } catch (err) {

            console.error(
                "Email logs loading error:",
                err
            );


            if (
                err.response?.status === 401
            ) {

                localStorage.clear();

                navigate("/login");

                return;
            }


            setError(
                err.response?.data?.message ||
                "Unable to load email logs."
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // RETRY EMAIL MANUALLY
    // =====================================================

    const retryEmail = async (id) => {

        try {

            setError("");

            setSuccessMessage("");

            setRetryingId(id);


            await axios.post(

                `http://localhost:8090/api/email-logs/${id}/retry`,

                {},

                authConfig
            );


            // Refresh immediately
            await fetchLogs();


            setSuccessMessage(
                "Email retry process completed."
            );


            // Remove success message after 4 seconds
            setTimeout(() => {

                setSuccessMessage("");

            }, 4000);


        } catch (err) {

            console.error(
                "Retry email error:",
                err
            );


            if (
                err.response?.status === 401
            ) {

                localStorage.clear();

                navigate("/login");

                return;
            }


            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Failed to retry email."
            );


        } finally {

            setRetryingId(null);
        }
    };


    // =====================================================
    // INITIAL LOAD + AUTOMATIC REFRESH
    // =====================================================

    useEffect(() => {

        if (!token) {

            navigate("/login");

            return;
        }


        fetchLogs();


        /*
         * Refresh every 10 seconds.
         *
         * This allows HR to see automatic
         * retry count/status changes.
         */

        const refreshInterval =
            setInterval(() => {

                fetchLogs();

            }, 10000);


        return () => {

            clearInterval(
                refreshInterval
            );

        };

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
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {

        if (
            status?.toUpperCase() === "SENT"
        ) {

            return "email-log-status sent";
        }


        return "email-log-status failed";
    };


    // =====================================================
    // GET ERROR MESSAGE
    // =====================================================

    const getErrorMessage = (log) => {

        if (
            log.status?.toUpperCase() !== "FAILED"
        ) {

            return "-";
        }


        return (
            log.errorMessage ||
            "Email delivery failed."
        );
    };


    // =====================================================
    // RETRY BUTTON TEXT
    // =====================================================

    const getRetryButtonText = (log) => {

        if (
            retryingId === log.id
        ) {

            return "Retrying...";
        }


        return "Retry Now";
    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="email-logs-page">


            {/* =================================================
                MAIN
            ================================================= */}

            <div className="email-logs-main">


                {/* =================================================
                    TOP BAR
                ================================================= */}

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


                {/* =================================================
                    CONTENT
                ================================================= */}

                <main className="email-logs-content">


                    {/* =================================================
                        SECTION HEADER
                    ================================================= */}

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


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div className="email-logs-error">

                            {error}

                        </div>

                    )}


                    {/* =================================================
                        SUCCESS
                    ================================================= */}

                    {successMessage && (

                        <div className="email-logs-success">

                            {successMessage}

                        </div>

                    )}


                    {/* =================================================
                        ERROR MODAL
                    ================================================= */}

                    {selectedError && (

                        <div
                            className="email-error-modal-overlay"
                            onClick={() =>
                                setSelectedError(null)
                            }
                        >

                            <div
                                className="email-error-modal"
                                onClick={(event) =>
                                    event.stopPropagation()
                                }
                            >


                                {/* =================================================
                                    MODAL HEADER
                                ================================================= */}

                                <div className="email-error-modal-header">

                                    <h3>
                                        Email Delivery Error
                                    </h3>


                                    <button
                                        type="button"
                                        className="email-error-close-button"
                                        onClick={() =>
                                            setSelectedError(null)
                                        }
                                    >
                                        ×
                                    </button>

                                </div>


                                {/* =================================================
                                    MODAL BODY
                                ================================================= */}

                                <div className="email-error-modal-body">

                                    <p className="email-error-label">
                                        Technical Error
                                    </p>


                                    <div className="email-error-full-message">

                                        {selectedError}

                                    </div>

                                </div>


                                {/* =================================================
                                    MODAL FOOTER
                                ================================================= */}

                                <div className="email-error-modal-footer">

                                    <button
                                        type="button"
                                        className="email-error-close"
                                        onClick={() =>
                                            setSelectedError(null)
                                        }
                                    >
                                        Close
                                    </button>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading ? (

                        <div className="email-logs-loading">

                            Loading email logs...

                        </div>

                    ) : (

                        <section className="email-logs-card">


                            {/* =================================================
                                CARD HEADER
                            ================================================= */}

                            <div className="email-logs-card-heading">

                                <div>

                                    <h3>
                                        Payslip Email History
                                    </h3>


                                    <p>
                                        Automatic email delivery records.
                                    </p>

                                </div>


                                <div className="email-logs-live">

                                    <span
                                        className="email-logs-live-dot"
                                    ></span>


                                    Auto Refresh: 10s

                                </div>

                            </div>


                            {/* =================================================
                                TABLE
                            ================================================= */}

                            <div className="email-logs-table-wrapper">

                                <table className="email-logs-table">


                                    {/* =================================================
                                        HEADER
                                    ================================================= */}

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
                                                Error Message
                                            </th>


                                            <th>
                                                Sent At
                                            </th>


                                            <th>
                                                Retry
                                            </th>

                                        </tr>

                                    </thead>


                                    {/* =================================================
                                        BODY
                                    ================================================= */}

                                    <tbody>

                                        {logs.length === 0 ? (

                                            <tr>

                                                <td
                                                    colSpan="8"
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


                                                        {/* =================================================
                                                            EMPLOYEE
                                                        ================================================= */}

                                                        <td>

                                                            <div
                                                                className="email-logs-employee"
                                                            >

                                                                <div
                                                                    className="email-logs-employee-code"
                                                                >

                                                                    {log.employeeCode}

                                                                </div>


                                                                <div
                                                                    className="email-logs-employee-name"
                                                                >

                                                                    {log.employeeName}

                                                                </div>

                                                            </div>

                                                        </td>


                                                        {/* =================================================
                                                            EMAIL
                                                        ================================================= */}

                                                        <td>

                                                            {log.email}

                                                        </td>


                                                        {/* =================================================
                                                            PAY MONTH
                                                        ================================================= */}

                                                        <td>

                                                            {log.payPeriod || "-"}

                                                        </td>


                                                        {/* =================================================
                                                            PAYSLIP
                                                        ================================================= */}

                                                        <td>

                                                            #{log.payslipId}

                                                        </td>


                                                        {/* =================================================
                                                            STATUS
                                                        ================================================= */}

                                                        <td>

                                                            <span
                                                                className={
                                                                    getStatusClass(
                                                                        log.status
                                                                    )
                                                                }
                                                            >

                                                                {log.status}

                                                            </span>

                                                        </td>


                                                        {/* =================================================
                                                            ERROR MESSAGE
                                                        ================================================= */}

                                                        <td>

                                                            {log.status?.toUpperCase() === "FAILED" ? (

                                                                <div
                                                                    className="email-logs-error-message"
                                                                >

                                                                    <div
                                                                        className="email-logs-error-preview"
                                                                    >

                                                                        Email delivery failed.

                                                                    </div>


                                                                    <button
                                                                        type="button"
                                                                        className="email-logs-view-error-button"
                                                                        onClick={() =>
                                                                            setSelectedError(
                                                                                getErrorMessage(
                                                                                    log
                                                                                )
                                                                            )
                                                                        }
                                                                    >

                                                                        View Error

                                                                    </button>

                                                                </div>

                                                            ) : (

                                                                <span
                                                                    className="email-logs-no-error"
                                                                >
                                                                    -
                                                                </span>

                                                            )}

                                                        </td>


                                                        {/* =================================================
                                                            SENT AT
                                                        ================================================= */}

                                                        <td>

                                                            {formatDate(
                                                                log.sentAt
                                                            )}

                                                        </td>


                                                        {/* =================================================
                                                            RETRY
                                                        ================================================= */}

                                                        <td>

                                                            <div
                                                                className="email-logs-retry"
                                                            >


                                                                {/* RETRY COUNT */}

                                                                <span>

                                                                    {log.retryCount ?? 0}

                                                                    {" / 3"}

                                                                </span>


                                                                {/* RETRY BUTTON */}

                                                                {log.status?.toUpperCase() === "FAILED"
                                                                    &&
                                                                    (log.retryCount ?? 0) < 3
                                                                    && (

                                                                        <button
                                                                            type="button"
                                                                            className="email-logs-retry-button"
                                                                            onClick={() =>
                                                                                retryEmail(
                                                                                    log.id
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                retryingId === log.id
                                                                            }
                                                                        >

                                                                            {getRetryButtonText(
                                                                                log
                                                                            )}

                                                                        </button>

                                                                    )}


                                                                {/* MAX RETRIES */}

                                                                {log.status?.toUpperCase() === "FAILED"
                                                                    &&
                                                                    (log.retryCount ?? 0) >= 3
                                                                    && (

                                                                        <span
                                                                            className="email-logs-max-retries"
                                                                        >

                                                                            Max retries reached

                                                                        </span>

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