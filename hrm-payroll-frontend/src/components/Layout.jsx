import { useEffect } from "react";
import {
  useNavigate,
  useLocation,
  Outlet
} from "react-router-dom";

import "../styles/Layout.css";

function Layout() {

  const navigate = useNavigate();
  const location = useLocation();

  // =========================================================
  // LOGGED-IN USER DETAILS
  // =========================================================

  const username =
    localStorage.getItem("username") || "User";

  const role =
    localStorage.getItem("role")?.toUpperCase() || "EMPLOYEE";


  // =========================================================
  // CHECK LOGIN
  // =========================================================

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }

  }, [navigate]);


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("email");

    navigate("/login");
  };


  // =========================================================
  // COMMON MENU
  // =========================================================

  const commonMenuItems = [

    {
      path: "/dashboard",
      icon: "⌂",
      label: "Dashboard",
    },

  ];


  // =========================================================
  // HR MENU
  // =========================================================

  const hrMenuItems = [

    {
      path: "/employees",
      icon: "♙",
      label: "Employees",
    },

    {
      path: "/salary-structures",
      icon: "₹",
      label: "Salary Structures",
    },

    {
      path: "/leave-management",
      icon: "◷",
      label: "Leave Management",
    },

    {
      path: "/payroll",
      icon: "▣",
      label: "Payroll",
    },

    {
      path: "/payslips",
      icon: "▤",
      label: "Payslips",
    },

    {
      path: "/email-logs",
      icon: "✉",
      label: "Email Logs",
    },

    {
      path: "/reports",
      icon: "▥",
      label: "Reports",
    },

    {
      path: "/settings",
      icon: "⚙",
      label: "Settings",
    },

  ];


  // =========================================================
  // EMPLOYEE MENU
  // =========================================================

  const employeeMenuItems = [

    {
      path: "/employee/leave",
      icon: "◷",
      label: "My Leave",
    },

    {
      path: "/employee/payroll",
      icon: "▣",
      label: "My Payroll",
    },

    {
      path: "/employee/payslips",
      icon: "▤",
      label: "My Payslips",
    },

    {
      path: "/employee/settings",
      icon: "⚙",
      label: "Settings",
    },

  ];


  // =========================================================
  // SELECT MENU BASED ON ROLE
  // =========================================================

  const isHR =
    role === "HR" || role === "ADMIN";


  const menuItems =
    isHR
      ? [
          ...commonMenuItems,
          ...hrMenuItems
        ]
      : [
          ...commonMenuItems,
          ...employeeMenuItems
        ];


  // =========================================================
  // SIDEBAR
  // =========================================================

  return (

    <div className="app-layout">


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="app-sidebar">


        {/* ===================================================
            BRAND
        =================================================== */}

        <div className="app-brand">

          <div className="app-brand-logo">
            H
          </div>


          <div className="app-brand-text">

            <strong>
              HRM
            </strong>

            <span>
              PAYROLL AUTOMATION
            </span>

          </div>

        </div>


        {/* ===================================================
            NAVIGATION
        =================================================== */}

        <nav className="app-navigation">

          {menuItems.map((item) => {

            const active =
              location.pathname === item.path;


            return (

              <button
                key={item.path}
                type="button"
                className={`app-menu-item ${
                  active ? "active" : ""
                }`}
                onClick={() =>
                  navigate(item.path)
                }
              >

                <span className="app-menu-icon">
                  {item.icon}
                </span>


                <span className="app-menu-text">
                  {item.label}
                </span>

              </button>

            );

          })}

        </nav>


        {/* ===================================================
            SIDEBAR FOOTER
        =================================================== */}

        <div className="app-sidebar-footer">


          {/* USER INFORMATION */}

          <div className="app-user">

            <div className="app-avatar">

              {username
                .substring(0, 2)
                .toUpperCase()}

            </div>


            <div className="app-user-info">

              <strong>
                {username}
              </strong>

              <span>
                {role}
              </span>

            </div>

          </div>


          {/* LOGOUT */}

          <button
            type="button"
            className="app-logout"
            onClick={handleLogout}
          >

            <span>
              ↪
            </span>

            Logout

          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="app-main">

        <Outlet />

      </main>


    </div>

  );
}

export default Layout;