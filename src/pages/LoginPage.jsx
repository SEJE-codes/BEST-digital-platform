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

      if (res.data.token) {
      localStorage.setItem(
        "token",
        res.data.token
      );

      navigate("/create-audit");
    }

    } catch (error) {

      console.log(error);

      alert("Login failed");

    } finally {

      setLoading(false);
    }
  };

  return (
  <div className="auth-container">

    <div className="auth-card">

      <img
        src="/best.png"
        alt="BEST Logo"
        className="login-logo"
      />

      <h1 className="auth-title">
        Welcome Back
      </h1>

      <p className="auth-subtitle">
        Login to continue
      </p>

      <form onSubmit={login}>

        <input
          type="email"
          placeholder="Email Address"
          className="input"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="input"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          className="btn"
          style={{ width: "100%" }}
        >
          {loading
            ? "Please wait..."
            : "Login"}
        </button>

      </form>

      <p className="auth-footer">
        Don't have an account?

        <Link to="/register">
          Register
        </Link>
      </p>

    </div>

  </div>
);
}

export default LoginPage;