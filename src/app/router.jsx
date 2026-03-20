import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { isBuyer } from "../lib/currentUser";
import { AppShell } from "../components/layout/AppShell";
import { ArenaPage } from "../pages/ArenaPage";
import { DashboardPage } from "../pages/DashboardPage";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { TaskDetailPage } from "../pages/TaskDetailPage";
import { TasksPage } from "../pages/TasksPage";
import { UnauthorizedPage } from "../pages/UnauthorizedPage";

function BuyerRoute({ children }) {
  const [allowed, setAllowed] = useState(() => isBuyer());

  useEffect(() => {
    const syncRole = () => setAllowed(isBuyer());
    window.addEventListener("vibebattle:user-change", syncRole);
    return () => window.removeEventListener("vibebattle:user-change", syncRole);
  }, []);

  return allowed ? children : <Navigate to="/unauthorized" replace />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tasks/:id" element={<TaskDetailPage />} />
        <Route path="/arena/:id" element={<ArenaPage />} />
        <Route
          path="/dashboard"
          element={
            <BuyerRoute>
              <DashboardPage />
            </BuyerRoute>
          }
        />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
