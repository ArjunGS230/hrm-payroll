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
  const element = document.getElementById(id);

  if (element) {
    const rect = element.getBoundingClientRect();

    const heading = element.querySelector(
      ".welcome-info-label, h2"
    );

    const target = heading || element;

    const targetRect = target.getBoundingClientRect();

    const scrollPosition =
      window.scrollY +
      targetRect.top -
      window.innerHeight / 2 +
      targetRect.height / 2;

    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
  }
};

  return (
    <div className="welcome-page">

      {/* BACKGROUND */}
      <div className="welcome-grid"></div>
      <div className="welcome-glow welcome-glow-one"></div>
      <div className="welcome-glow welcome-glow-two"></div>

      {/* NAVBAR */}
      <header className="welcome-navbar">

        <div className="welcome-brand">
          <div className="welcome-brand-logo">
            H
          </div>

          <div className="welcome-brand-info">
            <strong>HRM</strong>
            <span>PAYROLL AUTOMATION</span>
          </div>
        </div>

        <nav className="welcome-nav">

          <button
            type="button"
            onClick={() => scrollToSection("welcome-features")}
          >
            Features
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("welcome-modules")}
          >
            Modules
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("welcome-security")}
          >
            Security
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("welcome-about")}
          >
            About
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("welcome-contact")}
          >
            Contact
          </button>

        </nav>

        <div className="welcome-actions">

          <button
            type="button"
            className="welcome-signin"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>

          <button
            type="button"
            className="welcome-get-started"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </button>

        </div>

      </header>

      {/* HERO */}
      <main className="welcome-hero">

        {/* LEFT CONTENT */}
        <section className="welcome-hero-left">

          <div className="welcome-badge">
            <span></span>
            SMART HR · MODERN PAYROLL
          </div>

          <h1>
            Salary Structure
            <br />
            &amp; Payslip
            <br />
            <span>Automation</span>
          </h1>

          <p className="welcome-description">
            Configure salaries. Process payroll.
            <br />
            Generate payslips. Deliver automatically.
          </p>

          {/* MODULES */}
          <div
            className="welcome-modules"
            id="welcome-modules"
          >

            {modules.map((module, index) => (
              <div
                className="welcome-module"
                key={index}
              >
                <div className="welcome-module-icon">
                  {module.icon}
                </div>

                <strong>{module.title}</strong>

                <span>{module.subtitle}</span>
              </div>
            ))}

          </div>

          {/* BUTTONS */}
          <div className="welcome-hero-buttons">

            <button
              type="button"
              className="welcome-primary-button"
              onClick={() => navigate("/signup")}
            >
              Get Started Now
              <span>→</span>
            </button>

            <button
              type="button"
              className="welcome-secondary-button"
              onClick={() => scrollToSection("welcome-features")}
            >
              <span>▶</span>
              Explore Features
            </button>

          </div>

        </section>

        {/* DASHBOARD PREVIEW */}
        <section className="welcome-dashboard">

          <div className="welcome-dashboard-window">

            {/* SIDEBAR */}
            <aside className="welcome-dashboard-sidebar">

              <div className="welcome-dashboard-logo">
                HRM
              </div>

              <div className="welcome-sidebar-menu">

                <div className="welcome-sidebar-item active">
                  <span>⌂</span>
                  <span>Dashboard</span>
                </div>

                <div className="welcome-sidebar-item">
                  <span>♙</span>
                  <span>Employees</span>
                </div>

                <div className="welcome-sidebar-item">
                  <span>▣</span>
                  <span>Salary Structures</span>
                </div>

                <div className="welcome-sidebar-item">
                  <span>◷</span>
                  <span>Leave Management</span>
                </div>

                <div className="welcome-sidebar-item">
                  <span>▤</span>
                  <span>Payroll</span>
                </div>

                <div className="welcome-sidebar-item">
                  <span>▧</span>
                  <span>Payslips</span>
                </div>

                <div className="welcome-sidebar-item">
                  <span>✉</span>
                  <span>Email Logs</span>
                </div>

                <div className="welcome-sidebar-item">
                  <span>◫</span>
                  <span>Reports</span>
                </div>

                <div className="welcome-sidebar-item">
                  <span>⚙</span>
                  <span>Settings</span>
                </div>

              </div>

              <div className="welcome-sidebar-user">

                <div className="welcome-user-avatar">
                  AR
                </div>

                <div>
                  <strong>Arjun Reddy</strong>
                  <span>HR Manager</span>
                </div>

              </div>

            </aside>

            {/* DASHBOARD CONTENT */}
            <div className="welcome-dashboard-content">

              {/* TOP BAR */}
              <div className="welcome-dashboard-top">

                <div>
                  <span className="welcome-dashboard-small">
                    HR WORKSPACE
                  </span>

                  <h2>Dashboard</h2>
                </div>

                <div className="welcome-dashboard-profile">

                  <div className="welcome-search">
                    ⌕
                    <span>Search anything...</span>
                  </div>

                  <div className="welcome-notification">
                    ♧
                    <b>3</b>
                  </div>

                  <div className="welcome-profile-avatar">
                    AR
                  </div>

                </div>

              </div>

              {/* STAT CARDS */}
              <div className="welcome-stat-grid">

                <div className="welcome-stat-card">
                  <span>TOTAL EMPLOYEES</span>
                  <strong>128</strong>
                  <small className="welcome-positive">
                    ↑ 12 this month
                  </small>
                  <div className="welcome-stat-symbol blue">
                    ♙
                  </div>
                </div>

                <div className="welcome-stat-card">
                  <span>TOTAL PAYROLL</span>
                  <strong>₹48.64L</strong>
                  <small className="welcome-positive">
                    ↑ 8.4% this month
                  </small>
                  <div className="welcome-stat-symbol green">
                    ₹
                  </div>
                </div>

                <div className="welcome-stat-card">
                  <span>LEAVE REQUESTS</span>
                  <strong>16</strong>
                  <small>Pending approval</small>
                  <div className="welcome-stat-symbol yellow">
                    ◷
                  </div>
                </div>

                <div className="welcome-stat-card">
                  <span>PAYSLIPS GENERATED</span>
                  <strong>114</strong>
                  <small>This month</small>
                  <div className="welcome-stat-symbol purple">
                    ▧
                  </div>
                </div>

              </div>

              {/* MIDDLE */}
              <div className="welcome-dashboard-middle">

                {/* PAYROLL */}
                <div className="welcome-payroll-panel">

                  <div className="welcome-panel-heading">

                    <div>
                      <h3>Monthly Payroll Overview</h3>
                      <span>November 2026</span>
                    </div>

                    <button type="button">
                      This month⌄
                    </button>

                  </div>

                  <div className="welcome-payroll-data">

                    <div className="welcome-payroll-numbers">

                      <span>Total Gross Salary</span>
                      <strong>₹48,64,000</strong>

                      <span className="welcome-net-label">
                        Total Net Salary
                      </span>

                      <strong className="welcome-net-value">
                        ₹36,72,000
                      </strong>

                      <div className="welcome-processed">
                        ✓ PROCESSED
                      </div>

                    </div>

                    <div className="welcome-donut">
                      <div className="welcome-donut-center">
                        <span>Total</span>
                        <strong>₹48.64L</strong>
                      </div>
                    </div>

                    <div className="welcome-legend">

                      <div>
                        <span className="welcome-dot blue-dot"></span>
                        <label>Basic Salary</label>
                        <strong>₹28,00,000</strong>
                      </div>

                      <div>
                        <span className="welcome-dot cyan-dot"></span>
                        <label>HRA</label>
                        <strong>₹10,80,000</strong>
                      </div>

                      <div>
                        <span className="welcome-dot purple-dot"></span>
                        <label>Allowances</label>
                        <strong>₹7,20,000</strong>
                      </div>

                      <div>
                        <span className="welcome-dot yellow-dot"></span>
                        <label>Deductions</label>
                        <strong>₹2,00,000</strong>
                      </div>

                    </div>

                  </div>

                </div>

                {/* LEAVE */}
                <div className="welcome-leave-panel">

                  <div className="welcome-panel-heading">

                    <h3>Leave Balance</h3>

                    <button
                      type="button"
                      onClick={() =>
                        scrollToSection("welcome-modules")
                      }
                    >
                      View all
                    </button>

                  </div>

                  <div className="welcome-leave-row">

                    <div>
                      <span>Casual Leave</span>
                      <strong>12 / 12 days</strong>
                    </div>

                    <div className="welcome-leave-progress">
                      <span style={{ width: "100%" }}></span>
                    </div>

                  </div>

                  <div className="welcome-leave-row">

                    <div>
                      <span>Medical Leave</span>
                      <strong>15 / 15 days</strong>
                    </div>

                    <div className="welcome-leave-progress">
                      <span style={{ width: "100%" }}></span>
                    </div>

                  </div>

                  <div className="welcome-leave-row">

                    <div>
                      <span>Earned Leave</span>
                      <strong>18 / 20 days</strong>
                    </div>

                    <div className="welcome-leave-progress">
                      <span style={{ width: "90%" }}></span>
                    </div>

                  </div>

                  <div className="welcome-leave-row">

                    <div>
                      <span>Comp Off</span>
                      <strong>05 / 08 days</strong>
                    </div>

                    <div className="welcome-leave-progress yellow-progress">
                      <span style={{ width: "63%" }}></span>
                    </div>

                  </div>

                </div>

              </div>

              {/* BOTTOM */}
              <div className="welcome-dashboard-bottom">

                {/* ACTIVITY */}
                <div className="welcome-activity-panel">

                  <div className="welcome-panel-heading">

                    <h3>Recent Payroll Activity</h3>

                    <button
                      type="button"
                      onClick={() =>
                        scrollToSection("welcome-modules")
                      }
                    >
                      View all →
                    </button>

                  </div>

                  <div className="welcome-activity-header">
                    <span>Employee</span>
                    <span>Department</span>
                    <span>Gross Salary</span>
                    <span>Net Salary</span>
                    <span>Status</span>
                  </div>

                  <div className="welcome-activity-row">

                    <div className="welcome-employee-name">
                      <div className="welcome-mini-avatar">
                        RV
                      </div>
                      Rahul Verma
                    </div>

                    <span>Engineering</span>
                    <span>₹52,000</span>
                    <span>₹41,600</span>
                    <b className="welcome-paid">PAID</b>

                  </div>

                  <div className="welcome-activity-row">

                    <div className="welcome-employee-name">
                      <div className="welcome-mini-avatar">
                        PS
                      </div>
                      Priya Singh
                    </div>

                    <span>Marketing</span>
                    <span>₹45,000</span>
                    <span>₹36,250</span>
                    <b className="welcome-paid">PAID</b>

                  </div>

                  <div className="welcome-activity-row">

                    <div className="welcome-employee-name">
                      <div className="welcome-mini-avatar">
                        AK
                      </div>
                      Amit Kumar
                    </div>

                    <span>Sales</span>
                    <span>₹38,000</span>
                    <span>₹30,400</span>
                    <b className="welcome-paid">PAID</b>

                  </div>

                </div>

                {/* PAYSLIP STATUS */}
                <div className="welcome-payslip-panel">

                  <h3>Payslip Status</h3>

                  <div className="welcome-payslip-circle">
                    <div>
                      <strong>89%</strong>
                      <span>generated</span>
                    </div>
                  </div>

                  <strong className="welcome-payslip-count">
                    114 / 128
                  </strong>

                  <span>Payslips Generated</span>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

      {/* SECURITY */}
      <section
        className="welcome-info-section"
        id="welcome-security"
      >

        <div className="welcome-info-content">

          <span className="welcome-info-label">
            SECURITY
          </span>

          <h2>
            Your HR data stays
            <span> protected.</span>
          </h2>

          <p>
            Built with secure authentication and controlled
            access to protect employee, salary and payroll
            information.
          </p>

          <div className="welcome-info-cards">

            <div className="welcome-info-card">
              <div className="welcome-info-icon">✓</div>

              <div>
                <h3>JWT Authentication</h3>
                <p>
                  Secure authentication keeps your HR
                  application protected.
                </p>
              </div>
            </div>

            <div className="welcome-info-card">
              <div className="welcome-info-icon">◆</div>

              <div>
                <h3>Role-Based Access</h3>
                <p>
                  Control which users can access sensitive
                  HR operations.
                </p>
              </div>
            </div>

            <div className="welcome-info-card">
              <div className="welcome-info-icon">▣</div>

              <div>
                <h3>Protected Payroll</h3>
                <p>
                  Salary and payslip information is handled
                  through protected APIs.
                </p>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ABOUT */}
      <section
        className="welcome-info-section welcome-about-section"
        id="welcome-about"
      >

        <div className="welcome-info-content">

          <span className="welcome-info-label">
            ABOUT HRM
          </span>

          <h2>
            One workspace for
            <span> modern HR.</span>
          </h2>

          <p>
            HRM Salary Structure &amp; Payslip Automation brings
            salary configuration, leave management, payroll
            processing and payslip delivery together in one
            streamlined workspace.
          </p>

          <div className="welcome-about-stats">

            <div>
              <strong>01</strong>
              <span>Salary Configuration</span>
            </div>

            <div>
              <strong>02</strong>
              <span>Leave Management</span>
            </div>

            <div>
              <strong>03</strong>
              <span>Payroll Processing</span>
            </div>

            <div>
              <strong>04</strong>
              <span>Payslip Automation</span>
            </div>

          </div>

        </div>

      </section>

      {/* CONTACT */}
      <section
        className="welcome-contact-section"
        id="welcome-contact"
      >

        <div className="welcome-contact-content">

          <div>

            <span className="welcome-info-label">
              CONTACT
            </span>

            <h2>
              Ready to simplify
              <span> payroll?</span>
            </h2>

            <p>
              Start using the HRM payroll workspace and make
              salary and payslip management simpler.
            </p>

          </div>

          <div className="welcome-contact-actions">

            <button
              type="button"
              className="welcome-primary-button"
              onClick={() => navigate("/signup")}
            >
              Get Started
              <span>→</span>
            </button>

            <a
              href="mailto:hrm@example.com"
              className="welcome-contact-email"
            >
              ✉ hrm@example.com
            </a>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section
        className="welcome-feature-section"
        id="welcome-features"
      >

        {features.map((feature, index) => (

          <div
            className="welcome-feature-item"
            key={index}
          >

            <div className="welcome-feature-icon">
              {feature.icon}
            </div>

            <div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>

          </div>

        ))}

      </section>

      {/* FOOTER */}
      <footer className="welcome-footer">

        <div>
          <strong>HRM</strong>
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