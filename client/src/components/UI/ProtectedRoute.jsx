import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "var(--bg-900)",
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "3px solid var(--bg-600)",
          borderTopColor: "var(--accent)",
          animation: "spin 0.8s linear infinite",
        }} />
      </div>
    );
  }

  return user ? children : <Navigate to="/auth" replace />;
}
