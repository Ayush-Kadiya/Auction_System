import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
  const [auth, setAuth] = useState({ isLoggedIn: false, role: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("id");
    const role = localStorage.getItem("role");

    if (id && role === "USER") {
      setAuth({ isLoggedIn: true, role });
    } else {
      setAuth({ isLoggedIn: false, role: null });
    }

    setIsLoading(false);
  }, []);

  return { auth, isLoading };
};

const PrivateUserRoutes = () => {
  const { auth, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return auth.isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateUserRoutes;
