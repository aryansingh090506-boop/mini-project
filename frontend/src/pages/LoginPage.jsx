import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

const LoginPage = () => {
  const { login, user, role, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoggingIn(true);

  try {
    console.log("Attempting login with:", email);
    await login(email, password);
  } catch (err) {
    console.error("Login error:", err);
    setError(err.message || "Login failed");
  } finally {
    setLoggingIn(false); // 🔥 MUST
  }
};
useEffect(() => {
  if (!loading && user && role) {
    const target = role === "admin" ? "/admin" : "/farmer";
    navigate(target, { replace: true });
  }
}, [user, role, loading]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 px-4">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-slate-800/80 px-8 py-8 shadow-card">

        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-300">
            Welcome back
          </p>
          <h1 className="mt-1 text-xl font-semibold text-slate-50">
            Sign in to AgroCloud
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && (
            <p className="text-xs text-rose-400">{error}</p>
          )}

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loggingIn}
          >
            {loggingIn ? "Signing in..." : "Sign in"}
          </button>

        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          New to AgroCloud?{" "}
          <Link to="/signup" className="text-primary-300">
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;