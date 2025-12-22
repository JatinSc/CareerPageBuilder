import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/axios";
import PageLoader from "../components/ui/PageLoader";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    api.get("/api/company/me")
      .then(() => setAllowed(true))
      .catch(() => setAllowed(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader text="Verifying access..." />;

  return allowed ? children : <Navigate to="/login" />;
}