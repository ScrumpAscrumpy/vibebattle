import { Outlet } from "react-router-dom";
import { TopNav } from "./TopNav";

export function AppShell() {
  return (
    <div className="app-shell">
      <TopNav />
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container site-footer__inner">
          ⚡ VibeBattle · The Arena for Vibe Coders · © 2026
        </div>
      </footer>
    </div>
  );
}
