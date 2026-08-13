import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import "../styles/SignUp.css";


function SignUp() {

  const navigate = useNavigate();


  /* =====================================================
     FORM DATA
  ===================================================== */

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "HR",
  });


  const [confirmPassword, setConfirmPassword] =
    useState("");


  /* =====================================================
     PASSWORD VISIBILITY
  ===================================================== */

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  /* =====================================================
     OTHER STATES
  ===================================================== */

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };


  /* =====================================================
     REGISTER
  ===================================================== */

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    /* =================================================
       USERNAME VALIDATION
    ================================================= */

    if (!formData.username.trim()) {

      setError(
        "Please enter your username."
      );

      return;
    }


    /* =================================================
       EMAIL VALIDATION
    ================================================= */

    if (!formData.email.trim()) {

      setError(
        "Please enter your Gmail address."
      );

      return;
    }


    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(formData.email)) {

      setError(
        "Please enter a valid email address."
      );

      return;
    }


    /* =================================================
       PHONE VALIDATION
    ================================================= */

    if (!formData.phoneNumber.trim()) {

      setError(
        "Please enter your phone number."
      );

      return;
    }


    const phonePattern =
      /^[6-9]\d{9}$/;


    if (
      !phonePattern.test(
        formData.phoneNumber
      )
    ) {

      setError(
        "Please enter a valid 10-digit phone number."
      );

      return;
    }


    /* =================================================
       PASSWORD VALIDATION
    ================================================= */

    if (formData.password.length < 6) {

      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }


    /* =================================================
       CONFIRM PASSWORD
    ================================================= */

    if (
      formData.password !==
      confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      return;
    }


    /* =================================================
       API CALL
    ================================================= */

    try {

      setLoading(true);


      const response = await axios.post(
        "http://localhost:8090/api/auth/register",
        {
          username:
            formData.username.trim(),

          email:
            formData.email.trim(),

          phoneNumber:
            formData.phoneNumber.trim(),

          password:
            formData.password,

          role:
            formData.role,
        }
      );


      /* =================================================
         SUCCESS
      ================================================= */

      setSuccess(
        response.data ||
        "Account created successfully."
      );


      /* =================================================
         CLEAR FORM
      ================================================= */

      setFormData({
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "HR",
      });

      setConfirmPassword("");


      /* =================================================
         REDIRECT TO LOGIN
      ================================================= */

      setTimeout(() => {

        navigate("/login");

      }, 1500);


    } catch (err) {

      console.error(
        "Registration error:",
        err
      );


      if (
        err.response?.data?.message
      ) {

        setError(
          err.response.data.message
        );

      }

      else if (
        typeof err.response?.data ===
        "string"
      ) {

        setError(
          err.response.data
        );

      }

      else {

        setError(
          "Registration failed. Please try again."
        );
      }


    } finally {

      setLoading(false);

    }
  };


  /* =====================================================
     JSX
  ===================================================== */

  return (

    <div className="signup-page">


      {/* =================================================
          LEFT BRAND
      ================================================= */}

      <section className="signup-brand">

        <div className="signup-brand-content">


          {/* LOGO */}

          <div className="signup-logo">
            H
          </div>


          {/* BRAND NAME */}

          <div className="signup-brand-name">
            HRM
          </div>


          {/* SUBTITLE */}

          <div className="signup-brand-subtitle">
            SALARY STRUCTURE & PAYSLIP AUTOMATION
          </div>


          {/* LINE */}

          <div className="signup-line"></div>


          {/* HEADING */}

          <h1>

            Build your

            <br />

            <span>
              HR workspace.
            </span>

          </h1>


          {/* DESCRIPTION */}

          <p>

            Create your HRM account and manage
            salary structures, payroll, leave and
            payslips from one centralized workspace.

          </p>

        </div>

      </section>


      {/* =================================================
          RIGHT FORM SECTION
      ================================================= */}

      <section className="signup-form-section">

        <div className="signup-container">


          {/* MOBILE LOGO */}

          <div className="signup-mobile-logo">
            H
          </div>


          {/* LABEL */}

          <span className="signup-label">
            CREATE ACCOUNT
          </span>


          {/* TITLE */}

          <h2>
            Get started.
          </h2>


          {/* DESCRIPTION */}

          <p className="signup-description">

            Create your HRM account to access
            the payroll automation workspace.

          </p>


          {/* =================================================
              FORM
          ================================================= */}

          <form onSubmit={handleSubmit}>


            {/* =================================================
                USERNAME
            ================================================= */}

            <div className="signup-input-group">

              <label>
                Username
              </label>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                autoComplete="username"
                required
              />

            </div>


            {/* =================================================
                EMAIL + PHONE
            ================================================= */}

            <div className="signup-two-column">


              {/* EMAIL */}

              <div className="signup-input-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@gmail.com"
                  autoComplete="email"
                  required
                />

              </div>


              {/* PHONE */}

              <div className="signup-input-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => {

                    const value =
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);


                    setFormData(
                      (previous) => ({
                        ...previous,
                        phoneNumber: value,
                      })
                    );

                    setError("");
                    setSuccess("");

                  }}
                  placeholder="9876543210"
                  autoComplete="tel"
                  maxLength="10"
                  required
                />

              </div>

            </div>


            {/* =================================================
                PASSWORD + CONFIRM PASSWORD
            ================================================= */}

            <div className="signup-two-column">


              {/* =================================================
                  PASSWORD
              ================================================= */}

              <div className="signup-input-group">

                <label>
                  Password
                </label>


                <div className="signup-password-wrapper">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    autoComplete="new-password"
                    required
                  />


                  {/* EYE BUTTON */}

                  <button
                    type="button"
                    className="signup-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showPassword ? (

                      <EyeOff
                        size={18}
                        strokeWidth={2}
                      />

                    ) : (

                      <Eye
                        size={18}
                        strokeWidth={2}
                      />

                    )}

                  </button>

                </div>

              </div>


              {/* =================================================
                  CONFIRM PASSWORD
              ================================================= */}

              <div className="signup-input-group">

                <label>
                  Confirm Password
                </label>


                <div className="signup-password-wrapper">

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) => {

                      setConfirmPassword(
                        e.target.value
                      );

                      setError("");
                      setSuccess("");

                    }}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    required
                  />


                  {/* EYE BUTTON */}

                  <button
                    type="button"
                    className="signup-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >

                    {showConfirmPassword ? (

                      <EyeOff
                        size={18}
                        strokeWidth={2}
                      />

                    ) : (

                      <Eye
                        size={18}
                        strokeWidth={2}
                      />

                    )}

                  </button>

                </div>

              </div>

            </div>


            {/* =================================================
                ROLE
            ================================================= */}

            <div className="signup-input-group">

              <label>
                Account Role
              </label>


              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="signup-role-select"
              >

                <option value="HR">
                  HR
                </option>

                <option value="EMPLOYEE">
                  Employee
                </option>

              </select>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <div className="signup-error">

                {error}

              </div>

            )}


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

              <div className="signup-success">

                {success}

              </div>

            )}


            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              className="signup-submit"
              disabled={loading}
            >

              {loading
                ? "Creating account..."
                : "Create Account"
              }


              {!loading && (

                <span>
                  →
                </span>

              )}

            </button>

          </form>


          {/* =================================================
              LOGIN LINK
          ================================================= */}

          <div className="signup-auth-switch">

            <span>
              Already have an account?
            </span>


            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
            >
              Sign In
            </button>

          </div>


          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="signup-footer">

            <span>
              HRM Payroll Automation
            </span>

            <span>
              Secure access
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}


export default SignUp;