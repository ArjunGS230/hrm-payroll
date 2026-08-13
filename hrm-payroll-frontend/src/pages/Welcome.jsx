import { useNavigate } from "react-router-dom";
import "../styles/Welcome.css";

const modules = [
  {
    icon: "₹",
    title: "Salary",
    subtitle: "Management",
  },
  {
    icon: "◷",
    title: "Leave",
    subtitle: "Tracking",
  },
  {
    icon: "%",
    title: "Payroll",
    subtitle: "Processing",
  },
  {
    icon: "↗",
    title: "Payslip",
    subtitle: "Delivery",
  },
];


const features = [
  {
    icon: "◈",
    title: "Secure & Reliable",
    text: "JWT authentication and role-based access keep your HR data secure.",
  },
  {
    icon: "ϟ",
    title: "Automated Workflow",
    text: "From salary configuration to payslip delivery — fully automated.",
  },
  {
    icon: "◔",
    title: "Real-time Insights",
    text: "Live payroll and employee information for better HR decisions.",
  },
  {
    icon: "✉",
    title: "Smart Notifications",
    text: "Payslips and important updates delivered directly through email.",
  },
];


function Welcome() {

  const navigate = useNavigate();


  const scrollToSection = (id) => {

    const element =
      document.getElementById(id);

    if (element) {

      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    }
  };


  return (

    <div className="hrm-home">


      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="home-grid"></div>

      <div className="home-glow home-glow-one"></div>

      <div className="home-glow home-glow-two"></div>


      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="home-navbar">


        {/* BRAND */}

        <div className="home-brand">

          <div className="brand-logo">
            H
          </div>

          <div className="brand-info">

            <strong>
              HRM
            </strong>

            <span>
              PAYROLL AUTOMATION
            </span>

          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="home-nav">

          <button
            type="button"
            onClick={() =>
              scrollToSection("features-section")
            }
          >
            Features
          </button>


          <button
            type="button"
            onClick={() =>
              scrollToSection("modules-section")
            }
          >
            Modules
          </button>


          <button
            type="button"
            onClick={() =>
              scrollToSection("security-section")
            }
          >
            Security
          </button>


          <button
            type="button"
            onClick={() =>
              scrollToSection("about-section")
            }
          >
            About
          </button>


          <button
            type="button"
            onClick={() =>
              scrollToSection("contact-section")
            }
          >
            Contact
          </button>

        </nav>


        {/* ACTION BUTTONS */}

        <div className="home-actions">


          {/* SIGN IN */}

          <button
            type="button"
            className="signin-btn"
            onClick={() =>
              navigate("/login")
            }
          >
            Sign In
          </button>


          {/* GET STARTED */}

          <button
            type="button"
            className="get-started-btn"
            onClick={() =>
              navigate("/signup")
            }
          >
            Get Started
          </button>

        </div>

      </header>


      {/* =====================================================
          HERO
      ===================================================== */}

      <main className="home-hero">


        {/* ===================================================
            HERO LEFT
        =================================================== */}

        <section className="hero-left">


          {/* BADGE */}

          <div className="hero-badge">

            <span></span>

            SMART HR · MODERN PAYROLL

          </div>


          {/* TITLE */}

          <h1>

            Salary Structure

            <br />

            &amp; Payslip

            <br />

            <span>
              Automation
            </span>

          </h1>


          {/* DESCRIPTION */}

          <p className="hero-description">

            Configure salaries. Process payroll.

            <br />

            Generate payslips. Deliver automatically.

          </p>


          {/* =================================================
              MODULES
          ================================================= */}

          <div
            className="hero-modules"
            id="modules-section"
          >

            {modules.map(
              (module, index) => (

                <div
                  className="hero-module"
                  key={index}
                >

                  <div className="module-icon">
                    {module.icon}
                  </div>

                  <strong>
                    {module.title}
                  </strong>

                  <span>
                    {module.subtitle}
                  </span>

                </div>

              )
            )}

          </div>


          {/* =================================================
              HERO BUTTONS
          ================================================= */}

          <div className="hero-buttons">


            {/* GET STARTED */}

            <button
              type="button"
              className="hero-primary"
              onClick={() =>
                navigate("/signup")
              }
            >

              Get Started Now

              <span>
                →
              </span>

            </button>


            {/* EXPLORE FEATURES */}

            <button
              type="button"
              className="hero-secondary"
              onClick={() =>
                scrollToSection(
                  "features-section"
                )
              }
            >

              <span className="play-icon">
                ▶
              </span>

              Explore Features

            </button>

          </div>

        </section>


        {/* ===================================================
            DASHBOARD PREVIEW
        =================================================== */}

        <section className="hero-dashboard">

          <div className="dashboard-window">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="dashboard-sidebar">


              <div className="dashboard-logo">
                HRM
              </div>


              <div className="sidebar-menu">


                <div className="sidebar-item active">

                  <span>
                    ⌂
                  </span>

                  <span className="sidebar-text">
                    Dashboard
                  </span>

                </div>


                <div className="sidebar-item">

                  <span>
                    ♙
                  </span>

                  <span className="sidebar-text">
                    Employees
                  </span>

                </div>


                <div className="sidebar-item">

                  <span>
                    ▣
                  </span>

                  <span className="sidebar-text">
                    Salary Structures
                  </span>

                </div>


                <div className="sidebar-item">

                  <span>
                    ◷
                  </span>

                  <span className="sidebar-text">
                    Leave Management
                  </span>

                </div>


                <div className="sidebar-item">

                  <span>
                    ▤
                  </span>

                  <span className="sidebar-text">
                    Payroll
                  </span>

                </div>


                <div className="sidebar-item">

                  <span>
                    ▧
                  </span>

                  <span className="sidebar-text">
                    Payslips
                  </span>

                </div>


                <div className="sidebar-item">

                  <span>
                    ✉
                  </span>

                  <span className="sidebar-text">
                    Email Logs
                  </span>

                </div>


                <div className="sidebar-item">

                  <span>
                    ◫
                  </span>

                  <span className="sidebar-text">
                    Reports
                  </span>

                </div>


                <div className="sidebar-item">

                  <span>
                    ⚙
                  </span>

                  <span className="sidebar-text">
                    Settings
                  </span>

                </div>

              </div>


              {/* USER */}

              <div className="sidebar-user">

                <div className="user-avatar">
                  AR
                </div>

                <div>

                  <strong>
                    Arjun Reddy
                  </strong>

                  <span>
                    HR Manager
                  </span>

                </div>

              </div>

            </aside>


            {/* =================================================
                DASHBOARD CONTENT
            ================================================= */}

            <div className="dashboard-content">


              {/* TOP */}

              <div className="dashboard-top">

                <div>

                  <span className="dashboard-small">
                    HR WORKSPACE
                  </span>

                  <h2>
                    Dashboard
                  </h2>

                </div>


                <div className="dashboard-profile">

                  <div className="search-box">

                    ⌕

                    <span>
                      Search anything...
                    </span>

                  </div>


                  <div className="notification">

                    ♧

                    <b>
                      3
                    </b>

                  </div>


                  <div className="profile-avatar">
                    AR
                  </div>

                </div>

              </div>


              {/* =================================================
                  STAT CARDS
              ================================================= */}

              <div className="stat-grid">


                <div className="stat-card">

                  <span>
                    TOTAL EMPLOYEES
                  </span>

                  <strong>
                    128
                  </strong>

                  <small className="positive">
                    ↑ 12 this month
                  </small>

                  <div className="stat-symbol blue">
                    ♙
                  </div>

                </div>


                <div className="stat-card">

                  <span>
                    TOTAL PAYROLL
                  </span>

                  <strong>
                    ₹48.64L
                  </strong>

                  <small className="positive">
                    ↑ 8.4% this month
                  </small>

                  <div className="stat-symbol green">
                    ₹
                  </div>

                </div>


                <div className="stat-card">

                  <span>
                    LEAVE REQUESTS
                  </span>

                  <strong>
                    16
                  </strong>

                  <small>
                    Pending approval
                  </small>

                  <div className="stat-symbol yellow">
                    ◷
                  </div>

                </div>


                <div className="stat-card">

                  <span>
                    PAYSLIPS GENERATED
                  </span>

                  <strong>
                    114
                  </strong>

                  <small>
                    This month
                  </small>

                  <div className="stat-symbol purple">
                    ▧
                  </div>

                </div>

              </div>


              {/* =================================================
                  MIDDLE
              ================================================= */}

              <div className="dashboard-middle">


                {/* PAYROLL */}

                <div className="payroll-panel">

                  <div className="panel-heading">

                    <div>

                      <h3>
                        Monthly Payroll Overview
                      </h3>

                      <span>
                        November 2026
                      </span>

                    </div>

                    <button
                      type="button"
                    >
                      This month⌄
                    </button>

                  </div>


                  <div className="payroll-data">


                    <div className="payroll-numbers">

                      <span>
                        Total Gross Salary
                      </span>

                      <strong>
                        ₹48,64,000
                      </strong>


                      <span className="net-label">
                        Total Net Salary
                      </span>

                      <strong className="net-value">
                        ₹36,72,000
                      </strong>


                      <div className="processed-badge">
                        ✓ PROCESSED
                      </div>

                    </div>


                    <div className="donut">

                      <div className="donut-center">

                        <span>
                          Total
                        </span>

                        <strong>
                          ₹48.64L
                        </strong>

                      </div>

                    </div>


                    <div className="legend">


                      <div>

                        <span className="dot blue-dot"></span>

                        <label>
                          Basic Salary
                        </label>

                        <strong>
                          ₹28,00,000
                        </strong>

                      </div>


                      <div>

                        <span className="dot cyan-dot"></span>

                        <label>
                          HRA
                        </label>

                        <strong>
                          ₹10,80,000
                        </strong>

                      </div>


                      <div>

                        <span className="dot purple-dot"></span>

                        <label>
                          Allowances
                        </label>

                        <strong>
                          ₹7,20,000
                        </strong>

                      </div>


                      <div>

                        <span className="dot yellow-dot"></span>

                        <label>
                          Deductions
                        </label>

                        <strong>
                          ₹2,00,000
                        </strong>

                      </div>

                    </div>

                  </div>

                </div>


                {/* LEAVE */}

                <div className="leave-panel">

                  <div className="panel-heading">

                    <h3>
                      Leave Balance
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        scrollToSection(
                          "modules-section"
                        )
                      }
                    >
                      View all
                    </button>

                  </div>


                  <div className="leave-row">

                    <div>

                      <span>
                        Casual Leave
                      </span>

                      <strong>
                        12 / 12 days
                      </strong>

                    </div>

                    <div className="leave-progress">

                      <span
                        style={{
                          width: "100%",
                        }}
                      ></span>

                    </div>

                  </div>


                  <div className="leave-row">

                    <div>

                      <span>
                        Medical Leave
                      </span>

                      <strong>
                        15 / 15 days
                      </strong>

                    </div>

                    <div className="leave-progress">

                      <span
                        style={{
                          width: "100%",
                        }}
                      ></span>

                    </div>

                  </div>


                  <div className="leave-row">

                    <div>

                      <span>
                        Earned Leave
                      </span>

                      <strong>
                        18 / 20 days
                      </strong>

                    </div>

                    <div className="leave-progress">

                      <span
                        style={{
                          width: "90%",
                        }}
                      ></span>

                    </div>

                  </div>


                  <div className="leave-row">

                    <div>

                      <span>
                        Comp Off
                      </span>

                      <strong>
                        05 / 08 days
                      </strong>

                    </div>

                    <div className="leave-progress yellow-progress">

                      <span
                        style={{
                          width: "63%",
                        }}
                      ></span>

                    </div>

                  </div>

                </div>

              </div>


              {/* =================================================
                  BOTTOM
              ================================================= */}

              <div className="dashboard-bottom">


                {/* PAYROLL ACTIVITY */}

                <div className="activity-panel">

                  <div className="panel-heading">

                    <h3>
                      Recent Payroll Activity
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        scrollToSection(
                          "modules-section"
                        )
                      }
                    >
                      View all →
                    </button>

                  </div>


                  <div className="activity-header">

                    <span>
                      Employee
                    </span>

                    <span>
                      Department
                    </span>

                    <span>
                      Gross Salary
                    </span>

                    <span>
                      Net Salary
                    </span>

                    <span>
                      Status
                    </span>

                  </div>


                  <div className="activity-row">

                    <div className="employee-name">

                      <div className="mini-avatar">
                        RV
                      </div>

                      Rahul Verma

                    </div>

                    <span>
                      Engineering
                    </span>

                    <span>
                      ₹52,000
                    </span>

                    <span>
                      ₹41,600
                    </span>

                    <b className="paid">
                      PAID
                    </b>

                  </div>


                  <div className="activity-row">

                    <div className="employee-name">

                      <div className="mini-avatar purple-avatar">
                        PS
                      </div>

                      Priya Singh

                    </div>

                    <span>
                      Marketing
                    </span>

                    <span>
                      ₹45,000
                    </span>

                    <span>
                      ₹36,250
                    </span>

                    <b className="paid">
                      PAID
                    </b>

                  </div>


                  <div className="activity-row">

                    <div className="employee-name">

                      <div className="mini-avatar orange-avatar">
                        AK
                      </div>

                      Amit Kumar

                    </div>

                    <span>
                      Sales
                    </span>

                    <span>
                      ₹38,000
                    </span>

                    <span>
                      ₹30,400
                    </span>

                    <b className="paid">
                      PAID
                    </b>

                  </div>

                </div>


                {/* PAYSLIP STATUS */}

                <div className="payslip-panel">

                  <h3>
                    Payslip Status
                  </h3>


                  <div className="payslip-circle">

                    <div>

                      <strong>
                        89%
                      </strong>

                      <span>
                        generated
                      </span>

                    </div>

                  </div>


                  <strong className="payslip-count">
                    114 / 128
                  </strong>

                  <span>
                    Payslips Generated
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>


      {/* =====================================================
          SECURITY
      ===================================================== */}

      <section
        className="info-section"
        id="security-section"
      >

        <div className="info-content">

          <span className="info-label">
            SECURITY
          </span>

          <h2>
            Your HR data stays
            <span>
              {" "}protected.
            </span>
          </h2>

          <p>
            Built with secure authentication and
            controlled access to protect employee,
            salary and payroll information.
          </p>


          <div className="info-cards">


            <div className="info-card">

              <div className="info-icon">
                ✓
              </div>

              <div>

                <h3>
                  JWT Authentication
                </h3>

                <p>
                  Secure authentication keeps your HR
                  application protected.
                </p>

              </div>

            </div>


            <div className="info-card">

              <div className="info-icon">
                ◆
              </div>

              <div>

                <h3>
                  Role-Based Access
                </h3>

                <p>
                  Control which users can access
                  sensitive HR operations.
                </p>

              </div>

            </div>


            <div className="info-card">

              <div className="info-icon">
                ▣
              </div>

              <div>

                <h3>
                  Protected Payroll
                </h3>

                <p>
                  Salary and payslip information is
                  handled through protected APIs.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section
        className="info-section about-section"
        id="about-section"
      >

        <div className="info-content">

          <span className="info-label">
            ABOUT HRM
          </span>

          <h2>
            One workspace for
            <span>
              {" "}modern HR.
            </span>
          </h2>

          <p>
            HRM Salary Structure &amp; Payslip Automation
            brings salary configuration, leave management,
            payroll processing and payslip delivery together
            in one streamlined workspace.
          </p>


          <div className="about-stats">


            <div>

              <strong>
                01
              </strong>

              <span>
                Salary Configuration
              </span>

            </div>


            <div>

              <strong>
                02
              </strong>

              <span>
                Leave Management
              </span>

            </div>


            <div>

              <strong>
                03
              </strong>

              <span>
                Payroll Processing
              </span>

            </div>


            <div>

              <strong>
                04
              </strong>

              <span>
                Payslip Automation
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTACT
      ===================================================== */}

      <section
        className="contact-section"
        id="contact-section"
      >

        <div className="contact-content">


          <div>

            <span className="info-label">
              CONTACT
            </span>

            <h2>
              Ready to simplify
              <span>
                {" "}payroll?
              </span>
            </h2>

            <p>
              Start using the HRM payroll workspace
              and make salary and payslip management
              simpler.
            </p>

          </div>


          <div className="contact-actions">


            <button
              type="button"
              className="hero-primary"
              onClick={() =>
                navigate("/signup")
              }
            >

              Get Started

              <span>
                →
              </span>

            </button>


            <a
              href="mailto:hrm@example.com"
              className="contact-email"
            >
              ✉ hrm@example.com
            </a>

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section
        className="feature-section"
        id="features-section"
      >

        {features.map(
          (feature, index) => (

            <div
              className="feature-item"
              key={index}
            >

              <div className="feature-icon">
                {feature.icon}
              </div>

              <div>

                <h3>
                  {feature.title}
                </h3>

                <p>
                  {feature.text}
                </p>

              </div>

            </div>

          )
        )}

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="home-footer">

        <div>

          <strong>
            HRM
          </strong>

          <span>
            Salary Structure &amp; Payslip Automation
          </span>

        </div>

        <span>
          © 2026 HRM Payroll System
        </span>

      </footer>

    </div>
  );
}


export default Welcome;