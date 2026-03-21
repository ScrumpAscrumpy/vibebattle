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
    { to: "/tasks", label: "任务市场" },
    { to: "/", label: "开源广场", end: true },
    { to: "/", label: "排行榜", end: true },
  ];

  return (
    <header className="top-nav">
      <div className="container top-nav__inner">
        <NavLink to="/" end className="brand">
          <span className="brand__mark">⚡</span>
          <span className="brand__text">
            <strong>VibeBattle</strong>
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
          <div className="top-nav__auth">
            <button className="top-nav__auth-link" type="button">
              登录
            </button>
            <button className="top-nav__auth-link top-nav__auth-link--strong" type="button">
              注册
            </button>
          </div>
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
            <span className="top-nav__user-label">{currentUser ? currentUser.name : "loading user"}</span>
            <span className="top-nav__user-meta">{currentUser ? currentUser.role.toLowerCase() : "syncing profile"}</span>
            {error ? <span className="top-nav__user-error">{error}</span> : null}
          </div>
        </div>
      </div>
    </header>
  );
}
