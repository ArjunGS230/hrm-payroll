import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Settings() {

  const navigate = useNavigate();

  const username =
    localStorage.getItem("username") || "User";

  const role =
    localStorage.getItem("role") || "HR";


  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    name: username,
    email: "arjun@example.com",
    role: role
  });


  const [company, setCompany] = useState({
    companyName: "HRM Solutions",
    companyEmail: "admin@hrm.com",
    phone: "+91 9876543210",
    address: "Bengaluru, Karnataka, India"
  });


  const [payroll, setPayroll] = useState({
    payrollDay: "30",
    currency: "INR",
    workingDays: "26",
    overtimeEnabled: true
  });


  const [emailSettings, setEmailSettings] = useState({
    emailEnabled: true,
    sendPayslipAutomatically: true,
    sendLeaveNotifications: true,
    sendPayrollNotifications: true
  });


  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: "30"
  });


  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }

  }, [navigate]);


  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    navigate("/login");
  };


  const handleProfileChange = (e) => {

    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });

  };


  const handleCompanyChange = (e) => {

    setCompany({
      ...company,
      [e.target.name]: e.target.value
    });

  };


  const handlePayrollChange = (e) => {

    setPayroll({
      ...payroll,
      [e.target.name]: e.target.value
    });

  };


  const handleEmailChange = (e) => {

    setEmailSettings({
      ...emailSettings,
      [e.target.name]: e.target.checked
    });

  };


  const handleSecurityChange = (e) => {

    setSecurity({
      ...security,
      [e.target.name]: e.target.type === "checkbox"
        ? e.target.checked
        : e.target.value
    });

  };


  const handleSave = (section) => {

    alert(`${section} settings saved successfully.`);

  };


  return (

    <div className="dashboard-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="dashboard-sidebar">

        <div className="dashboard-brand">

          <div className="dashboard-brand-logo">
            H
          </div>

          <div>
            <strong>HRM</strong>

            <span>
              PAYROLL AUTOMATION
            </span>
          </div>

        </div>


        <nav className="dashboard-navigation">

          <button
            type="button"
            className="dashboard-menu-item"
            onClick={() => navigate("/dashboard")}
          >
            <span className="dashboard-menu-icon">⌂</span>
            <span className="dashboard-menu-text">
              Dashboard
            </span>
          </button>


          <button
            type="button"
            className="dashboard-menu-item"
            onClick={() => navigate("/employees")}
          >
            <span className="dashboard-menu-icon">♙</span>
            <span className="dashboard-menu-text">
              Employees
            </span>
          </button>


          <button
            type="button"
            className="dashboard-menu-item"
            onClick={() => navigate("/salary-structures")}
          >
            <span className="dashboard-menu-icon">₹</span>
            <span className="dashboard-menu-text">
              Salary Structures
            </span>
          </button>


          <button
            type="button"
            className="dashboard-menu-item"
            onClick={() => navigate("/leave-management")}
          >
            <span className="dashboard-menu-icon">◷</span>
            <span className="dashboard-menu-text">
              Leave Management
            </span>
          </button>


          <button
            type="button"
            className="dashboard-menu-item"
            onClick={() => navigate("/payroll")}
          >
            <span className="dashboard-menu-icon">▣</span>
            <span className="dashboard-menu-text">
              Payroll
            </span>
          </button>


          <button
            type="button"
            className="dashboard-menu-item"
            onClick={() => navigate("/payslips")}
          >
            <span className="dashboard-menu-icon">▤</span>
            <span className="dashboard-menu-text">
              Payslips
            </span>
          </button>


          <button
            type="button"
            className="dashboard-menu-item"
            onClick={() => navigate("/email-logs")}
          >
            <span className="dashboard-menu-icon">✉</span>
            <span className="dashboard-menu-text">
              Email Logs
            </span>
          </button>


          <button
            type="button"
            className="dashboard-menu-item"
            onClick={() => navigate("/reports")}
          >
            <span className="dashboard-menu-icon">▥</span>
            <span className="dashboard-menu-text">
              Reports
            </span>
          </button>


          {/* SETTINGS ACTIVE */}

          <button
            type="button"
            className="dashboard-menu-item active"
            onClick={() => navigate("/settings")}
          >
            <span className="dashboard-menu-icon">⚙</span>
            <span className="dashboard-menu-text">
              Settings
            </span>
          </button>

        </nav>


        {/* SIDEBAR FOOTER */}

        <div className="dashboard-sidebar-footer">

          <div className="dashboard-user">

            <div className="dashboard-avatar">
              {username
                .substring(0, 2)
                .toUpperCase()}
            </div>

            <div>

              <strong>
                {username}
              </strong>

              <span>
                {role}
              </span>

            </div>

          </div>


          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <main className="dashboard-main">

        {/* TOPBAR */}

        <header className="dashboard-topbar">

          <div>

            <span className="dashboard-overline">
              HR WORKSPACE
            </span>

            <h1>
              Settings
            </h1>

          </div>


          <div className="dashboard-top-actions">

            <button className="dashboard-search">
              <span>⌕</span>
              Search anything...
            </button>


            <button className="notification-button">
              ♧
              <b>3</b>
            </button>


            <div className="topbar-user">

              <div className="dashboard-avatar">
                {username
                  .substring(0, 2)
                  .toUpperCase()}
              </div>

              <div>

                <strong>
                  {username}
                </strong>

                <span>
                  {role}
                </span>

              </div>

            </div>

          </div>

        </header>


        {/* ================= SETTINGS CONTENT ================= */}

        <section
          style={{
            padding: "32px"
          }}
        >

          <div style={{ marginBottom: "30px" }}>

            <span
              style={{
                color: "#2563eb",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "2px"
              }}
            >
              SYSTEM SETTINGS
            </span>

            <h2
              style={{
                fontSize: "32px",
                margin: "8px 0",
                color: "#172033"
              }}
            >
              Settings
            </h2>

            <p
              style={{
                color: "#64748b",
                margin: 0
              }}
            >
              Manage your HRM payroll system settings.
            </p>

          </div>


          {/* SETTINGS LAYOUT */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "230px 1fr",
              gap: "25px",
              alignItems: "start"
            }}
          >


            {/* SETTINGS MENU */}

            <div
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                padding: "10px",
                boxShadow:
                  "0 3px 12px rgba(0,0,0,0.06)"
              }}
            >

              <button
                onClick={() => setActiveTab("profile")}
                style={{
                  ...tabStyle,
                  ...(activeTab === "profile"
                    ? activeTabStyle
                    : {})
                }}
              >
                👤 Profile
              </button>


              <button
                onClick={() => setActiveTab("company")}
                style={{
                  ...tabStyle,
                  ...(activeTab === "company"
                    ? activeTabStyle
                    : {})
                }}
              >
                🏢 Company
              </button>


              <button
                onClick={() => setActiveTab("payroll")}
                style={{
                  ...tabStyle,
                  ...(activeTab === "payroll"
                    ? activeTabStyle
                    : {})
                }}
              >
                ₹ Payroll
              </button>


              <button
                onClick={() => setActiveTab("email")}
                style={{
                  ...tabStyle,
                  ...(activeTab === "email"
                    ? activeTabStyle
                    : {})
                }}
              >
                ✉ Email
              </button>


              <button
                onClick={() => setActiveTab("security")}
                style={{
                  ...tabStyle,
                  ...(activeTab === "security"
                    ? activeTabStyle
                    : {})
                }}
              >
                🔐 Security
              </button>

            </div>


            {/* SETTINGS PANEL */}

            <div
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                padding: "30px",
                boxShadow:
                  "0 3px 12px rgba(0,0,0,0.06)"
              }}
            >


              {/* ================= PROFILE ================= */}

              {activeTab === "profile" && (

                <>

                  <h3 style={headingStyle}>
                    Profile Settings
                  </h3>

                  <p style={descriptionStyle}>
                    Manage your personal account information.
                  </p>


                  <div style={formGrid}>

                    <div>
                      <label style={labelStyle}>
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                        style={inputStyle}
                      />
                    </div>


                    <div>
                      <label style={labelStyle}>
                        Email Address
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        style={inputStyle}
                      />
                    </div>


                    <div>
                      <label style={labelStyle}>
                        Role
                      </label>

                      <input
                        type="text"
                        value={profile.role}
                        disabled
                        style={{
                          ...inputStyle,
                          background: "#f1f5f9"
                        }}
                      />
                    </div>

                  </div>


                  <SaveButton
                    onClick={() =>
                      handleSave("Profile")
                    }
                  />

                </>

              )}


              {/* ================= COMPANY ================= */}

              {activeTab === "company" && (

                <>

                  <h3 style={headingStyle}>
                    Company Information
                  </h3>

                  <p style={descriptionStyle}>
                    Configure your organization's basic information.
                  </p>


                  <div style={formGrid}>

                    <div>
                      <label style={labelStyle}>
                        Company Name
                      </label>

                      <input
                        type="text"
                        name="companyName"
                        value={company.companyName}
                        onChange={handleCompanyChange}
                        style={inputStyle}
                      />
                    </div>


                    <div>
                      <label style={labelStyle}>
                        Company Email
                      </label>

                      <input
                        type="email"
                        name="companyEmail"
                        value={company.companyEmail}
                        onChange={handleCompanyChange}
                        style={inputStyle}
                      />
                    </div>


                    <div>
                      <label style={labelStyle}>
                        Phone Number
                      </label>

                      <input
                        type="text"
                        name="phone"
                        value={company.phone}
                        onChange={handleCompanyChange}
                        style={inputStyle}
                      />
                    </div>


                    <div>
                      <label style={labelStyle}>
                        Address
                      </label>

                      <input
                        type="text"
                        name="address"
                        value={company.address}
                        onChange={handleCompanyChange}
                        style={inputStyle}
                      />
                    </div>

                  </div>


                  <SaveButton
                    onClick={() =>
                      handleSave("Company")
                    }
                  />

                </>

              )}


              {/* ================= PAYROLL ================= */}

              {activeTab === "payroll" && (

                <>

                  <h3 style={headingStyle}>
                    Payroll Settings
                  </h3>

                  <p style={descriptionStyle}>
                    Configure your payroll processing preferences.
                  </p>


                  <div style={formGrid}>

                    <div>
                      <label style={labelStyle}>
                        Payroll Processing Day
                      </label>

                      <select
                        name="payrollDay"
                        value={payroll.payrollDay}
                        onChange={handlePayrollChange}
                        style={inputStyle}
                      >

                        {Array.from(
                          { length: 28 },
                          (_, i) => (
                            <option
                              key={i + 1}
                              value={i + 1}
                            >
                              {i + 1}
                            </option>
                          )
                        )}

                      </select>

                    </div>


                    <div>
                      <label style={labelStyle}>
                        Currency
                      </label>

                      <select
                        name="currency"
                        value={payroll.currency}
                        onChange={handlePayrollChange}
                        style={inputStyle}
                      >
                        <option value="INR">
                          INR - Indian Rupee
                        </option>

                        <option value="USD">
                          USD - US Dollar
                        </option>

                        <option value="EUR">
                          EUR - Euro
                        </option>

                      </select>

                    </div>


                    <div>
                      <label style={labelStyle}>
                        Standard Working Days
                      </label>

                      <input
                        type="number"
                        name="workingDays"
                        value={payroll.workingDays}
                        onChange={handlePayrollChange}
                        style={inputStyle}
                      />
                    </div>

                  </div>


                  <div style={toggleRow}>

                    <div>
                      <strong>
                        Enable Overtime
                      </strong>

                      <p style={smallDescription}>
                        Allow overtime calculations in payroll.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      name="overtimeEnabled"
                      checked={payroll.overtimeEnabled}
                      onChange={(e) =>
                        setPayroll({
                          ...payroll,
                          overtimeEnabled:
                            e.target.checked
                        })
                      }
                    />

                  </div>


                  <SaveButton
                    onClick={() =>
                      handleSave("Payroll")
                    }
                  />

                </>

              )}


              {/* ================= EMAIL ================= */}

              {activeTab === "email" && (

                <>

                  <h3 style={headingStyle}>
                    Email Settings
                  </h3>

                  <p style={descriptionStyle}>
                    Configure automatic HR and payroll email notifications.
                  </p>


                  <div style={settingsList}>


                    <div style={toggleRow}>

                      <div>
                        <strong>
                          Email Notifications
                        </strong>

                        <p style={smallDescription}>
                          Enable system email notifications.
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        name="emailEnabled"
                        checked={emailSettings.emailEnabled}
                        onChange={handleEmailChange}
                      />

                    </div>


                    <div style={toggleRow}>

                      <div>
                        <strong>
                          Automatically Send Payslips
                        </strong>

                        <p style={smallDescription}>
                          Send generated payslips automatically to employees.
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        name="sendPayslipAutomatically"
                        checked={
                          emailSettings.sendPayslipAutomatically
                        }
                        onChange={handleEmailChange}
                      />

                    </div>


                    <div style={toggleRow}>

                      <div>
                        <strong>
                          Leave Notifications
                        </strong>

                        <p style={smallDescription}>
                          Send notifications when leave requests are created or approved.
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        name="sendLeaveNotifications"
                        checked={
                          emailSettings.sendLeaveNotifications
                        }
                        onChange={handleEmailChange}
                      />

                    </div>


                    <div style={toggleRow}>

                      <div>
                        <strong>
                          Payroll Notifications
                        </strong>

                        <p style={smallDescription}>
                          Send notifications related to payroll processing.
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        name="sendPayrollNotifications"
                        checked={
                          emailSettings.sendPayrollNotifications
                        }
                        onChange={handleEmailChange}
                      />

                    </div>

                  </div>


                  <SaveButton
                    onClick={() =>
                      handleSave("Email")
                    }
                  />

                </>

              )}


              {/* ================= SECURITY ================= */}

              {activeTab === "security" && (

                <>

                  <h3 style={headingStyle}>
                    Security Settings
                  </h3>

                  <p style={descriptionStyle}>
                    Manage account security and session preferences.
                  </p>


                  <div style={toggleRow}>

                    <div>
                      <strong>
                        Two-Factor Authentication
                      </strong>

                      <p style={smallDescription}>
                        Add an additional security layer to your account.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      name="twoFactor"
                      checked={security.twoFactor}
                      onChange={handleSecurityChange}
                    />

                  </div>


                  <div style={formGrid}>

                    <div>

                      <label style={labelStyle}>
                        Session Timeout
                      </label>

                      <select
                        name="sessionTimeout"
                        value={security.sessionTimeout}
                        onChange={handleSecurityChange}
                        style={inputStyle}
                      >

                        <option value="15">
                          15 minutes
                        </option>

                        <option value="30">
                          30 minutes
                        </option>

                        <option value="60">
                          1 hour
                        </option>

                        <option value="120">
                          2 hours
                        </option>

                      </select>

                    </div>

                  </div>


                  <SaveButton
                    onClick={() =>
                      handleSave("Security")
                    }
                  />

                </>

              )}

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}


/* ================= STYLES ================= */

const tabStyle = {
  width: "100%",
  border: "none",
  background: "transparent",
  padding: "13px 15px",
  textAlign: "left",
  borderRadius: "7px",
  cursor: "pointer",
  fontSize: "14px",
  color: "#475569",
  marginBottom: "3px"
};


const activeTabStyle = {
  background: "#eef4ff",
  color: "#2563eb",
  fontWeight: "600"
};


const headingStyle = {
  margin: 0,
  color: "#172033",
  fontSize: "22px"
};


const descriptionStyle = {
  color: "#64748b",
  marginTop: "8px",
  marginBottom: "28px"
};


const formGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
  gap: "22px",
  marginBottom: "25px"
};


const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "14px",
  fontWeight: "600",
  color: "#334155"
};


const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 13px",
  border: "1px solid #dbe2ea",
  borderRadius: "7px",
  outline: "none",
  fontSize: "14px",
  color: "#172033",
  background: "#ffffff"
};


const toggleRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "18px 0",
  borderBottom: "1px solid #e5e7eb",
  marginBottom: "5px"
};


const smallDescription = {
  color: "#64748b",
  fontSize: "13px",
  margin: "5px 0 0"
};


const settingsList = {
  marginBottom: "25px"
};


function SaveButton({ onClick }) {

  return (

    <button
      onClick={onClick}
      style={{
        marginTop: "10px",
        padding: "11px 22px",
        border: "none",
        borderRadius: "7px",
        background: "#2563eb",
        color: "#ffffff",
        fontWeight: "600",
        cursor: "pointer"
      }}
    >
      Save Changes
    </button>

  );

}


export default Settings;