import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import ProtectedRoutes from "./components/ProtectedRoutes";

export default function App() {
  return (
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoutes>
            <Dashboard />
          </ProtectedRoutes>
        }
      />

      <Route
        path="/notes"
        element={
          <ProtectedRoutes>
            <Notes />
          </ProtectedRoutes>
        }
      />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}
