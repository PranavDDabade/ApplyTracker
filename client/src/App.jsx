import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ApplicationsPage from "./pages/ApplicationsPage.jsx";
import CreatePage from "./pages/CreatePage.jsx";
import EditPage from "./pages/EditPage.jsx";
import DetailPage from "./pages/DetailPage.jsx";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/applications/new" element={<CreatePage />} />
          <Route path="/applications/:id" element={<DetailPage />} />
          <Route path="/applications/:id/edit" element={<EditPage />} />
          {/* Catch-all */}
          <Route
            path="*"
            element={
              <div className="not-found">
                <h2>404 — Page not found</h2>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
