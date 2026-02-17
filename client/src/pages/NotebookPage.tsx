import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Logo } from "../components/Logo";
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
      <header className="app-header">
        <Logo className="header-logo" />
        <div className="profile-zone">
          <button
            className="profile-btn"
            aria-label="Profile"
            onClick={() => setProfileOpen((prev) => !prev)}
          >
            <span aria-hidden="true">P</span>
          </button>
          {profileOpen && (
            <div className="profile-popover">
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          )}
        </div>
      </header>
      <div className="notebook-body">
        <h1 className="notebook-title">Notebook</h1>
      </div>
    </>
  );
}
