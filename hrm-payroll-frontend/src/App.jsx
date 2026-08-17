import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import { Toaster } from "react-hot-toast";


// =========================================================
// PUBLIC PAGES
// =========================================================

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";


// =========================================================
// LAYOUT
// =========================================================

import Layout from "./components/Layout";


// =========================================================
// COMMON
// =========================================================

import Dashboard from "./pages/Dashboard";


// =========================================================
// HR PAGES
// =========================================================

import Employees from "./pages/Employees";
import SalaryStructures from "./pages/SalaryStructures";
import LeaveManagement from "./pages/LeaveManagement";
import Payroll from "./pages/Payroll";
import Payslips from "./pages/Payslips";
import EmailLogs from "./pages/EmailLogs";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";


// =========================================================
// EMPLOYEE PAGES
// =========================================================

import MyLeave from "./pages/MyLeave";
import MyPayroll from "./pages/MyPayroll";


// =========================================================
// REPORT PAGES
// =========================================================

import PayrollReport from "./pages/PayrollReport";
import LeaveReport from "./pages/LeaveReport";
import PayslipReport from "./pages/PayslipReport";


function App() {

  return (

    <BrowserRouter>

      {/* =====================================================
          GLOBAL TOAST
      ===================================================== */}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000
        }}
      />


      <Routes>


        {/* ===================================================
            PUBLIC PAGES
        =================================================== */}

        <Route
          path="/"
          element={<Welcome />}
        />


        <Route
          path="/login"
          element={<Login />}
        />


        <Route
          path="/signup"
          element={<SignUp />}
        />


        {/* ===================================================
            COMMON HRM LAYOUT
        =================================================== */}

        <Route
          element={<Layout />}
        >


          {/* =================================================
              DASHBOARD
          ================================================= */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />


          {/* =================================================
              HR - EMPLOYEES
          ================================================= */}

          <Route
            path="/employees"
            element={<Employees />}
          />


          {/* =================================================
              HR - SALARY STRUCTURES
          ================================================= */}

          <Route
            path="/salary-structures"
            element={<SalaryStructures />}
          />


          {/* =================================================
              HR - LEAVE MANAGEMENT
          ================================================= */}

          <Route
            path="/leave-management"
            element={<LeaveManagement />}
          />


          {/* =================================================
              HR - PAYROLL
          ================================================= */}

          <Route
            path="/payroll"
            element={<Payroll />}
          />


          {/* =================================================
              HR - PAYSLIPS
          ================================================= */}

          <Route
            path="/payslips"
            element={<Payslips />}
          />


          {/* =================================================
              HR - EMAIL LOGS
          ================================================= */}

          <Route
            path="/email-logs"
            element={<EmailLogs />}
          />


          {/* =================================================
              HR - REPORTS
          ================================================= */}

          <Route
            path="/reports"
            element={<Reports />}
          />


          {/* =================================================
              HR - SETTINGS
          ================================================= */}

          <Route
            path="/settings"
            element={<Settings />}
          />


          {/* =================================================
              HR REPORTS
          ================================================= */}

          <Route
            path="/reports/payroll"
            element={<PayrollReport />}
          />


          <Route
            path="/reports/leave"
            element={<LeaveReport />}
          />


          <Route
            path="/reports/payslips"
            element={<PayslipReport />}
          />


          {/* =================================================
              EMPLOYEE - MY LEAVE
          ================================================= */}

          <Route
            path="/employee/leave"
            element={<MyLeave />}
          />


          {/* =================================================
              EMPLOYEE - MY PAYROLL
          ================================================= */}

          <Route
            path="/employee/payroll"
            element={<MyPayroll />}
          />


          {/* =================================================
              EMPLOYEE - MY PAYSLIPS
          ================================================= */}

          <Route
            path="/employee/payslips"
            element={<Payslips />}
          />


          {/* =================================================
              EMPLOYEE - SETTINGS
          ================================================= */}

          <Route
            path="/employee/settings"
            element={<Settings />}
          />


        </Route>

      </Routes>

    </BrowserRouter>

  );
}


export default App;