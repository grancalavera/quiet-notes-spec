import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export function NotebookPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  function handleSignOut() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.5rem 1rem",
          borderBottom: "1px solid #ccc",
          fontFamily: "system-ui",
        }}
      >
        <span style={{ fontWeight: "bold" }}>Qn.</span>
        <div style={{ position: "relative" }}>
          <button
            aria-label="Profile"
            onClick={() => setProfileOpen((prev) => !prev)}
            style={{
              borderRadius: "50%",
              width: 36,
              height: 36,
              border: "1px solid #ccc",
              cursor: "pointer",
              background: "#eee",
              fontSize: "14px",
            }}
          >
            <span aria-hidden="true">P</span>
          </button>
          {profileOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "100%",
                marginTop: 4,
                background: "white",
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "0.5rem",
                zIndex: 10,
              }}
            >
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          )}
        </div>
      </header>
      <div
        style={{ maxWidth: 800, margin: "2rem auto", fontFamily: "system-ui" }}
      >
        <h1>Notebook</h1>
      </div>
    </>
  );
}
