import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { Logo } from "../components/Logo";

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
    <div className="login-shell">
      <div className="login-card">
        <Logo className="login-logo" />

        {mode === "sign-in" ? (
          <>
            <h1 className="login-title">Sign In</h1>
            <form onSubmit={handleSignIn}>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="login-error">{error}</p>}
              <button type="submit" className="btn-primary">
                Sign In
              </button>
            </form>
            <p className="login-switch">
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
            <h1 className="login-title">Sign Up</h1>
            <form onSubmit={handleSignUp}>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="passwordConfirm">Confirm Password</label>
                <input
                  id="passwordConfirm"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                />
              </div>
              {error && <p className="login-error">{error}</p>}
              <button type="submit" className="btn-primary">
                Sign Up
              </button>
            </form>
            <p className="login-switch">
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
    </div>
  );
}
