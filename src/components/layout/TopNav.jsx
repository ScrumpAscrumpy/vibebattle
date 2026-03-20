import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { readCurrentUser, switchCurrentUser } from "../../lib/currentUser";

export function TopNav() {
  const [currentUser, setCurrentUser] = useState(() => readCurrentUser());
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) {
      return;
    }

    void handleSwitch("BUYER");
  }, [currentUser]);

  async function handleSwitch(role) {
    try {
      setError("");
      const user = await switchCurrentUser(role);
      setCurrentUser(user);
      window.dispatchEvent(new Event("vibebattle:user-change"));
    } catch {
      setError("用户切换失败，请确认后端已启动。");
    }
  }

  const navItems = [
    { to: "/", label: "Home", end: true },
    { to: "/tasks", label: "Tasks" },
    ...(currentUser?.role === "BUYER" ? [{ to: "/dashboard", label: "Dashboard" }] : []),
  ];

  return (
    <header className="top-nav">
      <div className="container top-nav__inner">
        <NavLink to="/" end className="brand">
          <span className="brand__mark">V</span>
          <span className="brand__text">
            <strong>VibeBattle</strong>
            <span>The Arena for Vibe Coders</span>
          </span>
        </NavLink>

        <nav className="top-nav__links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? "nav-link nav-link--active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="top-nav__user">
          <div className="role-switcher">
            <button
              className={currentUser?.role === "BUYER" ? "role-switcher__button role-switcher__button--active" : "role-switcher__button"}
              onClick={() => void handleSwitch("BUYER")}
              type="button"
            >
              buyer
            </button>
            <button
              className={currentUser?.role === "CODER" ? "role-switcher__button role-switcher__button--active" : "role-switcher__button"}
              onClick={() => void handleSwitch("CODER")}
              type="button"
            >
              coder
            </button>
          </div>
          <div className="top-nav__identity">
            <span className="top-nav__user-label">
              {currentUser ? currentUser.name : "loading user"}
            </span>
            <span className="top-nav__user-meta">
              {currentUser ? currentUser.role.toLowerCase() : "syncing profile"}
            </span>
            {error ? <span className="top-nav__user-error">{error}</span> : null}
          </div>
        </div>
      </div>
    </header>
  );
}
