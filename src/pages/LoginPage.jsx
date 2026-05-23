import { useState } from "react";
import axios from "axios";
import {
  useNavigate,
  Link,
} from "react-router-dom";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function LoginPage() {

  const navigate =
    useNavigate();

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
  // LOGIN
  // =========================

  const login = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res =
        await axios.post(
          `${API}/api/auth/login`,
          {
            email,
            password,
          }
        );

      localStorage.setItem(
        "token",
        res.data.token
      );

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      alert("Login failed");

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
      {/* LEFT SIDE */}
      {/* ========================= */}

      <div
        style={{
          flex: 1,
          background:
            "linear-gradient(135deg,#0f172a,#1e3a8a)",
          color: "white",
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
            Intelligent industrial
            inspection and APR
            management platform for
            modern companies.
          </p>

        </div>

      </div>

      {/* ========================= */}
      {/* RIGHT SIDE */}
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
            Welcome Back
          </h1>

          <p
            style={{
              marginBottom: "30px",
              color: "#64748b",
            }}
          >
            Login to continue
          </p>

          <form onSubmit={login}>

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
                : "Login"}

            </button>

          </form>

          <br />

          <p
            style={{
              textAlign: "center",
            }}
          >

            Don't have an account?

            <Link
              to="/register"
              style={{
                marginLeft: "5px",
                color: "#2563eb",
                fontWeight: "600",
              }}
            >
              Register
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default LoginPage;