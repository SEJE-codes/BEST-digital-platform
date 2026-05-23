import { useState } from "react";

import axios from "axios";

import {
  Link,
  useNavigate,
} from "react-router-dom";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function RegisterPage() {

  const navigate =
    useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  // =========================
  // REGISTER
  // =========================

  const register =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        await axios.post(
          `${API}/api/auth/register`,
          {
            name,
            email,
            password,
          }
        );

        alert(
          "Registration successful"
        );

        navigate("/");

      } catch (error) {

        console.log(error);

        alert(
          "Registration failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div
      className="page"
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >

      {/* ========================= */}
      {/* LEFT */}
      {/* ========================= */}

      <div
        style={{
          flex: 1,
          background:
            "linear-gradient(135deg,#0f172a,#1e3a8a)",
          color: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "50px",
        }}
      >

        <div>

          <h1
            style={{
              fontSize: "48px",
              marginBottom: "20px",
              color: "white",
            }}
          >
            QSHE DIGITAL
          </h1>

          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.8",
              color: "#cbd5e1",
              maxWidth: "500px",
            }}
          >
            Create your account and
            start managing industrial
            audits, inspections and
            APR reports professionally.
          </p>

        </div>

      </div>

      {/* ========================= */}
      {/* RIGHT */}
      {/* ========================= */}

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          background: "#f4f7fb",
        }}
      >

        <div
          className="card"
          style={{
            width: "100%",
            maxWidth: "450px",
            padding: "40px",
          }}
        >

          <h1>
            Create Account
          </h1>

          <p
            style={{
              marginBottom: "30px",
              color: "#64748b",
            }}
          >
            Register to continue
          </p>

          <form
            onSubmit={register}
          >

            <input
              type="text"
              placeholder="Full Name"
              className="input"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
            />

            <input
              type="email"
              placeholder="Email Address"
              className="input"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="input"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <button
              className="btn"
              style={{
                width: "100%",
              }}
            >

              {loading
                ? "Please wait..."
                : "Register"}

            </button>

          </form>

          <br />

          <p
            style={{
              textAlign: "center",
            }}
          >

            Already have an account?

            <Link
              to="/"
              style={{
                marginLeft: "5px",
                color: "#2563eb",
                fontWeight: "600",
              }}
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default RegisterPage;