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
  <div className="auth-container">

    <div className="auth-card">

      <img
        src="/best.png"
        alt="BEST Logo"
        className="login-logo"
      />

      <h1 className="auth-title">
        Create Account
      </h1>

      <p className="auth-subtitle">
        Register to get started
      </p>

      <form onSubmit={register}>

        <input
          type="text"
          placeholder="Full Name"
          className="input"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

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
            : "Register"}
        </button>

      </form>

      <p className="auth-footer">
        Already have an account?

        <Link to="/">
          Login
        </Link>
      </p>

    </div>

  </div>
);
}

export default RegisterPage;