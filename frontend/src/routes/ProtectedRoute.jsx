import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const isLoggedIn = true; // cookie-based auth (validated by backend)

    return isLoggedIn ? children : <Navigate to="/login" />;
}
