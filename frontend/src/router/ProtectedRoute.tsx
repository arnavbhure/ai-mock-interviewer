import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getUserProfile } from "@/api/auth/auth.api";
import { useAuthStore } from "../store/auth.store";
import LoadingPage from "@/pages/LoadingPage";

const ProtectedRoute = () => {
  const location = useLocation();

  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await getUserProfile();

        if (!response?.success || !response?.user) {
          clearUser();
        } else {
          setUser(response.user);
        }
      } catch (error) {
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [setUser, clearUser]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
