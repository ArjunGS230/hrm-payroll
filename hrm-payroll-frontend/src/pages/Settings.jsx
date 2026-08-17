import { useState } from "react";
import axios from "axios";

import "../styles/Settings.css";

function Settings() {

  // =====================================================
  // USER DETAILS
  // =====================================================

  const username =
    localStorage.getItem("username") || "User";

  const email =
    localStorage.getItem("email") || "Email not available";

  const role =
    localStorage.getItem("role")?.toUpperCase() || "EMPLOYEE";

  const token =
    localStorage.getItem("token");


  // =====================================================
  // ACTIVE TAB
  // =====================================================

  const [activeTab, setActiveTab] =
    useState(
      role === "HR" || role === "ADMIN"
        ? "general"
        : "profile"
    );


  // =====================================================
  // SEARCH
  // =====================================================

  const [searchText, setSearchText] =
    useState("");


  // =====================================================
  // PASSWORD
  // =====================================================

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [passwordLoading, setPasswordLoading] =
    useState(false);

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [payrollNotifications, setPayrollNotifications] =
    useState(true);

  const [leaveNotifications, setLeaveNotifications] =
    useState(true);


  // =====================================================
  // HR GENERAL SETTINGS
  // =====================================================

  const [companyName, setCompanyName] =
    useState("HRM Solutions");

  const [companyEmail, setCompanyEmail] =
    useState("admin@hrm.com");

  const [timezone, setTimezone] =
    useState("Asia/Kolkata");

  const [currency, setCurrency] =
    useState("INR");


  // =====================================================
  // HR SETTINGS
  // =====================================================

  const hrSettings = [

    {
      id: "general",
      title: "General",
      description:
        "Manage company information and general HRM settings.",
      keywords:
        "general company organization profile information",
      icon: "⚙"
    },

    {
      id: "security",
      title: "Security",
      description:
        "Manage password and account security.",
      keywords:
        "security password authentication login",
      icon: "🔒"
    },

    {
      id: "notifications",
      title: "Notifications",
      description:
        "Configure notification preferences.",
      keywords:
        "notifications email alerts messages",
      icon: "♧"
    },

    {
      id: "payroll",
      title: "Payroll",
      description:
        "Configure payroll preferences.",
      keywords:
        "payroll salary processing payslip",
      icon: "₹"
    },

    {
      id: "email",
      title: "Email",
      description:
        "Configure email delivery settings.",
      keywords:
        "email smtp delivery automation",
      icon: "✉"
    }

  ];


  // =====================================================
  // EMPLOYEE SETTINGS
  // =====================================================

  const employeeSettings = [

    {
      id: "profile",
      title: "My Profile",
      description:
        "View your employee account information.",
      keywords:
        "profile employee username email account",
      icon: "👤"
    },

    {
      id: "security",
      title: "Security",
      description:
        "Change your account password.",
      keywords:
        "security password authentication login",
      icon: "🔒"
    },

    {
      id: "notifications",
      title: "Notifications",
      description:
        "Manage your notification preferences.",
      keywords:
        "notifications email alerts messages",
      icon: "♧"
    }

  ];


  // =====================================================
  // SETTINGS BASED ON ROLE
  // =====================================================

  const settingsItems =
    role === "HR" || role === "ADMIN"
      ? hrSettings
      : employeeSettings;


  // =====================================================
  // SEARCH FILTER
  // =====================================================

  const search =
    searchText.trim().toLowerCase();


  const filteredSettings =
    settingsItems.filter((item) => {

      if (!search) {
        return true;
      }

      return (
        item.title
          .toLowerCase()
          .includes(search)

        ||

        item.description
          .toLowerCase()
          .includes(search)

        ||

        item.keywords
          .toLowerCase()
          .includes(search)
      );

    });


  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const handleChangePassword = async (e) => {

    e.preventDefault();

    setPasswordMessage("");
    setPasswordError("");


    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {

      setPasswordError(
        "Please fill all password fields."
      );

      return;
    }


    if (newPassword.length < 6) {

      setPasswordError(
        "New password must contain at least 6 characters."
      );

      return;
    }


    if (
      newPassword !== confirmPassword
    ) {

      setPasswordError(
        "New passwords do not match."
      );

      return;
    }


    try {

      setPasswordLoading(true);


      // ---------------------------------------------
      // API
      // ---------------------------------------------

      const response =
        await axios.put(
          "http://localhost:8090/api/auth/change-password",

          {
            currentPassword:
              currentPassword,

            newPassword:
              newPassword,

            confirmPassword:
              confirmPassword
          },

          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


      // ---------------------------------------------
      // SUCCESS
      // ---------------------------------------------

      setPasswordMessage(
        response.data ||
        "Password changed successfully."
      );


      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");


    } catch (error) {

      console.error(
        "Change password error:",
        error
      );


      if (error.response) {

        setPasswordError(
          error.response.data?.message ||
          error.response.data ||
          "Unable to change password."
        );

      } else {

        setPasswordError(
          "Unable to connect to the server."
        );

      }

    } finally {

      setPasswordLoading(false);

    }

  };


  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const handleSave = () => {

    alert(
      "Settings saved successfully."
    );

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="settings-page">

      <main className="settings-main">


        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="dashboard-topbar">

          <div>

            <span className="dashboard-overline">

              {role === "HR" || role === "ADMIN"
                ? "HR WORKSPACE"
                : "EMPLOYEE WORKSPACE"}

            </span>

            <h1>
              Settings
            </h1>

          </div>


          <div className="dashboard-top-actions">


            {/* SEARCH */}

            <div className="settings-search-wrapper">

              <div className="settings-search">

                <span>
                  ⌕
                </span>

                <input
                  type="text"
                  value={searchText}
                  onChange={(e) =>
                    setSearchText(
                      e.target.value
                    )
                  }
                  placeholder="Search settings..."
                />

              </div>


              {searchText.trim() && (

                <div className="settings-search-results">

                  {filteredSettings.length > 0 ? (

                    filteredSettings.map(
                      (item) => (

                        <div
                          key={item.id}
                          className="settings-search-result"
                          onClick={() => {
                            setActiveTab(item.id);
                            setSearchText("");
                          }}
                        >

                          <div className="settings-search-avatar">
                            {item.icon}
                          </div>

                          <div className="settings-search-info">

                            <strong>
                              {item.title}
                            </strong>

                            <span>
                              {item.description}
                            </span>

                          </div>

                        </div>

                      )
                    )

                  ) : (

                    <div className="settings-search-no-result">

                      No matching settings found.

                    </div>

                  )}

                </div>

              )}

            </div>


            {/* USER */}

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


        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="settings-content">


          {/* HEADING */}

          <div className="settings-heading">

            <span>
              SETTINGS
            </span>

            <h2>
              Account & Preferences
            </h2>

            <p>

              {role === "HR" || role === "ADMIN"
                ? "Manage your HRM system preferences."
                : "Manage your employee account and preferences."}

            </p>

          </div>


          {/* =================================================
              SETTINGS LAYOUT
          ================================================= */}

          <div className="settings-layout">


            {/* =================================================
                LEFT MENU
            ================================================= */}

            <div className="settings-menu">

              {filteredSettings.map(
                (item) => (

                  <button
                    key={item.id}
                    type="button"
                    className={`settings-menu-button ${
                      activeTab === item.id
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setActiveTab(item.id)
                    }
                  >

                    <span>
                      {item.icon}
                    </span>

                    <span>
                      {item.title}
                    </span>

                  </button>

                )
              )}

            </div>


            {/* =================================================
                RIGHT PANEL
            ================================================= */}

            <div className="settings-panel">


              {/* =================================================
                  EMPLOYEE PROFILE
              ================================================= */}

              {activeTab === "profile" && (

                <>

                  <h3>
                    My Profile
                  </h3>

                  <p className="settings-description">

                    Your account information.

                  </p>


                  <div className="settings-form-grid">


                    {/* USERNAME */}

                    <div className="settings-field">

                      <label>
                        Username
                      </label>

                      <input
                        type="text"
                        value={username}
                        readOnly
                      />

                    </div>


                    {/* GMAIL */}

                    <div className="settings-field">

                      <label>
                        Gmail
                      </label>

                      <input
                        type="email"
                        value={email}
                        readOnly
                      />

                    </div>


                    {/* ROLE */}

                    <div className="settings-field">

                      <label>
                        Role
                      </label>

                      <input
                        type="text"
                        value={role}
                        readOnly
                      />

                    </div>


                    {/* STATUS */}

                    <div className="settings-field">

                      <label>
                        Account Status
                      </label>

                      <input
                        type="text"
                        value="Active"
                        readOnly
                      />

                    </div>

                  </div>

                </>

              )}


              {/* =================================================
                  SECURITY
              ================================================= */}

              {activeTab === "security" && (

                <>

                  <h3>
                    Security Settings
                  </h3>

                  <p className="settings-description">

                    Change your password securely.

                  </p>


                  {/* LOGIN NOTIFICATIONS */}

                  <div className="settings-toggle-row">

                    <div>

                      <strong>
                        Login notifications
                      </strong>

                      <p>
                        Receive notifications when
                        a new login occurs.
                      </p>

                    </div>

                    <input
                      type="checkbox"
                      defaultChecked
                    />

                  </div>


                  {/* PASSWORD SECTION */}

                  <div
                    style={{
                      marginTop: "25px",
                      padding: "24px",
                      borderRadius: "12px",
                      background: "#f8fafc",
                      border: "1px solid #e5e7eb"
                    }}
                  >

                    <h4
                      style={{
                        marginTop: 0,
                        marginBottom: "8px"
                      }}
                    >
                      Change Password
                    </h4>

                    <p
                      style={{
                        color: "#64748b",
                        fontSize: "13px",
                        marginBottom: "20px"
                      }}
                    >
                      Enter your current password and
                      choose a new password.
                    </p>


                    <form
                      onSubmit={
                        handleChangePassword
                      }
                    >


                      {/* CURRENT PASSWORD */}

                      <div
                        className="settings-field"
                        style={{
                          marginBottom: "16px"
                        }}
                      >

                        <label>
                          Current Password
                        </label>

                        <div
                          style={{
                            position: "relative"
                          }}
                        >

                          <input
                            type={
                              showCurrentPassword
                                ? "text"
                                : "password"
                            }
                            value={
                              currentPassword
                            }
                            onChange={(e) =>
                              setCurrentPassword(
                                e.target.value
                              )
                            }
                            placeholder="Enter current password"
                            autoComplete="current-password"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(
                                !showCurrentPassword
                              )
                            }
                            style={{
                              position: "absolute",
                              right: "12px",
                              top: "50%",
                              transform:
                                "translateY(-50%)",
                              border: "none",
                              background: "transparent",
                              cursor: "pointer"
                            }}
                          >
                            {showCurrentPassword
                              ? "Hide"
                              : "Show"}
                          </button>

                        </div>

                      </div>


                      {/* NEW PASSWORD */}

                      <div
                        className="settings-field"
                        style={{
                          marginBottom: "16px"
                        }}
                      >

                        <label>
                          New Password
                        </label>

                        <div
                          style={{
                            position: "relative"
                          }}
                        >

                          <input
                            type={
                              showNewPassword
                                ? "text"
                                : "password"
                            }
                            value={
                              newPassword
                            }
                            onChange={(e) =>
                              setNewPassword(
                                e.target.value
                              )
                            }
                            placeholder="Enter new password"
                            autoComplete="new-password"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowNewPassword(
                                !showNewPassword
                              )
                            }
                            style={{
                              position: "absolute",
                              right: "12px",
                              top: "50%",
                              transform:
                                "translateY(-50%)",
                              border: "none",
                              background: "transparent",
                              cursor: "pointer"
                            }}
                          >
                            {showNewPassword
                              ? "Hide"
                              : "Show"}
                          </button>

                        </div>

                      </div>


                      {/* CONFIRM PASSWORD */}

                      <div
                        className="settings-field"
                        style={{
                          marginBottom: "18px"
                        }}
                      >

                        <label>
                          Confirm New Password
                        </label>

                        <div
                          style={{
                            position: "relative"
                          }}
                        >

                          <input
                            type={
                              showConfirmPassword
                                ? "text"
                                : "password"
                            }
                            value={
                              confirmPassword
                            }
                            onChange={(e) =>
                              setConfirmPassword(
                                e.target.value
                              )
                            }
                            placeholder="Confirm new password"
                            autoComplete="new-password"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(
                                !showConfirmPassword
                              )
                            }
                            style={{
                              position: "absolute",
                              right: "12px",
                              top: "50%",
                              transform:
                                "translateY(-50%)",
                              border: "none",
                              background: "transparent",
                              cursor: "pointer"
                            }}
                          >
                            {showConfirmPassword
                              ? "Hide"
                              : "Show"}
                          </button>

                        </div>

                      </div>


                      {/* ERROR */}

                      {passwordError && (

                        <div
                          style={{
                            padding: "10px 12px",
                            marginBottom: "15px",
                            borderRadius: "8px",
                            background: "#fff1f2",
                            color: "#dc2626",
                            fontSize: "13px"
                          }}
                        >
                          {passwordError}
                        </div>

                      )}


                      {/* SUCCESS */}

                      {passwordMessage && (

                        <div
                          style={{
                            padding: "10px 12px",
                            marginBottom: "15px",
                            borderRadius: "8px",
                            background: "#f0fdf4",
                            color: "#16a34a",
                            fontSize: "13px"
                          }}
                        >
                          {passwordMessage}
                        </div>

                      )}


                      {/* CHANGE PASSWORD */}

                      <button
                        type="submit"
                        className="settings-save-button"
                        disabled={
                          passwordLoading
                        }
                      >

                        {passwordLoading
                          ? "Changing Password..."
                          : "Change Password"}

                      </button>

                    </form>

                  </div>

                </>

              )}


              {/* =================================================
                  NOTIFICATIONS
              ================================================= */}

              {activeTab === "notifications" && (

                <>

                  <h3>
                    Notification Settings
                  </h3>

                  <p className="settings-description">

                    Choose which notifications
                    you want to receive.

                  </p>


                  <div className="settings-toggle-row">

                    <div>

                      <strong>
                        Email Notifications
                      </strong>

                      <p>
                        Receive important notifications
                        through email.
                      </p>

                    </div>

                    <input
                      type="checkbox"
                      checked={
                        emailNotifications
                      }
                      onChange={(e) =>
                        setEmailNotifications(
                          e.target.checked
                        )
                      }
                    />

                  </div>


                  <div className="settings-toggle-row">

                    <div>

                      <strong>
                        Payroll Notifications
                      </strong>

                      <p>
                        Receive notifications about
                        payroll processing.
                      </p>

                    </div>

                    <input
                      type="checkbox"
                      checked={
                        payrollNotifications
                      }
                      onChange={(e) =>
                        setPayrollNotifications(
                          e.target.checked
                        )
                      }
                    />

                  </div>


                  <div className="settings-toggle-row">

                    <div>

                      <strong>
                        Leave Notifications
                      </strong>

                      <p>
                        Receive notifications about
                        leave requests.
                      </p>

                    </div>

                    <input
                      type="checkbox"
                      checked={
                        leaveNotifications
                      }
                      onChange={(e) =>
                        setLeaveNotifications(
                          e.target.checked
                        )
                      }
                    />

                  </div>


                  <button
                    type="button"
                    className="settings-save-button"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>

                </>

              )}


              {/* =================================================
                  HR GENERAL
              ================================================= */}

              {activeTab === "general" && (

                <>

                  <h3>
                    General Settings
                  </h3>

                  <p className="settings-description">

                    Manage company information
                    and general HRM preferences.

                  </p>


                  <div className="settings-form-grid">

                    <div className="settings-field">

                      <label>
                        Company Name
                      </label>

                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) =>
                          setCompanyName(
                            e.target.value
                          )
                        }
                      />

                    </div>


                    <div className="settings-field">

                      <label>
                        Company Email
                      </label>

                      <input
                        type="email"
                        value={companyEmail}
                        onChange={(e) =>
                          setCompanyEmail(
                            e.target.value
                          )
                        }
                      />

                    </div>


                    <div className="settings-field">

                      <label>
                        Timezone
                      </label>

                      <select
                        value={timezone}
                        onChange={(e) =>
                          setTimezone(
                            e.target.value
                          )
                        }
                      >

                        <option value="Asia/Kolkata">
                          Asia/Kolkata
                        </option>

                        <option value="Asia/Dubai">
                          Asia/Dubai
                        </option>

                        <option value="Asia/Singapore">
                          Asia/Singapore
                        </option>

                        <option value="UTC">
                          UTC
                        </option>

                      </select>

                    </div>


                    <div className="settings-field">

                      <label>
                        Currency
                      </label>

                      <select
                        value={currency}
                        onChange={(e) =>
                          setCurrency(
                            e.target.value
                          )
                        }
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

                  </div>


                  <button
                    type="button"
                    className="settings-save-button"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>

                </>

              )}


              {/* =================================================
                  HR PAYROLL
              ================================================= */}

              {activeTab === "payroll" && (

                <>

                  <h3>
                    Payroll Settings
                  </h3>

                  <p className="settings-description">

                    Configure payroll processing preferences.

                  </p>


                  <div className="settings-toggle-row">

                    <div>

                      <strong>
                        Automatic Payroll Processing
                      </strong>

                      <p>
                        Automatically process payroll
                        for configured periods.
                      </p>

                    </div>

                    <input
                      type="checkbox"
                      defaultChecked
                    />

                  </div>


                  <div className="settings-toggle-row">

                    <div>

                      <strong>
                        Automatic Payslip Generation
                      </strong>

                      <p>
                        Generate payslips after payroll
                        processing.
                      </p>

                    </div>

                    <input
                      type="checkbox"
                      defaultChecked
                    />

                  </div>


                  <button
                    type="button"
                    className="settings-save-button"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>

                </>

              )}


              {/* =================================================
                  HR EMAIL
              ================================================= */}

              {activeTab === "email" && (

                <>

                  <h3>
                    Email Settings
                  </h3>

                  <p className="settings-description">

                    Manage email delivery and automation
                    preferences.

                  </p>


                  <div className="settings-field">

                    <label>
                      Sender Email
                    </label>

                    <input
                      type="email"
                      defaultValue="noreply@hrm.com"
                    />

                  </div>


                  <div
                    className="settings-toggle-row"
                    style={{
                      marginTop: "20px"
                    }}
                  >

                    <div>

                      <strong>
                        Automatic Payslip Emails
                      </strong>

                      <p>
                        Automatically send generated
                        payslips to employees.
                      </p>

                    </div>

                    <input
                      type="checkbox"
                      defaultChecked
                    />

                  </div>


                  <button
                    type="button"
                    className="settings-save-button"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>

                </>

              )}

            </div>

          </div>

        </div>

      </main>

    </div>

  );
}

export default Settings;