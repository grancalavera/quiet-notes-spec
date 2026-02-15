import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

type Mode = "sign-in" | "sign-up";

export function LoginPage() {
  const { user, login, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/notebook";

  if (user) {
    return <Navigate to={from} replace />;
  }

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      setError("Invalid email or password.");
    }
  }

  async function handleSignUp(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await signUp(email, password, passwordConfirm);
      navigate("/notebook", { replace: true });
    } catch {
      setError("Failed to create account.");
    }
  }

  return (
    <div
      style={{ maxWidth: 400, margin: "4rem auto", fontFamily: "system-ui" }}
    >
      {mode === "sign-in" ? (
        <>
          <h1>Sign In</h1>
          <form onSubmit={handleSignIn}>
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="email">Email</label>
              <br />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="password">Password</label>
              <br />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit" style={{ padding: "0.5rem 1rem" }}>
              Sign In
            </button>
          </form>
          <p style={{ marginTop: "1rem" }}>
            Don't have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setMode("sign-up");
                setError("");
              }}
            >
              Sign Up
            </a>
          </p>
        </>
      ) : (
        <>
          <h1>Sign Up</h1>
          <form onSubmit={handleSignUp}>
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="email">Email</label>
              <br />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="password">Password</label>
              <br />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="passwordConfirm">Confirm Password</label>
              <br />
              <input
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit" style={{ padding: "0.5rem 1rem" }}>
              Sign Up
            </button>
          </form>
          <p style={{ marginTop: "1rem" }}>
            Already have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setMode("sign-in");
                setError("");
              }}
            >
              Sign In
            </a>
          </p>
        </>
      )}
    </div>
  );
}
