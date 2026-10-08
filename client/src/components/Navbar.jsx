import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <NavLink to="/dashboard" className="navbar-logo">
        ApplyTrack
      </NavLink>

      {/* Desktop links */}
      <ul className="navbar-links">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/applications"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Applications
          </NavLink>
        </li>
        <li>
          <NavLink to="/applications/new" className="nav-link btn-nav">
            + New
          </NavLink>
        </li>
      </ul>

      {/* Hamburger button — visible only on mobile */}
      <button
        className="nav-hamburger"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        <span className={`hamburger-bar ${menuOpen ? "open" : ""}`} />
        <span className={`hamburger-bar ${menuOpen ? "open" : ""}`} />
        <span className={`hamburger-bar ${menuOpen ? "open" : ""}`} />
      </button>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="nav-mobile-menu">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-mobile-link active" : "nav-mobile-link"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/applications"
            className={({ isActive }) =>
              isActive ? "nav-mobile-link active" : "nav-mobile-link"
            }
          >
            Applications
          </NavLink>
          <NavLink to="/applications/new" className="nav-mobile-link nav-mobile-cta">
            + New Application
          </NavLink>
        </div>
      )}
    </nav>
  );
}
