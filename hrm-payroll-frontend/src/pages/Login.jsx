import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import "../styles/Login.css";

function Login() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);


  /* =====================================================
     LOGIN
  ===================================================== */

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");


    /* VALIDATION */

    if (!username || !password) {

      setError(
        "Please enter username and password"
      );

      return;
    }


    try {

      setLoading(true);


      /* API CALL */

      const response = await axios.post(
        "http://localhost:8090/api/auth/login",
        {
          username: username,
          password: password
        }
      );


      console.log(
        "Login response:",
        response.data
      );


      /* =================================================
         GET JWT TOKEN
      ================================================= */

      const token =
        response.data.token ||
        response.data.jwt ||
        response.data.accessToken;


      if (!token) {

        setError(
          "JWT token was not returned by server"
        );

        return;
      }


      /* =================================================
         STORE LOGIN DATA
      ================================================= */

      localStorage.setItem(
        "token",
        token
      );


      localStorage.setItem(
        "username",
        username
      );


      if (response.data.role) {

        localStorage.setItem(
          "role",
          response.data.role
        );

      }


      /* =================================================
         GO TO DASHBOARD
      ================================================= */

      navigate("/dashboard");


    } catch (err) {

      console.error(
        "Login error:",
        err
      );


      if (err.response) {

        setError(
          err.response.data?.message ||
          "Invalid username or password"
        );

      } else {

        setError(
          "Unable to connect to the server"
        );

      }


    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="login-page">


      {/* =================================================
          LEFT BRAND AREA
      ================================================= */}

      <section className="login-brand">

        <div className="login-brand-content">


          {/* LOGO */}

          <div className="login-logo">
            H
          </div>


          {/* BRAND */}

          <div className="login-brand-name">
            HRM
          </div>


          <div className="login-brand-subtitle">
            Salary & Payslip Automation
          </div>


          {/* LINE */}

          <div className="login-line"></div>


          {/* HEADING */}

          <h1>

            Manage payroll.

            <br />

            <span>
              Simply.
            </span>

          </h1>


          {/* DESCRIPTION */}

          <p>

            A centralized workspace for salary
            structures, employee leaves, payroll
            processing and automated payslip delivery.

          </p>

        </div>

      </section>


      {/* =================================================
          RIGHT LOGIN AREA
      ================================================= */}

      <section className="login-form-section">

        <div className="login-container">


          {/* MOBILE LOGO */}

          <div className="mobile-logo">
            HRM
          </div>


          {/* LABEL */}

          <span className="login-label">
            SECURE ACCESS
          </span>


          {/* TITLE */}

          <h2>
            Welcome back
          </h2>


          {/* DESCRIPTION */}

          <p className="login-description">

            Sign in to access your HRM workspace.

          </p>


          {/* =================================================
              FORM
          ================================================= */}

          <form onSubmit={handleLogin}>


            {/* =================================================
                USERNAME
            ================================================= */}

            <div className="input-group">

              <label>
                Username
              </label>


              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                autoComplete="username"
                required
              />

            </div>


            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="input-group">


              {/* PASSWORD LABEL */}

              <div className="password-label">

                <label>
                  Password
                </label>


                <span>
                  Protected
                </span>

              </div>


              {/* PASSWORD INPUT + EYE */}

              <div className="password-input-wrapper">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  autoComplete="current-password"
                  required
                />


                {/* EYE BUTTON */}

                <button
                  type="button"
                  className="password-toggle"
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
                ERROR
            ================================================= */}

            {error && (

              <div className="login-error">

                {error}

              </div>

            )}


            {/* =================================================
                LOGIN BUTTON
            ================================================= */}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >

              {loading
                ? "Signing in..."
                : "Sign in"
              }


              {!loading && (

                <span>
                  →
                </span>

              )}

            </button>

          </form>


          {/* =================================================
              SIGN UP LINK
          ================================================= */}

          <div className="auth-switch">

            <span>
              Don't have an account?
            </span>


            <button
              type="button"
              onClick={() =>
                navigate("/signup")
              }
            >
              Create account
            </button>

          </div>


          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="login-footer">

            <span>
              HRM Payroll Management System
            </span>


            <span>
              Secure JWT authentication
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;